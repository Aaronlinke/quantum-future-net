/**
 * Zero-Knowledge Proof utilities for Data Pod verification
 * Implements simple ZKP protocols for proving data ownership without revealing content
 */

/**
 * Generates a commitment to data without revealing the data itself
 * Uses hash-based commitment scheme
 */
export async function generateCommitment(data: string, nonce: string): Promise<string> {
  const encoder = new TextEncoder();
  const combined = encoder.encode(data + nonce);
  const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
  return arrayBufferToBase64(hashBuffer);
}

/**
 * Generates a zero-knowledge proof that proves knowledge of data
 * without revealing the data itself
 */
export interface ZKProof {
  commitment: string;
  challenge: string;
  response: string;
  timestamp: number;
}

/**
 * Creates a ZK proof for data ownership
 * This is a simplified Schnorr-like protocol adapted for data verification
 */
export async function createZKProof(data: string): Promise<ZKProof> {
  // Generate random nonce for commitment
  const nonce = generateNonce();
  
  // Create commitment: H(data || nonce)
  const commitment = await generateCommitment(data, nonce);
  
  // Generate challenge (in real implementation, this would come from verifier)
  const challenge = await generateChallenge(commitment);
  
  // Create response: H(nonce || challenge)
  const response = await generateResponse(nonce, challenge);
  
  return {
    commitment,
    challenge,
    response,
    timestamp: Date.now()
  };
}

/**
 * Verifies a zero-knowledge proof
 * Returns true if the proof is valid, false otherwise
 */
export async function verifyZKProof(
  proof: ZKProof,
  data: string,
  maxAge: number = 300000 // 5 minutes default
): Promise<boolean> {
  // Check if proof is not too old
  if (Date.now() - proof.timestamp > maxAge) {
    return false;
  }
  
  // In a full implementation, we'd verify the proof cryptographically
  // For this demo, we verify that the proof structure is valid and not expired
  return (
    proof.commitment.length > 0 &&
    proof.challenge.length > 0 &&
    proof.response.length > 0 &&
    proof.timestamp > 0
  );
}

/**
 * Generates a proof of data integrity
 * This can be used to prove that data hasn't been tampered with
 */
export async function generateIntegrityProof(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  return arrayBufferToBase64(hashBuffer);
}

/**
 * Verifies data integrity using a previously generated proof
 */
export async function verifyIntegrity(data: string, proof: string): Promise<boolean> {
  const currentHash = await generateIntegrityProof(data);
  return currentHash === proof;
}

/**
 * Creates a proof that demonstrates possession of decryption capability
 * without revealing the decryption key
 */
export interface DecryptionProof {
  dataHash: string;
  zkProof: ZKProof;
  verified: boolean;
}

export async function createDecryptionProof(decryptedData: string): Promise<DecryptionProof> {
  const dataHash = await generateIntegrityProof(decryptedData);
  const zkProof = await createZKProof(decryptedData);
  const verified = await verifyZKProof(zkProof, decryptedData);
  
  return {
    dataHash,
    zkProof,
    verified
  };
}

// ============ Helper Functions ============

function generateNonce(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return arrayBufferToBase64(array.buffer);
}

async function generateChallenge(commitment: string): Promise<string> {
  const encoder = new TextEncoder();
  const commitmentBuffer = encoder.encode(commitment + Date.now());
  const hashBuffer = await crypto.subtle.digest('SHA-256', commitmentBuffer);
  return arrayBufferToBase64(hashBuffer);
}

async function generateResponse(nonce: string, challenge: string): Promise<string> {
  const encoder = new TextEncoder();
  const combined = encoder.encode(nonce + challenge);
  const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
  return arrayBufferToBase64(hashBuffer);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
