"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface ColorTokens {
  primaryColor: string;
  errorColor: string;
  warningColor: string;
  successColor: string;
  foregroundHSBA: { h: number; s: number; b: number; a: number };
  backgroundHSBA: { h: number; s: number; b: number; a: number };
}

interface TypographyTokens {
  headingFont: string;
  bodyFont: string;
  baseSize: number;
  typeScale: number;
  baseLineHeight: number;
}

interface SpacingTokens {
  baseSpacing: number;
  spacingScale: number;
  baseRadius: number;
  radiusScale: number;
}

interface DesignTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
}

interface DesignTokensContextType {
  tokens: DesignTokens;
  updateColors: (colors: Partial<ColorTokens>) => void;
  updateTypography: (typography: Partial<TypographyTokens>) => void;
  updateSpacing: (spacing: Partial<SpacingTokens>) => void;
  resetTokens: () => void;
}

const defaultTokens: DesignTokens = {
  colors: {
    primaryColor: "#3b82f6",
    errorColor: "#dc2626",
    warningColor: "#f59e0b",
    successColor: "#16a34a",
    foregroundHSBA: { h: 0, s: 0, b: 0, a: 1 },
    backgroundHSBA: { h: 0, s: 0, b: 100, a: 1 },
  },
  typography: {
    headingFont: "Inter, sans-serif",
    bodyFont: "Inter, sans-serif",
    baseSize: 16,
    typeScale: 1.25,
    baseLineHeight: 1.5,
  },
  spacing: {
    baseSpacing: 4,
    spacingScale: 2,
    baseRadius: 4,
    radiusScale: 2,
  },
};

const STORAGE_KEY = "token-forge-design-tokens";

const DesignTokensContext = createContext<DesignTokensContextType | undefined>(
  undefined,
);

export function DesignTokensProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<DesignTokens>(defaultTokens);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedTokens = localStorage.getItem(STORAGE_KEY);
    if (storedTokens) {
      try {
        const parsed = JSON.parse(storedTokens) as DesignTokens;
        setTokens(parsed);
      } catch (error) {
        console.error("Error parsing stored tokens:", error);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    }
  }, [tokens, isInitialized]);

  const updateColors = useCallback((colors: Partial<ColorTokens>) => {
    setTokens((prev) => ({
      ...prev,
      colors: { ...prev.colors, ...colors },
    }));
  }, []);

  const updateTypography = useCallback((typography: Partial<TypographyTokens>) => {
    setTokens((prev) => ({
      ...prev,
      typography: { ...prev.typography, ...typography },
    }));
  }, []);

  const updateSpacing = useCallback((spacing: Partial<SpacingTokens>) => {
    setTokens((prev) => ({
      ...prev,
      spacing: { ...prev.spacing, ...spacing },
    }));
  }, []);

  const resetTokens = useCallback(() => {
    setTokens(defaultTokens);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <DesignTokensContext.Provider
      value={{
        tokens,
        updateColors,
        updateTypography,
        updateSpacing,
        resetTokens,
      }}
    >
      {children}
    </DesignTokensContext.Provider>
  );
}

export function useDesignTokens() {
  const context = useContext(DesignTokensContext);
  if (context === undefined) {
    throw new Error(
      "useDesignTokens must be used within a DesignTokensProvider",
    );
  }
  return context;
}
