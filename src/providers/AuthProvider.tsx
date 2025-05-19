"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: any;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/signin', '/signup', '/auth/callback'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        // Only redirect to welcome if on a public route
        if (publicRoutes.includes(pathname)) {
        router.push('/welcome');
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        // Only redirect to signin if not on a public route
        if (!publicRoutes.includes(pathname)) {
        router.push('/signin');
        }
      }
    });

    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      // Only redirect if:
      // 1. No session and not on a public route -> redirect to signin
      // 2. Has session and on a public route -> redirect to welcome
      if (!session && !publicRoutes.includes(pathname)) {
        router.push('/signin');
      } else if (session && publicRoutes.includes(pathname)) {
        router.push('/welcome');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname]);

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${pathname}`
      }
    });

    if (error) {
      console.error('Error signing in:', error.message);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

