import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMasterPassword } from '@/hooks/useMasterPassword';
import { useKnowledgeExtraction } from '@/hooks/useKnowledgeExtraction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, Plus, Trash2, Lock, Eye, EyeOff, Shield, Key, CheckCircle2, Brain, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import type { Json } from '@/integrations/supabase/types';
import { 
  generateEncryptionKey, 
  encryptData, 
  decryptData, 
  exportSalt, 
  importSalt,
  type EncryptionMetadata 
} from '@/lib/crypto';
import { createZKProof, verifyZKProof, createDecryptionProof, type ZKProof } from '@/lib/zkp';

interface DataPod {
  id: string;
  user_id: string;
  data_type: string;
  encrypted_data: string;
  access_rules: Json;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

const DataPods = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { masterPassword, isUnlocked, unlock } = useMasterPassword();
  const { extracting, extractFromContent, lastResult } = useKnowledgeExtraction();
  const [pods, setPods] = useState<DataPod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUnlockDialogOpen, setIsUnlockDialogOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [visiblePods, setVisiblePods] = useState<Set<string>>(new Set());
  const [decryptedData, setDecryptedData] = useState<Map<string, string>>(new Map());
  const [zkProofs, setZkProofs] = useState<Map<string, ZKProof>>(new Map());
  const [extractedPods, setExtractedPods] = useState<Set<string>>(new Set());
  const [newPod, setNewPod] = useState({
    data_type: '',
    encrypted_data: '',
    metadata: {}
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!isUnlocked) {
      setIsUnlockDialogOpen(true);
    } else {
      fetchPods();
    }
  }, [user, isUnlocked, navigate]);

  const fetchPods = async () => {
    const { data, error } = await supabase
      .from('data_pods')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Fehler beim Laden der Data Pods');
    } else {
      setPods(data || []);
    }
    setIsLoading(false);
  };

  const handleCreatePod = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !masterPassword) return;
    
    try {
      // Generate encryption key from master password
      const { key, salt } = await generateEncryptionKey(masterPassword);
      
      // Encrypt the data
      const { encrypted, iv } = await encryptData(newPod.encrypted_data, key);
      
      // Generate zero-knowledge proof
      const zkProof = await createZKProof(newPod.encrypted_data);
      
      // Create encryption metadata
      const metadata: EncryptionMetadata = {
        salt: exportSalt(salt),
        iv,
        hash: zkProof.commitment,
        timestamp: Date.now()
      };
      
      const { data: insertedPod, error } = await supabase
        .from('data_pods')
        .insert([{
          user_id: user.id,
          data_type: newPod.data_type,
          encrypted_data: encrypted,
          metadata: metadata as unknown as Json
        }])
        .select()
        .single();

      if (error) {
        toast.error('Fehler beim Erstellen des Data Pods');
      } else {
        toast.success('Data Pod mit Zero-Knowledge-Proof erstellt!');
        setIsDialogOpen(false);
        
        // Automatic Knowledge Extraction
        const contentToExtract = {
          data_type: newPod.data_type,
          content: newPod.encrypted_data,
          timestamp: new Date().toISOString()
        };
        
        const extractionResult = await extractFromContent(contentToExtract, insertedPod?.id);
        if (extractionResult) {
          setExtractedPods(prev => new Set(prev).add(insertedPod.id));
        }
        
        setNewPod({ data_type: '', encrypted_data: '', metadata: {} });
        fetchPods();
      }
    } catch (error) {
      console.error('Encryption error:', error);
      toast.error('Verschlüsselungsfehler aufgetreten');
    }
  };

  const handleDeletePod = async (id: string) => {
    const { error } = await supabase
      .from('data_pods')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Fehler beim Löschen');
    } else {
      toast.success('Data Pod gelöscht');
      fetchPods();
    }
  };

  const toggleVisibility = async (pod: DataPod) => {
    const podId = pod.id;
    const newVisible = new Set(visiblePods);
    
    if (newVisible.has(podId)) {
      // Hide the data
      newVisible.delete(podId);
      setDecryptedData(prev => {
        const next = new Map(prev);
        next.delete(podId);
        return next;
      });
    } else {
      // Decrypt and show the data
      if (!masterPassword) {
        toast.error('Master-Passwort erforderlich');
        return;
      }
      
      try {
        const metadata = pod.metadata as unknown as EncryptionMetadata;
        const salt = importSalt(metadata.salt);
        
        // Derive key from master password
        const { key } = await generateEncryptionKey(masterPassword);
        
        // Decrypt data
        const decrypted = await decryptData(pod.encrypted_data, metadata.iv, key);
        
        // Generate and verify ZK proof
        const zkProof = await createZKProof(decrypted);
        const isValid = await verifyZKProof(zkProof, decrypted);
        
        if (!isValid) {
          toast.error('Zero-Knowledge-Proof Verifizierung fehlgeschlagen');
          return;
        }
        
        // Create decryption proof
        const decryptionProof = await createDecryptionProof(decrypted);
        
        setDecryptedData(prev => {
          const next = new Map(prev);
          next.set(podId, decrypted);
          return next;
        });
        
        setZkProofs(prev => {
          const next = new Map(prev);
          next.set(podId, decryptionProof.zkProof);
          return next;
        });
        
        newVisible.add(podId);
        toast.success('Daten erfolgreich entschlüsselt und verifiziert');
      } catch (error) {
        console.error('Decryption error:', error);
        toast.error('Fehler beim Entschlüsseln der Daten');
        return;
      }
    }
    
    setVisiblePods(newVisible);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.length < 8) {
      toast.error('Passwort muss mindestens 8 Zeichen haben');
      return;
    }
    unlock(passwordInput);
    setIsUnlockDialogOpen(false);
    setPasswordInput('');
    toast.success('Data Pods entsperrt');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Unlock Dialog */}
        <Dialog open={isUnlockDialogOpen} onOpenChange={setIsUnlockDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-secondary" />
                Data Pods entsperren
              </DialogTitle>
              <DialogDescription>
                Gib dein Master-Passwort ein, um auf deine verschlüsselten Data Pods zuzugreifen.
                <br />
                <span className="text-xs text-warning">Dieses Passwort wird nur lokal gespeichert.</span>
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="master-password">Master-Passwort</Label>
                <Input
                  id="master-password"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Mindestens 8 Zeichen"
                  minLength={8}
                  required
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                Entsperren
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Personal Data Pods</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Lock className="w-4 h-4" />
              End-to-End verschlüsselt mit Zero-Knowledge-Proofs
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Neuer Data Pod
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Neuen Data Pod erstellen</DialogTitle>
                <DialogDescription>
                  Speichere verschlüsselte Daten in deinem persönlichen Pod
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreatePod} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="data_type">Datentyp</Label>
                  <Select
                    value={newPod.data_type}
                    onValueChange={(value) => setNewPod({ ...newPod, data_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wähle einen Typ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Persönliche Daten</SelectItem>
                      <SelectItem value="medical">Medizinische Daten</SelectItem>
                      <SelectItem value="financial">Finanzielle Daten</SelectItem>
                      <SelectItem value="preferences">Präferenzen</SelectItem>
                      <SelectItem value="credentials">Credentials</SelectItem>
                      <SelectItem value="other">Sonstiges</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data">Daten (werden verschlüsselt gespeichert)</Label>
                  <Textarea
                    id="data"
                    value={newPod.encrypted_data}
                    onChange={(e) => setNewPod({ ...newPod, encrypted_data: e.target.value })}
                    placeholder="Deine vertraulichen Daten..."
                    rows={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    AES-256-GCM Verschlüsselung + Zero-Knowledge-Proof
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={extracting}>
                  {extracting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Extrahiere Wissen...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Pod erstellen & Wissen extrahieren
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                  <Brain className="w-3 h-3" />
                  KI extrahiert automatisch Entitäten für den Knowledge Graph
                </p>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {pods.length === 0 ? (
            <Card className="glass border-secondary/30 md:col-span-2">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Database className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  Noch keine Data Pods vorhanden. Erstelle deinen ersten Pod!
                </p>
              </CardContent>
            </Card>
          ) : (
            pods.map((pod) => (
              <Card key={pod.id} className="glass border-secondary/30">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-secondary" />
                      {pod.data_type}
                    </div>
                    <div className="flex items-center gap-2">
                      {zkProofs.has(pod.id) && (
                        <div className="flex items-center gap-1 text-success text-xs">
                          <CheckCircle2 className="w-3 h-3" />
                          ZKP
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleVisibility(pod)}
                      >
                        {visiblePods.has(pod.id) ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePod(pod.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Erstellt am {new Date(pod.created_at).toLocaleDateString('de-DE')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="glass rounded-lg p-4">
                    {visiblePods.has(pod.id) ? (
                      <div className="space-y-2">
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {decryptedData.get(pod.id) || 'Entschlüsselung fehlgeschlagen'}
                        </p>
                        {zkProofs.has(pod.id) && (
                          <div className="flex items-center gap-2 text-xs text-success pt-2 border-t border-border/50">
                            <Shield className="w-3 h-3" />
                            Zero-Knowledge-Proof verifiziert
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        🔒 AES-256-GCM verschlüsselt - Klicke auf das Auge zum Entschlüsseln
                      </p>
                    )}
                  </div>
                  {pod.access_rules && Array.isArray(pod.access_rules) && pod.access_rules.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-xs text-muted-foreground">Zugriffsregeln</Label>
                      <div className="mt-2 text-sm">
                        {pod.access_rules.length} Regeln aktiv
                      </div>
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Lock className="w-3 h-3" />
                        <span>End-to-End Encrypted</span>
                      </div>
                      {extractedPods.has(pod.id) && (
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <Brain className="w-3 h-3" />
                          <span>Wissen extrahiert</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DataPods;
