
interface WeatherInput {
  outdoorTemperature: number;
  humidity: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy';
}

interface WeatherOutput {
  adjustment: 'increase_cooling' | 'decrease_cooling' | 'suggest_dry_mode' | 'reduce_ac_usage' | 'none';
  suggestedTemp: number | null;
  reason: string;
}

class WeatherEngine {
  public getWeatherBasedAdjustment(input: WeatherInput): WeatherOutput {
    const { outdoorTemperature, humidity, condition } = input;

    if (outdoorTemperature > 30) {
      return {
        adjustment: 'increase_cooling',
        suggestedTemp: 20, // Suggest a cooler temp
        reason: `High external temperature (${outdoorTemperature}°C) detected. Increasing cooling intensity.`,
      };
    }

    if (humidity > 70 && condition !== 'Rainy') { // High humidity, but not actively raining (AC can help dry air)
      return {
        adjustment: 'suggest_dry_mode',
        suggestedTemp: null,
        reason: `High humidity (${humidity}%) detected. Suggesting 'Dry' mode for comfort.`,
      };
    }

    if (outdoorTemperature < 18 && condition === 'Sunny') {
      return {
        adjustment: 'reduce_ac_usage',
        suggestedTemp: null,
        reason: `Mild and sunny weather (${outdoorTemperature}°C). Consider reducing AC usage or opening windows.`,
      };
    }

    if (condition === 'Rainy' || condition === 'Stormy') {
      return {
        adjustment: 'none',
        suggestedTemp: null,
        reason: `It's ${condition.toLowerCase()} outside. Ensure windows are closed and maintain current settings.`,
      };
    }

    return {
      adjustment: 'none',
      suggestedTemp: null,
      reason: "No specific weather-based adjustment needed at this time.",
    };
  }
}

export const weatherEngine = new WeatherEngine();