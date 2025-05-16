import { supabase } from './supabase';

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const authService = {
  async signIn({ email, password }: SignInData) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Check if email is confirmed
    if (!data.user?.email_confirmed_at) {
      throw new Error('Please verify your email before signing in');
    }

    return data;
  },

  async signUp(data: SignUpData) {
    const { email, password, ...profileData } = data;

    // Create the auth user with email confirmation
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: profileData.firstName,
          last_name: profileData.lastName,
        },
        emailRedirectTo: `https://endo-connect.vercel.app/auth/callback`
      }
    });

    if (error) {
      throw error;
    }

    return authData;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  },

  async resendConfirmationEmail(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `https://endo-connect.vercel.app/auth/callback`
      }
    });

    if (error) {
      throw error;
    }
  },

  async checkEmailConfirmation() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw error;
    }

    return !!user?.email_confirmed_at;
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/onboarding`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  }
};
