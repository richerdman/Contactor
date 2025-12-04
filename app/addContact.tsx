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
                photo: (photoUri ?? '').trim(),
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

            <Text style={styles.label}>Photo</Text>
            <View style={styles.photoContainer}>
                {photoUri ? (
                    <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                ) : (
                    <View style={styles.photoPlaceholder}>
                        <Text style={styles.photoPlaceholderText}></Text>
                    </View>
                )}

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.button, styles.chooseButton]}
                        onPress={async () => { await pickImage(); }}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.buttonText}>Choose Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.takeButton]}
                        onPress={async () => { await takePhoto(); }}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.buttonText}>Take Photo</Text>
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
        borderRadius: 12,
        padding: SPACING.lg,
        fontSize: FONT_SIZES.medium,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: SPACING.md,
        minHeight: 48,
    },
    buttonContainer: {
        marginTop: SPACING.lg,
        gap: SPACING.sm,
    },
    cancelButton: {
        backgroundColor: '#cbcbcbff',
    },
    photoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.lg,
        gap: SPACING.md,
    },
    photoPreview: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f5f5f5',
    },
    photoPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
    },
    photoPlaceholderText: {
        fontSize: 40,
    },
    buttonRow: {
        flexDirection: 'column',
        gap: SPACING.sm,
        flex: 1,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
    },
    chooseButton: {
        backgroundColor: COLORS.primary,
    },
    takeButton: {
        backgroundColor: '#666',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.medium,
        fontWeight: '600',
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
    },
    secondaryButton: {
        backgroundColor: '#555',
    },
});
