"use client";

import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";

interface ColorTokens {
  backgroundHSBA: { a: number; b: number; h: number; s: number };
  errorColor: string;
  foregroundHSBA: { a: number; b: number; h: number; s: number };
  primaryColor: string;
  successColor: string;
  warningColor: string;
}

interface DesignTokens {
  colors: ColorTokens;
  spacing: SpacingTokens;
  typography: TypographyTokens;
}

interface DesignTokensContextType {
  resetTokens: () => void;
  tokens: DesignTokens;
  updateColors: (colors: Partial<ColorTokens>) => void;
  updateSpacing: (spacing: Partial<SpacingTokens>) => void;
  updateTypography: (typography: Partial<TypographyTokens>) => void;
}

interface SpacingTokens {
  baseRadius: number;
  baseSpacing: number;
  radiusScale: number;
  spacingScale: number;
}

interface TypographyTokens {
  baseLineHeight: number;
  baseSize: number;
  bodyFont: string;
  headingFont: string;
  typeScale: number;
}

const defaultTokens: DesignTokens = {
  colors: {
    backgroundHSBA: { a: 1, b: 100, h: 0, s: 0 },
    errorColor: "#dc2626",
    foregroundHSBA: { a: 1, b: 0, h: 0, s: 0 },
    primaryColor: "#3b82f6",
    successColor: "#16a34a",
    warningColor: "#f59e0b",
  },
  spacing: {
    baseRadius: 4,
    baseSpacing: 4,
    radiusScale: 2,
    spacingScale: 2,
  },
  typography: {
    baseLineHeight: 1.5,
    baseSize: 16,
    bodyFont: "Inter, sans-serif",
    headingFont: "Inter, sans-serif",
    typeScale: 1.25,
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

  const updateTypography = useCallback(
    (typography: Partial<TypographyTokens>) => {
      setTokens((prev) => ({
        ...prev,
        typography: { ...prev.typography, ...typography },
      }));
    },
    [],
  );

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
    <DesignTokensContext
      value={{
        resetTokens,
        tokens,
        updateColors,
        updateSpacing,
        updateTypography,
      }}
    >
      {children}
    </DesignTokensContext>
  );
}

export function useDesignTokens() {
  const context = use(DesignTokensContext);
  if (context === undefined) {
    throw new Error(
      "useDesignTokens must be used within a DesignTokensProvider",
    );
  }
  return context;
}
