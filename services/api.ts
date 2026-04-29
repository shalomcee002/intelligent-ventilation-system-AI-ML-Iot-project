
let baseUrl = 'http://192.168.4.1';

export const setBaseUrl = (ip: string) => {
  baseUrl = `http://${ip}`;
};

export const getSensorData = async () => {
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
  try {
    await fetch(`${baseUrl}/ac/on`, { method: 'POST' });
  } catch (error) {
    console.error('Error turning on AC:', error);
  }
};

export const turnOffAC = async () => {
  try {
    await fetch(`${baseUrl}/ac/off`, { method: 'POST' });
  } catch (error) {
    console.error('Error turning off AC:', error);
  }
};

export const setTemperature = async (value: number) => {
  try {
    await fetch(`${baseUrl}/temp?value=${value}`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Error setting temperature:', error);
  }
};

export const setACMode = async (mode: string) => {
  try {
    await fetch(`${baseUrl}/mode?value=${mode.toLowerCase()}`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Error setting AC mode:', error);
  }
};

export const checkConnection = async () => {
  try {
    const response = await fetch(baseUrl);
    return response.ok;
  } catch (error) {
    return false;
  }
};