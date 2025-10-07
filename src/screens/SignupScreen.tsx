import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../navigation/AuthStack';
import { registerUser } from '../api/auth';
import AntDesign from 'react-native-vector-icons/AntDesign';

type Role = 'BUYER' | 'SELLER' | 'USER';
type SignupScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

const ROLES: Role[] = ['BUYER', 'SELLER', 'USER'];

const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { width } = useWindowDimensions();

  const s = useMemo(() => {
    const isTablet = width >= 768;
    const base = Math.min(Math.max(width / 24, 12), 18);
    return {
      isTablet,
      pad: isTablet ? 24 : 16,
      gap: isTablet ? 14 : 10,
      radius: isTablet ? 12 : 10,
      f12: base * 0.75,
      f14: base * 0.9,
      f16: base * 1.0,
      f18: base * 1.1,
      f24: base * 1.4,
      cardWidth: Math.min(width * 0.92, 540),
    };
  }, [width]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress]     = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('BUYER');
  const [showRoleSheet, setShowRoleSheet] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (!firstName || !lastName || !mobileNumber || !address || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      Alert.alert('Error', 'Mobile number must be exactly 10 digits');
      return;
    }

    if (!/^[\w.+\-]+@gmail\.com$/.test(email)) {
      Alert.alert('Error', 'Email must be a valid Gmail address (ending with @gmail.com)');
      return;
    }

    if (!/^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/.test(password)) {
      Alert.alert('Error', 'Password must be at least 8 characters long and contain at least 1 special symbol');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        email,
        password,
        firstName,
        lastName,
        mobileNumber: Number(mobileNumber),
        address,
        role,
      };

      await registerUser(payload);

      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (e: any) {
      const data = e?.response?.data;
      const msg = data?.errorMessage || data?.message || e?.message || 'Signup failed';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const roleLabel = (r: Role) => r.charAt(0) + r.slice(1).toLowerCase();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: '#0F5E87' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex1}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { padding: s.pad }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.header, { marginBottom: s.pad * 1.25 }]}>
            <Text style={[styles.logo, { fontSize: s.f24 }]}>LOGO</Text>
            <Text style={[styles.appTitle, { fontSize: s.f16 }]}>Create your account</Text>
          </View>

          <View
            style={[
              styles.card,
              { width: s.cardWidth, borderRadius: s.radius, padding: s.pad, gap: s.gap },
            ]}
          >
            <Text style={[styles.title, { fontSize: s.f18 }]}>Sign up</Text>
            <Text style={[styles.subtitle, { fontSize: s.f12 }]}>
              Choose your role and enter your details.
            </Text>

            <Text style={[styles.label, { fontSize: s.f12 }]}>Select role</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.inputLike,
                { borderRadius: s.radius, paddingVertical: 12, paddingHorizontal: 12 },
              ]}
              onPress={() => setShowRoleSheet(true)}
            >
              <Text style={[styles.inputLikeText, { fontSize: s.f14 }]}>{roleLabel(role)}</Text>
              <Text style={[styles.caret, { fontSize: s.f16 }]}>▾</Text>
            </TouchableOpacity>

            <Text style={[styles.label, { fontSize: s.f12 }]}>First name</Text>
            <TextInput
              placeholder="Enter first name"
              placeholderTextColor="#8C8C8C"
              style={[styles.input, { borderRadius: s.radius, fontSize: s.f14 }]}
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              returnKeyType="next"
            />
            <Text style={[styles.label, { fontSize: s.f12 }]}>Last name</Text>
            <TextInput
              placeholder="Enter last name"
              placeholderTextColor="#8C8C8C"
              style={[styles.input, { borderRadius: s.radius, fontSize: s.f14 }]}
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              returnKeyType="next"
            />

            <Text style={[styles.label, { fontSize: s.f12 }]}>Mobile number</Text>
            <TextInput
              placeholder="Enter mobile number"
              placeholderTextColor="#8C8C8C"
              style={[styles.input, { borderRadius: s.radius, fontSize: s.f14 }]}
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
              returnKeyType="next"
            />

            <Text style={[styles.label, { fontSize: s.f12 }]}>Address</Text>
            <TextInput
              placeholder="Enter address"
              placeholderTextColor="#8C8C8C"
              style={[styles.input, { borderRadius: s.radius, fontSize: s.f14 }]}
              value={address}
              onChangeText={setAddress}
              returnKeyType="next"
            />

            <Text style={[styles.label, { fontSize: s.f12 }]}>Email address</Text>
            <TextInput
              placeholder="Enter email address"
              placeholderTextColor="#8C8C8C"
              style={[styles.input, { borderRadius: s.radius, fontSize: s.f14 }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />

            <Text style={[styles.label, { fontSize: s.f12 }]}>Create password</Text>
            <View>
              <TextInput
                placeholder="Create password"
                placeholderTextColor="#8C8C8C"
                secureTextEntry={!showPassword}
                style={[
                  styles.input,
                  { borderRadius: s.radius, fontSize: s.f14, paddingRight: 40 },
                ]}
                value={password}
                onChangeText={setPassword}
                returnKeyType="next"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <AntDesign name={showPassword ? 'eyeo' : 'eye'} size={22} color="#000" />
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { fontSize: s.f12 }]}>Confirm password</Text>
            <View>
              <TextInput
                placeholder="Confirm password"
                placeholderTextColor="#8C8C8C"
                secureTextEntry={!showConfirmPassword}
                style={[
                  styles.input,
                  { borderRadius: s.radius, fontSize: s.f14, paddingRight: 40 },
                ]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <AntDesign name={showConfirmPassword ? 'eyeo' : 'eye'} size={22} color="#000" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                { borderRadius: s.radius, paddingVertical: 14, opacity: submitting ? 0.7 : 1 },
              ]}
              onPress={handleSignup}
              disabled={submitting}
            >
              <Text style={[styles.buttonText, { fontSize: s.f16 }]}>
                {submitting ? 'Creating…' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.footerText, { fontSize: s.f12 }]}>
              Already have an account?{' '}
              <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                Login
              </Text>
            </Text>
          </View>
        </ScrollView>

        <Modal
          visible={showRoleSheet}
          transparent
          animationType="fade"
          onRequestClose={() => setShowRoleSheet(false)}
        >
          <Pressable style={styles.sheetBackdrop} onPress={() => setShowRoleSheet(false)} />
          <View
            style={[
              styles.sheetContainer,
              { padding: s.pad, borderTopLeftRadius: s.radius + 2, borderTopRightRadius: s.radius + 2 },
            ]}
          >
            <Text style={[styles.sheetTitle, { fontSize: s.f16 }]}>Select Role</Text>
            {ROLES.map((r) => {
              const active = r === role;
              return (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.sheetItem,
                    {
                      borderRadius: s.radius,
                      paddingVertical: 12,
                      paddingHorizontal: 10,
                      marginBottom: s.gap,
                    },
                    active && styles.sheetItemActive,
                  ]}
                  onPress={() => {
                    setRole(r);
                    setShowRoleSheet(false);
                  }}
                >
                  <Text
                    style={[
                      styles.sheetItemText,
                      { fontSize: s.f14 },
                      active && styles.sheetItemTextActive,
                    ]}
                  >
                    {roleLabel(r)}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={[styles.sheetCancel, { paddingVertical: 12 }]}
              onPress={() => setShowRoleSheet(false)}
            >
              <Text style={[styles.sheetCancelText, { fontSize: s.f14 }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  safe: { flex: 1 },
  scrollContent: { alignItems: 'center', justifyContent: 'center', minHeight: '100%' },
  header: { width: '100%', alignItems: 'center' },
  logo: { color: '#fff', fontWeight: 'bold' },
  appTitle: { color: '#EAF6FD' },
  card: {
    backgroundColor: '#fff',
    width: '92%',
    maxWidth: 560,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  title: { color: '#0F172A', fontWeight: '700' },
  subtitle: { color: '#6B7280' },
  label: { color: '#374151', marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#DFE3EA',
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#0B0F19',
    backgroundColor: '#FBFCFE',
  },
  inputLike: {
    borderWidth: 1,
    borderColor: '#DFE3EA',
    backgroundColor: '#FBFCFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputLikeText: { color: '#0B0F19' },
  caret: { color: '#667085' },
  button: { backgroundColor: '#0F5E87', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  footerText: { color: '#111827', textAlign: 'center' },
  link: { color: '#0F5E87', fontWeight: '600' },

  // 👁️ eye icon for password fields
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -11 }],
  },

  // Role sheet
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheetContainer: { backgroundColor: '#fff' },
  sheetTitle: { fontWeight: '600', color: '#0B0F19', marginBottom: 6 },
  sheetItem: { borderWidth: 1, borderColor: '#EEE' },
  sheetItemActive: { backgroundColor: '#E6F3FA', borderColor: '#0F5E87' },
  sheetItemText: { color: '#111827' },
  sheetItemTextActive: { color: '#0F5E87', fontWeight: '700' },
  sheetCancel: { alignItems: 'center', marginTop: 4 },
  sheetCancelText: { color: '#0F5E87', fontWeight: '600' },
});
