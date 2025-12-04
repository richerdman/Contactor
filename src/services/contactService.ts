import * as FileSystem from 'expo-file-system';
import type { Contact } from "../types/types";

const CONTACTS_DIR = `${FileSystem.documentDirectory}contacts/`;

async function ensureDirectoryExists(): Promise<void> {
    const dirInfo = await FileSystem.getInfoAsync(CONTACTS_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(CONTACTS_DIR, { intermediates: true });
    }
}

function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function createFilename(name: string, uuid: string): string {
    const sanitized = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return `${sanitized}_${uuid}.json`;
}

export async function getAllContacts(): Promise<Contact[]> {
    try {
        await ensureDirectoryExists();
        
        const files = await FileSystem.readDirectoryAsync(CONTACTS_DIR);
        const contacts: Contact[] = [];

        for (const filename of files) {
            if (filename.endsWith('.json')) {
                const fileUri = CONTACTS_DIR + filename;
                const content = await FileSystem.readAsStringAsync(fileUri);
                const contact: Contact = JSON.parse(content);
                contacts.push(contact);
            }
        }
        // Sort contacts alphabetically by name (case-insensitive)
        contacts.sort((a, b) => {
            const an = (a.name || '').trim();
            const bn = (b.name || '').trim();
            return an.localeCompare(bn, undefined, { sensitivity: 'base' });
        });

        return contacts;
    } catch (error) {
        console.error('Error reading contacts:', error);
        return [];
    }
}

export async function getContactById(id: string): Promise<Contact | null> {
    try {
        const contacts = await getAllContacts();
        return contacts.find(c => c.id === id) ?? null;
    } catch (error) {
        console.error('Error getting contact:', error);
        return null;
    }
}

export async function createContact(payload: {
    name: string;
    phoneNumber: string;
    photo: string;
}): Promise<Contact> {
    try {
        await ensureDirectoryExists();

        const uuid = generateUUID();
        const contact: Contact = {
            id: uuid,
            name: payload.name,
            phoneNumber: payload.phoneNumber,
            photo: payload.photo,
        };

        const filename = createFilename(contact.name, uuid);
        const fileUri = CONTACTS_DIR + filename;
        
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(contact, null, 2));
        
        return contact;
    } catch (error) {
        console.error('Error creating contact:', error);
        throw error;
    }
}

export async function updateContact(
    id: string,
    updates: Partial<Omit<Contact, 'id'>>
): Promise<Contact | null> {
    try {
        await ensureDirectoryExists();

        const files = await FileSystem.readDirectoryAsync(CONTACTS_DIR);
        let contactFilename = null;
        let oldContact = null;

        for (const filename of files) {
            if (filename.includes(id)) {
                contactFilename = filename;
                const fileUri = CONTACTS_DIR + filename;
                const content = await FileSystem.readAsStringAsync(fileUri);
                oldContact = JSON.parse(content);
                break;
            }
        }

        if (!contactFilename || !oldContact) {
            return null;
        }

        const updatedContact = { ...oldContact, ...updates };

        if (updates.name && updates.name !== oldContact.name) {
            const oldFileUri = CONTACTS_DIR + contactFilename;
            const newFilename = createFilename(updates.name, id);
            const newFileUri = CONTACTS_DIR + newFilename;

            await FileSystem.writeAsStringAsync(newFileUri, JSON.stringify(updatedContact, null, 2));
            await FileSystem.deleteAsync(oldFileUri);
        } else {
            const fileUri = CONTACTS_DIR + contactFilename;
            await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(updatedContact, null, 2));
        }

        return updatedContact;
    } catch (error) {
        console.error('Error updating contact:', error);
        return null;
    }
}

export async function deleteContact(id: string): Promise<boolean> {
    try {
        await ensureDirectoryExists();

        const files = await FileSystem.readDirectoryAsync(CONTACTS_DIR);

        for (const filename of files) {
            if (filename.includes(id)) {
                const fileUri = CONTACTS_DIR + filename;
                await FileSystem.deleteAsync(fileUri);
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error('Error deleting contact:', error);
        return false;
    }
}