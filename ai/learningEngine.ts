
interface UserInteraction {
  time: string; // e.g., "22:00"
  temperature: number;
  motion: 0 | 1; // 0 for no motion, 1 for motion
  userOverride: boolean;
}

interface LearningOutput {
  recommendedTemp: number;
  confidence: number;
  reason: string;
}

class LearningEngine {
  private historicalData: UserInteraction[] = [];

  public addInteraction(interaction: UserInteraction) {
    this.historicalData.push(interaction);
    // Keep data size manageable, e.g., last 1000 interactions
    if (this.historicalData.length > 1000) {
      this.historicalData.shift();
    }
  }

  public analyze(currentTime: string): LearningOutput {
    // Simple pattern detection for demonstration
    // In a real scenario, this would involve more sophisticated ML algorithms

    const hour = parseInt(currentTime.split(':')[0]);

    // Detect night preference (e.g., between 22:00 and 6:00)
    if (hour >= 22 || hour < 6) {
      const nightInteractions = this.historicalData.filter(
        (interaction) => parseInt(interaction.time.split(':')[0]) >= 22 || parseInt(interaction.time.split(':')[0]) < 6
      );

      if (nightInteractions.length > 10) {
        const avgTemp = nightInteractions.reduce((sum, interaction) => sum + interaction.temperature, 0) / nightInteractions.length;
        return {
          recommendedTemp: Math.round(avgTemp),
          confidence: 0.85,
          reason: "User prefers cooler night temperature based on historical patterns.",
        };
      }
    }

    // Detect daytime comfort range (e.g., between 9:00 and 18:00)
    if (hour >= 9 && hour < 18) {
      const dayInteractions = this.historicalData.filter(
        (interaction) => parseInt(interaction.time.split(':')[0]) >= 9 && parseInt(interaction.time.split(':')[0]) < 18
      );

      if (dayInteractions.length > 10) {
        const avgTemp = dayInteractions.reduce((sum, interaction) => sum + interaction.temperature, 0) / dayInteractions.length;
        return {
          recommendedTemp: Math.round(avgTemp),
          confidence: 0.75,
          reason: "User prefers a specific daytime comfort range based on historical patterns.",
        };
      }
    }

    // Default or fallback recommendation
    return {
      recommendedTemp: 22, // A sensible default
      confidence: 0.5,
      reason: "No strong historical pattern detected for this time.",
    };
  }
}

export const learningEngine = new LearningEngine();