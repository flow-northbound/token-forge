"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDesignTokens } from "@/lib/design-tokens-context";

export default function ExportPage() {
  const [exportFormat, setExportFormat] = useState("css");
  const [copied, setCopied] = useState(false);
  const { tokens } = useDesignTokens();

  // Helper functions to convert HSB to RGB
  const hsbToRGB = (h: number, s: number, b: number) => {
    const hNorm = h / 360;
    const sNorm = s / 100;
    const bNorm = b / 100;

    const c = bNorm * sNorm;
    const x = c * (1 - Math.abs(((hNorm * 6) % 2) - 1));
    const m = bNorm - c;

    let b_rgb = 0,
      g = 0,
      r = 0;

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
      b: Math.round((b_rgb + m) * 255),
      g: Math.round((g + m) * 255),
      r: Math.round((r + m) * 255),
    };
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          b: parseInt(result[3], 16),
          g: parseInt(result[2], 16),
          r: parseInt(result[1], 16),
        }
      : null;
  };

  // Generate font sizes based on type scale
  const generateFontSizes = () => {
    const { baseSize, typeScale } = tokens.typography;
    return {
      base: baseSize, // same as sm
      display: Math.ceil(baseSize * typeScale ** 6),
      h1: Math.ceil(baseSize * typeScale ** 5),
      h2: Math.ceil(baseSize * typeScale ** 4),
      h3: Math.ceil(baseSize * typeScale ** 3),
      h4: Math.ceil(baseSize * typeScale * typeScale),
      lg: Math.ceil(baseSize * typeScale),
      sm: baseSize, // base size
      xs: Math.ceil(baseSize / typeScale),
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
      "2xl": baseRadius * 4,
      "3xl": baseRadius * 6,
      DEFAULT: baseRadius,
      full: 9999,
      lg: baseRadius * 2,
      md: baseRadius * 1.5,
      none: 0,
      sm: baseRadius / 2,
      xl: baseRadius * 3,
    };
  };

  // Generate color scale from a base color
  const generateColorScale = (baseColor: string) => {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return {};

    return {
      fill: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`,
      "stroke-strong": `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.80)`,
      "stroke-weak": `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.20)`,
      text: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1.00)`,
    };
  };

  // Generate monochromatic scale
  const generateMonochromaticScale = () => {
    const scale = [
      { a: 0.9, b: 15, h: 230, name: "text-strong", s: 100 },
      { a: 0.65, b: 20, h: 230, name: "text-weak", s: 100 },
      { a: 0.45, b: 30, h: 230, name: "stroke-strong", s: 100 },
      { a: 0.1, b: 40, h: 230, name: "stroke-weak", s: 100 },
      { a: 0.04, b: 50, h: 230, name: "fill-weak", s: 100 },
      { a: 0.02, b: 50, h: 230, name: "fill-weaker", s: 100 },
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
      "bg-active": `rgba(0, 0, 0, 0.04)`,
      // Background tokens
      "bg-base": `rgba(255, 255, 255, 1)`,
      "bg-brand": primaryRgb
        ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.05)`
        : tokens.colors.primaryColor,
      "bg-brand-strong": primaryRgb
        ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 1)`
        : tokens.colors.primaryColor,
      "bg-error": errorRgb
        ? `rgba(${errorRgb.r}, ${errorRgb.g}, ${errorRgb.b}, 0.05)`
        : tokens.colors.errorColor,
      "bg-hover": `rgba(0, 0, 0, 0.02)`,
      "bg-subtle": `rgba(250, 250, 250, 1)`,

      "bg-success": successRgb
        ? `rgba(${successRgb.r}, ${successRgb.g}, ${successRgb.b}, 0.05)`
        : tokens.colors.successColor,
      "bg-warning": warningRgb
        ? `rgba(${warningRgb.r}, ${warningRgb.g}, ${warningRgb.b}, 0.05)`
        : tokens.colors.warningColor,
      // Border tokens (legacy naming for compatibility)
      "border-base": monoScale["stroke-weak"],
      "border-brand": primaryRgb
        ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2)`
        : tokens.colors.primaryColor,
      "border-error": errorRgb
        ? `rgba(${errorRgb.r}, ${errorRgb.g}, ${errorRgb.b}, 0.2)`
        : tokens.colors.errorColor,
      "border-focus": primaryRgb
        ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5)`
        : tokens.colors.primaryColor,
      "border-strong": monoScale["stroke-strong"],

      "border-success": successRgb
        ? `rgba(${successRgb.r}, ${successRgb.g}, ${successRgb.b}, 0.2)`
        : tokens.colors.successColor,
      "border-warning": warningRgb
        ? `rgba(${warningRgb.r}, ${warningRgb.g}, ${warningRgb.b}, 0.2)`
        : tokens.colors.warningColor,
      "stroke-brand-medium": primaryRgb
        ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5)`
        : tokens.colors.primaryColor,
      "stroke-brand-strong": primaryRgb
        ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.8)`
        : tokens.colors.primaryColor,
      // Stroke with brand emphasis
      "stroke-brand-weak": primaryRgb
        ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2)`
        : tokens.colors.primaryColor,

      "stroke-disabled": `rgba(200, 200, 200, 0.3)`,
      "stroke-error-medium": errorRgb
        ? `rgba(${errorRgb.r}, ${errorRgb.g}, ${errorRgb.b}, 0.5)`
        : tokens.colors.errorColor,
      "stroke-error-strong": errorRgb
        ? `rgba(${errorRgb.r}, ${errorRgb.g}, ${errorRgb.b}, 0.8)`
        : tokens.colors.errorColor,

      // Stroke with error emphasis
      "stroke-error-weak": errorRgb
        ? `rgba(${errorRgb.r}, ${errorRgb.g}, ${errorRgb.b}, 0.2)`
        : tokens.colors.errorColor,
      "stroke-focus": primaryRgb
        ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5)`
        : tokens.colors.primaryColor,
      "stroke-selected": primaryRgb
        ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.8)`
        : tokens.colors.primaryColor,

      // Stroke tokens
      "stroke-strong": monoScale["stroke-strong"],
      "stroke-success-medium": successRgb
        ? `rgba(${successRgb.r}, ${successRgb.g}, ${successRgb.b}, 0.5)`
        : tokens.colors.successColor,
      "stroke-success-strong": successRgb
        ? `rgba(${successRgb.r}, ${successRgb.g}, ${successRgb.b}, 0.8)`
        : tokens.colors.successColor,

      // Stroke with success emphasis
      "stroke-success-weak": successRgb
        ? `rgba(${successRgb.r}, ${successRgb.g}, ${successRgb.b}, 0.2)`
        : tokens.colors.successColor,
      "stroke-warning-medium": warningRgb
        ? `rgba(${warningRgb.r}, ${warningRgb.g}, ${warningRgb.b}, 0.5)`
        : tokens.colors.warningColor,
      "stroke-warning-strong": warningRgb
        ? `rgba(${warningRgb.r}, ${warningRgb.g}, ${warningRgb.b}, 0.8)`
        : tokens.colors.warningColor,

      // Stroke with warning emphasis
      "stroke-warning-weak": warningRgb
        ? `rgba(${warningRgb.r}, ${warningRgb.g}, ${warningRgb.b}, 0.2)`
        : tokens.colors.warningColor,
      "stroke-weak": monoScale["stroke-weak"],
      "text-brand": primaryRgb
        ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 1)`
        : tokens.colors.primaryColor,
      // Interactive states
      "text-brand-hover": primaryRgb
        ? `rgba(${Math.max(0, primaryRgb.r - 30)}, ${Math.max(0, primaryRgb.g - 30)}, ${Math.max(0, primaryRgb.b - 30)}, 1)`
        : tokens.colors.primaryColor,
      "text-disabled": `rgba(150, 150, 150, 0.5)`, // Medium gray with moderate opacity
      "text-error": errorRgb
        ? `rgba(${errorRgb.r}, ${errorRgb.g}, ${errorRgb.b}, 1)`
        : tokens.colors.errorColor,

      // Text tokens
      "text-strong": monoScale["text-strong"],
      "text-success": successRgb
        ? `rgba(${successRgb.r}, ${successRgb.g}, ${successRgb.b}, 1)`
        : tokens.colors.successColor,
      "text-warning": warningRgb
        ? `rgba(${warningRgb.r}, ${warningRgb.g}, ${warningRgb.b}, 1)`
        : tokens.colors.warningColor,
      "text-weak": monoScale["text-weak"],
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
      borderRadius: radius,
      colors: {
        error: {
          base: tokens.colors.errorColor,
          scale: generateColorScale(tokens.colors.errorColor),
        },
        monochromatic: generateMonochromaticScale(),
        primary: {
          base: tokens.colors.primaryColor,
          scale: generateColorScale(tokens.colors.primaryColor),
        },
        semantic: generateSemanticTokens(),
        success: {
          base: tokens.colors.successColor,
          scale: generateColorScale(tokens.colors.successColor),
        },
        warning: {
          base: tokens.colors.warningColor,
          scale: generateColorScale(tokens.colors.warningColor),
        },
      },
      spacing: spacing,
      typography: {
        fonts: {
          body: tokens.typography.bodyFont,
          heading: tokens.typography.headingFont,
        },
        lineHeight: {
          base: tokens.typography.baseLineHeight,
        },
        sizes: fontSizes,
      },
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
      case "js":
        return generateJS();
      case "json":
        return generateJSON();
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <label className="block text-sm font-medium mb-2" htmlFor="format">
          Export Format
        </label>
        <select
          className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          id="format"
          onChange={(e) => setExportFormat(e.target.value)}
          value={exportFormat}
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
            <Tooltip open={copied}>
              <TooltipTrigger asChild>
                <button
                  className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  onClick={copyToClipboard}
                  type="button"
                >
                  Copy to Clipboard
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copied!</p>
              </TooltipContent>
            </Tooltip>
            <button
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
              onClick={downloadFile}
              type="button"
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
          className="inline-flex items-center rounded-md border border-input bg-background px-6 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground"
          href="/spacing"
        >
          Back: Spacing & Radius
        </Link>
        <Link
          className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          href="/"
        >
          Start Over
        </Link>
      </div>
    </div>
  );
}
