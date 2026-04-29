
interface PredictionInput {
  currentTemperature: number;
  outdoorTemperature: number;
  timeOfDay: string; // e.g., "HH:MM"
  motionDetected: boolean;
  historicalAverageTemp: number; // From learningEngine
}

interface PredictionOutput {
  predictedTemp: number;
  reason: string;
}

class Predictor {
  public predictTemperature(input: PredictionInput): PredictionOutput {
    const { currentTemperature, outdoorTemperature, timeOfDay, motionDetected, historicalAverageTemp } = input;
    const hour = parseInt(timeOfDay.split(':')[0]);

    let predictedTemp = historicalAverageTemp;
    let reason = "Predicted based on historical averages.";

    // Rule 1: Night time adjustment (e.g., 22:00 - 6:00)
    if (hour >= 22 || hour < 6) {
      if (motionDetected) {
        predictedTemp = Math.min(predictedTemp, 21); // Slightly cooler if occupied at night
        reason = "Night time occupancy detected, slightly lowering temperature.";
      } else {
        predictedTemp = Math.max(predictedTemp, 20); // Energy saving if no motion at night
        reason = "Night time, no motion detected. Optimizing for energy savings.";
      }
    }
    // Rule 2: Hot weather adjustment
    else if (outdoorTemperature > 30) {
      predictedTemp = Math.max(predictedTemp, 22); // Ensure cooling is active
      reason = `Hot weather (${outdoorTemperature}°C). Ensuring adequate cooling.`;
    }
    // Rule 3: Mild weather, reduce AC usage
    else if (outdoorTemperature >= 18 && outdoorTemperature <= 25) {
      predictedTemp = Math.min(predictedTemp, 24); // Allow slightly higher temp for energy saving
      reason = `Mild outdoor temperature (${outdoorTemperature}°C). Optimizing for reduced AC usage.`;
    }
    // Rule 4: Daytime comfort
    else if (hour >= 9 && hour < 18) {
      if (!motionDetected) {
        predictedTemp = Math.min(predictedTemp, 25); // Increase temp if no motion during day
        reason = "Daytime, no motion detected. Increasing temperature for energy savings.";
      }
    }

    // Ensure temperature stays within a reasonable range
    predictedTemp = Math.max(18, Math.min(28, predictedTemp));

    return {
      predictedTemp: Math.round(predictedTemp),
      reason,
    };
  }
}

export const predictor = new Predictor();