import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient, User } from "@supabase/supabase-js";
import { request, gql } from "graphql-request";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://olmvkmyyqfpdhxfaozsp.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbXZrbXl5cWZwZGh4ZmFvenNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MjUzNzgsImV4cCI6MjA4NzUwMTM3OH0.Y-er__uYzvP50bqprPZLWjl-yAdvJ2mVNpFy560eBUY";
const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Color {
  hex: string;
  name: string;
  psychology?: string;
}

interface PaletteIA {
  name: string;
  colors: Color[];
  typography_suggestion?: {
    heading: string;
    body: string;
  };
  vibe?: string;
}

interface AuraContextType {
  user: (User & { plan?: string; points?: number }) | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  generatePalette: (prompt: string, image?: string) => Promise<PaletteIA>;
  savePalette: (palette: PaletteIA) => Promise<any>;
  getPalette: (id: string) => Promise<any>;
  deletePalette: (id: string) => Promise<boolean>;
  addCollaboration: (resourceId: string, resourceType: string, userId: string, role?: string) => Promise<any>;
  searchUserByEmail: (email: string) => Promise<any>;
  getNotifications: () => Promise<any[]>;
  markNotificationAsRead: (id: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getMyPalettes: () => Promise<any[]>;
  createCheckoutSession: (priceId: string) => Promise<void>;
  updateUserProfile: (data: { full_name?: string, email?: string }) => Promise<void>;
  simulatePlanUpgrade: (plan: string) => Promise<void>;
  theme: string;
  setTheme: (newTheme: string) => void;
}

const AuraContext = createContext<AuraContextType | undefined>(undefined);

export function AuraProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<(User & { plan?: string; points?: number }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullProfile, setFullProfile] = useState<any>(null);
  const [theme, setThemeState] = useState<string>(() => localStorage.getItem("aura-theme") || "light");

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem("aura-theme", newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (targetTheme: string) => {
    const root = window.document.documentElement;
    if (targetTheme === "dark") {
      root.classList.add("dark");
    } else if (targetTheme === "light") {
      root.classList.remove("dark");
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", systemDark);
    }
  };

  useEffect(() => {
    applyTheme(theme);

    // Listen for system theme changes if in system mode
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const refreshUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const query = gql`
          query GetMe {
            me {
              id
              plan
              points
              fullName
            }
          }
        `;
        const headers = { Authorization: `Bearer ${session.access_token}` };
        try {
          const data: any = await request(GRAPHQL_ENDPOINT, query, {}, headers);
          if (data?.me) {
            setUser({ ...session.user, plan: data.me.plan, points: data.me.points });
            return;
          }
        } catch (apiErr) {
          console.warn("Backend profile fetch failed, using session user", apiErr);
        }
        setUser(session.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Session refresh error:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    // Initial session recovery
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await refreshUser();
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes (this handles login/logout and session updates)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`[Auth Event] ${event}`);
      if (session) {
        if (event === 'SIGNED_IN') {
          await refreshUser();
        } else {
          setUser(prev => {
            if (prev?.id === session.user.id) {
              return { ...session.user, plan: prev.plan, points: prev.points };
            }
            return session.user;
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      Authorization: session ? `Bearer ${session.access_token}` : "",
    };
  };

  const generatePalette = async (prompt: string, image?: string): Promise<PaletteIA> => {
    const query = gql`
      query GenerateIAPalette($prompt: String!, $image: String) {
        generateIAPalette(prompt: $prompt, image: $image) {
          name
          vibe
          colors {
            hex
            name
            psychology
          }
          typography_suggestion {
            heading
            body
          }
        }
      }
    `;
    const headers = await getHeaders();
    const data: any = await request(GRAPHQL_ENDPOINT, query, { prompt, image }, headers);
    return data.generateIAPalette;
  };

  const getPalette = async (id: string) => {
    const query = gql`
      query GetPalette($id: ID!) {
        palette(id: $id) {
          id
          name
          colors {
            hex
            name
          }
          aiGenerated
          createdAt
        }
      }
    `;
    const headers = await getHeaders();
    const data: any = await request(GRAPHQL_ENDPOINT, query, { id }, headers);
    return data.palette;
  };

  const savePalette = async (palette: PaletteIA) => {
    const mutation = gql`
      mutation SavePalette($name: String!, $colors: [ColorInput!]!, $aiGenerated: Boolean) {
        savePalette(name: $name, colors: $colors, aiGenerated: $aiGenerated) {
          id
          name
        }
      }
    `;
    const headers = await getHeaders();
    const variables = {
      name: palette.name,
      colors: palette.colors.map(c => ({ hex: c.hex, name: c.name, psychology: c.psychology })),
      aiGenerated: true
    };
    return await request(GRAPHQL_ENDPOINT, mutation, variables, headers);
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.href
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Auth error:", error);
      alert("El login con Google no está configurado en Supabase o hubo un error de red.");
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const createCheckoutSession = async (priceId: string) => {
    try {
      const mutation = gql`
        mutation CreateCheckoutSession($priceId: String!) {
          createCheckoutSession(priceId: $priceId)
        }
      `;
      const headers = await getHeaders();
      // Permitimos que esto se llame incluso sin usuario; el backend manejará el caso anónimo
      const data: any = await request(GRAPHQL_ENDPOINT, mutation, { priceId }, headers);
      if (data.createCheckoutSession) {
        window.location.href = data.createCheckoutSession;
      }
    } catch (error: any) {
      console.error("Checkout session error:", error);
      // Si el backend aún requiere auth, mostramos el login
      if (error.message?.includes("autenticado") || error.message?.includes("autorizado")) {
        signInWithGoogle();
      } else {
        alert("No se pudo iniciar la transacción. Por favor, inténtalo de nuevo.");
      }
    }
  };

  const addCollaboration = async (resourceId: string, resourceType: string, userId: string, role: string = 'VIEWER'): Promise<any> => {
    const mutation = gql`
      mutation AddCollaboration($resourceId: ID!, $resourceType: String!, $userId: ID!, $role: String) {
        addCollaboration(resourceId: $resourceId, resourceType: $resourceType, userId: $userId, role: $role) {
          id
          role
          user {
            fullName
            email
          }
        }
      }
    `;
    const headers = await getHeaders();
    const data: any = await request(GRAPHQL_ENDPOINT, mutation, { resourceId, resourceType, userId, role }, headers);
    return data.addCollaboration;
  };

  const searchUserByEmail = async (email: string): Promise<any> => {
    const query = gql`
      query SearchUserByEmail($email: String!) {
        searchUserByEmail(email: $email) {
          id
          fullName
          email
        }
      }
    `;
    const headers = await getHeaders();
    const data: any = await request(GRAPHQL_ENDPOINT, query, { email }, headers);
    return data.searchUserByEmail;
  };

  const getNotifications = async (): Promise<any[]> => {
    const query = gql`
      query MyNotifications {
        myNotifications {
          id
          type
          title
          message
          read
          link
          createdAt
        }
      }
    `;
    const headers = await getHeaders();
    const data: any = await request(GRAPHQL_ENDPOINT, query, {}, headers);
    return data.myNotifications || [];
  };

  const markNotificationAsRead = async (id: string): Promise<boolean> => {
    const mutation = gql`
      mutation MarkNotificationAsRead($id: ID!) {
        markNotificationAsRead(id: $id)
      }
    `;
    const headers = await getHeaders();
    const data: any = await request(GRAPHQL_ENDPOINT, mutation, { id }, headers);
    return data.markNotificationAsRead;
  };

  const deletePalette = async (id: string): Promise<boolean> => {
    const mutation = gql`
      mutation DeletePalette($id: ID!) {
        deletePalette(id: $id)
      }
    `;
    const headers = await getHeaders();
    console.log("[AuraContext] Llamando a deletePalette para:", id);
    const data: any = await request(GRAPHQL_ENDPOINT, mutation, { id }, headers);
    return data.deletePalette;
  };

  const getMyPalettes = async (): Promise<any[]> => {
    const query = gql`
      query GetMyPalettes {
        myPalettes {
          id
          name
          colors {
            hex
            name
          }
          aiGenerated
          createdAt
        }
      }
    `;
    const headers = await getHeaders();
    const data: any = await request(GRAPHQL_ENDPOINT, query, {}, headers);
    return data.myPalettes || [];
  };

  const updateUserProfile = async (data: { full_name?: string, email?: string }) => {
    try {
      const updatePayload: any = {};
      if (data.full_name) updatePayload.data = { full_name: data.full_name };
      if (data.email) updatePayload.email = data.email;

      const { error } = await supabase.auth.updateUser(updatePayload);
      if (error) throw error;
    } catch (error: any) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  const simulatePlanUpgrade = async (plan: string) => {
    const mutation = gql`
      mutation SimulatePlanUpgrade($plan: String!) {
        simulatePlanUpgrade(plan: $plan) {
          id
          plan
        }
      }
    `;
    const headers = await getHeaders();
    await request(GRAPHQL_ENDPOINT, mutation, { plan }, headers);
    await refreshUser();
  };

  return (
    <AuraContext.Provider value={{
      user,
      loading,
      refreshUser,
      generatePalette,
      savePalette,
      getPalette,
      deletePalette,
      addCollaboration,
      searchUserByEmail,
      getNotifications,
      markNotificationAsRead,
      signInWithGoogle,
      signOut,
      getMyPalettes,
      createCheckoutSession,
      updateUserProfile,
      simulatePlanUpgrade,
      theme,
      setTheme
    }}>
      {children}
    </AuraContext.Provider>
  );
}

export function useAura() {
  const context = useContext(AuraContext);
  if (context === undefined) {
    throw new Error("useAura must be used within an AuraProvider");
  }
  return context;
}
