import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User, Key, LogOut, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', user?.id);

    if (error) {
      toast.error('Fehler beim Aktualisieren des Profils');
    } else {
      toast.success('Profil erfolgreich aktualisiert!');
      await refreshProfile();
    }

    setIsLoading(false);
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Dein Profil</h1>
            <p className="text-muted-foreground">Verwalte deine dezentrale Identität</p>
          </div>
          <Button onClick={signOut} variant="outline" className="gap-2">
            <LogOut className="w-4 h-4" />
            Abmelden
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* DID Information */}
          <Card className="glass border-secondary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Dezentrale Identität (DID)
              </CardTitle>
              <CardDescription>
                Deine einzigartige Web 4.0 Identität
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">DID Identifier</Label>
                <div className="glass rounded-lg p-3 mt-2 break-all text-sm font-mono">
                  {profile.did_identifier}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">User ID</Label>
                <div className="glass rounded-lg p-3 mt-2 break-all text-sm font-mono">
                  {user.id}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">E-Mail</Label>
                <div className="glass rounded-lg p-3 mt-2 text-sm">
                  {user.email}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card className="glass border-secondary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profil Informationen
              </CardTitle>
              <CardDescription>
                Öffentlich sichtbare Informationen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="display_name">Anzeigename</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    placeholder="Dein Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Erzähle uns über dich..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar_url">Avatar URL</Label>
                  <Input
                    id="avatar_url"
                    type="url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Speichern...' : 'Profil speichern'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="glass border-secondary/30 cursor-pointer hover:border-secondary transition-colors"
            onClick={() => navigate('/data-pods')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Personal Data Pods
              </CardTitle>
              <CardDescription>
                Verwalte deine verschlüsselten Daten und Zugriffsrechte
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="glass border-secondary/30 cursor-pointer hover:border-secondary transition-colors"
            onClick={() => navigate('/consent')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Consent Management
              </CardTitle>
              <CardDescription>
                Kontrolliere, wer auf deine Daten zugreifen darf
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
