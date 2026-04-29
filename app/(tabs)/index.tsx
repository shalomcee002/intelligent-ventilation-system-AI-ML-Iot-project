
import React, { useContext } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  ActivityLog,
  AISmartModePanel,
  AISuggestionCard,
  ComfortScorePanel,
  EnergyOptimizationPanel,
  PredictiveTemperaturePanel
} from '../../components/AI/Dashboard';
import SensorHistoryChart from '../../components/SensorHistoryChart';
import { Colors } from '../../constants/Colors';
import { AppContext } from '../../context/AppContext';

const DashboardScreen = () => {
  const context = useContext(AppContext);

  if (!context) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const { historicalData, aiSuggestions } = context;

  const temperatureChartData = {
    labels: historicalData.map((_, i) => (i % 5 === 0 ? `${i * 5}s` : '')),
    datasets: [
      {
        data: historicalData.map(d => d.temperature),
        color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
      },
    ],
  };

  const humidityChartData = {
    labels: historicalData.map((_, i) => (i % 5 === 0 ? `${i * 5}s` : '')),
    datasets: [
      {
        data: historicalData.map(d => d.humidity),
        color: (opacity = 1) => `rgba(56, 189, 248, ${opacity})`,
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>IntelliVent AI</Text>

      <AISmartModePanel />

      <ComfortScorePanel />

      {aiSuggestions.length > 0 && (
        <View style={styles.suggestionsSection}>
          <Text style={styles.sectionTitle}>AI Suggestions</Text>
          <FlatList
            data={aiSuggestions}
            renderItem={({ item }) => <AISuggestionCard suggestion={item} />}
            keyExtractor={item => item.id}
          />
        </View>
      )}

      <ActivityLog />

      <EnergyOptimizationPanel />

      <PredictiveTemperaturePanel />

      <View style={styles.chartsSection}>
        <Text style={styles.sectionTitle}>Live Sensor Data</Text>
        <SensorHistoryChart data={temperatureChartData} title="Temperature (°C)" />
        <SensorHistoryChart data={humidityChartData} title="Humidity (%)" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    marginTop: 8,
  },
  suggestionsSection: {
    marginBottom: 16,
  },
  chartsSection: {
    marginBottom: 16,
  },
});

export default DashboardScreen;