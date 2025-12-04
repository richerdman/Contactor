import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, View } from "react-native";
import AppButton from "../src/components/button";
import { SPACING } from "../src/constants/theme";
import { useImagePicker } from "../src/hooks/useImagePicker";
import { deleteContact, getContactById, updateContact } from "../src/services/contactService";
import type { Contact } from "../src/types/types";

type Params = {
    id?: string;
};

export default function ContactDetailScreen() {
    const params = useLocalSearchParams<Params>();
    const router = useRouter();
    const id = params.id;

    const { image, pickImage, takePhoto } = useImagePicker();

    const [contact, setContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [photo, setPhoto] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (image) {
        setPhoto(image);
        }
    }, [image]);

    useEffect(() => {
        let mounted = true;
        async function fetchContact() {
        if (!id) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const loaded = await getContactById(id);
            if (!mounted) return;
            if (loaded) {
            setContact(loaded);
            setName(loaded.name);
            setPhone(loaded.phoneNumber ?? "");
            setPhoto(loaded.photo ?? null);
            } else {
            Alert.alert("Not found", "Contact not found.");
            }
        } catch (e) {
            console.error("Failed to load contact", e);
            Alert.alert("Error", "Failed to load contact.");
        } finally {
            if (mounted) setLoading(false);
        }
        }
        fetchContact();
        return () => {
        mounted = false;
        };
    }, [id]);

    async function onSave() {
        if (!contact) return;
        if (!name.trim()) {
        Alert.alert("Validation", "Name is required.");
        return;
        }

        try {
        const updated = await updateContact(contact.id!, {
            name: name.trim(),
            phoneNumber: phone,
            photo: photo ?? "",
        });

        if (!updated) {
            Alert.alert("Error", "Failed to update contact.");
            return;
        }

        setContact(updated);
        Alert.alert("Saved", "Contact updated successfully.");

        router.back();
        } catch (e) {
        console.error("Save failed", e);
        Alert.alert("Error", "Failed to save changes.");
        }
    }

    async function onDelete() {
        if (!contact) return;

        Alert.alert(
        "Delete contact",
        `Delete ${contact.name}? This action cannot be undone.`,
        [
            { text: "Cancel", style: "cancel" },
            {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
                try {
                setDeleting(true);
                const ok = await deleteContact(contact.id!);
                if (!ok) {
                    Alert.alert("Error", "Failed to delete contact.");
                    return;
                }
                Alert.alert("Deleted", "Contact deleted.");
                router.back();
                } catch (e) {
                console.error("Delete failed", e);
                Alert.alert("Error", "Failed to delete contact.");
                } finally {
                setDeleting(false);
                }
            },
            },
        ]
        );
    }

    async function handleCall() {
        const raw = (phone ?? "").toString().trim();
        if (!raw) {
        Alert.alert("Missing phone number", "This contact has no phone number.");
        return;
        }

        const sanitized = raw.replace(/[^+\d]/g, "");
        if (!sanitized) {
        Alert.alert("Invalid phone number", "This contact does not have a valid phone number.");
        return;
        }

        const telUrl = `tel:${sanitized}`;

        try {
        const supported = await Linking.canOpenURL(telUrl);
        if (!supported) {
            Alert.alert("Cannot make calls", "This device cannot make phone calls.");
            return;
        }
        await Linking.openURL(telUrl);
        } catch (e) {
        console.error("Call failed", e);
        Alert.alert("Error", "Failed to start call.");
        }
    }

    if (loading) {
        return (
        <View style={{ padding: SPACING.md }}>
            <Text>Loading contact…</Text>
        </View>
        );
    }

    if (!contact) {
        return (
        <View style={{ padding: SPACING.md }}>
            <Text>Contact not found.</Text>
        </View>
        );
    }

    const hasPhone = (phone ?? "").toString().trim().length > 0;

    return (
        <ScrollView contentContainerStyle={{ padding: SPACING.md }}>
        <View style={{ alignItems: "center", marginBottom: SPACING.md }}>
            {photo ? (
            <Image
                source={{ uri: photo }}
                style={{
                width: 160,
                height: 160,
                borderRadius: 80,
                marginBottom: SPACING.md,
                alignSelf: "center",
                }}
            />
            ) : (
            <View
                style={{
                width: 160,
                height: 160,
                borderRadius: 80,
                backgroundColor: "#EEE",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: SPACING.md,
                }}
            >
                <Text>No photo</Text>
            </View>
            )}
        </View>

        <View style={{ marginBottom: SPACING.md, gap: SPACING.sm }}>
            <AppButton
            title="Pick Photo"
            onPress={pickImage}
            style={{ alignSelf: "center", minWidth: 220 }}
            />

            <AppButton
            title="Take Photo"
            onPress={takePhoto}
            style={{ alignSelf: "center", minWidth: 220, marginTop: SPACING.sm }}
            />
        </View>

        <Text style={{ marginTop: SPACING.md }}>Name</Text>
        <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            style={{
            borderWidth: 1,
            padding: 10,
            marginBottom: SPACING.sm,
            borderRadius: 6,
            }}
        />

        <Text>Phone number</Text>
        <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone"
            keyboardType="phone-pad"
            style={{
            borderWidth: 1,
            padding: 10,
            marginBottom: SPACING.md,
            borderRadius: 6,
            }}
        />

        <AppButton
            title="Call"
            onPress={hasPhone ? handleCall : () => {}}
            style={{
            alignSelf: "center",
            minWidth: 220,
            opacity: hasPhone ? 1 : 0.5,
            marginTop: SPACING.sm,
            backgroundColor: hasPhone ? "green" : "#9CCC9C",
            }}
        />

        <View style={{ marginTop: 60, paddingBottom: 40 }}>
            <AppButton
            title="Save"
            onPress={onSave}
            style={{
                alignSelf: "center",
                minWidth: 220,
                marginBottom: SPACING.sm,
            }}
            />

            <AppButton
            title={deleting ? "Deleting…" : "Delete"}
            onPress={deleting ? () => {} : onDelete}
            style={{
                alignSelf: "center",
                minWidth: 220,
                backgroundColor: "#D9534F",
                opacity: deleting ? 0.6 : 1,
            }}
            />
        </View>
        </ScrollView>
    );
}
