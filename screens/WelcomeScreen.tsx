import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { ImageBackground } from 'react-native';

const { width, height } = Dimensions.get('window');

import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  SignIn: undefined;
  RegisterScreen: undefined;
};

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const handleSignIn = () => {
    navigation.navigate('SignIn');
    console.log('Swtiched to SignIn screen');
  };
  const handleRegister = () => {
    navigation.navigate('RegisterScreen');
    console.log('Switched to Register Screen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5E6D3" />
      <ImageBackground 
        source={require('./assets/bg-image-more-hd.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.content}>{/* Logo Section */}
        <View style={styles.logoSection}>          <Image 
            source={require('./assets/logo-image.png')}
            style={styles.logo}
            resizeMode="contain"
            accessible={true}
            accessibilityLabel="Chat Connect Logo"
          />
          <Text style={styles.appTitle}>CHAT CONNECT</Text>
          <Text style={styles.tagline}>TALK. SHARE. CONNECT.</Text>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome!</Text>
          <Text style={styles.welcomeSubtitle}>
            Connect with employers and vendors through seamless conversations
          </Text>
        </View>

        {/* Action Buttons */}        <View style={styles.buttonSection}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleRegister}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText} numberOfLines={1}>
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={handleSignIn}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText} numberOfLines={1}>
              I already have an account
            </Text>          </TouchableOpacity>
        </View>
      </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-evenly', // Changed from space-between for better distribution
    paddingTop: height * 0.05, // Reduced top padding
    paddingBottom: height * 0.04,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: -50, // Reduced top margin
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 7,
  },  appTitle: {
    fontSize: 28,
    fontFamily: 'Bitter-Bold',
    color: '#8B4513',
    letterSpacing: 2,
    marginTop: 20,
  },
  tagline: {
    fontSize: 14,
    fontFamily: 'Bitter-Medium',
    color: '#8B4513',
    letterSpacing: 1.5,
    marginTop: 8,
    opacity: 0.8,
  },welcomeSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -height * 0.02, // Added negative margin to reduce space from logo section
  },  welcomeTitle: {
    fontSize: 32,
    fontFamily: 'Bitter-Bold',
    color: '#8B4513',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Bitter-Regular',
    color: '#8B4513',
    textAlign: 'center',
    lineHeight: 25,
    opacity: 0.8,
  },
  buttonSection: {
    paddingBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 16,
    shadowColor: '#8B4513',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },  primaryButtonText: {
    color: '#F5E6D3',
    fontSize: 18,
    fontFamily: 'Bitter-Bold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#8B4513',
  },  secondaryButtonText: {
    color: '#8B4513',
    fontSize: 16,
    fontFamily: 'Bitter-SemiBold',
    textAlign: 'center',
  },
});

export default WelcomeScreen;