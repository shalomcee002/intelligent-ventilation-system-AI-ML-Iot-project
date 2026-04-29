
let baseUrl = 'http://192.168.4.1';
let isSimulationMode = false;

export const setBaseUrl = (ip: string) => {
  baseUrl = `http://${ip}`;
};

export const setSimulationMode = (mode: boolean) => {
  isSimulationMode = mode;
};

export const getSensorData = async () => {
  if (isSimulationMode) {
    // Simulate sensor data
    const simulatedTemp = Math.floor(Math.random() * (30 - 20 + 1)) + 20; // 20-30°C
    const simulatedHumidity = Math.floor(Math.random() * (70 - 40 + 1)) + 40; // 40-70%
    const simulatedGas = Math.random() > 0.9 ? 1 : 0; // 10% chance of gas detected
    const simulatedMotion = Math.random() > 0.5 ? 1 : 0; // 50% chance of motion
    const simulatedAcStatus = Math.random() > 0.5 ? 'ON' : 'OFF'; // 50% chance AC is on

    return {
      temperature: simulatedTemp,
      humidity: simulatedHumidity,
      gasStatus: simulatedGas === 0 ? 'Safe' : 'Danger',
      motionDetected: simulatedMotion === 1 ? 'Yes' : 'No',
      acStatus: simulatedAcStatus,
    };
  }
  try {
    const response = await fetch(`${baseUrl}/data`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return {
      temperature: data.temperature,
      humidity: data.humidity,
      gasStatus: data.gas === 0 ? 'Safe' : 'Danger',
      motionDetected: data.motion === 1 ? 'Yes' : 'No',
      acStatus: data.ac,
    };
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    return null;
  }
};

export const toggleAC = async (isCurrentlyOn: boolean) => {
  if (isSimulationMode) {
    return isCurrentlyOn ? 'OFF' : 'ON';
  }
  try {
    const endpoint = isCurrentlyOn ? 'off' : 'on';
    const response = await fetch(`${baseUrl}/ac/${endpoint}`, { method: 'POST' });
    if (response.ok) {
      return isCurrentlyOn ? 'OFF' : 'ON';
    }
    return null;
  } catch (error) {
    console.error('Error toggling AC:', error);
    return null;
  }
};

export const turnOnAC = async () => {
  if (isSimulationMode) {
    console.log('Simulating AC ON');
    return;
  }
  try {
    await fetch(`${baseUrl}/ac/on`, { method: 'POST' });
  } catch (error) {
    console.error('Error turning on AC:', error);
  }
};

export const turnOffAC = async () => {
  if (isSimulationMode) {
    console.log('Simulating AC OFF');
    return;
  }
  try {
    await fetch(`${baseUrl}/ac/off`, { method: 'POST' });
  } catch (error) {
    console.error('Error turning off AC:', error);
  }
};

export const setTemperature = async (value: number) => {
  if (isSimulationMode) {
    console.log(`Simulating set temperature to: ${value}`);
    return;
  }
  try {
    await fetch(`${baseUrl}/temp?value=${value}`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Error setting temperature:', error);
  }
};

export const setACMode = async (mode: string) => {
  if (isSimulationMode) {
    console.log(`Simulating set AC mode to: ${mode}`);
    return;
  }
  try {
    await fetch(`${baseUrl}/mode?value=${mode.toLowerCase()}`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Error setting AC mode:', error);
  }
};

export const checkConnection = async () => {
  if (isSimulationMode) {
    return true; // Always connected in simulation mode
  }
  try {
    const response = await fetch(baseUrl);
    return response.ok;
  } catch (error) {
    return false;
  }
};