import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Register: undefined;
  ChatScreen: undefined;
  // Add other routes here if needed
};

type SignInScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

const SignInScreen = ({ navigation }: SignInScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('Success', 'Signed in successfully!');
      }, 100);
      navigation.navigate('ChatScreen');
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    }
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  const goBack = () => {
    navigation.goBack();
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset functionality coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5E6D3" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {/* Curved Top Card with Background Image */}
          <ImageBackground
            source={require('./assets/bg-image-more-hd.png')}
            style={styles.topCard}
            imageStyle={styles.topCardBg}
            resizeMode="cover"
          >
            <View style={styles.topCardContent}>
              <Image
                source={require('./assets/logo-image.png')}
                style={styles.logo}
                resizeMode="contain"
                accessible={true}
                accessibilityLabel="Chat Connect Logo"
              />
              <Text style={styles.slogan}>CHAT CONNECT</Text>
              <Text style={styles.tagline}>TALK. SHARE. CONNECT.</Text>
              <Text style={styles.welcomeText}>Welcome back!</Text>
            </View>
          </ImageBackground>

          {/* Login Card (no bg image) */}
          <View style={styles.formSection}>
            <Text style={styles.loginTitle}>Sign In</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor="#A0A0A0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>
            <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton, isLoading && styles.disabledButton]}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
            <View style={styles.socialRow}>
              <View style={styles.divider} />
              <View style={styles.divider} />
            </View>
            <View style={styles.signupPrompt}>
              <Text style={styles.signupPromptText}>Don't have account? </Text>
              <TouchableOpacity onPress={goToRegister}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  topCard: {
    width: width,
    minHeight: 300,
    borderBottomLeftRadius: 90,
    borderBottomRightRadius: 90,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
    backgroundColor: '#a16d52',
    marginTop: -20,
  },
  topCardBg: {
    width: '100%',
    height: '100%',
    opacity: 0.13,
    backgroundColor: '#b88a6a',
  },
  topCardContent: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    paddingTop: 10,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 40,
  },  slogan: {
    color: '#fff',
    fontFamily: 'Bitter-Bold',
    fontSize: 18,
    letterSpacing: 2,
    paddingBottom: 10,
  },
  tagline: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Bitter-Medium',
    letterSpacing: 1.2,
    marginBottom: 10,
    opacity: 0.8,
  },  
  welcomeText: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'Bitter-Bold',
    marginTop: 8,
    marginBottom: 5,
    opacity: 0.95,
  },
  formSection: {
    backgroundColor: '#fff',
    width: '88%',
    borderRadius: 24,
    padding: 24,
    marginTop: 60,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },  
  loginTitle: {
    color: '#964B00',
    fontSize: 20,
    fontFamily: 'Bitter-Bold',
    marginBottom: 18,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    marginBottom: 16,
  },  
  textInput: {
    backgroundColor: '#F3F6F6',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Bitter-Regular',
    color: 'black',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 18,
  },  
  forgotPasswordText: {
    color: '#964B00',
    fontSize: 14,
    fontFamily: 'Bitter-Regular',
  },
  primaryButton: {
    backgroundColor: '#ab7457',
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 18,
    marginTop: 2,
    shadowColor: '#ab7457',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Bitter-Bold',
    textAlign: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    marginHorizontal: 10,
    color: '#A0A0A0',
    fontSize: 13,
  },
  signupPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signupPromptText: {
    color: '#A0A0A0',
    fontSize: 15,
    fontFamily: 'Bitter-Regular'
  },
  signupLink: {
    color: '#964B00',
    fontSize: 15,
    marginLeft: 2,
    fontFamily: 'Bitter-Bold'
  },
});

export default SignInScreen;