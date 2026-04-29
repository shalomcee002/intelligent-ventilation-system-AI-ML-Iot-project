
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { AppContext } from '../../context/AppContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SettingsScreen = () => {
  const context = useContext(AppContext);
  const [ipAddress, setIpAddress] = useState(context?.espIpAddress || '');
  const [location, setLocation] = useState(context?.userLocation || '');
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    LayoutAnimation.easeInEaseOut();
  }, []);

  if (!context) {
    return null;
  }

  const { connectionStatus, setESPAddress, refreshData, updateUserLocation } = context;

  const handleSaveAll = () => {
    setESPAddress(ipAddress);
    updateUserLocation(location);
    Alert.alert("Settings Saved", "Your settings have been successfully updated.");
  };

  const handleCheckConnection = async () => {
    setIsTesting(true);
    LayoutAnimation.easeInEaseOut(); // Animate the change in ActivityIndicator visibility
    const success = await refreshData(); // Assuming refreshData returns a boolean indicating success
    setIsTesting(false);
    LayoutAnimation.easeInEaseOut(); // Animate the change back

    if (success) {
      Alert.alert("Connection Successful", "The device is connected and data is refreshing.");
    } else {
      Alert.alert("Connection Failed", "Could not connect to the device. Please check the IP address and network.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.sectionHeader}>Device Settings</Text>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="ip-network" size={24} color={Colors.text} style={styles.cardIcon} />
          <Text style={styles.cardTitle}>ESP32 IP Address</Text>
        </View>
        <TextInput
          style={styles.input}
          value={ipAddress}
          onChangeText={setIpAddress}
          placeholder="Enter ESP32 IP Address"
          placeholderTextColor={Colors.textSecondary}
          keyboardType="numeric"
        />
      </View>
      <Text style={styles.sectionHeader}>Location Settings</Text>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="location-outline" size={24} color={Colors.text} style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Your Location</Text>
        </View>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter Your Location"
          placeholderTextColor={Colors.textSecondary}
        />
      </View>
      <Text style={styles.sectionHeader}>Connection Status</Text>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <AntDesign name="wifi" size={24} color={Colors.text} style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Device Connection</Text>
        </View>
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
      <TouchableOpacity style={styles.saveAllButton} onPress={handleSaveAll}>
        <Ionicons name="save-outline" size={24} color={Colors.text} style={styles.saveButtonIcon} />
        <Text style={styles.saveAllButtonText}>Save All Settings</Text>
      </TouchableOpacity>
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
    paddingBottom: 32, // Add some extra padding at the bottom for scrollability
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.background,
    color: Colors.text,
    borderRadius: 8,
    padding: 16,
    marginBottom: 0,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  statusLabel: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  saveAllButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 32,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveButtonIcon: {
    marginRight: 10,
  },
  saveAllButtonText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;