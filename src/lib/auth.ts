import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

// Auth State context management (Simplified for prototype)
let globalUser: User | null = null;
let subscriptions: ((user: User | null) => void)[] = [];

// Initialize listener
supabase.auth.onAuthStateChange(async (event, session) => {
  globalUser = session?.user ?? null;
  subscriptions.forEach(cb => cb(globalUser));
});

export function useAuth() {
  const [user, setUser] = useState<User | null>(globalUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Current session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      globalUser = session?.user ?? null;
      setUser(globalUser);
      setLoading(false);
    });

    const cb = (u: User | null) => setUser(u);
    subscriptions.push(cb);
    return () => { subscriptions = subscriptions.filter(s => s !== cb) };
  }, []);

  return { user, loading };
}
