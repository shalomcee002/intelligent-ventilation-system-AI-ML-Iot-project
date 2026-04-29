
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import * as api from '../services/api';

interface SensorData {
  temperature: number;
  humidity: number;
  gasStatus: string;
  motionDetected: string;
  acStatus: string;
}

interface AppContextProps {
  espIpAddress: string;
  sensorData: SensorData | null;
  acStatus: string;
  mode: string;
  temperature: number;
  connectionStatus: string;
  setESPAddress: (ip: string) => void;
  toggleAC: () => void;
  updateMode: (newMode: string) => void;
  updateTemperature: (newTemp: number) => void;
  refreshData: () => void;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [espIpAddress, setEspIpAddress] = useState('192.168.4.1');
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [acStatus, setAcStatus] = useState('OFF');
  const [mode, setMode] = useState('Cool');
  const [temperature, setTemperature] = useState(22);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

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
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [connectionStatus]);

  const refreshData = async () => {
    const data = await api.getSensorData();
    if (data) {
      setSensorData(data);
      setAcStatus(data.acStatus);
      setConnectionStatus('Connected');
    } else {
      setConnectionStatus('Device Offline');
    }
  };

  const setESPAddress = async (ip: string) => {
    setEspIpAddress(ip);
    await AsyncStorage.setItem('espIpAddress', ip);
    api.setBaseUrl(ip);
    refreshData();
  };

  const toggleAC = async () => {
    const newStatus = await api.toggleAC(acStatus === 'ON');
    if (newStatus) {
      setAcStatus(newStatus);
    }
  };

  const updateMode = async (newMode: string) => {
    setMode(newMode);
    await api.setACMode(newMode);
  };

  const updateTemperature = async (newTemp: number) => {
    setTemperature(newTemp);
    await api.setTemperature(newTemp);
  };

  return (
    <AppContext.Provider
      value={{
        espIpAddress,
        sensorData,
        acStatus,
        mode,
        temperature,
        connectionStatus,
        setESPAddress,
        toggleAC,
        updateMode,
        updateTemperature,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};