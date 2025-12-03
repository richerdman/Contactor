import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

// Stored contact data structure
// File system-based storage for contacts, with localStorage fallback for web

export type StoredContact = {
  filename: string; // file name in contacts dir
  name: string;
  phone: string;
  photo?: string | null;
};

const isWeb = Platform.OS === 'web';

const CONTACTS_DIR = ((FileSystem as any).documentDirectory ?? (FileSystem as any).cacheDirectory ?? '') + 'contacts/';

async function ensureDir() {
  if (isWeb) {
    // No-op on web (we use localStorage)
    return;
  }
  const info = await FileSystem.getInfoAsync(CONTACTS_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(CONTACTS_DIR, { intermediates: true });
  }
}

function makeId() {
  return (
    typeof (globalThis as any).crypto?.randomUUID === 'function'
      ? (globalThis as any).crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
  );
}

function sanitizeName(name: string) {
  return name.replace(/[^a-z0-9]/gi, '_');
}

export async function listContacts(): Promise<StoredContact[]> {
  if (isWeb) {
    // localStorage-backed implementation for web
    const out: StoredContact[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (!key.startsWith('contacts:')) continue;
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        try {
          const parsed = JSON.parse(raw);
          out.push({ filename: key.replace('contacts:', ''), name: parsed.name, phone: parsed.phoneNumber ?? parsed.phone, photo: parsed.photo ?? null });
        } catch {
          // ignore invalid
        }
      }
    } catch {
      // localStorage not available or access denied
    }
    out.sort((a, b) => a.name.localeCompare(b.name));
    return out;
  }

  await ensureDir();
  const names = await FileSystem.readDirectoryAsync(CONTACTS_DIR).catch(() => []);
  const out: StoredContact[] = [];
  for (const fname of names) {
    try {
      const raw = await FileSystem.readAsStringAsync(CONTACTS_DIR + fname);
      const parsed = JSON.parse(raw);
      out.push({ filename: fname, name: parsed.name, phone: parsed.phoneNumber ?? parsed.phone, photo: parsed.photo ?? null });
    } catch {
      // ignore invalid files
    }
  }
  // sort by name
  out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

export async function loadContact(filename: string): Promise<StoredContact | null> {
  if (isWeb) {
    try {
      const raw = localStorage.getItem('contacts:' + filename);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return { filename, name: parsed.name, phone: parsed.phoneNumber ?? parsed.phone, photo: parsed.photo ?? null };
    } catch {
      return null;
    }
  }

  try {
    const raw = await FileSystem.readAsStringAsync(CONTACTS_DIR + filename);
    const parsed = JSON.parse(raw);
    return { filename, name: parsed.name, phone: parsed.phoneNumber ?? parsed.phone, photo: parsed.photo ?? null };
  } catch {
    return null;
  }
}

export async function saveContact(payload: { name: string; phone: string; photo?: string | null }, existingFilename?: string): Promise<StoredContact> {
  if (isWeb) {
    let filename = existingFilename;
    if (!filename) {
      const id = makeId();
      filename = `${sanitizeName(payload.name)}-${id}.json`;
    }
    const content = { name: payload.name, phoneNumber: payload.phone, photo: payload.photo ?? null };
    try {
      localStorage.setItem('contacts:' + filename, JSON.stringify(content));
    } catch {
      // ignore storage errors
    }
    return { filename, name: payload.name, phone: payload.phone, photo: payload.photo ?? null };
  }

  await ensureDir();
  let filename = existingFilename;
  if (!filename) {
    const id = makeId();
    filename = `${sanitizeName(payload.name)}-${id}.json`;
  }
  const content = { name: payload.name, phoneNumber: payload.phone, photo: payload.photo ?? null };
  await FileSystem.writeAsStringAsync(CONTACTS_DIR + filename, JSON.stringify(content));
  return { filename, name: payload.name, phone: payload.phone, photo: payload.photo ?? null };
}

export async function deleteContact(filename: string): Promise<void> {
  if (isWeb) {
    try {
      localStorage.removeItem('contacts:' + filename);
    } catch {
      // ignore
    }
    return;
  }

  try {
    await FileSystem.deleteAsync(CONTACTS_DIR + filename);
  } catch {
    // ignore
  }
}
