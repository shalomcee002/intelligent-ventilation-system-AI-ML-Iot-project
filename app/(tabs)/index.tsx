
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  const [refreshing, setRefreshing] = useState(false);
  const [previousSensorData, setPreviousSensorData] = useState(context?.sensorData);
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (context?.sensorData && previousSensorData) {
      // Check if any key sensor data has changed
      const hasTemperatureChanged = context.sensorData.temperature !== previousSensorData.temperature;
      const hasHumidityChanged = context.sensorData.humidity !== previousSensorData.humidity;
      const hasGasStatusChanged = context.sensorData.gasStatus !== previousSensorData.gasStatus;
      const hasMotionChanged = context.sensorData.motionDetected !== previousSensorData.motionDetected;
      const hasAcStatusChanged = context.sensorData.acStatus !== previousSensorData.acStatus;

      if (hasTemperatureChanged || hasHumidityChanged || hasGasStatusChanged || hasMotionChanged || hasAcStatusChanged) {
        // Trigger flash animation
        flashAnim.setValue(0); // Reset animation
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          Animated.timing(flashAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start();
        });
      }
    }
    setPreviousSensorData(context?.sensorData);
  }, [context?.sensorData, flashAnim, previousSensorData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await context?.refreshData();
    setRefreshing(false);
  };

  if (!context) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const { historicalData, aiSuggestions, weatherAdvice, sensorData, connectionStatus, acStatus, outdoorTemp, weatherCondition, lastSyncTime } = context;

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

  const connectionStatusColor = connectionStatus === 'Connected' ? Colors.success : Colors.danger;

  const animatedFlashStyle = {
    backgroundColor: flashAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [Colors.card, Colors.primaryLight], // Flash from card background to a lighter primary color
    }),
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Sunny':
        return 'sun-o';
      case 'Cloudy':
        return 'cloud';
      case 'Rainy':
        return 'umbrella';
      case 'Stormy':
        return 'bolt';
      default:
        return 'question-circle-o';
    }
  };

  const formattedLastSyncTime = lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString() : 'N/A';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
    >
      {weatherAdvice && (
        <View style={styles.adviceContainer}>
          <View style={styles.weatherInfo}>
            <FontAwesome name={getWeatherIcon(weatherCondition)} size={24} color={Colors.text} />
            <Text style={styles.weatherText}>{outdoorTemp}°C</Text>
          </View>
          <Text style={styles.adviceText}>{weatherAdvice}</Text>
        </View>
      )}

      {/* Current Status Section */}
      <Text style={styles.sectionTitle}>Current Status</Text>
      <Animated.View style={[styles.currentStatusCard, animatedFlashStyle]}>
        <View style={styles.statusRow}>
          <Ionicons name="wifi" size={20} color={connectionStatusColor} />
          <Text style={[styles.statusText, { color: connectionStatusColor }]}> {connectionStatus}</Text>
          <View style={styles.lastSyncContainer}>
            <Text style={styles.lastSyncText}>Last Updated: {formattedLastSyncTime}</Text>
          </View>
        </View>
        {sensorData ? (
          <>
            <View style={styles.statusGrid}>
              <View style={styles.statusItem}>
                <MaterialCommunityIcons name="thermometer" size={24} color={Colors.text} />
                <Text style={styles.statusValue}>{sensorData.temperature}°C</Text>
                <Text style={styles.statusLabel}>Temp</Text>
              </View>
              <View style={styles.statusItem}>
                <MaterialCommunityIcons name="water-percent" size={24} color={Colors.text} />
                <Text style={styles.statusValue}>{sensorData.humidity}%</Text>
                <Text style={styles.statusLabel}>Humidity</Text>
              </View>
              <View style={styles.statusItem}>
                <MaterialCommunityIcons name="gas-cylinder" size={24} color={Colors.text} />
                <Text style={styles.statusValue}>{sensorData.gasStatus}</Text>
                <Text style={styles.statusLabel}>Gas</Text>
              </View>
              <View style={styles.statusItem}>
                <MaterialCommunityIcons name="motion-sensor" size={24} color={Colors.text} />
                <Text style={styles.statusValue}>{sensorData.motionDetected}</Text>
                <Text style={styles.statusLabel}>Motion</Text>
              </View>
              <View style={styles.statusItem}>
                <MaterialCommunityIcons name="air-conditioner" size={24} color={Colors.text} />
                <Text style={styles.statusValue}>{acStatus}</Text>
                <Text style={styles.statusLabel}>AC</Text>
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.noDataText}>Waiting for sensor data...</Text>
        )}
      </Animated.View>

      <View style={styles.panelContainer}>
        <AISmartModePanel />
      </View>

      <View style={styles.panelContainer}>
        <ComfortScorePanel />
      </View>

      {aiSuggestions.length > 0 && (
        <View style={styles.suggestionsSection}>
          <Text style={styles.sectionTitle}>AI Suggestions</Text>
          <FlatList
            data={aiSuggestions}
            renderItem={({ item }) => (
              <View style={styles.suggestionCardWrapper}>
                <AISuggestionCard suggestion={item} />
              </View>
            )}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsListContent}
            snapToInterval={280} // Assuming card width + margin is around 280
            decelerationRate="fast"
            snapToAlignment="start"
          />
        </View>
      )}

      <View style={styles.panelContainer}>
        <ActivityLog />
      </View>

      <View style={styles.panelContainer}>
        <EnergyOptimizationPanel />
      </View>

      <View style={styles.panelContainer}>
        <PredictiveTemperaturePanel />
      </View>

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
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32, // Add some extra padding at the bottom
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    marginTop: 8,
  },
  panelContainer: {
    marginBottom: 16, // Consistent spacing for panels
  },
  suggestionsSection: {
    marginBottom: 16,
  },
  suggestionsListContent: {
    paddingHorizontal: 16, // Add horizontal padding to the content
  },
  suggestionCardWrapper: {
    width: 260, // Fixed width for each card
    marginRight: 20, // Space between cards
  },
  chartsSection: {
    marginBottom: 16,
  },
  adviceContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  adviceText: {
    color: Colors.text,
    fontSize: 16,
    textAlign: 'center',
    flexShrink: 1, // Allow text to wrap
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  weatherText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  currentStatusCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  lastSyncContainer: {
    marginLeft: 'auto', // Push to the right
  },
  lastSyncText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
    margin: 8,
    width: '30%', // Adjust as needed for responsiveness
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  noDataText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default DashboardScreen;