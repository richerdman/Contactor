import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Image, ScrollView, Text, TextInput, View } from "react-native";
import { loadContact, saveContact, StoredContact } from "../src/lib/contactsFS";

type Params = {
  id?: string;
};

export default function ContactDetailScreen() {
  const params = useLocalSearchParams<Params>();
  const router = useRouter();
  const id = params.id;

  const [contact, setContact] = useState<StoredContact | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchContact() {
      if (!id) return;
      const loaded = await loadContact(id);
      if (!mounted) return;
      if (loaded) {
        setContact(loaded);
        setName(loaded.name);
        setPhone(loaded.phone);
        setPhoto(loaded.photo ?? null);
      }
    }
    fetchContact();
    return () => {
      mounted = false;
    };
  }, [id]);

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: false,
    });

    // Newer expo-image-picker returns { canceled, assets } shape.
    // Check for canceled/assets to be safe.
    // @ts-ignore - guard below handles types
    if (!result.canceled && (result as any).assets?.length > 0) {
      // @ts-ignore
      setPhoto((result as any).assets[0].uri);
    } else if ((result as any).uri) {
      // fallback for older return shape
      // @ts-ignore
      setPhoto((result as any).uri);
    }
  }

  async function onSave() {
    if (!contact) return;
    await saveContact(
      {
        name,
        phone,
        photo,
      },
      contact.filename
    );

    // go back to previous route
    router.back();
  }

  if (!contact) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Loading contact…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        Contact Details
      </Text>

      {photo ? (
        <Image
          source={{ uri: photo }}
          style={{ width: 150, height: 150, borderRadius: 75, marginBottom: 15 }}
        />
      ) : (
        <Text>No photo</Text>
      )}

      <Button title="Pick Photo" onPress={pickPhoto} />

      <Text style={{ marginTop: 20 }}>Name</Text>
      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
        value={name}
        onChangeText={setName}
      />

      <Text>Phone Number</Text>
      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 20,
        }}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <Button title="Save" onPress={onSave} />
    </ScrollView>
  );
}
