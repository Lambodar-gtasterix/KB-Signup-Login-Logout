// src/screens/SigninScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../navigation/AuthStack';
import { useAuth } from '../context/AuthContext';
import AntDesign from 'react-native-vector-icons/AntDesign';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
const { height } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      if (loading) return;
      setLoading(true);

      await signIn(email, password);

    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.errorMessage ||
        'Invalid email or password';
      Alert.alert('Login failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground}>
        <Text style={styles.logo}>LOGO</Text>
      </View>
      <View style={styles.curvedTransition} />

      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Email address</Text>
        <TextInput
          placeholder="Enter email address"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <AntDesign name={showPassword ? 'eyeo' : 'eye'} size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Logging in…' : 'Login'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Don&apos;t have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBackground: {
    height: height * 0.35,
    backgroundColor: '#3282AA',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  logo: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  curvedTransition: {
    position: 'absolute',
    top: height * 0.33,
    left: 0,
    right: 0,
    height: height * 0.67,
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    zIndex: 0,
  },
  card: {
    position: 'absolute',
    top: height * 0.28,
    alignSelf: 'center',
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 16,
  },
  label: { fontSize: 12, color: '#555', marginBottom: 4, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    color: '#000',
  },

  // 👇 added for password show/hide
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 12,
    paddingRight: 10,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    color: '#000',
  },
  eyeButton: { padding: 4 },

  button: {
    backgroundColor: '#1D6D99',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  footerText: { fontSize: 12, textAlign: 'center' },
  link: { color: '#1D6D99', fontWeight: '500' },
});
