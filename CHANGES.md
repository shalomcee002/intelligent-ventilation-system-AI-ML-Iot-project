# IntelliVent App Changes Log

This file documents the significant UI/UX enhancements and bug fixes implemented in the IntelliVent Dashboard.

## Version 1.0.0 - Dashboard UI/UX Enhancements

### New Features & Improvements:

*   **Dynamic Weather Icons**:
    *   **Description**: The weather advice section on the Dashboard now dynamically displays relevant icons (e.g., sun, cloud, umbrella, bolt) based on the current `weatherCondition`.
    *   **Impact**: Enhances visual appeal and provides a quick, intuitive understanding of the weather.
    *   **Files Modified**: `app/(tabs)/index.tsx`

*   **"Last Updated" Timestamp**:
    *   **Description**: A "Last Updated" timestamp has been added to the "Current Status" card, indicating when the sensor data was last synchronized.
    *   **Impact**: Improves data transparency and helps users understand the recency of displayed information.
    *   **Files Modified**: `app/(tabs)/index.tsx`

*   **Enhanced AI Suggestions `FlatList`**:
    *   **Description**: The horizontal `FlatList` displaying AI suggestions now features improved visual cues for swiping. Cards snap into place, and a peek of the next card is visible, indicating scrollability.
    *   **Impact**: Enhances user experience for navigating through AI suggestions, making it more intuitive and engaging.
    *   **Files Modified**: `app/(tabs)/index.tsx`

*   **Refined `AISuggestionCard` Component**:
    *   **Description**: The "Apply" and "Dismiss" action buttons within each AI suggestion card have been made more prominent and user-friendly with a clearer layout and improved styling.
    *   **Impact**: Increases the discoverability and usability of AI suggestion actions.
    *   **Files Modified**: `components/AI/Dashboard.tsx`

*   **Enhanced AI Smart Mode Panel**:
    *   **Description**: The `AISmartModePanel` now includes dynamic icons for each AI mode (Active, Learning, Manual), a clear "Change Mode" text label, and a button that visually changes color based on the active mode.
    *   **Impact**: Provides a more intuitive and visually informative way to understand and switch between AI operational modes.
    *   **Files Modified**: `components/AI/Dashboard.tsx`

*   **Improved Chart Readability (X-axis labels)**:
    *   **Description**: The `SensorHistoryChart` now displays more descriptive and context-aware time intervals on the X-axis (e.g., "Now", "5s ago", "1m ago") instead of generic "Xs".
    *   **Impact**: Significantly improves the readability and interpretability of historical sensor data trends.
    *   **Files Modified**: `app/(tabs)/index.tsx`

*   **Interactive Tooltips for Sensor History Charts**:
    *   **Description**: Users can now tap on individual data points within the `SensorHistoryChart` to reveal an interactive tooltip displaying the exact value and its corresponding time label.
    *   **Impact**: Enhances data precision and user interaction, allowing for detailed inspection of sensor readings.
    *   **Files Modified**: `components/SensorHistoryChart.tsx`

### Bug Fixes:

*   **Resolved Invalid `MaterialCommunityIcons` Name**:
    *   **Description**: Fixed a TypeScript error caused by using an invalid icon name ("hand-right") for the "Manual" AI mode. The icon has been updated to "cog".
    *   **Impact**: Ensures type safety and correct rendering of icons in the `AISmartModePanel`.
    *   **Files Modified**: `components/AI/Dashboard.tsx`