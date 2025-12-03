import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Button, Image, ScrollView, Text, TextInput, View } from "react-native";
import { SPACING } from "../src/constants/theme";
import { getContactById, updateContact } from "../src/services/contactService";
import type { Contact } from "../src/types/types";

type Params = {
  id?: string;
};

export default function ContactDetailScreen() {
  const params = useLocalSearchParams<Params>();
  const router = useRouter();
  const id = params.id;

  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

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

  async function pickPhoto() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: false,
      });

      if (!result.canceled && (result as any).assets?.length > 0) {
        setPhoto((result as any).assets[0].uri);
      } else if ((result as any).uri) {
        setPhoto((result as any).uri);
      }
    } catch (e) {
      console.error("Image pick failed", e);
      Alert.alert("Error", "Failed to pick image.");
    }
  }

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
      
      router.back();
    } catch (e) {
      console.error("Save failed", e);
      Alert.alert("Error", "Failed to save changes.");
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

  return (
    <ScrollView contentContainerStyle={{ padding: SPACING.md }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: SPACING.sm }}>Contact Details</Text>

      {photo ? (
        <Image source={{ uri: photo }} style={{ width: 160, height: 160, borderRadius: 80, marginBottom: SPACING.md }} />
      ) : (
        <View style={{ width: 160, height: 160, borderRadius: 80, backgroundColor: "#EEE", alignItems: "center", justifyContent: "center", marginBottom: SPACING.md }}>
          <Text>No photo</Text>
        </View>
      )}

      <Button title="Pick Photo" onPress={pickPhoto} />

      <Text style={{ marginTop: SPACING.md }}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={{ borderWidth: 1, padding: 10, marginBottom: SPACING.sm, borderRadius: 6 }}
      />

      <Text>Phone number</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone"
        keyboardType="phone-pad"
        style={{ borderWidth: 1, padding: 10, marginBottom: SPACING.md, borderRadius: 6 }}
      />

      <Button title="Save" onPress={onSave} />
    </ScrollView>
  );
}
