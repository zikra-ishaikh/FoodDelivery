import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const router = useRouter();
    React.useEffect(() => { console.log("Login Screen Mounted"); }, []);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        const cleanEmail = email.trim().toLowerCase();

        // 1. ADMIN CHECK
        if (cleanEmail === 'admin@gmail.com') {
            if (password === 'admin123') {
                console.log("Admin Credentials Verified. Attempting redirect to /admin");
                // Alert removed to prevent blocking on Web
                router.push('/admin');
            } else {
                Alert.alert("Login Failed", "Incorrect Admin Password");
            }
            return;
        }

        // 2. NORMAL USER CHECK (Simulated for now)
        if (cleanEmail && password) {
            router.replace('/(tabs)'); // Go to the User App
        }
        else {
            Alert.alert("Error", "Please enter email and password");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: '#4F46E5' }}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoEmoji}>🍕</Text>
                        <Text style={styles.logoText}>Super Eats</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="admin@gmail.com"
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            autoCapitalize="none"
                            onChangeText={setEmail}
                            autoComplete="email" // Web Helper
                            keyboardType="email-address"
                        />

                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="admin123"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            autoComplete="password" // Web Helper
                        />

                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.guestBtn} onPress={() => router.replace('/(tabs)')}>
                            <Text style={styles.guestText}>Continue as Guest</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, justifyContent: 'center' },
    container: { padding: 20 },
    logoContainer: { alignItems: 'center', marginBottom: 40 },
    logoEmoji: { fontSize: 60 },
    logoText: { fontSize: 32, fontWeight: '800', color: 'white', marginTop: 10 },
    form: { backgroundColor: 'white', padding: 25, borderRadius: 20, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
    label: { fontWeight: '700', color: '#374151', marginBottom: 8, marginTop: 10 },
    input: { backgroundColor: '#F3F4F6', padding: 14, borderRadius: 10, fontSize: 16, color: '#000' },
    button: { backgroundColor: '#111827', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 25 },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    guestBtn: { alignItems: 'center', marginTop: 20 },
    guestText: { color: '#6B7280', fontWeight: '600' }
});
