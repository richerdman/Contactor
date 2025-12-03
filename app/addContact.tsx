import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../src/components/button';
import { useContacts } from '../src/hooks/useContacts';
import { COLORS, SPACING, FONT_SIZES } from '../src/constants/theme';

export default function AddContactScreen() {
    const router = useRouter();
    const { addContact } = useContacts();
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [photo, setPhoto] = useState('');
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
                photo: photo.trim(),
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

            <Text style={styles.label}>Photo URL</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter photo URL"
                value={photo}
                onChangeText={setPhoto}
                autoCapitalize="none"
                editable={!saving}
            />

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
});
