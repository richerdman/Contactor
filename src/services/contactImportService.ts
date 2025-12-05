import * as Contacts from 'expo-contacts';
import { createContact } from './contactService';
import { Alert } from 'react-native';

export async function requestContactsPermission(): Promise<boolean> {
    const { status } = await Contacts.requestPermissionsAsync();
    return status === 'granted';
}

export async function pickAndImportContact(): Promise<boolean> {
    try {
        const hasPermission = await requestContactsPermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Contacts permission not granted');
            return false;
        }

        const result = await Contacts.presentContactPickerAsync();

        if (result === null || result === undefined) {
            return false;
        }

        const phoneNumber = result.phoneNumbers?.[0]?.number ?? '';
        const name = result.name 
            || (result.firstName && result.lastName ? `${result.firstName} ${result.lastName}` : '')
            || result.firstName
            || result.lastName
            || 'Unknown Contact';
        const photo = result.image?.uri ?? '';
        
        await createContact({
            name: name,
            phoneNumber: phoneNumber,
            photo: photo,
        });
        return true;
    } catch (error) {
        console.error('Error picking and importing contact:', error);
        Alert.alert('Import Failed', 'An error occurred while importing the contact.');
        return false;
    }
}

export async function importAllContactsFromDevice(): Promise<number> {
    try {
        const hasPermission = await requestContactsPermission();
        if (!hasPermission) {
            throw new Error('Contacts permission not granted');
        }

        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
        });

        let importedCount = 0;

        for (const deviceContact of data) {
            try {
                const phoneNumber = deviceContact.phoneNumbers?.[0]?.number ?? '';
                const name = deviceContact.name ?? "Unknown";
                const photo = deviceContact.image?.uri ?? '';

                await createContact({
                    name: name,
                    phoneNumber: phoneNumber,
                    photo: photo,
                });

                importedCount++;
            } catch (error) {
                console.error('Error importing contact:', error);
            }
        }
        return importedCount;
    } catch (error) {
        console.error('Error importing contacts:', error);
        return 0;
    }
}

export async function importSingleContact(contactId: string): Promise<void> {
    try {
        const hasPermission = await requestContactsPermission();
        if (!hasPermission) {
            throw new Error('Contacts permission not granted');
        }

        const contact = await Contacts.getContactByIdAsync(contactId);

        if (contact) {
            const phoneNumber = contact.phoneNumbers?.[0]?.number ?? '';
            const name = contact.name ?? "Unknown";
            const photo = contact.image?.uri ?? '';

            await createContact({
                name: name,
                phoneNumber: phoneNumber,
                photo: photo,
            });
        }
    } catch (error) {
        console.error('Error importing single contact:', error);
        throw error;
    }
}