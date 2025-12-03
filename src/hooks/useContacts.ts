import { useState, useEffect, useCallback } from "react";
import { Contact } from "../types/types";
import { getAllContacts, createContact, updateContact, deleteContact } from "../services/contactService";

export function useContacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);

    const loadContacts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllContacts();
            setContacts(data);
        } catch (error) {
            console.error("Error loading contacts:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadContacts();
    }, [loadContacts]);

    const addContact = useCallback(async (contact: Omit<Contact, "id">) => {
        try {
            await createContact(contact);
            await loadContacts();
        } catch (error) {
            console.error("Error adding contact:", error);
            throw error;
        }
    }, [loadContacts]);

    const removeContact = useCallback(async (id: string) => {
        try {
            await deleteContact(id);
            await loadContacts();
        } catch (error) {
            console.error("Error deleting contact:", error);
            throw error;
        }
    }, [loadContacts]);

    const editContact = useCallback(async (id: string, updates: Partial<Omit<Contact, "id">>) => {
        try {
            await updateContact(id, updates);
            await loadContacts();
        } catch (error) {
            console.error("Error updating contact:", error);
            throw error;
        }
    }, [loadContacts]);

    return { contacts, addContact, removeContact, editContact, loading, reload: loadContacts };
}