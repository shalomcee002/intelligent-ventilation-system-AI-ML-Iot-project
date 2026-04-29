
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart as RNLineChart } from 'react-native-chart-kit';
import { Rect, Svg, Text as SvgText } from 'react-native-svg';
import { Colors } from '../constants/Colors';

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
    }[];
  };
  title: string;
}

const SensorHistoryChart = ({ data, title }: LineChartProps) => {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    value: number;
    x: number;
    y: number;
    label: string;
  }>({
    visible: false,
    value: 0,
    x: 0,
    y: 0,
    label: '',
  });

  const handleDataPointClick = (dataPoint: { value: number; index: number; x: number; y: number }) => {
    // Toggle tooltip visibility if the same point is clicked again
    if (tooltip.visible && tooltip.x === dataPoint.x && tooltip.y === dataPoint.y) {
      setTooltip({ ...tooltip, visible: false });
    } else {
      setTooltip({
        visible: true,
        value: dataPoint.value,
        x: dataPoint.x,
        y: dataPoint.y,
        label: data.labels[dataPoint.index],
      });
    }
  };

  if (!data || !data.datasets || data.datasets.some(ds => ds.data.length === 0)) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.noDataText}>Not enough data to display chart.</Text>
      </View>
    );
  }

  const chartWidth = Dimensions.get('window').width - 64;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <RNLineChart
        data={data}
        width={chartWidth}
        height={220}
        chartConfig={{
          backgroundColor: Colors.card,
          backgroundGradientFrom: Colors.card,
          backgroundGradientTo: Colors.card,
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: Colors.accent,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        onDataPointClick={handleDataPointClick}
        decorator={() => {
          if (!tooltip.visible) return null;

          const tooltipText = `${tooltip.label}: ${tooltip.value}`;
          const textLength = tooltipText.length;
          const fontSize = 12;
          const padding = 8;
          const rectWidth = textLength * (fontSize * 0.6) + padding * 2; // Approximate width
          const rectHeight = fontSize + padding * 2;

          // Adjust tooltip position to be above the data point and centered horizontally
          const rectX = tooltip.x - rectWidth / 2;
          const rectY = tooltip.y - rectHeight - 10; // 10 units above the point

          // Ensure tooltip stays within chart bounds (simple check for now)
          const adjustedRectX = Math.max(0, Math.min(rectX, chartWidth - rectWidth));
          const adjustedRectY = Math.max(0, rectY); // Don't go above 0 for now

          return (
            <Svg>
              <Rect
                x={adjustedRectX}
                y={adjustedRectY}
                width={rectWidth}
                height={rectHeight}
                fill={Colors.primary}
                rx={5}
                ry={5}
              />
              <SvgText
                x={adjustedRectX + rectWidth / 2} // Center text horizontally
                y={adjustedRectY + rectHeight / 2 + fontSize / 3} // Center text vertically
                fill={Colors.text}
                fontSize={fontSize}
                fontWeight="bold"
                textAnchor="middle"
              >
                {tooltipText}
              </SvgText>
            </Svg>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  noDataText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 40,
  },
});

export default SensorHistoryChart;