import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Settings, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function Perfil() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Selecione apenas arquivo de imagem.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('A imagem deve ter no maximo 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result?.toString() || '';
      setAvatarUrl(result);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        setError('Nao foi possivel carregar o perfil.');
      }

      setFullName((data?.full_name || user.user_metadata?.full_name || '').toString());
      setEmail((data?.email || user.email || '').toString());
      setPhone((data?.phone || user.user_metadata?.phone || '').toString());
      setAvatarUrl((data?.avatar_url || user.user_metadata?.avatar_url || '').toString());
      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    const { error: upsertError } = await supabase.from('profiles').upsert(
      {
        id: user.id,
        email: email.trim().toLowerCase(),
        full_name: fullName.trim(),
        phone: phone.trim(),
        avatar_url: avatarUrl.trim() || null,
      },
      { onConflict: 'id' }
    );

    if (upsertError) {
      setError(upsertError.message);
      setSaving(false);
      return;
    }

    const { error: authUpdateError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName.trim(),
        phone: phone.trim(),
        avatar_url: avatarUrl.trim() || null,
      }
    });

    if (authUpdateError) {
      setError(authUpdateError.message);
    } else {
      setSuccess('Perfil atualizado com sucesso.');
    }

    setSaving(false);
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setError(null);
    setSuccess(null);

    if (newPassword.trim().length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      setPasswordSaving(false);
      return;
    }

    const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword.trim() });
    if (passwordError) {
      setError(passwordError.message);
    } else {
      setNewPassword('');
      setSuccess('Senha alterada com sucesso.');
    }

    setPasswordSaving(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
         <Settings className="w-8 h-8 text-white/60" /> Configurações
      </h1>

      <div className="glass-card p-6 md:p-8">
         {loading && <p className="text-sf-text-muted">Carregando perfil...</p>}
         {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
         {success && <p className="mb-4 text-sm text-emerald-400">{success}</p>}

         <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-2xl border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center">
               {avatarUrl ? (
                 <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <User className="w-10 h-10 text-white/40" />
               )}
            </div>
            <div>
               <h2 className="text-2xl font-bold text-white">{fullName || 'Membro'}</h2>
               <p className="text-sf-text-muted">{email || user?.email}</p>
            </div>
          </div>

          <hr className="border-white/5 my-8" />

          <form onSubmit={handleProfileSave} className="space-y-4 mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Dados do Perfil</h3>
            <div>
              <label className="text-xs font-bold text-sf-text-muted uppercase tracking-wider">Nome</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-sf-text-muted uppercase tracking-wider">E-mail</label>
              <input value={email} disabled className="mt-1 w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white/60" />
            </div>
            <div>
              <label className="text-xs font-bold text-sf-text-muted uppercase tracking-wider">Telefone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-sf-text-muted uppercase tracking-wider">Foto de perfil (opcional)</label>
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-white" />
            </div>
            <button type="submit" disabled={saving} className="text-sm font-medium bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
              {saving ? 'Salvando...' : 'Salvar dados'}
            </button>
          </form>

          <form onSubmit={handlePasswordChange} className="space-y-4 mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Trocar Senha</h3>
            <div>
              <label className="text-xs font-bold text-sf-text-muted uppercase tracking-wider">Nova senha</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} required className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none" />
            </div>
            <button type="submit" disabled={passwordSaving} className="text-sm font-medium bg-sf-purple/20 hover:bg-sf-purple/30 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
              {passwordSaving ? 'Alterando...' : 'Alterar senha'}
            </button>
          </form>

          <div className="space-y-4">
             <h3 className="text-lg font-bold text-white mb-4">Plano Atual</h3>
             <div className="p-4 rounded-xl relative overflow-hidden flex justify-between items-center bg-sf-purple/10 border border-sf-purple/20">
                <div>
                  <h4 className="font-bold text-white">Vitalicio</h4>
                  <p className="text-sm text-sf-text-muted mt-1">Acesso ilimitado a todo o conteudo da plataforma.</p>
                </div>
                <span className="text-sm font-medium bg-sf-purple/20 text-sf-purple px-4 py-2 rounded-lg">Ativo</span>
             </div>
          </div>
         

      </div>
    </div>
  );
}
