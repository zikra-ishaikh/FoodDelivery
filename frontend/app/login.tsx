import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';

const THEME = {
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    text: '#111827',
    subtext: '#6B7280',
    background: '#FFFFFF',
    border: '#E5E7EB',
};

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Navigate to Home layout
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                        {/* Header Image */}
                        <View style={styles.heroContainer}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop' }}
                                style={styles.heroImage}
                                resizeMode="cover"
                            />
                            <View style={styles.heroOverlay} />
                            <View style={styles.heroTextContainer}>
                                <Text style={styles.appName}>Qlick</Text>
                                <Text style={styles.appTagline}>Crave. Qlick. Satisfy.</Text>
                            </View>
                        </View>

                        {/* Login Form */}
                        <View style={styles.formContainer}>
                            <Text style={styles.welcomeText}>Welcome Back!</Text>
                            <Text style={styles.subText}>Login to continue your food adventure</Text>

                            {/* Email Input */}
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={20} color={THEME.subtext} style={styles.inputIcon} />
                                <TextInput
                                    placeholder="Email Address"
                                    placeholderTextColor="#9CA3AF"
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color={THEME.subtext} style={styles.inputIcon} />
                                <TextInput
                                    placeholder="Password"
                                    placeholderTextColor="#9CA3AF"
                                    style={styles.input}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                                <TouchableOpacity>
                                    <Text style={styles.forgotText}>Forgot?</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Login Button */}
                            <TouchableOpacity style={styles.loginBtn} activeOpacity={0.8} onPress={handleLogin}>
                                <Text style={styles.loginBtnText}>Login</Text>
                                <Ionicons name="arrow-forward" size={20} color="white" />
                            </TouchableOpacity>

                            {/* Divider */}
                            <View style={styles.dividerContainer}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>or continue with</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            {/* Social Login */}
                            <View style={styles.socialRow}>
                                <TouchableOpacity style={styles.socialBtn}>
                                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }} style={styles.socialIcon} />
                                    <Text style={styles.socialText}>Google</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialBtn}>
                                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/0/747.png' }} style={styles.socialIcon} />
                                    <Text style={styles.socialText}>Apple</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Sign Up Link */}
                            <View style={styles.footerRow}>
                                <Text style={styles.footerText}>Don't have an account?</Text>
                                <TouchableOpacity>
                                    <Text style={styles.signupText}> Sign Up</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
    container: { flex: 1 },
    scrollContent: { flexGrow: 1, backgroundColor: '#FFFFFF' },

    heroContainer: {
        height: 320,
        width: '100%',
        position: 'relative',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
    },
    heroImage: { width: '100%', height: '100%' },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)', // Darken image slightly
    },
    heroTextContainer: {
        position: 'absolute',
        bottom: 40,
        left: 24,
    },
    appName: {
        fontSize: 42,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -1,
    },
    appTagline: {
        fontSize: 16,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4
    },

    formContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 24,
    },
    welcomeText: { fontSize: 28, fontWeight: '800', color: THEME.text, marginBottom: 8 },
    subText: { fontSize: 14, color: THEME.subtext, marginBottom: 32 },

    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: THEME.border,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 16,
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, fontSize: 16, color: THEME.text, fontWeight: '500' },
    forgotText: { fontSize: 13, color: THEME.primary, fontWeight: '600' },

    loginBtn: {
        backgroundColor: THEME.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 58,
        borderRadius: 16,
        marginTop: 16,
        shadowColor: THEME.primary,
        shadowOpacity: 0.4,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    loginBtnText: { color: 'white', fontSize: 18, fontWeight: '700', marginRight: 8 },

    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 32 },
    dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
    dividerText: { marginHorizontal: 16, color: '#9CA3AF', fontSize: 14, fontWeight: '500' },

    socialRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
    socialBtn: {
        flex: 0.48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    socialIcon: { width: 24, height: 24, marginRight: 8 },
    socialText: { fontSize: 15, fontWeight: '600', color: '#374151' },

    footerRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
    footerText: { fontSize: 14, color: '#6B7280' },
    signupText: { fontSize: 14, fontWeight: '700', color: THEME.primary },
});
