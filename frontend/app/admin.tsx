import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AdminScreen() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', price: '', image: '' });
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        console.log("AdminScreen Mounted!");
    }, []);

    // ⚠️ YOUR IP HERE
    const API_URL = 'http://192.168.0.102:3000';

    const handleSubmit = async () => {
        if (!formData.name || !formData.price || !formData.image) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/add-food`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                Alert.alert("Success", "Food added to menu! 🍔");
                setFormData({ name: '', price: '', image: '' }); // Clear form
            } else {
                Alert.alert("Error", "Could not add food");
            }
        } catch (error) {
            Alert.alert("Error", "Server connection failed");
        }
        setLoading(false);
    };

    const [themeData, setThemeData] = useState({ themeName: 'Default', startDate: '', endDate: '' });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [activeDateField, setActiveDateField] = useState<'start' | 'end' | null>(null);

    const getDateValue = (dateString: string) => {
        if (!dateString) return new Date();
        const d = new Date(dateString);
        return isNaN(d.getTime()) ? new Date() : d;
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate && activeDateField) {
            const dateString = selectedDate.toISOString().split('T')[0];
            setThemeData(prev => ({
                ...prev,
                [activeDateField === 'start' ? 'startDate' : 'endDate']: dateString
            }));
        }
        setActiveDateField(null);
    };

    const openDatePicker = (field: 'start' | 'end') => {
        setActiveDateField(field);
        setShowDatePicker(true);
    };

    const handleThemeSubmit = async () => {
        if (!themeData.startDate || !themeData.endDate) {
            Alert.alert("Error", "Please enter start and end dates");
            return;
        }
        try {
            const response = await fetch(`${API_URL}/schedule-theme`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(themeData)
            });
            if (response.ok) {
                Alert.alert("Success", `Theme ${themeData.themeName} scheduled! 🎨`);
                setThemeData({ ...themeData, startDate: '', endDate: '' });
            } else {
                Alert.alert("Error", "Could not schedule theme");
            }
        } catch (error) {
            Alert.alert("Error", "Network Error");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>👨🍳 Admin Panel</Text>
                <TouchableOpacity onPress={() => router.replace('/')} style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* THEME SCHEDULER SECTION */}
            <View style={[styles.card, { marginBottom: 20, borderColor: '#6366F1', borderWidth: 1 }]}>
                <Text style={styles.cardTitle}>🎨 Theme Scheduler</Text>
                <Text style={styles.subtext}>Enter dates (YYYY-MM-DD) to auto-apply themes.</Text>

                <Text style={styles.label}>Select Theme</Text>
                <View style={styles.row}>
                    {['Default', 'Diwali', 'Christmas', 'Eid', 'Holi', 'Independence'].map((t) => (
                        <TouchableOpacity
                            key={t}
                            style={[styles.chip, themeData.themeName === t && styles.chipActive]}
                            onPress={() => setThemeData({ ...themeData, themeName: t })}
                        >
                            <Text style={[styles.chipText, themeData.themeName === t && styles.chipTextActive]}>{t}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.rowInput}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Text style={styles.label}>Start Date</Text>
                        <TouchableOpacity onPress={() => openDatePicker('start')}>
                            <View pointerEvents="none">
                                <TextInput
                                    style={styles.input}
                                    placeholder="YYYY-MM-DD"
                                    value={themeData.startDate}
                                    editable={false}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>End Date</Text>
                        <TouchableOpacity onPress={() => openDatePicker('end')}>
                            <View pointerEvents="none">
                                <TextInput
                                    style={styles.input}
                                    placeholder="YYYY-MM-DD"
                                    value={themeData.endDate}
                                    editable={false}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={getDateValue(activeDateField === 'start' ? themeData.startDate : themeData.endDate)}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <TouchableOpacity style={[styles.button, { marginTop: 15, backgroundColor: '#10B981' }]} onPress={handleThemeSubmit}>
                    <Text style={styles.buttonText}>Save Schedule</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Food Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Chicken Burger"
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                />

                <Text style={styles.label}>Price (₹)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. 250"
                    keyboardType="numeric"
                    value={formData.price}
                    onChangeText={(text) => setFormData({ ...formData, price: text })}
                />

                <Text style={styles.label}>Image URL</Text>
                <TextInput
                    style={styles.input}
                    placeholder="https://..."
                    value={formData.image}
                    onChangeText={(text) => setFormData({ ...formData, image: text })}
                />

                {formData.image ? (
                    <Image source={{ uri: formData.image }} style={styles.previewImage} />
                ) : null}

                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Add to Menu</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#F3F4F6', padding: 20, paddingTop: 60 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 28, fontWeight: '800', color: '#1F2937' },
    logoutBtn: { padding: 8 },
    logoutText: { color: '#EF4444', fontWeight: '600' },
    card: { backgroundColor: 'white', padding: 20, borderRadius: 16, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 12 },
    input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, fontSize: 16 },
    previewImage: { width: '100%', height: 150, borderRadius: 8, marginTop: 15 },
    button: { backgroundColor: '#4F46E5', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    // New Styles
    cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 5 },
    subtext: { fontSize: 12, color: '#6B7280', marginBottom: 15 },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
    chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#E5E7EB' },
    chipActive: { backgroundColor: '#6366F1' },
    chipText: { fontSize: 12, color: '#374151', fontWeight: '600' },
    chipTextActive: { color: 'white' },
    rowInput: { flexDirection: 'row', justifyContent: 'space-between' }
});
