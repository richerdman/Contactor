import * as Contacts from 'expo-contacts';
import { createContact } from './contactService';

export async function requestContactsPermission(): Promise<boolean> {
    const { status } = await Contacts.requestPermissionsAsync();
    return status === 'granted';
}

export async function importContactsFromDevice(): Promise<number> {
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