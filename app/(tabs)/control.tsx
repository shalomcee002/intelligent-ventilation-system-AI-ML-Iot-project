
import Slider from '@react-native-community/slider';
import React, { useContext } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { AppContext } from '../../context/AppContext';

const ModeButton = ({ title, onPress, isActive }: { title: string; onPress: () => void; isActive: boolean }) => (
  <TouchableOpacity
    style={[styles.modeButton, isActive && { backgroundColor: Colors.primary }]}
    onPress={onPress}>
    <Text style={styles.modeButtonText}>{title}</Text>
  </TouchableOpacity>
);

const ControlScreen = () => {
  const context = useContext(AppContext);

  if (!context) {
    return null;
  }

  const { temperature, mode, acStatus, updateTemperature, updateMode, toggleAC } = context;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>AC Power</Text>
        <View style={styles.powerControl}>
          <Text style={[styles.acStatusText, { color: acStatus === 'ON' ? Colors.primary : Colors.textSecondary }]}>
            {acStatus}
          </Text>
          <Switch
            value={acStatus === 'ON'}
            onValueChange={toggleAC}
            trackColor={{ false: Colors.inactive, true: Colors.primary }}
            thumbColor={Colors.text}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Temperature</Text>
        <Text style={styles.tempDisplay}>{temperature}°C</Text>
        <Slider
          style={styles.slider}
          minimumValue={16}
          maximumValue={30}
          step={1}
          value={temperature}
          onSlidingComplete={updateTemperature}
          minimumTrackTintColor={Colors.accent}
          maximumTrackTintColor={Colors.inactive}
          thumbTintColor={Colors.accent}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mode</Text>
        <View style={styles.modeSelector}>
          <ModeButton title="Cool" onPress={() => updateMode('Cool')} isActive={mode === 'Cool'} />
          <ModeButton title="Fan" onPress={() => updateMode('Fan')} isActive={mode === 'Fan'} />
          <ModeButton title="Auto" onPress={() => updateMode('Auto')} isActive={mode === 'Auto'} />
        </View>
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
  powerControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  acStatusText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  tempDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modeButton: {
    backgroundColor: Colors.inactive,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  modeButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ControlScreen;