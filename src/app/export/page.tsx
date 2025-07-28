"use client";

import Link from "next/link";
import { useState } from "react";
import { useDesignTokens } from "@/lib/design-tokens-context";

export default function ExportPage() {
  const [exportFormat, setExportFormat] = useState("css");
  const { tokens } = useDesignTokens();

  // Helper functions to convert HSB to RGB
  const hsbToRGB = (h: number, s: number, b: number) => {
    const hNorm = h / 360;
    const sNorm = s / 100;
    const bNorm = b / 100;

    const c = bNorm * sNorm;
    const x = c * (1 - Math.abs(((hNorm * 6) % 2) - 1));
    const m = bNorm - c;

    let r = 0,
      g = 0,
      b_rgb = 0;

    if (hNorm < 1 / 6) {
      r = c;
      g = x;
      b_rgb = 0;
    } else if (hNorm < 2 / 6) {
      r = x;
      g = c;
      b_rgb = 0;
    } else if (hNorm < 3 / 6) {
      r = 0;
      g = c;
      b_rgb = x;
    } else if (hNorm < 4 / 6) {
      r = 0;
      g = x;
      b_rgb = c;
    } else if (hNorm < 5 / 6) {
      r = x;
      g = 0;
      b_rgb = c;
    } else {
      r = c;
      g = 0;
      b_rgb = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b_rgb + m) * 255),
    };
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Generate font sizes based on type scale
  const generateFontSizes = () => {
    const { baseSize, typeScale } = tokens.typography;
    return {
      xs: Math.ceil(baseSize / typeScale),
      sm: baseSize, // base size
      base: baseSize, // same as sm
      lg: Math.ceil(baseSize * typeScale),
      h4: Math.ceil(baseSize * typeScale * typeScale),
      h3: Math.ceil(baseSize * Math.pow(typeScale, 3)),
      h2: Math.ceil(baseSize * Math.pow(typeScale, 4)),
      h1: Math.ceil(baseSize * Math.pow(typeScale, 5)),
      display: Math.ceil(baseSize * Math.pow(typeScale, 6)),
    };
  };

  // Generate spacing values
  const generateSpacing = () => {
    const { baseSpacing, spacingScale } = tokens.spacing;
    if (spacingScale === 1.618) {
      // Fibonacci sequence
      const fib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
      return {
        0: 0,
        0.5: baseSpacing / 2,
        1: baseSpacing,
        2: baseSpacing * fib[3],
        3: baseSpacing * fib[4],
        4: baseSpacing * fib[5],
        5: baseSpacing * fib[6],
        6: baseSpacing * fib[7],
        8: baseSpacing * fib[8],
        10: baseSpacing * fib[9],
      };
    } else {
      // Linear or Material scale
      return {
        0: 0,
        0.5: baseSpacing * 0.5,
        1: baseSpacing,
        2: baseSpacing * 2,
        3: baseSpacing * 3,
        4: baseSpacing * 4,
        5: baseSpacing * 5,
        6: baseSpacing * 6,
        8: baseSpacing * 8,
        10: baseSpacing * 10,
        12: baseSpacing * 12,
        16: baseSpacing * 16,
        20: baseSpacing * 20,
        24: baseSpacing * 24,
      };
    }
  };

  // Generate radius values
  const generateRadius = () => {
    const { baseRadius } = tokens.spacing;
    return {
      none: 0,
      sm: baseRadius / 2,
      DEFAULT: baseRadius,
      md: baseRadius * 1.5,
      lg: baseRadius * 2,
      xl: baseRadius * 3,
      "2xl": baseRadius * 4,
      "3xl": baseRadius * 6,
      full: 9999,
    };
  };

  // Generate color scale from a base color
  const generateColorScale = (baseColor: string) => {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return {};

    return {
      text: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1.00)`,
      "stroke-strong": `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.80)`,
      "stroke-weak": `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.20)`,
      fill: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`,
    };
  };

  // Generate monochromatic scale
  const generateMonochromaticScale = () => {
    const scale = [
      { name: "text-strong", h: 230, s: 100, b: 15, a: 0.9 },
      { name: "text-weak", h: 230, s: 100, b: 20, a: 0.65 },
      { name: "stroke-strong", h: 230, s: 100, b: 30, a: 0.45 },
      { name: "stroke-weak", h: 230, s: 100, b: 40, a: 0.1 },
      { name: "fill-weak", h: 230, s: 100, b: 50, a: 0.04 },
      { name: "fill-weaker", h: 230, s: 100, b: 50, a: 0.02 },
    ];

    const result: Record<string, string> = {};
    scale.forEach((item) => {
      const rgb = hsbToRGB(item.h, item.s, item.b);
      result[item.name] = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${item.a})`;
    });
    return result;
  };

  // Generate semantic tokens following [element-tone-emphasis-state] structure
  const generateSemanticTokens = () => {
    const monoScale = generateMonochromaticScale();
    const primaryRgb = hexToRgb(tokens.colors.primaryColor);
    const errorRgb = hexToRgb(tokens.colors.errorColor);
    const warningRgb = hexToRgb(tokens.colors.warningColor);
    const successRgb = hexToRgb(tokens.colors.successColor);

    const semanticTokens: Record<string, string> = {
      // Text tokens
      "text-strong": monoScale["text-strong"],
      "text-weak": monoScale["text-weak"],
      "text-brand": primaryRgb ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 1)` : tokens.colors.primaryColor,
      "text-disabled": `rgba(150, 150, 150, 0.5)`, // Medium gray with moderate opacity
      "text-error": errorRgb ? `rgba(${errorRgb.r}, ${errorRgb.g}, ${errorRgb.b}, 1)` : tokens.colors.errorColor,
      "text-warning": warningRgb ? `rgba(${warningRgb.r}, ${warningRgb.g}, ${warningRgb.b}, 1)` : tokens.colors.warningColor,
      "text-success": successRgb ? `rgba(${successRgb.r}, ${successRgb.g}, ${successRgb.b}, 1)` : tokens.colors.successColor,
      
      // Background tokens
      "bg-base": `rgba(255, 255, 255, 1)`,
      "bg-subtle": `rgba(250, 250, 250, 1)`,
      "bg-brand": primaryRgb ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.05)` : tokens.colors.primaryColor,
      "bg-brand-strong": primaryRgb ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 1)` : tokens.colors.primaryColor,
      "bg-error": errorRgb ? `rgba(${errorRgb.r}, ${errorRgb.g}, ${errorRgb.b}, 0.05)` : tokens.colors.errorColor,
      "bg-warning": warningRgb ? `rgba(${warningRgb.r}, ${warningRgb.g}, ${warningRgb.b}, 0.05)` : tokens.colors.warningColor,
      "bg-success": successRgb ? `rgba(${successRgb.r}, ${successRgb.g}, ${successRgb.b}, 0.05)` : tokens.colors.successColor,
      
      // Stroke tokens
      "stroke-strong": monoScale["stroke-strong"],
      "stroke-weak": monoScale["stroke-weak"],
      "stroke-selected": primaryRgb ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.8)` : tokens.colors.primaryColor,
      "stroke-focus": primaryRgb ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5)` : tokens.colors.primaryColor,
      "stroke-disabled": `rgba(200, 200, 200, 0.3)`,
      
      // Stroke with brand emphasis
      "stroke-brand-weak": primaryRgb ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2)` : tokens.colors.primaryColor,
      "stroke-brand-medium": primaryRgb ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5)` : tokens.colors.primaryColor,
      "stroke-brand-strong": primaryRgb ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.8)` : tokens.colors.primaryColor,
      
      // Stroke with error emphasis
      "stroke-error-weak": errorRgb ? `rgba(${errorRgb.r}, ${errorRgb.g}, ${errorRgb.b}, 0.2)` : tokens.colors.errorColor,
      "stroke-error-medium": errorRgb ? `rgba(${errorRgb.r}, ${errorRgb.g}, ${errorRgb.b}, 0.5)` : tokens.colors.errorColor,
      "stroke-error-strong": errorRgb ? `rgba(${errorRgb.r}, ${errorRgb.g}, ${errorRgb.b}, 0.8)` : tokens.colors.errorColor,
      
      // Stroke with warning emphasis
      "stroke-warning-weak": warningRgb ? `rgba(${warningRgb.r}, ${warningRgb.g}, ${warningRgb.b}, 0.2)` : tokens.colors.warningColor,
      "stroke-warning-medium": warningRgb ? `rgba(${warningRgb.r}, ${warningRgb.g}, ${warningRgb.b}, 0.5)` : tokens.colors.warningColor,
      "stroke-warning-strong": warningRgb ? `rgba(${warningRgb.r}, ${warningRgb.g}, ${warningRgb.b}, 0.8)` : tokens.colors.warningColor,
      
      // Stroke with success emphasis
      "stroke-success-weak": successRgb ? `rgba(${successRgb.r}, ${successRgb.g}, ${successRgb.b}, 0.2)` : tokens.colors.successColor,
      "stroke-success-medium": successRgb ? `rgba(${successRgb.r}, ${successRgb.g}, ${successRgb.b}, 0.5)` : tokens.colors.successColor,
      "stroke-success-strong": successRgb ? `rgba(${successRgb.r}, ${successRgb.g}, ${successRgb.b}, 0.8)` : tokens.colors.successColor,
      
      // Border tokens (legacy naming for compatibility)
      "border-base": monoScale["stroke-weak"],
      "border-strong": monoScale["stroke-strong"],
      "border-brand": primaryRgb ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2)` : tokens.colors.primaryColor,
      "border-error": errorRgb ? `rgba(${errorRgb.r}, ${errorRgb.g}, ${errorRgb.b}, 0.2)` : tokens.colors.errorColor,
      "border-warning": warningRgb ? `rgba(${warningRgb.r}, ${warningRgb.g}, ${warningRgb.b}, 0.2)` : tokens.colors.warningColor,
      "border-success": successRgb ? `rgba(${successRgb.r}, ${successRgb.g}, ${successRgb.b}, 0.2)` : tokens.colors.successColor,
      
      // Interactive states
      "text-brand-hover": primaryRgb ? `rgba(${Math.max(0, primaryRgb.r - 30)}, ${Math.max(0, primaryRgb.g - 30)}, ${Math.max(0, primaryRgb.b - 30)}, 1)` : tokens.colors.primaryColor,
      "bg-hover": `rgba(0, 0, 0, 0.02)`,
      "bg-active": `rgba(0, 0, 0, 0.04)`,
      "border-focus": primaryRgb ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5)` : tokens.colors.primaryColor,
    };

    return semanticTokens;
  };

  const generateCSS = () => {
    let css = ":root {\n";

    // Colors
    css += "  /* Brand Colors */\n";
    const primaryScale = generateColorScale(tokens.colors.primaryColor);
    Object.entries(primaryScale).forEach(([key, value]) => {
      css += `  --color-primary-${key}: ${value};\n`;
    });

    css += "\n  /* Status Colors */\n";
    const errorScale = generateColorScale(tokens.colors.errorColor);
    Object.entries(errorScale).forEach(([key, value]) => {
      css += `  --color-error-${key}: ${value};\n`;
    });

    const warningScale = generateColorScale(tokens.colors.warningColor);
    Object.entries(warningScale).forEach(([key, value]) => {
      css += `  --color-warning-${key}: ${value};\n`;
    });

    const successScale = generateColorScale(tokens.colors.successColor);
    Object.entries(successScale).forEach(([key, value]) => {
      css += `  --color-success-${key}: ${value};\n`;
    });

    css += "\n  /* Monochromatic Scale */\n";
    const monoScale = generateMonochromaticScale();
    Object.entries(monoScale).forEach(([key, value]) => {
      css += `  --color-mono-${key}: ${value};\n`;
    });

    css += "\n  /* Semantic Tokens */\n";
    const semanticTokens = generateSemanticTokens();
    Object.entries(semanticTokens).forEach(([key, value]) => {
      css += `  --${key}: ${value};\n`;
    });

    // Typography
    css += `\n  /* Typography */\n`;
    css += `  --font-heading: ${tokens.typography.headingFont};\n`;
    css += `  --font-body: ${tokens.typography.bodyFont};\n`;
    css += `  --line-height-base: ${tokens.typography.baseLineHeight};\n`;

    const fontSizes = generateFontSizes();
    Object.entries(fontSizes).forEach(([size, value]) => {
      css += `  --font-size-${size}: ${value}px;\n`;
    });

    // Spacing
    css += `\n  /* Spacing */\n`;
    const spacing = generateSpacing();
    Object.entries(spacing).forEach(([size, value]) => {
      css += `  --spacing-${size}: ${value}px;\n`;
    });

    // Border Radius
    css += `\n  /* Border Radius */\n`;
    const radius = generateRadius();
    Object.entries(radius).forEach(([size, value]) => {
      css += `  --radius-${size}: ${value}px;\n`;
    });

    css += "}";
    return css;
  };

  const generateJSON = () => {
    const fontSizes = generateFontSizes();
    const spacing = generateSpacing();
    const radius = generateRadius();

    const exportData = {
      colors: {
        primary: {
          base: tokens.colors.primaryColor,
          scale: generateColorScale(tokens.colors.primaryColor),
        },
        error: {
          base: tokens.colors.errorColor,
          scale: generateColorScale(tokens.colors.errorColor),
        },
        warning: {
          base: tokens.colors.warningColor,
          scale: generateColorScale(tokens.colors.warningColor),
        },
        success: {
          base: tokens.colors.successColor,
          scale: generateColorScale(tokens.colors.successColor),
        },
        monochromatic: generateMonochromaticScale(),
        semantic: generateSemanticTokens(),
      },
      typography: {
        fonts: {
          heading: tokens.typography.headingFont,
          body: tokens.typography.bodyFont,
        },
        sizes: fontSizes,
        lineHeight: {
          base: tokens.typography.baseLineHeight,
        },
      },
      spacing: spacing,
      borderRadius: radius,
    };

    return JSON.stringify(exportData, null, 2);
  };

  const generateJS = () => {
    return `export const tokens = ${generateJSON()}`;
  };

  const generateSCSS = () => {
    let scss = "";

    // Colors
    scss += "// Brand Colors\n";
    const primaryScale = generateColorScale(tokens.colors.primaryColor);
    Object.entries(primaryScale).forEach(([key, value]) => {
      scss += `$color-primary-${key}: ${value};\n`;
    });

    scss += "\n// Status Colors\n";
    const errorScale = generateColorScale(tokens.colors.errorColor);
    Object.entries(errorScale).forEach(([key, value]) => {
      scss += `$color-error-${key}: ${value};\n`;
    });

    const warningScale = generateColorScale(tokens.colors.warningColor);
    Object.entries(warningScale).forEach(([key, value]) => {
      scss += `$color-warning-${key}: ${value};\n`;
    });

    const successScale = generateColorScale(tokens.colors.successColor);
    Object.entries(successScale).forEach(([key, value]) => {
      scss += `$color-success-${key}: ${value};\n`;
    });

    scss += "\n// Monochromatic Scale\n";
    const monoScale = generateMonochromaticScale();
    Object.entries(monoScale).forEach(([key, value]) => {
      scss += `$color-mono-${key}: ${value};\n`;
    });

    scss += "\n// Semantic Tokens\n";
    const semanticTokens = generateSemanticTokens();
    Object.entries(semanticTokens).forEach(([key, value]) => {
      scss += `$${key}: ${value};\n`;
    });

    // Typography
    scss += `\n// Typography\n`;
    scss += `$font-heading: ${tokens.typography.headingFont};\n`;
    scss += `$font-body: ${tokens.typography.bodyFont};\n`;
    scss += `$line-height-base: ${tokens.typography.baseLineHeight};\n`;

    const fontSizes = generateFontSizes();
    Object.entries(fontSizes).forEach(([size, value]) => {
      scss += `$font-size-${size}: ${value}px;\n`;
    });

    // Spacing
    scss += `\n// Spacing\n`;
    const spacing = generateSpacing();
    Object.entries(spacing).forEach(([size, value]) => {
      scss += `$spacing-${size}: ${value}px;\n`;
    });

    // Border Radius
    scss += `\n// Border Radius\n`;
    const radius = generateRadius();
    Object.entries(radius).forEach(([size, value]) => {
      scss += `$radius-${size}: ${value}px;\n`;
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
              type="button"
              onClick={copyToClipboard}
              className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Copy to Clipboard
            </button>
            <button
              type="button"
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
