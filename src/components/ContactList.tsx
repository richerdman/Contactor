
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from './button';
import { useContacts } from '../hooks/useContacts';
import useDebouncedValue from '../hooks/useDebouncedValue';
import ContactItem from './ContactItem';

// Contact list component
// This component displays a searchable list of contacts and allows navigation to contact details or creation.

export default function ContactList() {
    const { contacts, reload } = useContacts();
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebouncedValue(query, 250);
    const router = useRouter?.() as any;

    // case-insensitive substring search (debounced)
    const filteredContacts = useMemo(() => {
        const q = debouncedQuery?.toString().trim().toLowerCase() ?? '';
        if (!q) return contacts;
        return contacts.filter((c) => c.name.toLowerCase().includes(q));
    }, [contacts, debouncedQuery]);

    useFocusEffect(
        React.useCallback(() => {
            reload?.();
            return () => {};
        }, [reload])
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TextInput
                    placeholder="Search contacts"
                    value={query}
                    onChangeText={setQuery}
                    style={styles.search}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            <FlatList
                data={filteredContacts}
                keyExtractor={(item, index) =>
                    (item as any).id ?? `${item.name}-${((item as any).phone ?? (item as any).phoneNumber) ?? index}`
                }
                renderItem={({ item }) => (
                    <ContactItem
                        name={item.name}
                        photo={item.photo}
                        onPress={() => router?.push?.({ pathname: '/details', params: { id: item.id } })}
                    />
                )}
                ListEmptyComponent={() => <Text style={{ padding: 16 }}>No contacts</Text>}
            />

            <View style={styles.fabContainer} pointerEvents="box-none">
                <Button title="Add Contact" onPress={() => router?.push?.('/addContact')} style={styles.fab} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 12, flexDirection: 'row', alignItems: 'center' },
    search: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 8, marginRight: 8 },
    fabContainer: { position: 'absolute', left: 0, right: 0, bottom: 24, alignItems: 'center', zIndex: 10 },
    fab: { minWidth: 180, paddingVertical: 12 },
});