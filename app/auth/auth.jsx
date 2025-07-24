import { AntDesign, FontAwesome } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, Image, KeyboardAvoidingView, Linking, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import GoogleG from '../../assets/images/google-g.png';

const ACCENT = '#2E45A3';
const GRADIENT = ['#e8edfa', '#d1e0ff', '#f5f7fa']; // softer, more modern gradient
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AuthScreen() {
  const [checked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [loginLinkModalVisible, setLoginLinkModalVisible] = useState(false);
  const [loginLinkEmail, setLoginLinkEmail] = useState('');
  const [loginLinkError, setLoginLinkError] = useState('');
  const [loginLinkSuccess, setLoginLinkSuccess] = useState('');
  const [loginLinkLoading, setLoginLinkLoading] = useState(false);
  const [checkInboxModalVisible, setCheckInboxModalVisible] = useState(false);
  const [resendTimer, setResendTimer] = useState(25);
  const [createAccountModalVisible, setCreateAccountModalVisible] = useState(false);
  const [createEmail, setCreateEmail] = useState('');
  const [createChecked, setCreateChecked] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [verifyCode, setVerifyCode] = useState(['', '', '', '']);
  const [verifyError, setVerifyError] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResendTimer, setVerifyResendTimer] = useState(30);
  const codeInputs = [useRef(), useRef(), useRef(), useRef()];
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernamePassword, setUsernamePassword] = useState('');
  const [usernamePasswordVisible, setUsernamePasswordVisible] = useState(false);
  const [usernamePasswordError, setUsernamePasswordError] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPasswordVisible, setSignupPasswordVisible] = useState(false);
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupConfirmPasswordVisible, setSignupConfirmPasswordVisible] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const router = useRouter();
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Shake animation effect
  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [error, shakeAnim]);

  // Basic validation
  const validateAndLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Email/username and password are required.');
      Toast.show({ type: 'error', text1: 'Sign In Error', text2: 'Email/username and password are required.' });
      return;
    }
    // Email format check (if email)
    if (email.includes('@') && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Please enter a valid email address.');
      Toast.show({ type: 'error', text1: 'Sign In Error', text2: 'Please enter a valid email address.' });
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Simulate async sign-in
      await new Promise((resolve, reject) => setTimeout(() => {
        // Simulate a failed login for demonstration
        // reject({ code: 'auth/wrong-password' });
        resolve();
      }, 800));
      // If successful:
      setModalVisible(false);
      router.replace('(tabs)'); // Navigate to main home feed tab
    } catch (err) {
      // Example error handling
      let toastMsg = 'Sign in failed. Please try again.';
      if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
        toastMsg = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email or username.');
        toastMsg = 'No account found with this email or username.';
      } else {
        setError('Sign in failed. Please try again.');
      }
      Toast.show({ type: 'error', text1: 'Sign In Error', text2: toastMsg });
    } finally {
      setLoading(false);
    }
  };

  // Add a timer effect for the resend link
  useEffect(() => {
    let timer;
    if (checkInboxModalVisible && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [checkInboxModalVisible, resendTimer]);

  // Add a timer effect for the resend link
  useEffect(() => {
    let timer;
    if (verifyModalVisible && verifyResendTimer > 0) {
      timer = setTimeout(() => setVerifyResendTimer(verifyResendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [verifyModalVisible, verifyResendTimer]);

  return (
    <LinearGradient colors={GRADIENT} style={styles.gradient}>
      <View style={styles.centered}>
        {/* Only show the main card if neither modal is visible */}
        {!modalVisible && !forgotModalVisible && !loginLinkModalVisible && !checkInboxModalVisible && !createAccountModalVisible && !verifyModalVisible && !usernameModalVisible && !genderModalVisible && (
          <View style={styles.cardModern}>
            {/* Logo */}
            <View style={styles.logoWrapModern}>
              <Image source={require('../../assets/images/Penguin.jpg')} style={styles.logoModern} />
            </View>
            {/* Title with Gradient */}
            <MaskedView
              maskElement={
                <Text style={styles.titleGradient}>Log in or Sign up</Text>
              }
            >
              <LinearGradient
                colors={[ACCENT, '#7683F7', '#292F4B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ minHeight: 40, paddingVertical: 6, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={[styles.titleGradient, { opacity: 0 }]}>Log in or Sign up</Text>
              </LinearGradient>
            </MaskedView>
            {/* Social Sign-In Buttons */}
            <View style={styles.socialBtnGroup}>
              {/* Google Sign-In */}
              <TouchableOpacity
                style={styles.googleSignInBtn}
                activeOpacity={0.85}
              >
                <Image source={GoogleG} style={styles.googleGIcon} />
                <Text style={styles.googleSignInText}>Continue with Google</Text>
              </TouchableOpacity>
              {/* Apple Sign-In */}
              <TouchableOpacity
                style={styles.appleSignInBtn}
                activeOpacity={0.85}
              >
                <FontAwesome name="apple" size={24} color="#fff" style={styles.appleIcon} />
                <Text style={styles.appleSignInText}>Sign in with Apple</Text>
              </TouchableOpacity>
            </View>
            {/* Divider */}
            <View style={styles.dividerModern}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>
            {/* Email/Username Sign-In Button */}
            <TouchableOpacity
              style={styles.emailSignInBtn}
              activeOpacity={0.85}
              onPress={() => setModalVisible(true)}
            >
              <FontAwesome name="envelope" size={22} color="#888" style={styles.emailIcon} />
              <Text style={styles.emailSignInText}>Use email or username</Text>
            </TouchableOpacity>
            <View style={{ height: 10 }} />
            {/* Checkbox */}
            <View style={styles.checkboxRowModern}>
              <TouchableOpacity onPress={() => setChecked(!checked)} style={styles.checkboxBoxModern}>
                {checked ? (
                  <LinearGradient colors={[ACCENT, '#7683F7']} style={styles.checkboxGradient}>
                    <AntDesign name="check" size={16} color="#fff" />
                  </LinearGradient>
                ) : (
                  <View style={styles.checkboxEmpty} />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxTextModern}>I agree to receive emails about cool stuff on Neoping</Text>
            </View>
            {/* Legal Text */}
            <Text style={styles.legalTextModern}>
              By continuing, you agree to our{' '}
              <Text style={styles.linkModern} onPress={() => Linking.openURL('https://your-user-agreement-url.com')}>User Agreement</Text>
              {' '}and acknowledge that you understand the{' '}
              <Text style={styles.linkModern} onPress={() => Linking.openURL('https://your-privacy-policy-url.com')}>Privacy Policy</Text>.
            </Text>
          </View>
        )}
      </View>
      {/* Email/Username Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 24 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              style={{ width: '100%' }}
              alwaysBounceVertical={true}
            >
              <View style={styles.modalCard}>
                {/* Logo */}
                <View style={{ marginBottom: 14 }}>
                  <Image source={require('../../assets/images/Penguin.jpg')} style={styles.modalLogo} />
                </View>
                {/* Title */}
                <View style={{ height: 6 }} />
                <MaskedView
                  maskElement={<Text style={styles.modalTitleGradient}>Log in to Neoping</Text>}
                  style={{ width: '100%', backgroundColor: 'transparent' }}
                >
                  <LinearGradient
                    colors={[ACCENT, '#7683F7', '#292F4B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ minHeight: 36, paddingVertical: 8, alignItems: 'center', justifyContent: 'center', width: '100%' }}
                  >
                    <Text style={[styles.modalTitleGradient, { opacity: 0 }]}>Log in to Neoping</Text>
                  </LinearGradient>
                </MaskedView>
                <View style={{ height: 0 }} />
                {/* Email/Username Input */}
                <Animated.View style={{ width: '100%', transform: [{ translateX: shakeAnim }], marginTop: 4 }}>
                  <TextInput
                    style={[
                      styles.modalInput,
                      emailFocused && styles.modalInputFocused,
                      error && styles.inputError
                    ]}
                    placeholder="Email or username"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={text => { setEmail(text); setError(''); }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </Animated.View>
                {/* Password Input */}
                <View style={styles.passwordInputWrap}>
                  <TextInput
                    style={[
                      styles.modalInput,
                      passwordFocused && styles.modalInputFocused,
                      error && styles.inputError,
                      { flex: 1, marginBottom: 0 }
                    ]}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={text => { setPassword(text); setError(''); }}
                    secureTextEntry={!showPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <TouchableOpacity
                    style={styles.eyeIconWrap}
                    onPress={() => setShowPassword((v) => !v)}
                  >
                    <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#888" />
                  </TouchableOpacity>
                </View>
                <View style={{ height: 8 }} />
                {/* Error Message */}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                {/* Log in Button */}
                <TouchableOpacity
                  style={[
                    styles.modalLoginBtn,
                    (!email.trim() || !password.trim()) && styles.modalLoginBtnDisabled
                  ]}
                  onPress={validateAndLogin}
                  disabled={!email.trim() || !password.trim() || loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={[
                      styles.modalLoginText,
                      (!email.trim() || !password.trim()) && styles.modalLoginTextDisabled
                    ]}>Log in</Text>
                  )}
                </TouchableOpacity>
                {/* Links */}
                <View style={styles.modalLinksRow}>
                  <TouchableOpacity onPress={() => { setForgotModalVisible(true); setModalVisible(false); }}>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { setLoginLinkModalVisible(true); setModalVisible(false); }}>
                    <View style={styles.customUnderlineWrap}>
                      <Text style={styles.loginLinkText}>Email me a login link instead</Text>
                      <View style={styles.customUnderline} />
                    </View>
                  </TouchableOpacity>
                </View>
                {/* Create Account Link */}
                <TouchableOpacity style={styles.createAccountBtn} onPress={() => { setCreateAccountModalVisible(true); setModalVisible(false); }}>
                  <Text style={styles.createAccountText}>Create a new account</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
      {/* Forgot Password Modal */}
      <Modal
        visible={forgotModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => { setForgotModalVisible(false); setModalVisible(true); }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.forgotCard}>
            {/* Top Row: Back/Close and Help */}
            <View style={styles.forgotTopRow}>
              <TouchableOpacity onPress={() => { setForgotModalVisible(false); setModalVisible(true); }}>
                <FontAwesome name="arrow-left" size={22} color="#222" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.forgotHelp}>Help</Text>
              </TouchableOpacity>
            </View>
            {/* Logo */}
            <View style={styles.modalLogoWrap}>
              <Image source={require('../../assets/images/Penguin.jpg')} style={styles.modalLogo} />
            </View>
            {/* Gradient Title */}
            <MaskedView
              maskElement={
                <Text style={styles.forgotTitleGradient}>Forgot password?</Text>
              }
            >
              <LinearGradient
                colors={[ACCENT, '#7683F7', '#292F4B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ minHeight: 36, paddingVertical: 4, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={[styles.forgotTitleGradient, { opacity: 0 }]}>Forgot password?</Text>
              </LinearGradient>
            </MaskedView>
            {/* Subtitle */}
            <Text style={styles.forgotSubtitle}>
              Enter your email address or username and we’ll send you a link to reset your password
            </Text>
            {/* Input */}
            <TextInput
              style={[styles.modalInput, forgotError && styles.inputError]}
              placeholder="Email or username"
              placeholderTextColor="#888"
              value={forgotEmail}
              onChangeText={text => { setForgotEmail(text); setForgotError(''); setForgotSuccess(''); }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {/* Reset Password Button */}
            <TouchableOpacity
              style={[
                styles.modalLoginBtn,
                (!forgotEmail.trim() || forgotLoading) && styles.modalLoginBtnDisabled
              ]}
              onPress={async () => {
                if (!forgotEmail.trim()) {
                  setForgotError('Email or username is required.');
                  return;
                }
                if (forgotEmail.includes('@') && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(forgotEmail)) {
                  setForgotError('Please enter a valid email address.');
                  return;
                }
                setForgotError('');
                setForgotSuccess('');
                setForgotLoading(true);
                // Simulate async request
                setTimeout(() => {
                  setForgotLoading(false);
                  setForgotSuccess('If an account exists, a reset link has been sent.');
                }, 1200);
              }}
              disabled={!forgotEmail.trim() || forgotLoading}
            >
              {forgotLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[
                  styles.modalLoginText,
                  (!forgotEmail.trim() || forgotLoading) && styles.modalLoginTextDisabled
                ]}>Reset Password</Text>
              )}
            </TouchableOpacity>
            {/* Error/Success Message */}
            {forgotError ? <Text style={styles.errorTextModern}>{forgotError}</Text> : null}
            {forgotSuccess ? <Text style={styles.successTextModern}>{forgotSuccess}</Text> : null}
          </View>
        </View>
      </Modal>
      {/* Email Me a Login Link Modal */}
      <Modal
        visible={loginLinkModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => { setLoginLinkModalVisible(false); setModalVisible(true); }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.loginLinkCard}>
            {/* Top Row: Back/Close */}
            <View style={styles.forgotTopRow}>
              <TouchableOpacity onPress={() => { setLoginLinkModalVisible(false); setModalVisible(true); }}>
                <FontAwesome name="arrow-left" size={22} color="#222" />
              </TouchableOpacity>
              <View style={{ width: 22 }} />
            </View>
            {/* Logo */}
            <View style={styles.modalLogoWrap}>
              <Image source={require('../../assets/images/Penguin.jpg')} style={styles.modalLogo} />
            </View>
            {/* Gradient Title */}
            <MaskedView
              maskElement={
                <Text style={styles.loginLinkTitleGradient}>What's your email?</Text>
              }
            >
              <LinearGradient
                colors={[ACCENT, '#7683F7', '#292F4B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ minHeight: 36, paddingVertical: 4, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={[styles.loginLinkTitleGradient, { opacity: 0 }]}>What's your email?</Text>
              </LinearGradient>
            </MaskedView>
            {/* Subtitle */}
            <Text style={styles.loginLinkSubtitle}>
              We’ll send you a login link. No password needed.
            </Text>
            {/* Input */}
            <TextInput
              style={[styles.modalInput, loginLinkError && styles.inputError]}
              placeholder="Email"
              placeholderTextColor="#888"
              value={loginLinkEmail}
              onChangeText={text => { setLoginLinkEmail(text); setLoginLinkError(''); setLoginLinkSuccess(''); }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.modalLoginBtn,
                (!loginLinkEmail.trim() || loginLinkLoading) && styles.modalLoginBtnDisabled
              ]}
              onPress={async () => {
                if (!loginLinkEmail.trim()) {
                  setLoginLinkError('Email is required.');
                  return;
                }
                if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(loginLinkEmail)) {
                  setLoginLinkError('Please enter a valid email address.');
                  return;
                }
                setLoginLinkError('');
                setLoginLinkSuccess('');
                setLoginLinkLoading(true);
                // Simulate async request
                setTimeout(() => {
                  setLoginLinkLoading(false);
                  setLoginLinkSuccess('If an account exists, a login link has been sent.');
                  setLoginLinkModalVisible(false);
                  setCheckInboxModalVisible(true);
                  setResendTimer(25);
                }, 1200);
              }}
              disabled={!loginLinkEmail.trim() || loginLinkLoading}
            >
              {loginLinkLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[
                  styles.modalLoginText,
                  (!loginLinkEmail.trim() || loginLinkLoading) && styles.modalLoginTextDisabled
                ]}>Continue</Text>
              )}
            </TouchableOpacity>
            {/* Error/Success Message */}
            {loginLinkError ? <Text style={styles.errorTextModern}>{loginLinkError}</Text> : null}
            {loginLinkSuccess ? <Text style={styles.successTextModern}>{loginLinkSuccess}</Text> : null}
          </View>
        </View>
      </Modal>
      {/* Check Your Inbox Modal */}
      <Modal
        visible={checkInboxModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => { setCheckInboxModalVisible(false); setModalVisible(true); }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.checkInboxCard}>
            {/* Top Row: Back/Close */}
            <View style={styles.forgotTopRow}>
              <TouchableOpacity onPress={() => { setCheckInboxModalVisible(false); setModalVisible(true); }}>
                <FontAwesome name="arrow-left" size={22} color="#222" />
              </TouchableOpacity>
              <View style={{ width: 22 }} />
            </View>
            {/* Logo */}
            <View style={styles.modalLogoWrap}>
              <Image source={require('../../assets/images/Penguin.jpg')} style={styles.modalLogo} />
            </View>
            {/* Gradient Title */}
            <MaskedView
              maskElement={
                <Text style={styles.checkInboxTitleGradient}>Check your inbox</Text>
              }
            >
              <LinearGradient
                colors={[ACCENT, '#7683F7', '#292F4B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ minHeight: 36, paddingVertical: 4, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={[styles.checkInboxTitleGradient, { opacity: 0 }]}>Check your inbox</Text>
              </LinearGradient>
            </MaskedView>
            {/* Subtitle */}
            <Text style={styles.checkInboxSubtitle}>
              We sent a link to your email for you to log in without a password.
            </Text>
            {/* Envelope Icon */}
            <View style={styles.checkInboxIconWrap}>
              <FontAwesome name="envelope-o" size={54} color="#222" />
            </View>
            {/* Resend Link */}
            <Text style={styles.checkInboxResend}>
              Didn’t get an email from Neoping? <Text style={{ color: ACCENT, fontWeight: '700' }}>Resend in 00:{resendTimer.toString().padStart(2, '0')}</Text>
            </Text>
            {/* Open Email App Button */}
            <TouchableOpacity
              style={styles.checkInboxBtn}
              onPress={() => Linking.openURL('mailto:')}
            >
              <Text style={styles.checkInboxBtnText}>Open Email App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Create Account Modal */}
      <Modal
        visible={createAccountModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => { setCreateAccountModalVisible(false); setModalVisible(true); }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.createAccountCard}>
            {/* Top Row: Back/Close */}
            <View style={styles.forgotTopRow}>
              <TouchableOpacity onPress={() => { setCreateAccountModalVisible(false); setModalVisible(true); }}>
                <FontAwesome name="arrow-left" size={22} color="#222" />
              </TouchableOpacity>
              <View style={{ width: 22 }} />
            </View>
            {/* Logo */}
            <View style={styles.modalLogoWrap}>
              <Image source={require('../../assets/images/Penguin.jpg')} style={styles.modalLogo} />
            </View>
            {/* Gradient Title */}
            <MaskedView
              maskElement={
                <Text style={styles.createAccountTitleGradient}>Hi new friend, welcome to Neoping</Text>
              }
            >
              <LinearGradient
                colors={[ACCENT, '#7683F7', '#292F4B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ minHeight: 36, paddingVertical: 4, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={[styles.createAccountTitleGradient, { opacity: 0 }]}>Hi new friend, welcome to Neoping</Text>
              </LinearGradient>
            </MaskedView>
            {/* Subtitle */}
            <Text style={styles.createAccountSubtitle}>
              Enter your email to get started
            </Text>
            {/* Input */}
            <TextInput
              style={[styles.modalInput, createError && styles.inputError]}
              placeholder="Email"
              placeholderTextColor="#888"
              value={createEmail}
              onChangeText={text => { setCreateEmail(text); setCreateError(''); setCreateSuccess(''); }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {/* Checkbox */}
            <View style={styles.checkboxRowModern}>
              <TouchableOpacity onPress={() => setCreateChecked(!createChecked)} style={styles.checkboxBoxModern}>
                {createChecked ? (
                  <LinearGradient colors={[ACCENT, '#7683F7']} style={styles.checkboxGradient}>
                    <AntDesign name="check" size={16} color="#fff" />
                  </LinearGradient>
                ) : (
                  <View style={styles.checkboxEmpty} />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxTextModern}>I agree to recieve emails about cool stuff on Neoping</Text>
            </View>
            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.modalLoginBtn,
                (!createEmail.trim() || !createChecked || createLoading) && styles.modalLoginBtnDisabled
              ]}
              onPress={async () => {
                if (!createEmail.trim()) {
                  setCreateError('Email is required.');
                  return;
                }
                if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(createEmail)) {
                  setCreateError('Please enter a valid email address.');
                  return;
                }
                if (!createChecked) {
                  setCreateError('You must agree to receive emails.');
                  return;
                }
                setCreateError('');
                setCreateSuccess('');
                setCreateLoading(true);
                // Simulate async request
                setTimeout(() => {
                  setCreateLoading(false);
                  setCreateSuccess('Account created! Check your email for a confirmation link.');
                  router.replace('(tabs)'); // Navigate to main home feed tab
                }, 1200);
              }}
              disabled={!createEmail.trim() || !createChecked || createLoading}
            >
              {createLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[
                  styles.modalLoginText,
                  (!createEmail.trim() || !createChecked || createLoading) && styles.modalLoginTextDisabled
                ]}>Continue</Text>
              )}
            </TouchableOpacity>
            {/* Error/Success Message */}
            {createError ? <Text style={styles.errorTextModern}>{createError}</Text> : null}
            {createSuccess ? <Text style={styles.successTextModern}>{createSuccess}</Text> : null}
            {/* Legal Text */}
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Text style={[styles.legalTextModern, { width: '90%', textAlign: 'center', alignSelf: 'center' }]}>
                By continuing, you agree to our{' '}
                <Text style={styles.linkModern} onPress={() => Linking.openURL('https://your-user-agreement-url.com')}>User Agreement</Text>
                {' '}and acknowledge that you understand the{' '}
                <Text style={styles.linkModern} onPress={() => Linking.openURL('https://your-privacy-policy-url.com')}>Privacy Policy</Text>.
              </Text>
            </View>
            {/* Log into existing account link */}
            <TouchableOpacity style={styles.createAccountLoginBtn} onPress={() => { setCreateAccountModalVisible(false); setModalVisible(true); }}>
              <Text style={styles.createAccountLoginText}>Log into exiting account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Verify Email Modal */}
      <Modal
        visible={verifyModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => { setVerifyModalVisible(false); setModalVisible(true); }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.verifyCard}>
            {/* Top Row: Back/Close */}
            <View style={styles.forgotTopRow}>
              <TouchableOpacity onPress={() => { setVerifyModalVisible(false); setModalVisible(true); }}>
                <FontAwesome name="arrow-left" size={22} color="#222" />
              </TouchableOpacity>
              <View style={{ width: 22 }} />
            </View>
            {/* Logo */}
            <View style={styles.modalLogoWrap}>
              <Image source={require('../../assets/images/Penguin.jpg')} style={styles.modalLogo} />
            </View>
            {/* Gradient Title */}
            <MaskedView
              maskElement={
                <Text style={styles.verifyTitleGradient}>Verify your Email</Text>
              }
            >
              <LinearGradient
                colors={[ACCENT, '#7683F7', '#292F4B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ minHeight: 36, paddingVertical: 4, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={[styles.verifyTitleGradient, { opacity: 0 }]}>Verify your Email</Text>
              </LinearGradient>
            </MaskedView>
            {/* Subtitle */}
            <Text style={styles.verifySubtitle}>
              We’ve sent the code to your email.
            </Text>
            {/* Code Inputs */}
            <View style={styles.codeInputRow}>
              {[0, 1, 2, 3].map((i) => (
                <TextInput
                  key={i}
                  ref={codeInputs[i]}
                  style={[styles.codeInput, verifyError && styles.inputError]}
                  value={verifyCode[i]}
                  onChangeText={text => {
                    if (/^[0-9]?$/.test(text)) {
                      const newCode = [...verifyCode];
                      newCode[i] = text;
                      setVerifyCode(newCode);
                      setVerifyError('');
                      if (text && i < 3) codeInputs[i + 1].current.focus();
                      if (!text && i > 0) codeInputs[i - 1].current.focus();
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  returnKeyType="next"
                  textAlign="center"
                  autoFocus={i === 0}
                />
              ))}
            </View>
            {/* Resend Link */}
            <Text style={styles.verifyResend}>
              Didn’t receive any code?{' '}
              <Text style={{ color: ACCENT, fontWeight: '700' }} onPress={() => verifyResendTimer === 0 && setVerifyResendTimer(30)}>
                Resend{verifyResendTimer > 0 ? ` in 00:${verifyResendTimer.toString().padStart(2, '0')}` : ''}
              </Text>
            </Text>
            {/* Verify Button */}
            <TouchableOpacity
              style={[
                styles.modalLoginBtn,
                (verifyCode.some(c => !c) || verifyLoading) && styles.modalLoginBtnDisabled
              ]}
              onPress={async () => {
                if (verifyCode.some(c => !c)) {
                  setVerifyError('Please enter the 4-digit code.');
                  return;
                }
                setVerifyError('');
                setVerifyLoading(true);
                // Simulate async verification
                setTimeout(() => {
                  setVerifyLoading(false);
                  // Success: proceed to next step (e.g., create username)
                  setVerifyModalVisible(false);
                  setUsernameModalVisible(true);
                  setUsername('');
                  setUsernameError('');
                }, 1200);
              }}
              disabled={verifyCode.some(c => !c) || verifyLoading}
            >
              {verifyLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[
                  styles.modalLoginText,
                  (verifyCode.some(c => !c) || verifyLoading) && styles.modalLoginTextDisabled
                ]}>Verify</Text>
              )}
            </TouchableOpacity>
            {/* Error Message */}
            {verifyError ? <Text style={styles.errorTextModern}>{verifyError}</Text> : null}
          </View>
        </View>
      </Modal>
      {/* Create Username Modal */}
      <Modal
        visible={usernameModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => { setUsernameModalVisible(false); setModalVisible(true); }}
      >
        <View style={styles.usernameOverlay}>
          <View style={styles.usernameCard}>
            {/* Top Row: Back/Close */}
            <View style={styles.usernameTopRow}>
              <TouchableOpacity onPress={() => { setUsernameModalVisible(false); setModalVisible(true); }}>
                <FontAwesome name="arrow-left" size={22} color="#222" />
              </TouchableOpacity>
              <View style={{ width: 22 }} />
            </View>
            {/* Logo */}
            <View style={styles.usernameLogoWrap}>
              <Image source={require('../../assets/images/Penguin.jpg')} style={styles.usernameLogo} />
            </View>
            {/* Gradient Title */}
            <MaskedView
              maskElement={
                <Text style={styles.usernameTitleGradient}>Sign Up</Text>
              }
            >
              <LinearGradient
                colors={[ACCENT, '#7683F7', '#292F4B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ minHeight: 38, paddingVertical: 4, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={[styles.usernameTitleGradient, { opacity: 0 }]}>Sign Up</Text>
              </LinearGradient>
            </MaskedView>
            {/* Subtitle */}
            <Text style={styles.usernameSubtitle}>
              Pick a name to use on Neoping. Choose carefully, you won’t be able to change it later.
            </Text>
            {/* Username Input */}
            <View style={styles.usernameInputWrap}>
              <Text style={styles.usernameInputLabel}>Username</Text>
              <View style={[styles.usernameInputBox, usernameError && styles.inputError]}>
                <TextInput
                  style={styles.usernameInput}
                  placeholder="Username"
                  placeholderTextColor="#888"
                  value={username}
                  onChangeText={text => {
                    setUsername(text);
                    setUsernameError('');
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={20}
                />
                {usernameError ? (
                  <FontAwesome name="exclamation-circle" size={20} color="#e74c3c" style={{ marginLeft: 6 }} />
                ) : null}
                {!!username && (
                  <TouchableOpacity onPress={() => setUsername('')}>
                    <FontAwesome name="times-circle" size={20} color="#888" style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {/* Error Message */}
            {usernameError ? <Text style={styles.usernameErrorText}>{usernameError}</Text> : null}
            {/* Password Field */}
            <View style={styles.usernameInputWrap}>
              <Text style={styles.usernameInputLabel}>New Password</Text>
              <View style={[styles.usernameInputBox, signupError && styles.inputError]}>
                <TextInput
                  style={styles.usernameInput}
                  placeholder="New Password"
                  placeholderTextColor="#888"
                  value={signupPassword}
                  onChangeText={text => {
                    setSignupPassword(text);
                    setSignupError('');
                  }}
                  autoCapitalize="none"
                  secureTextEntry={!signupPasswordVisible}
                  maxLength={32}
                />
                <TouchableOpacity onPress={() => setSignupPasswordVisible(v => !v)}>
                  <FontAwesome name={signupPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="#888" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            </View>
            {/* Error Message for Password */}
            {signupError ? <Text style={styles.usernameErrorText}>{signupError}</Text> : null}
            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.usernameContinueBtn,
                (!username.trim() || usernameLoading || !signupPassword.trim() || !signupConfirmPassword.trim()) && styles.modalLoginBtnDisabled
              ]}
              onPress={async () => {
                if (!username.trim()) {
                  setUsernameError('Username is required.');
                  return;
                }
                if (!signupPassword.trim() || !signupConfirmPassword.trim()) {
                  setSignupError('Both password fields are required.');
                  return;
                }
                if (signupPassword.length < 6) {
                  setSignupError('Password must be at least 6 characters.');
                  return;
                }
                if (signupPassword !== signupConfirmPassword) {
                  setSignupError('Passwords do not match.');
                  return;
                }
                // Simulate username check
                setUsernameLoading(true);
                setTimeout(() => {
                  setUsernameLoading(false);
                  if (username.toLowerCase() === 'neatpage6068') {
                    setUsernameError('Username already taken! Try another');
                  } else {
                    // Success: proceed to next step
                  }
                }, 1200);
              }}
              disabled={!username.trim() || usernameLoading || !signupPassword.trim() || !signupConfirmPassword.trim()}
            >
              <Text style={styles.usernameContinueText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Gender Selection Modal */}
      <Modal
        visible={genderModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => { setGenderModalVisible(false); setModalVisible(true); }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.genderCard}>
            {/* Logo */}
            <View style={styles.modalLogoWrap}>
              <Image source={require('../../assets/images/Penguin.jpg')} style={styles.modalLogo} />
            </View>
            {/* Gradient Title */}
            <MaskedView
              maskElement={
                <Text style={styles.genderTitleGradient}>About you</Text>
              }
            >
              <LinearGradient
                colors={[ACCENT, '#7683F7', '#292F4B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ minHeight: 36, paddingVertical: 4, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={[styles.genderTitleGradient, { opacity: 0 }]}>About you</Text>
              </LinearGradient>
            </MaskedView>
            {/* Subtitle */}
            <Text style={styles.genderSubtitle}>
              Tell us about yourself to start building your home feed
            </Text>
            {/* Gender Options */}
            {['Female', 'Male', 'Non-binary', 'I prefer not to say'].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.genderOptionBtn,
                  selectedGender === option && styles.genderOptionBtnSelected
                ]}
                onPress={() => {
                  setSelectedGender(option);
                  setTimeout(() => {
                    setGenderModalVisible(false);
                    router.replace('(tabs)'); // Navigate to main home feed tab
                  }, 400);
                }}
              >
                <Text style={[
                  styles.genderOptionText,
                  selectedGender === option && styles.genderOptionTextSelected
                ]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardModern: {
    width: '92%',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 48, // more rounded
    paddingVertical: 24, // was 60
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#1A237E', // deeper blue for modern shadow
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 48,
    elevation: 32,
    marginVertical: 8, // was 18
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(18px)' } : {}),
  },
  logoWrapModern: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoModern: {
    width: 110, // was 140
    height: 110, // was 140
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#2E45A3', // user requested color
    backgroundColor: 'linear-gradient(135deg, #e8edfa 60%, #d1e0ff 100%)', // fallback for RN, will show as solid color
    marginBottom: 10,
    shadowColor: '#2E45A3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  titleGradient: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 0,
    lineHeight: 40,
    letterSpacing: 0.7,
  },
  socialBtnGroup: {
    width: '100%',
    marginBottom: 18,
  },
  googleSignInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: '#dadce0',
    borderWidth: 1.2,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 14,
    width: '100%',
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
    transitionDuration: '0.2s',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
  },
  googleGIcon: {
    width: 22,
    height: 22,
    marginRight: 14,
    resizeMode: 'contain',
    verticalAlign: 'middle',
    alignSelf: 'center',
  },
  googleSignInText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    letterSpacing: 0.1,
  },
  appleSignInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 8,
    width: '100%',
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    transitionDuration: '0.2s',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
  },
  appleIcon: {
    marginRight: 14,
    verticalAlign: 'middle',
    alignSelf: 'center',
  },
  appleSignInText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.1,
  },
  dividerModern: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#e0e0e0',
    borderRadius: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#888',
    fontWeight: '600',
    fontSize: 14,
  },
  authBtnModern: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 22,
    marginBottom: 18,
    width: '100%',
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
    transitionDuration: '0.2s',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
    alignSelf: 'center', // Center the button
  },
  btnPressed: {
    transform: [{ scale: 0.97 }],
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  authBtnTextModern: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },
  checkboxRowModern: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  checkboxBoxModern: {
    marginRight: 10,
  },
  checkboxGradient: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxEmpty: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: ACCENT,
    backgroundColor: '#fff',
  },
  checkboxTextModern: {
    fontSize: 14,
    color: '#444',
    flex: 1,
    flexWrap: 'wrap',
  },
  legalTextModern: {
    fontSize: 12,
    color: '#888',
    marginTop: 14,
    textAlign: 'left',
    width: '100%',
    fontWeight: '500',
  },
  linkModern: {
    color: ACCENT,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  emailSignInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: '#dadce0',
    borderWidth: 1.2,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 18,
    width: '100%',
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: 'center',
    transitionDuration: '0.2s',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
  },
  emailIcon: {
    marginRight: 14,
    verticalAlign: 'middle',
    alignSelf: 'center',
  },
  emailSignInText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    letterSpacing: 0.1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '92%',
    maxHeight: SCREEN_HEIGHT * 0.85,
    backgroundColor: '#fff',
    borderRadius: 36, // more rounded
    paddingVertical: 14, // was 24
    paddingHorizontal: 26,
    alignItems: 'center',
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 48,
    elevation: 32,
    marginVertical: 6, // was 16
    paddingTop: 14, // was 24
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(18px)' } : {}),
  },
  modalLogoWrap: {
    alignItems: 'center',
    marginBottom: 12,
  },
  modalLogo: {
    width: 120, // was 150
    height: 120, // was 150
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#2E45A3', // user requested color
    backgroundColor: 'linear-gradient(135deg, #e8edfa 60%, #d1e0ff 100%)', // fallback for RN, will show as solid color
    marginBottom: 12,
    shadowColor: '#2E45A3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: ACCENT,
    marginBottom: 24,
    marginTop: 12,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  modalTitleGradient: {
    textAlign: 'center',
    fontSize: 32, // was 26
    fontWeight: '900',
    marginBottom: 24,
    lineHeight: 38, // adjust for new font size
    letterSpacing: 0.5,
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#f7f8fa',
    borderRadius: 24,
    paddingVertical: 12, // was 18
    paddingHorizontal: 22,
    fontSize: 18,
    marginBottom: 14, // was 24
    borderWidth: 0, // remove harsh border
    color: '#222',
    shadowColor: '#2E45A3',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  passwordInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  eyeIconWrap: {
    position: 'absolute',
    right: 18,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    height: '100%',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalLoginBtn: {
    backgroundColor: ACCENT,
    borderRadius: 28,
    paddingVertical: 12, // was 18
    paddingHorizontal: 44,
    marginTop: 8,
    marginBottom: 14, // was 24
    width: '100%',
    alignItems: 'center',
    minHeight: 40, // was 48
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
  },
  modalLoginBtnGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
  },
  modalLoginText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  modalLoginBtnDisabled: {
    backgroundColor: '#e0e0e0',
    shadowColor: 'transparent',
  },
  modalLoginTextDisabled: {
    color: '#aaa',
  },
  modalLinksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  forgotText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
  },
  loginLinkText: {
    color: '#222',
    fontSize: 14,
    fontWeight: '700',
  },
  createAccountBtn: {
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
    minHeight: 44,
  },
  createAccountText: {
    color: ACCENT,
    fontSize: 16,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  errorTextModern: {
    color: '#e74c3c',
    fontSize: 13,
    marginTop: 2,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  inputError: {
    borderWidth: 1.5,
    borderColor: '#e74c3c',
  },
  modalInputFocused: {
    backgroundColor: '#eef2fb',
    shadowOpacity: 0.10,
    borderWidth: 1.5,
    borderColor: ACCENT,
  },
  forgotCard: {
    width: '92%',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 44,
    paddingVertical: 48,
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 48,
    elevation: 32,
    marginVertical: 32,
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(16px)' } : {}),
  },
  forgotTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  forgotHelp: {
    color: ACCENT,
    fontWeight: '700',
    fontSize: 15,
  },
  forgotTitleGradient: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 12,
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  forgotSubtitle: {
    textAlign: 'center',
    color: '#222',
    fontSize: 15,
    marginBottom: 18,
    fontWeight: '500',
  },
  successTextModern: {
    color: '#2E7D32',
    fontSize: 13,
    marginTop: 2,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  loginLinkCard: {
    width: '92%',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 44,
    paddingVertical: 48,
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 48,
    elevation: 32,
    marginVertical: 32,
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(16px)' } : {}),
  },
  loginLinkTitleGradient: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 12,
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  loginLinkSubtitle: {
    textAlign: 'center',
    color: '#222',
    fontSize: 15,
    marginBottom: 18,
    fontWeight: '500',
  },
  checkInboxCard: {
    width: '92%',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 44,
    paddingVertical: 48,
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 48,
    elevation: 32,
    marginVertical: 32,
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(16px)' } : {}),
  },
  checkInboxTitleGradient: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 12,
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  checkInboxSubtitle: {
    textAlign: 'center',
    color: '#222',
    fontSize: 15,
    marginBottom: 18,
    fontWeight: '500',
  },
  checkInboxIconWrap: {
    marginVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInboxResend: {
    color: '#222',
    fontSize: 14,
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  checkInboxBtn: {
    backgroundColor: ACCENT,
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 8,
  },
  checkInboxBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  createAccountCard: {
    width: '94%',
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 52,
    paddingVertical: 56,
    paddingHorizontal: 34,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 48,
    elevation: 32,
    marginVertical: 36,
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(20px)' } : {}),
  },
  createAccountTitleGradient: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 18,
    lineHeight: 36,
    letterSpacing: 0.7,
  },
  createAccountSubtitle: {
    textAlign: 'center',
    color: '#222',
    fontSize: 17,
    marginBottom: 24,
    fontWeight: '600',
  },
  createAccountLoginBtn: {
    marginTop: 18,
    width: '100%',
    alignItems: 'center',
  },
  createAccountLoginText: {
    color: ACCENT,
    fontSize: 16,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#f7f8fa',
    borderRadius: 26,
    paddingVertical: 18,
    paddingHorizontal: 22,
    fontSize: 18,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#222',
  },
  modalLoginBtn: {
    backgroundColor: ACCENT,
    borderRadius: 28,
    paddingVertical: 12, // was 18
    paddingHorizontal: 44,
    marginTop: 4,
    marginBottom: 14, // was 22
    width: '100%',
    alignItems: 'center',
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 4,
    transitionDuration: '0.2s',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
    minHeight: 40, // was 44
  },
  verifyCard: {
    width: '92%',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 44,
    paddingVertical: 48,
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 48,
    elevation: 32,
    marginVertical: 32,
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(16px)' } : {}),
  },
  verifyTitleGradient: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 12,
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  verifySubtitle: {
    textAlign: 'center',
    color: '#222',
    fontSize: 15,
    marginBottom: 18,
    fontWeight: '500',
  },
  codeInputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
  },
  codeInput: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f7f8fa',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    fontSize: 24,
    fontWeight: '700',
    marginHorizontal: 8,
    textAlign: 'center',
    color: '#222',
  },
  verifyResend: {
    color: '#222',
    fontSize: 14,
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  usernameOverlay: {
    flex: 1,
    backgroundColor: '#7d90e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  usernameCard: {
    width: '94%',
    backgroundColor: '#fff',
    borderRadius: 52,
    paddingVertical: 56,
    paddingHorizontal: 34,
    alignItems: 'center',
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 48,
    elevation: 32,
    marginVertical: 36,
  },
  usernameTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  usernameLogoWrap: {
    alignItems: 'center',
    marginBottom: 18,
  },
  usernameLogo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 5,
    borderColor: '#fff',
    backgroundColor: '#e8edfa',
    marginBottom: 18,
    shadowColor: '#2E45A3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 8,
  },
  usernameTitleGradient: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 12,
    lineHeight: 40,
    letterSpacing: 0.7,
  },
  usernameTitleLight: {
    color: '#7683F7',
    fontWeight: '900',
  },
  usernameSubtitle: {
    textAlign: 'center',
    color: '#222',
    fontSize: 17,
    marginBottom: 24,
    fontWeight: '600',
  },
  usernameInputWrap: {
    width: '100%',
    marginBottom: 8,
  },
  usernameInputLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
    marginLeft: 6,
  },
  usernameInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  usernameInput: {
    flex: 1,
    fontSize: 20,
    color: '#222',
    fontWeight: '600',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  usernameErrorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'left',
    fontWeight: '500',
    alignSelf: 'flex-start',
    marginLeft: 6,
  },
  usernameContinueBtn: {
    backgroundColor: '#bbb',
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 44,
    width: '100%',
    alignItems: 'center',
    marginTop: 28,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
    transitionDuration: '0.2s',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
    minHeight: 44,
  },
  usernameContinueText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  genderCard: {
    width: '92%',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 44,
    paddingVertical: 48,
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 48,
    elevation: 32,
    marginVertical: 32,
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(16px)' } : {}),
  },
  genderTitleGradient: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 12,
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  genderSubtitle: {
    textAlign: 'center',
    color: '#222',
    fontSize: 15,
    marginBottom: 18,
    fontWeight: '500',
  },
  genderOptionBtn: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  genderOptionBtnSelected: {
    borderColor: ACCENT,
    backgroundColor: '#e8edfa',
  },
  genderOptionText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },
  genderOptionTextSelected: {
    color: ACCENT,
  },
  customUnderlineWrap: {
    alignSelf: 'flex-start',
    position: 'relative',
  },
  customUnderline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -2,
    height: 2,
    backgroundColor: '#000',
    borderRadius: 1,
  },
}); 