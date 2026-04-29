# IntelliVent App Functionality

The IntelliVent app is a smart home climate control system designed to provide users with real-time environmental monitoring, AI-driven climate management, and energy optimization. It integrates with an ESP32 device to collect sensor data and offers a comprehensive dashboard for control and insights.

## Core Features:

### 1. Real-time Dashboard
- **Current Status**: Displays live data from connected sensors including:
  - Temperature (°C)
  - Humidity (%)
  - Gas Status (Safe/Danger)
  - Motion Detection (Yes/No)
  - AC Status (ON/OFF)
- **Device Connection**: Shows the connection status to the ESP32 device (Connected/Disconnected) and the last data update time.
- **Weather Information**: Provides current outdoor temperature, weather conditions (Sunny, Cloudy, Rainy, Stormy), and AI-generated weather advice.

### 2. AI Smart Mode Panel
- **AI Modes**: Allows users to switch between different AI operational modes:
  - **Active**: AI actively adjusts climate settings based on learned patterns and real-time data.
  - **Learning**: AI observes user interactions and environmental data to build personalized comfort profiles.
  - **Manual**: User has full control over climate settings, overriding AI suggestions.
- **Dynamic Icons & Status**: Visual indicators and clear labels for the current AI mode.

### 3. AI Suggestions & Activity Log
- **AI Suggestions**: Provides actionable recommendations from the AI to optimize comfort or energy efficiency. Users can apply or dismiss these suggestions.
- **Activity Log**: Records AI decisions, user overrides, and system events for transparency and historical review.

### 4. Climate Control & Optimization
- **Comfort Score**: A metric indicating the current level of comfort based on various environmental factors.
- **Energy Optimization Panel**: Displays estimated energy savings and provides insights into energy efficiency.
- **Predictive Temperature Panel**: Shows forecasted temperature trends, helping users anticipate future climate conditions.

### 5. Sensor History Charts
- **Temperature History Chart**: Visualizes historical temperature data over time with interactive tooltips for precise readings.
- **Humidity History Chart**: Visualizes historical humidity data over time with interactive tooltips for precise readings.
- **Improved Readability**: X-axis labels are dynamically generated to show meaningful time intervals (e.g., "Now", "5s ago", "1m ago").

### 6. User Customization
- **Location Settings**: Users can update their location to receive accurate local weather data.
- **ESP IP Address Configuration**: Allows users to configure the IP address of their ESP32 device.

The IntelliVent app aims to create an intelligent, responsive, and energy-efficient living environment by leveraging sensor data and artificial intelligence.