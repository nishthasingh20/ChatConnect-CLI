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
  ImageBackground,
  Image,
} from 'react-native';

import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Register: undefined;
  SignIn: undefined;
  // Add other screens here as needed
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = async () => {
    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // Send registration data to Spring Boot backend
      const response = await fetch('http://192.168.29.79:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          password
        }),
      });

      let data = {};
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        data = await response.json();
      }

      if (response.ok) {
        Alert.alert('Success', 'Account created successfully!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('SignIn');
            }
          }
        ]);
      } else {
        const errorMessage =
          typeof data === 'object' && data !== null && 'message' in data && typeof (data as any).message === 'string'
            ? (data as any).message
            : 'Failed to create account. Please try again.';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignIn = () => {
    navigation.navigate('SignIn');
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
        <ImageBackground 
        source={require('./assets/bg-image-more-hd.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
        >
        
      <StatusBar barStyle="dark-content" backgroundColor="#F5E6D3" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={goBack} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
              <Image
                source={require('./assets/logo-image.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>Join the conversation</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your full name"
                placeholderTextColor="#8B4513AA"
                value={formData.fullName}
                onChangeText={(value) => updateFormData('fullName', value)}
                autoComplete="name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="#8B4513AA"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Create a password (min 6 characters)"
                placeholderTextColor="#8B4513AA"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Confirm your password"
                placeholderTextColor="#8B4513AA"
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <TouchableOpacity 
              style={[styles.primaryButton, isLoading && styles.disabledButton]} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.signupPrompt}>
              <Text style={styles.signupPromptText}>Already have an account? </Text>
              <TouchableOpacity onPress={goToSignIn}>
                <Text style={styles.signupLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    opacity: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
  },  
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 130,
    marginTop: 18,
    marginBottom: -15,
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 40,
  },
  backButtonText: {
    color: '#8B4513',
    fontSize: 16,
    fontFamily: 'Bitter-Medium',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Bitter-Bold',
    color: '#8B4513',
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8B4513',
    fontFamily: "Bitter-Regular",
    opacity: 0.8,
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    paddingBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "Bitter-Bold",
    color: '#8B4513',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5D5C8',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: 'black',
    shadowColor: '#8B4513',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 10,
    marginTop: 15,
    shadowColor: '#8B4513',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    opacity: 0.9,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#F5E6D3',
    fontSize: 18,
    fontFamily: 'Bitter-Bold',
    textAlign: 'center',
  },
  signupPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupPromptText: {
    color: '#8B4513',
    fontSize: 16,
    fontFamily: "Bitter-Regular",
  },
  signupLink: {
    color: '#8B4513',
    fontSize: 16,
    fontFamily: "Bitter-Bold",
  },
});

export default RegisterScreen;