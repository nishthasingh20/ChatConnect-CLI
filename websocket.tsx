import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import "fast-text-encoding";

let stompClient: Client | null = null;

export function connectAndSendTestMessage() {
  if (stompClient && stompClient.active) {
    // Already connected
    stompClient.publish({
      destination: '/app/hello',
      body: JSON.stringify({ name: 'Hello Testing Button' }),
    });
    return;
  }

  const socket = new SockJS('http://172.20.48.159:8080/ws');
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: (str) => {
      console.log('STOMP Debug:', str);
    },
    onConnect: () => {
      console.log('STOMP connected successfully!');
      stompClient?.subscribe('/topic/greetings', (message) => {
        console.log('Received greeting:', message.body);
        const greeting = JSON.parse(message.body);
        console.log('Parsed greeting:', greeting);
      });
      // Send a test message
      stompClient?.publish({
        destination: '/app/hello',
        body: JSON.stringify({ name: 'Hello nishtha' }),
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
} 