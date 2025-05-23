import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  <Button 
  title="Test Location Services" 
  onPress={async () => {
    const hasServices = await Location.hasServicesEnabledAsync();
    alert(`Location services enabled: ${hasServices}`);
  }}
/>
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    
    try {
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        status = newStatus;
      }

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      const location = await Promise.race([
        Location.getCurrentPositionAsync({}),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Location request timed out')), 10000)
        )
      ]);

      const geocode = await Location.reverseGeocodeAsync(location.coords);
      if (!geocode || geocode.length === 0) {
        throw new Error('No address found');
      }

      setLocation(geocode[0]?.city || geocode[0]?.region || 'Unknown location');
    } catch (error) {
      setErrorMsg(error.message);
      console.error('Location error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : errorMsg ? (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{errorMsg}</Text>
          <Button title="Retry" onPress={getLocation} />
        </View>
      ) : (
        <Text style={styles.text}>Your City: {location}</Text>
      )}
    </View>
  );
};

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: name || 'Profile',
    });
  }, [name, navigation]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.text}>Hello, {name || 'Guest'}!</Text>
    </View>
  );
};

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen</Text>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Profile') iconName = 'person';
            else if (route.name === 'Settings') iconName = 'settings';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    marginVertical: 10,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
  },
});
