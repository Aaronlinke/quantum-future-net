import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, Plus, Trash2, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import type { Json } from '@/integrations/supabase/types';

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
  const [pods, setPods] = useState<DataPod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [visiblePods, setVisiblePods] = useState<Set<string>>(new Set());
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
    fetchPods();
  }, [user, navigate]);

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
    
    if (!user) return;
    
    const { error } = await supabase
      .from('data_pods')
      .insert([{
        user_id: user.id,
        data_type: newPod.data_type,
        encrypted_data: btoa(newPod.encrypted_data), // Simple base64 encoding for demo
        metadata: newPod.metadata
      }]);

    if (error) {
      toast.error('Fehler beim Erstellen des Data Pods');
    } else {
      toast.success('Data Pod erfolgreich erstellt!');
      setIsDialogOpen(false);
      setNewPod({ data_type: '', encrypted_data: '', metadata: {} });
      fetchPods();
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

  const toggleVisibility = (id: string) => {
    const newVisible = new Set(visiblePods);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisiblePods(newVisible);
  };

  const decryptData = (encrypted: string) => {
    try {
      return atob(encrypted);
    } catch {
      return encrypted;
    }
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Personal Data Pods</h1>
            <p className="text-muted-foreground">
              Deine verschlüsselten Daten unter deiner Kontrolle
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
                </div>
                <Button type="submit" className="w-full">
                  Pod erstellen
                </Button>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleVisibility(pod.id)}
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
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {decryptData(pod.encrypted_data)}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Verschlüsselte Daten - Klicke auf das Auge um sie anzuzeigen
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
