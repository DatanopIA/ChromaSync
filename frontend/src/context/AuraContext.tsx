import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient, User } from "@supabase/supabase-js";
import { request, gql } from "graphql-request";

const SUPABASE_URL = "https://olmvkmyyqfpdhxfaozsp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbXZrbXl5cWZwZGh4ZmFvenNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MjUzNzgsImV4cCI6MjA4NzUwMTM3OH0.Y-er__uYzvP50bqprPZLWjl-yAdvJ2mVNpFy560eBUY";
const GRAPHQL_ENDPOINT = "http://localhost:4000/graphql";

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
    user: User | null;
    loading: boolean;
    generatePalette: (prompt: string, image?: string) => Promise<PaletteIA>;
    savePalette: (palette: PaletteIA) => Promise<any>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    createCheckoutSession: (priceId: string) => Promise<void>;
    updateUserProfile: (data: { full_name?: string, email?: string }) => Promise<void>;
    theme: string;
    setTheme: (newTheme: string) => void;
}

const AuraContext = createContext<AuraContextType | undefined>(undefined);

export function AuraProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
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
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (error: any) {
            console.error("Auth error:", error);
            alert("El login con Google no está configurado en Supabase. Por favor, asegúrate de habilitar Google como proveedor en el dashboard de Supabase.");
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const createCheckoutSession = async (priceId: string) => {
        const mutation = gql`
      mutation CreateCheckoutSession($priceId: String!) {
        createCheckoutSession(priceId: $priceId)
      }
    `;
        const headers = await getHeaders();
        const data: any = await request(GRAPHQL_ENDPOINT, mutation, { priceId }, headers);
        if (data.createCheckoutSession) {
            window.location.href = data.createCheckoutSession;
        }
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

    return (
        <AuraContext.Provider value={{
            user,
            loading,
            generatePalette,
            savePalette,
            signInWithGoogle,
            signOut,
            createCheckoutSession,
            updateUserProfile,
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
