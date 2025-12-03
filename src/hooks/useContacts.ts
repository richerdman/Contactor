import { useState, useEffect } from "react";
import { Contact } from "../types/types";
import { getAllContacts, createContact, updateContact, deleteContact } from "../services/contactService";

export function useContacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        setLoading(true);
        try {
            const data = await getAllContacts();
            setContacts(data);
        } catch (error) {
            console.error("Error loading contacts:", error);
        } finally {
            setLoading(false);
        }
    };

    const addContact = async (contact: Omit<Contact, "id">) => {
        try {
            await createContact(contact);
            await loadContacts();
        } catch (error) {
            console.error("Error adding contact:", error);
            throw error;
        }
    };

    const removeContact = async (id: string) => {
        try {
            await deleteContact(id);
            await loadContacts();
        } catch (error) {
            console.error("Error deleting contact:", error);
            throw error;
        }
    };

    const editContact = async (id: string, updates: Partial<Omit<Contact, "id">>) => {
        try {
            await updateContact(id, updates);
            await loadContacts();
        } catch (error) {
            console.error("Error updating contact:", error);
            throw error;
        }
    };

    return { contacts, addContact, removeContact, editContact, loading };
}