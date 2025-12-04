import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import useDebouncedValue from '../hooks/useDebouncedValue';
import { useFocusEffect } from '@react-navigation/native';
import {  SectionList, StyleSheet, Text, TextInput, View, TouchableOpacity, Animated, Easing } from 'react-native';
import Button from './button';
import { useContacts } from '../hooks/useContacts';
import ContactItem from './ContactItem';

// Contact list component
// This component displays a searchable list of contacts and allows navigation to contact details or creation.

export default function ContactList() {
    const { contacts, reload } = useContacts();
    const [query, setQuery] = useState('');
    const router = useRouter?.() as any;
    const sectionListRef = useRef<SectionList>(null);
    const focusAnim = useRef(new Animated.Value(0)).current;
    const onSearchFocus = () => {
        Animated.timing(focusAnim, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    };

    

    // buildSections(contacts)
    function buildSections(contacts: Contact[]) {
        const groups = new Map<string, Contact[]>();
        for (const c of contacts) {
            const first = (c.name || '').trim()[0]?.toUpperCase() ?? '#';
            const letter = /[A-Z]/.test(first) ? first : '#';
            if (!groups.has(letter)) groups.set(letter, []);
            groups.get(letter)!.push(c);
        }
        // sort each group's items and build ordered array
        const letters = Array.from(groups.keys()).sort((a, b) => {
            if (a === '#') return 1;
            if (b === '#') return -1;
            return a.localeCompare(b);
        });
        return letters.map((letter) => ({
            title: letter,
            data: groups.get(letter)!.sort((x, y) => (x.name || '').localeCompare(y.name || '', undefined, { sensitivity: 'base' })),
        }));
    }

    const debouncedQuery = useDebouncedValue(query, 250);

    const filteredContacts = useMemo(() => {
        const q = debouncedQuery?.toString().trim().toLowerCase() ?? '';
        if (!q) return contacts;
        return contacts.filter((c) => (c.name || '').toLowerCase().includes(q));
    }, [contacts, debouncedQuery]);

    const sections = useMemo(() => buildSections(filteredContacts), [filteredContacts]);

    useFocusEffect(
        React.useCallback(() => {
            reload?.();
            return () => {};
        }, [reload])
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Animated.View style={[styles.searchContainer, {
                    shadowOpacity: focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0.03, 0.14] }) as any,
                }]}
                >
                    <TextInput
                        placeholder="Search contacts"
                        value={query}
                        onChangeText={setQuery}
                        style={styles.searchInput}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholderTextColor="#8b95a6"
                        onFocus={onSearchFocus}
                    />
                    {query.length > 0 ? (
                        <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
                            <Text style={styles.clearText}>✖</Text>
                        </TouchableOpacity>
                    ) : null}
                </Animated.View>
            </View>

            <SectionList
                ref={sectionListRef}
                sections={sections}
                contentContainerStyle={{ paddingBottom: 140 }}
                keyExtractor={(item) => item.id ?? item.name}
                renderItem={({ item }) => (
                    <ContactItem
                        name={item.name}
                        photo={item.photo}
                        subtitle={item.phoneNumber}
                        onPress={() => router.push({ pathname: '/details', params: { id: item.id } })}
                    />
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>{title}</Text>
                    </View>
                )}
                stickySectionHeadersEnabled
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
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginRight: 8,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    searchInput: { flex: 1, padding: 0, fontSize: 18, color: '#222', minHeight: 36 },
    clearButton: { paddingHorizontal: 6, paddingVertical: 4 },
    clearText: { fontSize: 14, color: '#6b7280' },
    fabContainer: { position: 'absolute', left: 0, right: 0, bottom: 24, alignItems: 'center', zIndex: 10 },
    fab: { minWidth: 180, paddingVertical: 12 },
    sectionHeader: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#F1F1F1',
        fontWeight: 'bold',
    },
});