import React, { useEffect, useState, useRef } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';


//api for sending 
//login -> roomId created for respective user -> sender and receiver subscribed to the same roomId -> then messaging might work.


interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  name?: string;
}

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;
type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatScreen'>;

interface ChatScreenProps {
  route: ChatScreenRouteProp;
  navigation: ChatScreenNavigationProp;
}

const ChatScreen = ({ route, navigation }: ChatScreenProps) => {
  const [client, setClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [roomId, setRoomId] = useState<string>('');
  const { chat, sender } = route.params; // for room/user info and sender
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    console.log("roomId" + JSON.stringify(roomId));
  },[])

  useEffect(() => {
    const fetchRoomId = async () => {
      try {
        const response = await fetch('http://172.20.48.146:8080/api/chat/room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userIds: [sender, chat.name] }),
        });
        if (!response.ok) throw new Error('Failed to create/fetch room');
        const data = await response.json();
        setRoomId(data.roomId);
      } catch (err) {
        console.error('Error fetching room ID:', err);
      }
    };
    fetchRoomId();
  }, []);

  useEffect(() => {
    if (!roomId) return;

    // Step 2: Fetch chat history
    fetchChatHistory(roomId);

    const sock = new SockJS('http://172.20.48.146:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => sock,
      onConnect: () => {
        console.log('connected');   //working fine
        stompClient.subscribe(`/topic/chatroom/${roomId}`, (message) => { //roomId
          //console.log("chat is" + chat);
          const received = JSON.parse(message.body);
          setMessages((prev) => [...prev, received]);
        });
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (client && inputMessage.trim()) {
      const messageObj = {
        sender: sender, // use actual logged-in user
        content: inputMessage,
        timestamp: new Date(),
      };
      client.publish({
        destination: `/app/chatroom/${roomId}`,
        body: JSON.stringify(messageObj),
      });
      setInputMessage('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isSent = item.sender === sender;
    return (
      <View
        style={[
          styles.messageContainer,
          isSent ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <Text style={[styles.messageSender, isSent ? styles.sentSender : styles.receivedSender]}>
          {isSent ? 'You' : item.sender}
        </Text>
        <Text style={styles.messageText}>{item.content}</Text>
      </View>
    );
  };

  const fetchChatHistory = async (roomId: string) => {
    try {
      const response = await fetch(`http://172.20.48.146:8080/api/messages/${roomId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      console.log('Fetched messages:', data); //to check
      // Convert timestamp string to Date object if needed
      const formatted = data.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
      setMessages(formatted);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{chat.name || 'Chat'}</Text>
      </View>
      
      {/* Chat messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      {/* Input area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.inputContainer}>
          <TextInput
            value={inputMessage}
            onChangeText={setInputMessage}
            onSubmitEditing={sendMessage}
            placeholder="Type message..."
            placeholderTextColor="#B88A6A"
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5E6D3',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(184, 138, 106, 0.1)',
    elevation: 2,
    shadowColor: '#B88A6A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backButtonText: {
    fontSize: 28,
    color: '#B88A6A',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B88A6A',
  },
  messagesList: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  messageContainer: {
    maxWidth: '75%',
    marginBottom: 12,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#B88A6A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#B88A6A',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5E6D3',
    borderWidth: 1,
    borderColor: 'rgba(184, 138, 106, 0.1)',
  },
  messageSender: {
    fontSize: 12,
    marginBottom: 2,
  },
  sentSender: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  receivedSender: {
    color: '#B88A6A',
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
    color: '#2D1810',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(184, 138, 106, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2D1810',
    backgroundColor: 'rgba(184, 138, 106, 0.07)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#B88A6A',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ChatScreen;
