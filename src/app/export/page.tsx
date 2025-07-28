"use client";

import { useState } from "react";
import Link from "next/link";

export default function ExportPage() {
  const [exportFormat, setExportFormat] = useState("css");

  // Mock token data - in a real app, this would come from a global state/context
  const tokens = {
    colors: {
      primary: {
        50: "#eff6ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a",
        950: "#172554",
      },
      secondary: {
        50: "#f5f3ff",
        100: "#ede9fe",
        200: "#ddd6fe",
        300: "#c4b5fd",
        400: "#a78bfa",
        500: "#8b5cf6",
        600: "#7c3aed",
        700: "#6d28d9",
        800: "#5b21b6",
        900: "#4c1d95",
        950: "#2e1065",
      },
    },
    typography: {
      fontFamily: {
        heading: "Inter, sans-serif",
        body: "Inter, sans-serif",
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        base: "16px",
        lg: "18px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "30px",
        "4xl": "36px",
        "5xl": "48px",
      },
    },
    spacing: {
      0: "0px",
      0.5: "2px",
      1: "4px",
      2: "8px",
      3: "12px",
      4: "16px",
      5: "20px",
      6: "24px",
      8: "32px",
      10: "40px",
      12: "48px",
      16: "64px",
      20: "80px",
      24: "96px",
    },
    borderRadius: {
      none: "0px",
      sm: "2px",
      DEFAULT: "4px",
      md: "6px",
      lg: "8px",
      xl: "12px",
      "2xl": "16px",
      "3xl": "24px",
      full: "9999px",
    },
  };

  const generateCSS = () => {
    let css = ":root {\n";

    // Colors
    Object.entries(tokens.colors).forEach(([colorName, shades]) => {
      Object.entries(shades).forEach(([shade, value]) => {
        css += `  --color-${colorName}-${shade}: ${value};\n`;
      });
    });

    // Typography
    css += `\n  /* Typography */\n`;
    css += `  --font-heading: ${tokens.typography.fontFamily.heading};\n`;
    css += `  --font-body: ${tokens.typography.fontFamily.body};\n`;

    Object.entries(tokens.typography.fontSize).forEach(([size, value]) => {
      css += `  --font-size-${size}: ${value};\n`;
    });

    // Spacing
    css += `\n  /* Spacing */\n`;
    Object.entries(tokens.spacing).forEach(([size, value]) => {
      css += `  --spacing-${size}: ${value};\n`;
    });

    // Border Radius
    css += `\n  /* Border Radius */\n`;
    Object.entries(tokens.borderRadius).forEach(([size, value]) => {
      css += `  --radius-${size}: ${value};\n`;
    });

    css += "}";
    return css;
  };

  const generateJSON = () => {
    return JSON.stringify(tokens, null, 2);
  };

  const generateJS = () => {
    return `export const tokens = ${JSON.stringify(tokens, null, 2)}`;
  };

  const generateSCSS = () => {
    let scss = "";

    // Colors
    Object.entries(tokens.colors).forEach(([colorName, shades]) => {
      Object.entries(shades).forEach(([shade, value]) => {
        scss += `$color-${colorName}-${shade}: ${value};\n`;
      });
    });

    // Typography
    scss += `\n// Typography\n`;
    scss += `$font-heading: ${tokens.typography.fontFamily.heading};\n`;
    scss += `$font-body: ${tokens.typography.fontFamily.body};\n`;

    Object.entries(tokens.typography.fontSize).forEach(([size, value]) => {
      scss += `$font-size-${size}: ${value};\n`;
    });

    // Spacing
    scss += `\n// Spacing\n`;
    Object.entries(tokens.spacing).forEach(([size, value]) => {
      scss += `$spacing-${size}: ${value};\n`;
    });

    // Border Radius
    scss += `\n// Border Radius\n`;
    Object.entries(tokens.borderRadius).forEach(([size, value]) => {
      scss += `$radius-${size}: ${value};\n`;
    });

    return scss;
  };

  const getExportContent = () => {
    switch (exportFormat) {
      case "css":
        return generateCSS();
      case "json":
        return generateJSON();
      case "js":
        return generateJS();
      case "scss":
        return generateSCSS();
      default:
        return "";
    }
  };

  const exportContent = getExportContent();

  const downloadFile = () => {
    const blob = new Blob([exportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `design-tokens.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportContent);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Export Design Tokens</h1>
        <p className="mt-2 text-muted-foreground">
          Export your design tokens in various formats for use in your projects.
        </p>
      </div>

      <div className="mb-8">
        <label htmlFor="format" className="block text-sm font-medium mb-2">
          Export Format
        </label>
        <select
          id="format"
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="css">CSS Variables</option>
          <option value="scss">SCSS Variables</option>
          <option value="json">JSON</option>
          <option value="js">JavaScript</option>
        </select>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Preview</h2>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={downloadFile}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Download File
            </button>
          </div>
        </div>

        <pre className="overflow-x-auto rounded-lg border bg-muted p-4">
          <code className="text-sm">{exportContent}</code>
        </pre>
      </div>

      <div className="flex justify-between">
        <Link
          href="/spacing"
          className="inline-flex items-center rounded-md border border-input bg-background px-6 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground"
        >
          Back: Spacing & Radius
        </Link>
        <Link
          href="/"
          className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Start Over
        </Link>
      </div>
    </div>
  );
}
