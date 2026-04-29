
import { learningEngine } from './learningEngine';
import { predictor } from './predictor';
import { weatherEngine } from './weatherEngine';

interface DecisionInput {
  currentTemperature: number;
  outdoorTemperature: number;
  humidity: number;
  weatherCondition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy';
  timeOfDay: string; // e.g., "HH:MM"
  motionDetected: boolean;
  acStatus: string; // "ON" or "OFF"
}

interface DecisionOutput {
  finalTemp: number;
  mode: string; // "Cool", "Heat", "Dry", "Fan"
  confidence: number;
  source: string[];
  explanation: string;
  suggestions: string[];
}

class DecisionEngine {
  public makeDecision(input: DecisionInput): DecisionOutput {
    const {
      currentTemperature,
      outdoorTemperature,
      humidity,
      weatherCondition,
      timeOfDay,
      motionDetected,
      acStatus,
    } = input;

    let finalTemp = currentTemperature;
    let mode = "Cool"; // Default mode
    let confidence = 0.5;
    const source: string[] = [];
    const suggestions: string[] = [];
    let explanation = "Initial assessment.";

    // 1. Get insights from Learning Engine
    const learningOutput = learningEngine.analyze(timeOfDay);
    let historicalAverageTemp = learningOutput.recommendedTemp;
    source.push("history");
    explanation += ` ${learningOutput.reason}`;
    confidence = Math.max(confidence, learningOutput.confidence);

    // 2. Get prediction from Predictor
    const predictionOutput = predictor.predictTemperature({
      currentTemperature,
      outdoorTemperature,
      timeOfDay,
      motionDetected,
      historicalAverageTemp,
    });
    finalTemp = predictionOutput.predictedTemp;
    source.push("prediction");
    explanation += ` ${predictionOutput.reason}`;
    confidence = Math.max(confidence, 0.7); // Predictor adds more confidence

    // 3. Get weather-based adjustments
    const weatherOutput = weatherEngine.getWeatherBasedAdjustment({
      outdoorTemperature,
      humidity,
      condition: weatherCondition,
    });
    source.push("weather");
    explanation += ` ${weatherOutput.reason}`;

    if (weatherOutput.suggestedTemp !== null) {
      finalTemp = weatherOutput.suggestedTemp;
      confidence = Math.max(confidence, 0.8); // Weather data is strong
    }
    if (weatherOutput.adjustment === 'suggest_dry_mode') {
      mode = 'Dry';
      suggestions.push("Consider switching to 'Dry' mode due to high humidity.");
    } else if (weatherOutput.adjustment === 'increase_cooling') {
      suggestions.push("Increasing cooling intensity due to high outdoor temperature.");
    } else if (weatherOutput.adjustment === 'reduce_ac_usage') {
      suggestions.push("Consider reducing AC usage or opening windows due to mild weather.");
    }

    // 4. Occupancy-based adjustments (if not already handled by predictor)
    if (!motionDetected && acStatus === 'ON') {
      if (!source.includes("occupancy")) { // Avoid duplicate reasoning if predictor already used it
        finalTemp = Math.min(finalTemp + 2, 28); // Increase temp for energy saving
        explanation += " No motion detected, adjusting for energy savings.";
        source.push("occupancy");
        confidence = Math.max(confidence, 0.6);
        suggestions.push("No motion detected. Turn off AC to save energy?");
      }
    }

    // Final temperature clamping
    finalTemp = Math.max(18, Math.min(30, finalTemp));

    return {
      finalTemp: Math.round(finalTemp),
      mode,
      confidence: Math.min(confidence, 0.99), // Cap confidence
      source,
      explanation,
      suggestions,
    };
  }
}

export const decisionEngine = new DecisionEngine();