
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors } from '../../constants/Colors';
import { AppContext } from '../../context/AppContext';

export const AISmartModePanel = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { aiMode, aiConfidence, toggleAIMode } = context;

  const getStatusColor = () => {
    if (aiMode === 'Active') return Colors.primary;
    if (aiMode === 'Learning') return Colors.accent;
    return Colors.inactive;
  };

  return (
    <View style={styles.aiPanel}>
      <View style={styles.aiHeader}>
        <MaterialCommunityIcons name="brain" size={24} color={Colors.primary} />
        <Text style={styles.aiTitle}>AI Smart Mode</Text>
      </View>
      <View style={styles.aiBody}>
        <View style={styles.aiStatus}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
          <Text style={styles.aiStatusText}>{aiMode}</Text>
        </View>
        <View style={styles.aiConfidence}>
          <Text style={styles.aiConfidenceLabel}>Confidence</Text>
          <Text style={styles.aiConfidenceValue}>{aiConfidence}%</Text>
        </View>
        <TouchableOpacity style={styles.toggleButton} onPress={toggleAIMode}>
          <FontAwesome name="power-off" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const AISuggestionCard = ({ suggestion }: { suggestion: any }) => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { dismissSuggestion } = context;

  const handleApply = () => {
    suggestion.action();
    dismissSuggestion(suggestion.id);
  };

  return (
    <View style={styles.suggestionCard}>
      <FontAwesome name="lightbulb-o" size={24} color={Colors.accent} />
      <Text style={styles.suggestionText}>{suggestion.text}</Text>
      <View style={styles.suggestionActions}>
        <TouchableOpacity style={[styles.actionButton, styles.applyButton]} onPress={handleApply}>
          <Text style={styles.actionButtonText}>Apply</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.dismissButton]} onPress={() => dismissSuggestion(suggestion.id)}>
          <Text style={styles.actionButtonText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const ComfortScorePanel = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { comfortScore, energyEfficiency, aiConfidence, aiDecisionExplanation, aiDecisionSource, aiDecisionSuggestions } = context;

  return (
    <View style={styles.comfortPanel}>
      <Text style={styles.sectionTitle}>Comfort Intelligence</Text>
      <View style={styles.comfortBody}>
        <View style={styles.comfortScore}>
          <Text style={styles.comfortScoreValue}>{comfortScore}</Text>
          <Text style={styles.comfortScoreLabel}>Comfort Score</Text>
        </View>
        <View style={styles.comfortDetails}>
          <Text style={styles.detailText}>Energy Efficiency: {energyEfficiency}</Text>
          <Text style={styles.detailText}>AI Confidence: {aiConfidence}%</Text>
        </View>
      </View>
      <View style={styles.aiReasoningSection}>
        <Text style={styles.aiReasoningTitle}>AI Reasoning</Text>
        <Text style={styles.aiExplanationText}>{aiDecisionExplanation}</Text>
        <View style={styles.aiSourceContainer}>
          {aiDecisionSource.map((source, index) => (
            <View key={index} style={styles.aiSourceBadge}>
              <Text style={styles.aiSourceText}>{source}</Text>
            </View>
          ))}
        </View>
        {aiDecisionSuggestions.length > 0 && (
          <View style={styles.aiSuggestionsContainer}>
            <Text style={styles.aiSuggestionsTitle}>AI Considered:</Text>
            {aiDecisionSuggestions.map((suggestion, index) => (
              <Text key={index} style={styles.aiSuggestionItem}>• {suggestion}</Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export const ActivityLog = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { aiActivityLog } = context;

  return (
    <View style={styles.logPanel}>
      <Text style={styles.sectionTitle}>AI Activity Log</Text>
      <View style={styles.logContent}>
        {aiActivityLog.map((item, index) => (
          <Text key={index.toString()} style={styles.logItem}>{item}</Text>
        ))}
      </View>
    </View>
  );
};

export const EnergyOptimizationPanel = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { estimatedSavings, weeklyEnergyData } = context;

  return (
    <View style={styles.energyPanel}>
      <Text style={styles.sectionTitle}>Energy Optimization</Text>
      <Text style={styles.savingsText}>Estimated Monthly Savings: ${estimatedSavings}</Text>
      <LineChart
        data={weeklyEnergyData}
        width={300}
        height={200}
        chartConfig={chartConfig}
        bezier
      />
    </View>
  );
};

export const PredictiveTemperaturePanel = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { predictiveTempData } = context;

  return (
    <View style={styles.predictivePanel}>
      <Text style={styles.sectionTitle}>Predictive Temperature</Text>
      <LineChart
        data={predictiveTempData}
        width={300}
        height={200}
        chartConfig={chartConfig}
        bezier
      />
    </View>
  );
};

export const AIHistoryPanel = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { historicalData } = context;

  const temperatureHistoryData = {
    labels: historicalData.map((_, index) => `${historicalData.length - index}m ago`).reverse(),
    datasets: [
      {
        data: historicalData.map(data => data.temperature).reverse(),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Purple
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.historyPanel}>
      <Text style={styles.sectionTitle}>AI History Dashboard</Text>
      <Text style={styles.historySubtitle}>Temperature History</Text>
      {historicalData.length > 1 ? (
        <LineChart
          data={temperatureHistoryData}
          width={300}
          height={200}
          chartConfig={chartConfig}
          bezier
        />
      ) : (
        <Text style={styles.noDataText}>No sufficient historical data to display.</Text>
      )}
      <Text style={styles.historySubtitle}>Recommendation vs User Choices (Coming Soon)</Text>
      {/* Placeholder for future implementation */}
    </View>
  );
};

const chartConfig = {
  backgroundGradientFrom: Colors.card,
  backgroundGradientTo: Colors.card,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

export const DeviceIntelligencePanel = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { deviceStatus, lastSyncTime } = context;

  const lastSync = lastSyncTime
    ? `Last sync: ${lastSyncTime.toLocaleTimeString()}`
    : 'Last sync: Never';

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Device Intelligence</Text>
      <View style={styles.deviceStatusRow}>
        <View style={[styles.statusIndicator, { backgroundColor: deviceStatus === 'Online' ? Colors.success : Colors.error }]} />
        <Text style={styles.deviceStatusText}>{deviceStatus}</Text>
      </View>
      <Text style={styles.lastSyncText}>{lastSync}</Text>
      <AIHistoryPanel />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  aiPanel: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
  },
  aiBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  aiStatusText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: 'bold',
  },
  aiConfidence: {
    alignItems: 'center',
  },
  aiConfidenceLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  aiConfidenceValue: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleButton: {
    backgroundColor: Colors.background,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionText: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    marginLeft: 12,
  },
  suggestionActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  applyButton: {
    backgroundColor: Colors.primary,
  },
  dismissButton: {
    backgroundColor: Colors.inactive,
  },
  actionButtonText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 12,
  },
  comfortPanel: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  comfortBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  comfortScore: {
    alignItems: 'center',
  },
  comfortScoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  comfortScoreLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  comfortDetails: {
    alignItems: 'flex-start',
  },
  detailText: {
    color: Colors.text,
    fontSize: 14,
    marginBottom: 4,
  },
  logPanel: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    height: 200,
  },
  logContent: {
    flex: 1, // Allow content to take available space
    overflow: 'hidden', // Hide overflow if content exceeds height
  },
  logItem: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  energyPanel: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  savingsText: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 12,
  },
  predictivePanel: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  devicePanel: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  deviceStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceStatusText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
    marginLeft: 8,
  },
  lastSyncText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  aiReasoningSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  aiReasoningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  aiExplanationText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 10,
    lineHeight: 20,
  },
  aiSourceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  aiSourceBadge: {
    backgroundColor: Colors.background,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  aiSourceText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  aiSuggestionsContainer: {
    marginTop: 5,
  },
  aiSuggestionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  aiSuggestionItem: {
    fontSize: 13,
    color: Colors.text,
    marginBottom: 3,
  },
  historyPanel: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  historySubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 10,
    marginBottom: 8,
  },
  noDataText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 10,
  },
});