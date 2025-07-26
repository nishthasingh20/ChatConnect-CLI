import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserChats'>;
type UserChatsRouteProp = RouteProp<RootStackParamList, 'UserChats'>;

interface Props {
  navigation: NavigationProp;
  route: UserChatsRouteProp;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  avatar: string;
}

const ChatListScreen: React.FC<Props> = ({ navigation, route }) => {
  const [searchText, setSearchText] = useState<string>('');
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const { sender } = route.params;

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('http://172.20.48.146:8080/api/users');
        const data = await response.json();
        //here data is the users fetched from the database : console.log(data);
        // Use fullName if available, fallback to name or email
        const formattedChats = data.map((user: any) => ({
          id: user.email,
          name: user.fullName || user.name || user.email,
          lastMessage: '',
          time: '',
          unreadCount: 0,
          isOnline: false,
          avatar: '👤',
        }));
        setChats(formattedChats);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ChatScreen', { chat: item, sender })}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
      </View>
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName} numberOfLines={1}>{item.name}</Text>
          {/* Optionally, add time or status here */}
        </View>
        {/* Optionally, add last message here */}
      </View>
      <Text style={{ fontSize: 18, color: '#B88A6A', marginLeft: 8 }}>›</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5E6D3" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading chats...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5E6D3" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Chats</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerIcon}>📷</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerIcon}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerIcon}>⋮</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search chats..."
              placeholderTextColor="#B88A6A"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>
      </View>

      Chat List
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabIcon}>💬</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  header: {
    backgroundColor: '#F5E6D3',
    paddingHorizontal: 16,
    paddingBottom: 12,
    elevation: 2,
    shadowColor: '#B88A6A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B88A6A',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(184, 138, 106, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 16,
    color: '#B88A6A',
  },
  searchContainer: {
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(184, 138, 106, 0.1)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  searchIcon: {
    fontSize: 16,
    color: '#B88A6A',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#B88A6A',
    paddingVertical: 4,
  },
  chatList: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 32,
    width: 50,
    height: 50,
    textAlign: 'center',
    lineHeight: 50,
    borderRadius: 25,
    backgroundColor: '#F5E6D3',
    overflow: 'hidden',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D1810',
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
    color: '#B88A6A',
    marginLeft: 8,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#6B5B4F',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#B88A6A',
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(184, 138, 106, 0.1)',
    marginLeft: 78,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#B88A6A',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#B88A6A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
});

export default ChatListScreen;