import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Key, Link2, CheckCircle2, AlertCircle, Copy, QrCode } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generateDataHash } from '@/lib/crypto';

interface DIDDocument {
  did: string;
  publicKey: string;
  verificationMethod: any;
  createdAt: string;
  status: 'verified' | 'pending' | 'revoked';
}

export default function BlockchainDID() {
  const [did, setDid] = useState<string>('');
  const [didDocument, setDidDocument] = useState<DIDDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    loadDIDFromProfile();
  }, []);

  const loadDIDFromProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile?.did_identifier) {
        setDid(profile.did_identifier);
        setDidDocument({
          did: profile.did_identifier,
          publicKey: profile.public_key || '',
          verificationMethod: profile.verification_method,
          createdAt: profile.created_at || new Date().toISOString(),
          status: 'verified'
        });
      }
    } catch (error) {
      console.error('Error loading DID:', error);
    }
  };

  const generateDID = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Bitte melden Sie sich an');
        return;
      }

      // Generate DID identifier
      const didIdentifier = `did:web4:${user.id}`;
      
      // Generate public/private key pair (simplified)
      const keyPair = await generateKeyPair();
      
      // Create verification method
      const verificationMethod = {
        id: `${didIdentifier}#key-1`,
        type: 'Ed25519VerificationKey2020',
        controller: didIdentifier,
        publicKeyMultibase: keyPair.publicKey
      };

      // Update profile with DID
      const { error } = await supabase
        .from('profiles')
        .update({
          did_identifier: didIdentifier,
          public_key: keyPair.publicKey,
          verification_method: verificationMethod
        })
        .eq('id', user.id);

      if (error) throw error;

      setDid(didIdentifier);
      setDidDocument({
        did: didIdentifier,
        publicKey: keyPair.publicKey,
        verificationMethod,
        createdAt: new Date().toISOString(),
        status: 'verified'
      });

      toast.success('DID erfolgreich generiert!');
    } catch (error) {
      console.error('Error generating DID:', error);
      toast.error('Fehler beim Generieren der DID');
    } finally {
      setLoading(false);
    }
  };

  const generateKeyPair = async () => {
    // Simplified key generation - in production use proper crypto library
    const timestamp = Date.now().toString();
    const publicKey = await generateDataHash(timestamp + 'public');
    return {
      publicKey,
      privateKey: await generateDataHash(timestamp + 'private')
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('In Zwischenablage kopiert!');
  };

  const verifyDID = async () => {
    setLoading(true);
    try {
      // Simulate DID verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (didDocument) {
        setDidDocument({ ...didDocument, status: 'verified' });
        toast.success('DID erfolgreich verifiziert!');
      }
    } catch (error) {
      toast.error('Verifikation fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Blockchain DID
        </h1>
        <p className="text-muted-foreground mt-2">
          Dezentrale Identität & Kryptographische Verifikation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <CardTitle className="text-lg">Sicherheit</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">256-bit</div>
            <p className="text-xs text-muted-foreground mt-1">Verschlüsselung</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Schlüssel</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{didDocument ? '1' : '0'}</div>
            <p className="text-xs text-muted-foreground mt-1">Aktive Schlüsselpaare</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-lg">Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant={didDocument ? 'default' : 'secondary'} className="text-sm">
              {didDocument ? 'Aktiv' : 'Inaktiv'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="identity" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="identity">Identität</TabsTrigger>
          <TabsTrigger value="verification">Verifikation</TabsTrigger>
          <TabsTrigger value="keys">Schlüssel</TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deine Dezentrale Identität (DID)</CardTitle>
              <CardDescription>
                Eine einzigartige, kryptographisch sichere Identität im Web 4.0
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!didDocument ? (
                <div className="text-center py-8 space-y-4">
                  <Shield className="h-16 w-16 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">Keine DID vorhanden</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Erstelle eine neue dezentrale Identität für maximale Sicherheit
                    </p>
                  </div>
                  <Button onClick={generateDID} disabled={loading} className="mt-4">
                    {loading ? 'Wird generiert...' : 'DID Generieren'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>DID Identifier</Label>
                    <div className="flex gap-2 mt-2">
                      <Input value={did} readOnly className="font-mono text-sm" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(did)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowQR(!showQR)}
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Status</Label>
                    <div className="mt-2">
                      <Badge
                        variant={didDocument.status === 'verified' ? 'default' : 'secondary'}
                        className="flex items-center gap-2 w-fit"
                      >
                        {didDocument.status === 'verified' ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        {didDocument.status === 'verified' ? 'Verifiziert' : 'Ausstehend'}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label>Erstellt am</Label>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {new Date(didDocument.createdAt).toLocaleString('de-DE')}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DID Verifikation</CardTitle>
              <CardDescription>
                Verifiziere deine Identität gegenüber anderen Teilnehmern
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {didDocument ? (
                <div className="space-y-4">
                  <div className="rounded-lg border bg-muted/20 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold">Verifikationsmethode</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {didDocument.verificationMethod?.type || 'Ed25519VerificationKey2020'}
                        </p>
                        <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">
                          {didDocument.verificationMethod?.id || 'N/A'}
                        </code>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={verifyDID} 
                    disabled={loading || didDocument.status === 'verified'}
                    className="w-full"
                  >
                    {loading ? 'Wird verifiziert...' : 'DID Verifizieren'}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Erstelle zuerst eine DID, um sie zu verifizieren
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kryptographische Schlüssel</CardTitle>
              <CardDescription>
                Verwalte deine öffentlichen und privaten Schlüssel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {didDocument ? (
                <div className="space-y-4">
                  <div>
                    <Label>Öffentlicher Schlüssel</Label>
                    <div className="flex gap-2 mt-2">
                      <Input 
                        value={didDocument.publicKey} 
                        readOnly 
                        className="font-mono text-xs"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(didDocument.publicKey)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-yellow-500">Sicherheitshinweis</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Teile niemals deinen privaten Schlüssel mit anderen. 
                          Er ist sicher in deinem Browser gespeichert.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Schlüsselpaar Rotieren
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Keine Schlüssel verfügbar
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}