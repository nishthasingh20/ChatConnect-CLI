import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Define the Message type
interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
}

export default function ChatInterface() {
  // Use Message[] for the messages state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Icon name="arrow-back" size={24} color="#4B5563" />
        <View style={styles.userSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar} />
          </View>
          <View>
            <Text style={styles.username}>Jerome Bell</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
        </View>
        <Icon name="more-vert" size={24} color="#4B5563" />
      </View>

      {/* Messages */}
      <ScrollView contentContainerStyle={styles.messages}>
        {messages.map((message) => (
          <View key={message.id} style={styles.messageRight}>
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
            <Text style={styles.timestamp}>{message.timestamp}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputArea}>
        <Icon name="add" size={24} color="#6B7280" />
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputMessage}
          onChangeText={setInputMessage}
          onSubmitEditing={handleSendMessage}
        />
        <Icon name="search" size={24} color="#6B7280" />
        <Icon name="face" size={24} color="#6B7280" />
        <Icon name="mic" size={24} color="#6B7280" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    backgroundColor: '#D1D5DB',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: '#9CA3AF',
    borderRadius: 16,
  },
  username: {
    fontWeight: '600',
    color: '#111827',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  messages: {
    padding: 16,
  },
  messageRight: {
    alignSelf: 'flex-end',
    marginBottom: 12,
    maxWidth: '80%',
  },
  messageBubble: {
    backgroundColor: '#FEF3C7',
    borderTopRightRadius: 4,
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    padding: 12,
  },
  messageText: {
    color: '#1F2937',
    fontSize: 14,
  },
  timestamp: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  inputArea: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    columnGap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
});
