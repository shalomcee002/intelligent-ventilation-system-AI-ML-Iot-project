
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { decisionEngine } from '../ai/decisionEngine';
import { learningEngine } from '../ai/learningEngine';
import * as api from '../services/api';

interface SensorData {
  temperature: number;
  humidity: number;
  gasStatus: string;
  motionDetected: string;
  acStatus: string;
}

type AITask = {
  id: string;
  text: string;
  action: () => void;
};

interface AppContextProps {
  espIpAddress: string;
  sensorData: SensorData | null;
  historicalData: SensorData[];
  acStatus: string;
  mode: string;
  temperature: number;
  connectionStatus: string;
  aiMode: 'Active' | 'Learning' | 'Manual';
  aiConfidence: number;
  comfortScore: number;
  energyEfficiency: 'Low' | 'Medium' | 'High';
  aiSuggestions: AITask[];
  aiActivityLog: string[];
  estimatedSavings: number;
  weeklyEnergyData: any;
  predictiveTempData: any;
  deviceStatus: 'Online' | 'Offline';
  lastSyncTime: Date | null;
  outdoorTemp: number;
  weatherCondition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy';
  aiDecisionExplanation: string;
  aiDecisionConfidence: number;
  aiDecisionSource: string[];
  aiDecisionSuggestions: string[];
  userOverrideOccurred: boolean;
  setESPAddress: (ip: string) => void;
  toggleAC: () => void;
  updateMode: (newMode: string) => void;
  updateTemperature: (newTemp: number) => void;
  refreshData: () => void;
  toggleAIMode: () => void;
  dismissSuggestion: (id: string) => void;
  setUserOverrideOccurred: (status: boolean) => void;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [espIpAddress, setEspIpAddress] = useState('192.168.4.1');
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const [acStatus, setAcStatus] = useState('OFF');
  const [mode, setMode] = useState('Cool');
  const [temperature, setTemperature] = useState(22);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  // AI State
  const [aiMode, setAIMode] = useState<'Active' | 'Learning' | 'Manual'>('Learning');
  const [aiConfidence, setAIConfidence] = useState(75);
  const [comfortScore, setComfortScore] = useState(82);
  const [energyEfficiency, setEnergyEfficiency] = useState<'Low' | 'Medium' | 'High'>('High');
  const [aiSuggestions, setAISuggestions] = useState<AITask[]>([]);
  const [aiActivityLog, setAIActivityLog] = useState<string[]>([]);
  const [estimatedSavings, setEstimatedSavings] = useState(25);
  const [weeklyEnergyData, setWeeklyEnergyData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data: [2, 3, 2, 4, 5, 4, 3] }],
  });
  const [predictiveTempData, setPredictiveTempData] = useState({
    labels: ['Now', '1h', '2h', '3h', '4h'],
    datasets: [{ data: [24, 23.5, 23, 22.5, 22] }],
  });

  const [deviceStatus, setDeviceStatus] = useState<'Online' | 'Offline'>('Offline');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [outdoorTemp, setOutdoorTemp] = useState(28);
  const [weatherCondition, setWeatherCondition] = useState<'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy'>('Sunny');

  // AI Decision Output State
  const [aiDecisionExplanation, setAiDecisionExplanation] = useState("AI is learning...");
  const [aiDecisionConfidence, setAiDecisionConfidence] = useState(0);
  const [aiDecisionSource, setAiDecisionSource] = useState<string[]>([]);
  const [aiDecisionSuggestions, setAiDecisionSuggestions] = useState<string[]>([]);
  const [userOverrideOccurred, setUserOverrideOccurred] = useState(false);

  useEffect(() => {
    const loadIpAddress = async () => {
      const storedIp = await AsyncStorage.getItem('espIpAddress');
      if (storedIp) {
        setEspIpAddress(storedIp);
        api.setBaseUrl(storedIp);
      }
    };
    loadIpAddress();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (connectionStatus === 'Connected') {
        refreshData();
        runAISimulation();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [connectionStatus, sensorData]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setAIActivityLog(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 20));
  };

  const runAISimulation = () => {
    if (!sensorData) return;

    // 1. Add current interaction to learning engine
    learningEngine.addInteraction({
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      temperature: sensorData.temperature,
      motion: sensorData.motionDetected === 'Yes' ? 1 : 0,
      userOverride: false, // This would be set to true if a manual change just occurred
    });

    // 2. Get decision from AI Decision Engine
    const decision = decisionEngine.makeDecision({
      currentTemperature: sensorData.temperature,
      outdoorTemperature: outdoorTemp,
      humidity: sensorData.humidity,
      weatherCondition: weatherCondition,
      timeOfDay: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      motionDetected: sensorData.motionDetected === 'Yes',
      acStatus: acStatus,
    });

    // 3. Update AI state with decision output
    setAiDecisionExplanation(decision.explanation);
    setAiDecisionConfidence(decision.confidence);
    setAiDecisionSource(decision.source);
    setAiDecisionSuggestions(decision.suggestions);

    // 4. Generate AITask suggestions from decision engine output
    const newSuggestions: AITask[] = decision.suggestions.map((text: string, index: number) => ({
      id: `ai_suggestion_${index}_${Date.now()}`,
      text: text,
      action: () => addLog(`User acknowledged AI suggestion: "${text}"`),
    }));

    setAISuggestions(prev => {
      const existingIds = new Set(prev.map(s => s.id));
      const filteredNew = newSuggestions.filter(s => !existingIds.has(s.id));
      return [...prev, ...filteredNew];
    });

    // 5. AI auto-adjustment based on aiMode
    if (aiMode === 'Active' && decision.finalTemp !== sensorData.temperature) {
      updateTemperature(decision.finalTemp);
      addLog(`AI auto-adjusted temperature to ${decision.finalTemp}°C. Reason: ${decision.explanation}`);
    }

    // Simulate dynamic data for charts (can be refined with AI output)
    setComfortScore(Math.floor(decision.confidence * 100)); // Use AI confidence for comfort score
    setAIConfidence(Math.floor(decision.confidence * 100));
    setEstimatedSavings(Math.floor(Math.random() * 5) + 20); // Placeholder, can be AI-driven
    setWeeklyEnergyData(prev => ({
      ...prev,
      datasets: [{ data: prev.datasets[0].data.map(d => d + (Math.random() - 0.5)) }],
    }));
    setPredictiveTempData(prev => ({
      ...prev,
      datasets: [{ data: prev.datasets[0].data.map(d => d + (Math.random() - 0.5)) }],
    }));

    // Simulate weather changes (still needed for dynamic outdoorTemp/weatherCondition)
    const weatherConditions: Array<'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy'> = ['Sunny', 'Cloudy', 'Rainy', 'Stormy'];
    if (Math.random() > 0.9) { // 10% chance to change weather
      const newWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      const newTemp = Math.floor(Math.random() * 15) + 15;
      setWeatherCondition(newWeather);
      setOutdoorTemp(newTemp);
      addLog(`Weather updated: ${newWeather}, ${newTemp}°C`);
    }
  };

  const refreshData = async () => {
    const data = await api.getSensorData();
    if (data) {
      setSensorData(data);
      setAcStatus(data.acStatus);
      setConnectionStatus('Connected');
      setHistoricalData(prevData => [...prevData, data].slice(-20));
      setDeviceStatus('Online');
      setLastSyncTime(new Date());
    } else {
      setConnectionStatus('Device Offline');
      setDeviceStatus('Offline');
    }
  };

  const setESPAddress = async (ip: string) => {
    setEspIpAddress(ip);
    await AsyncStorage.setItem('espIpAddress', ip);
    api.setBaseUrl(ip);
    refreshData();
    addLog(`Device IP address updated to ${ip}.`);
  };

  const toggleAC = async () => {
    const newStatus = await api.toggleAC(acStatus === 'ON');
    if (newStatus) {
      setAcStatus(newStatus);
      addLog(`AC turned ${newStatus}.`);
    }
  };

  const updateMode = async (newMode: string) => {
    setMode(newMode);
    await api.setACMode(newMode);
    addLog(`AC mode set to ${newMode}.`);
  };

  const updateTemperature = async (newTemp: number) => {
    setTemperature(newTemp);
    await api.setTemperature(newTemp);
    setUserOverrideOccurred(true); // User manually changed temperature
    addLog(`User manually set temperature to ${newTemp}°C`);
  };

  const toggleAIMode = () => {
    const modes: Array<'Active' | 'Learning' | 'Manual'> = ['Manual', 'Learning', 'Active'];
    const nextIndex = (modes.indexOf(aiMode) + 1) % modes.length;
    const newMode = modes[nextIndex];
    setAIMode(newMode);
    addLog(`AI mode changed to ${newMode}.`);
  };

  const dismissSuggestion = (id: string) => {
    setAISuggestions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        espIpAddress,
        sensorData,
        historicalData,
        acStatus,
        mode,
        temperature,
        connectionStatus,
        aiMode,
        aiConfidence,
        comfortScore,
        energyEfficiency,
        aiSuggestions,
        aiActivityLog,
        estimatedSavings,
        weeklyEnergyData,
        predictiveTempData,
        deviceStatus,
        lastSyncTime,
        outdoorTemp,
        weatherCondition,
        aiDecisionExplanation,
        aiDecisionConfidence,
        aiDecisionSource,
        aiDecisionSuggestions,
        setESPAddress,
        toggleAC,
        updateMode,
        updateTemperature,
        refreshData,
        toggleAIMode,
        dismissSuggestion,
        userOverrideOccurred,
        setUserOverrideOccurred,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};