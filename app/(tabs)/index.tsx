
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { AppContext } from '../../context/AppContext';

const SensorCard = ({ icon, label, value, color }: { icon: any; label: string; value: string; color?: string }) => (
  <View style={styles.sensorCard}>
    <FontAwesome name={icon} size={24} color={color || Colors.accent} />
    <Text style={styles.sensorLabel}>{label}</Text>
    <Text style={[styles.sensorValue, { color: color || Colors.text }]}>{value}</Text>
  </View>
);

const DashboardScreen = () => {
  const context = useContext(AppContext);

  if (!context) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const { sensorData, acStatus, connectionStatus, refreshData, toggleAC } = context;

  const isConnected = connectionStatus === 'Connected';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>IntelliVent</Text>
        <View style={[styles.statusIndicator, { backgroundColor: isConnected ? Colors.primary : Colors.danger }]} />
      </View>

      {!isConnected || !sensorData ? (
        <View style={styles.centered}>
          <Text style={styles.offlineText}>Device is offline. Please check the connection.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.grid}>
            <SensorCard icon="thermometer" label="Temperature" value={`${sensorData.temperature}°C`} />
            <SensorCard icon="tint" label="Humidity" value={`${sensorData.humidity}%`} />
            <SensorCard icon="warning" label="Gas Status" value={sensorData.gasStatus} color={sensorData.gasStatus === 'Safe' ? Colors.primary : Colors.danger} />
            <SensorCard icon="male" label="Motion" value={sensorData.motionDetected} />
          </View>

          <View style={styles.acStatusCard}>
            <Text style={styles.acStatusTitle}>AC Status</Text>
            <MaterialCommunityIcons
              name={acStatus === 'ON' ? 'air-conditioner' : 'air-conditioner'}
              size={80}
              color={acStatus === 'ON' ? Colors.primary : Colors.inactive}
            />
            <Text style={[styles.acStatusValue, { color: acStatus === 'ON' ? Colors.primary : Colors.inactive }]}>
              {acStatus}
            </Text>
            <TouchableOpacity style={styles.toggleButton} onPress={toggleAC}>
              <FontAwesome name="power-off" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </>
      )}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  offlineText: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  retryButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sensorCard: {
    backgroundColor: Colors.card,
    width: '48%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  sensorLabel: {
    color: Colors.textSecondary,
    marginTop: 8,
    fontSize: 14,
  },
  sensorValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  acStatusCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  acStatusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  acStatusValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: Colors.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DashboardScreen;