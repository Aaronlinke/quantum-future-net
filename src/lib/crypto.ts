/**
 * Client-side encryption utilities using Web Crypto API
 * Implements AES-GCM encryption for Data Pods
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const ITERATIONS = 100000;

/**
 * Derives a cryptographic key from a password using PBKDF2
 */
export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Ensure salt is a proper Uint8Array with ArrayBuffer (not SharedArrayBuffer)
  const saltBuffer = new Uint8Array(salt);
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: ITERATIONS,
      hash: 'SHA-256'
    },
    baseKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generates a secure encryption key for the user
 * Should be derived from user's master password
 */
export async function generateEncryptionKey(masterPassword: string): Promise<{ key: CryptoKey; salt: Uint8Array }> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const key = await deriveKey(masterPassword, salt);
  return { key, salt };
}

/**
 * Encrypts data using AES-GCM
 */
export async function encryptData(data: string, key: CryptoKey): Promise<{ encrypted: string; iv: string }> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv
    },
    key,
    dataBuffer
  );
  
  return {
    encrypted: arrayBufferToBase64(encryptedBuffer),
    iv: arrayBufferToBase64(iv.buffer)
  };
}

/**
 * Decrypts data using AES-GCM
 */
export async function decryptData(encryptedData: string, iv: string, key: CryptoKey): Promise<string> {
  const encryptedBuffer = base64ToArrayBuffer(encryptedData);
  const ivBuffer = base64ToArrayBuffer(iv);
  
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv: ivBuffer
    },
    key,
    encryptedBuffer
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

/**
 * Generates a hash of data for zero-knowledge proof verification
 */
export async function generateDataHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  return arrayBufferToBase64(hashBuffer);
}

/**
 * Stores encryption metadata (salt, iv) securely
 */
export interface EncryptionMetadata {
  salt: string;
  iv: string;
  hash: string;
  timestamp: number;
}

/**
 * Helper: Convert ArrayBuffer to Base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Helper: Convert Base64 to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Exports salt as base64 for storage
 */
export function exportSalt(salt: Uint8Array): string {
  // Convert Uint8Array to ArrayBuffer properly
  const buffer = new ArrayBuffer(salt.length);
  const view = new Uint8Array(buffer);
  view.set(salt);
  return arrayBufferToBase64(buffer);
}

/**
 * Imports salt from base64 storage
 */
export function importSalt(saltBase64: string): Uint8Array {
  const buffer = base64ToArrayBuffer(saltBase64);
  return new Uint8Array(buffer);
}
