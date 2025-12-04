import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../src/components/button';
import { useContacts } from '../src/hooks/useContacts';
import { useImagePicker } from '../src/hooks/useImagePicker';
import { COLORS, SPACING, FONT_SIZES } from '../src/constants/theme';

export default function AddContactScreen() {
    const router = useRouter();
    const { addContact } = useContacts();
    const { image: photoUri, pickImage, takePhoto } = useImagePicker();
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [photo] = useState('');
    const [saving, setSaving] = useState(false);

    const handleCreate = async () => {
        if (!name.trim()) {
            alert('Please enter a contact name');
            return;
        }

        setSaving(true);
        try {
            await addContact({
                name: name.trim(),
                phoneNumber: phoneNumber.trim(),
                photo: (photoUri ?? photo).trim(),
            });
            
            router.push('/');
        } catch (error) {
                alert('Failed to create contact');
                throw error;
        } finally {
                setSaving(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
        <View style={styles.content}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter contact name"
                value={name}
                onChangeText={setName}
                editable={!saving}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                editable={!saving}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
                {photoUri ? (
                    <Image source={{ uri: photoUri }} style={{ width: 72, height: 72, borderRadius: 8, marginRight: 12 }} />
                ) : (
                    <View style={{ width: 72, height: 72, borderRadius: 8, backgroundColor: '#eee', marginRight: 12, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#777' }}>No photo</Text>
                    </View>
                )}

                <View style={styles.smallButtonRow}>
                    <TouchableOpacity
                        style={[styles.smallButton, styles.primaryButton]}
                        onPress={async () => { const saved = await pickImage(); if (saved) {/* no-op: hook already updates image */} }}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.smallButtonText}>Pick Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.smallButton, styles.secondaryButton]}
                        onPress={async () => { await takePhoto(); }}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.smallButtonText}>Take Photo</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {saving ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SPACING.xl }} />
            ) : (
            <View style={styles.buttonContainer}>
                <Button
                title="Add Contact"
                onPress={handleCreate}
                />
                
                <Button
                title="Cancel"
                onPress={() => router.back()}
                style={styles.cancelButton}
                />
            </View>
            )}
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.lg,
    },
    label: {
        fontSize: FONT_SIZES.medium,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
        marginTop: SPACING.md,
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: SPACING.md,
        fontSize: FONT_SIZES.medium,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: SPACING.md,
    },
    buttonContainer: {
        marginTop: SPACING.md,
    },
    cancelButton: {
        backgroundColor: '#999',
        marginTop: SPACING.sm,
    },
    smallButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    smallButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    smallButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.small ?? 14,
        fontWeight: '600',
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
    },
    secondaryButton: {
        backgroundColor: '#555',
    },
});
