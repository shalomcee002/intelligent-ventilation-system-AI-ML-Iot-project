
import React, { useContext, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { AppContext } from '../../context/AppContext';

const SettingsScreen = () => {
  const context = useContext(AppContext);
  const [ipAddress, setIpAddress] = useState(context?.espIpAddress || '');
  const [isTesting, setIsTesting] = useState(false);

  if (!context) {
    return null;
  }

  const { connectionStatus, setESPAddress, refreshData } = context;

  const handleSave = () => {
    setESPAddress(ipAddress);
  };

  const handleCheckConnection = async () => {
    setIsTesting(true);
    await refreshData();
    setIsTesting(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Device IP Address</Text>
        <TextInput
          style={styles.input}
          value={ipAddress}
          onChangeText={setIpAddress}
          placeholder="Enter ESP32 IP Address"
          placeholderTextColor={Colors.textSecondary}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Connection</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text style={[styles.status, { color: connectionStatus === 'Connected' ? Colors.primary : Colors.danger }]}>
            {connectionStatus}
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleCheckConnection} disabled={isTesting}>
          {isTesting ? (
            <ActivityIndicator color={Colors.text} />
          ) : (
            <Text style={styles.buttonText}>Test Connection</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.background,
    color: Colors.text,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLabel: {
    color: Colors.textSecondary,
    fontSize: 18,
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default SettingsScreen;