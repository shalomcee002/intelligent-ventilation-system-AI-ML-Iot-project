const OPEN_WEATHER_API_KEY = 'a044499edcf3c59d4c9ff50ed79484f2'; // Replace with your actual API key
export const fetchWeatherData = async (city: string) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPEN_WEATHER_API_KEY}&units=metric`
    );
    if (!response.ok) {
      console.error('Error fetching weather data:', response.statusText);
      return null;
    }
    const data = await response.json();
    return {
      temperature: data.main.temp,
      condition: data.weather[0].main,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};