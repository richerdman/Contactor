import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Contact item props
// This component displays a contact's name and photo, and handles press events.

type Props = {
  name: string;
  photo?: string | null;
  onPress?: () => void;
};

export default function ContactItem({ name, photo, onPress }: Props) {
  const initials = (name || '')
    .split(' ')
    .map((p) => p[0] || '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <TouchableOpacity onPress={onPress} style={styles.row}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.thumb} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', padding: 12, alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee' },
  thumb: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#ddd' },
  placeholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6b7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: '#fff', fontWeight: '600' },
  info: { marginLeft: 12 },
  name: { fontSize: 16 },
});
