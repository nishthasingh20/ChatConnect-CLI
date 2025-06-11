import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';
import SignInScreen from './screens/SignInScreen';
import RegisterScreen from './screens/RegisterScreen';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(() => {
    const socket = new SockJS('http://192.168.209.208:8080/gs-guide-websocket');
    
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      onConnect: () => {
        console.log('STOMP connected successfully!');

        // Subscribe to the correct topic that matches your Spring Boot controller
        stompClient.subscribe('/topic/greetings', (message) => {
          console.log('Received greeting:', message.body);
          const greeting = JSON.parse(message.body);
          console.log('Parsed greeting:', greeting);
        });

        // Send a message to the correct endpoint
        stompClient.publish({
          destination: '/app/hello',
          body: JSON.stringify({ name: 'React Native User' }),
        });
      },
      onStompError: (frame) => {
        console.error('STOMP Error:', frame.headers['message']);
        console.error('Details:', frame.body);
      },
      onWebSocketError: (error) => {
        console.error('WebSocket Error:', error);
      },
      onDisconnect: () => {
        console.log('STOMP disconnected');
      }
    });

    stompClient.activate();

    return () => {
      console.log('Deactivating STOMP client');
      stompClient.deactivate();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'beige',
    alignItems: 'center',
    justifyContent: 'center',
  },
});