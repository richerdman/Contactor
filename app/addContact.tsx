import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import { useContacts } from '../src/hooks/useContacs';

export default function CreateScreen() {
  const router = useRouter();
  const { add } = useContacts();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  async function onSave() {
    if (!name.trim()) {
      Alert.alert('Name required');
      return;
    }
    await add({ name: name.trim(), phone: phone.trim() });
    // go back to list
    router.back();
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <Button title="Save" onPress={onSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 6, marginBottom: 12 },
});
