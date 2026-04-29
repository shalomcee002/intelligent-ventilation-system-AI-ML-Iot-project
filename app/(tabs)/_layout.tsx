
import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.card,
        },
        headerStyle: {
          backgroundColor: Colors.card,
        },
        headerTitleStyle: {
          color: Colors.text,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'IntelliVent Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="control"
        options={{
          title: 'Control',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="sliders" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}