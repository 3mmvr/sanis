import CryptoJS from 'crypto-js';

// Use a secure static key or environment variable. 
// For mobile parity, this ensures data stored in the browser isn't easily visible or modifiable via XSS/DevTools.
const SECRET_KEY = import.meta.env.VITE_STORAGE_KEY || 'sanis_secure_storage_fallback_key_2026';

class StorageService {
  /**
   * Encrypt and store data
   */
  async setItem(key: string, value: any): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      const encryptedValue = CryptoJS.AES.encrypt(stringValue, SECRET_KEY).toString();
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error(`Failed to securely save to storage for key: ${key}`, error);
    }
  }

  /**
   * Retrieve and decrypt data
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;

      const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) return null; // Decryption failed (key mismatch or corrupted data)
      
      return JSON.parse(decryptedString) as T;
    } catch (error) {
      console.error(`Failed to retrieve or decrypt storage for key: ${key}`, error);
      return null;
    }
  }

  /**
   * Remove a specific item
   */
  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  /**
   * Clear all app storage
   */
  async clear(): Promise<void> {
    localStorage.clear();
  }
}

export const secureStorage = new StorageService();
