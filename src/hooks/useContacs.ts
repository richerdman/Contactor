import { useCallback, useEffect, useState } from 'react';
import { deleteContact, listContacts, saveContact } from '../lib/contactsFS';

export type Contact = {
  id: string; // filename
  name: string;
  phone: string;
  photo?: string | null;
};

function seedContacts(): { name: string; phone: string; photo?: string | null }[] {
  return [
    { name: 'Dominos', phone: '58-12345' },
    { name: 'Bubbi Morthens', phone: '123-4567' },
    { name: 'Walter White', phone: '6767677' },
    { name: 'John Pork', phone: '777-1111' },
    { name: 'Charlie Kirk', phone: '145-2345' },
    { name: 'Xi Jinping', phone: '455-6789' },
    { name: 'Super Mario', phone: '800-5555' },
    { name: 'Ja Morant', phone: '999-8888' },
    { name: 'Peter Griffin', phone: '321-4321' },
    { name: 'Lebron James', phone: '111-2222' },
  ];
}

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  // load contacts from storage (FileSystem or localStorage)
  const load = useCallback(async () => {
    const stored = await listContacts();
    if (stored.length > 0) {
      setContacts(stored.map((s) => ({ id: s.filename, name: s.name, phone: s.phone, photo: s.photo })));
      return;
    }

    // seed into filesystem if none found
    const seeds = seedContacts();
    const saved: Contact[] = [];
    for (const s of seeds) {
      const storedContact = await saveContact({ name: s.name, phone: s.phone, photo: s.photo });
      saved.push({ id: storedContact.filename, name: storedContact.name, phone: storedContact.phone, photo: storedContact.photo });
    }
    setContacts(saved);
  }, []);

  useEffect(() => {
    let mounted = true;
    // call load and guard with mounted flag
    (async () => {
      if (!mounted) return;
      await load();
    })();
    return () => {
      mounted = false;
    };
  }, [load]);

  const add = useCallback(async (payload: { name: string; phone: string; photo?: string | null }) => {
    const saved = await saveContact({ name: payload.name, phone: payload.phone, photo: payload.photo });
    const c: Contact = { id: saved.filename, name: saved.name, phone: saved.phone, photo: saved.photo };
    setContacts((prev) => {
      const next = [...prev, c];
      next.sort((a, b) => a.name.localeCompare(b.name));
      return next;
    });
    return c;
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteContact(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const update = useCallback(async (id: string, patch: Partial<Omit<Contact, 'id'>>) => {
    // find existing contact
    const existing = contacts.find((c) => c.id === id);
    if (!existing) return;
    const newData = { name: patch.name ?? existing.name, phone: patch.phone ?? existing.phone, photo: patch.photo ?? existing.photo };
    const saved = await saveContact({ name: newData.name, phone: newData.phone, photo: newData.photo }, id);
    setContacts((prev) => prev.map((c) => (c.id === id ? { id: saved.filename, name: saved.name, phone: saved.phone, photo: saved.photo } : c)));
  }, [contacts]);

  return { contacts, add, remove, update, reload: load } as const;
}