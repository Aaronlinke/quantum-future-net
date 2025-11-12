import { useState, useEffect } from 'react';

/**
 * Hook for managing user's master password for encryption
 * In production, this should use more secure methods like:
 * - Browser's Web Authentication API
 * - Hardware security keys
 * - Biometric authentication
 */
export function useMasterPassword() {
  const [masterPassword, setMasterPassword] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // Check if password is stored in session
    const sessionPassword = sessionStorage.getItem('master_password');
    if (sessionPassword) {
      setMasterPassword(sessionPassword);
      setIsUnlocked(true);
    }
  }, []);

  const unlock = (password: string) => {
    setMasterPassword(password);
    setIsUnlocked(true);
    // Store in session (cleared on browser close)
    sessionStorage.setItem('master_password', password);
  };

  const lock = () => {
    setMasterPassword(null);
    setIsUnlocked(false);
    sessionStorage.removeItem('master_password');
  };

  return {
    masterPassword,
    isUnlocked,
    unlock,
    lock
  };
}
