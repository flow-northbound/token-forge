"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDesignTokens } from "@/lib/design-tokens-context";

const fontOptions = [
  // Sans-serif fonts
  { name: "Inter", value: "Inter, sans-serif", category: "Sans-serif" },
  { name: "Roboto", value: "Roboto, sans-serif", category: "Sans-serif" },
  {
    name: "Open Sans",
    value: "'Open Sans', sans-serif",
    category: "Sans-serif",
  },
  { name: "Lato", value: "Lato, sans-serif", category: "Sans-serif" },
  { name: "Poppins", value: "Poppins, sans-serif", category: "Sans-serif" },
  {
    name: "Montserrat",
    value: "Montserrat, sans-serif",
    category: "Sans-serif",
  },
  { name: "Raleway", value: "Raleway, sans-serif", category: "Sans-serif" },
  {
    name: "Source Sans Pro",
    value: "'Source Sans Pro', sans-serif",
    category: "Sans-serif",
  },
  { name: "Nunito", value: "Nunito, sans-serif", category: "Sans-serif" },
  {
    name: "Work Sans",
    value: "'Work Sans', sans-serif",
    category: "Sans-serif",
  },
  { name: "DM Sans", value: "'DM Sans', sans-serif", category: "Sans-serif" },
  { name: "Manrope", value: "Manrope, sans-serif", category: "Sans-serif" },
  {
    name: "Space Grotesk",
    value: "'Space Grotesk', sans-serif",
    category: "Sans-serif",
  },
  { name: "Outfit", value: "Outfit, sans-serif", category: "Sans-serif" },
  {
    name: "Plus Jakarta Sans",
    value: "'Plus Jakarta Sans', sans-serif",
    category: "Sans-serif",
  },
  { name: "Figtree", value: "Figtree, sans-serif", category: "Sans-serif" },
  { name: "Satoshi", value: "Satoshi, sans-serif", category: "Sans-serif" },
  { name: "Urbanist", value: "Urbanist, sans-serif", category: "Sans-serif" },
  { name: "Quicksand", value: "Quicksand, sans-serif", category: "Sans-serif" },

  // Serif fonts
  {
    name: "Playfair Display",
    value: "'Playfair Display', serif",
    category: "Serif",
  },
  { name: "Merriweather", value: "Merriweather, serif", category: "Serif" },
  { name: "Georgia", value: "Georgia, serif", category: "Serif" },
  { name: "Lora", value: "Lora, serif", category: "Serif" },
  { name: "Crimson Text", value: "'Crimson Text', serif", category: "Serif" },
  { name: "PT Serif", value: "'PT Serif', serif", category: "Serif" },
  { name: "Bitter", value: "Bitter, serif", category: "Serif" },
  {
    name: "Libre Baskerville",
    value: "'Libre Baskerville', serif",
    category: "Serif",
  },
  { name: "EB Garamond", value: "'EB Garamond', serif", category: "Serif" },
  { name: "Cormorant", value: "Cormorant, serif", category: "Serif" },

  // Display fonts
  { name: "Bebas Neue", value: "'Bebas Neue', display", category: "Display" },
  { name: "Righteous", value: "Righteous, display", category: "Display" },
  {
    name: "Alfa Slab One",
    value: "'Alfa Slab One', display",
    category: "Display",
  },
  {
    name: "Archivo Black",
    value: "'Archivo Black', display",
    category: "Display",
  },
  { name: "Passion One", value: "'Passion One', display", category: "Display" },

  // Monospace fonts
  {
    name: "Roboto Mono",
    value: "'Roboto Mono', monospace",
    category: "Monospace",
  },
  {
    name: "JetBrains Mono",
    value: "'JetBrains Mono', monospace",
    category: "Monospace",
  },
  {
    name: "Source Code Pro",
    value: "'Source Code Pro', monospace",
    category: "Monospace",
  },
  {
    name: "IBM Plex Mono",
    value: "'IBM Plex Mono', monospace",
    category: "Monospace",
  },
  { name: "Fira Code", value: "'Fira Code', monospace", category: "Monospace" },
  {
    name: "Space Mono",
    value: "'Space Mono', monospace",
    category: "Monospace",
  },
  {
    name: "Inconsolata",
    value: "Inconsolata, monospace",
    category: "Monospace",
  },

  // System fonts
  {
    name: "System UI",
    value: "system-ui, -apple-system, sans-serif",
    category: "System",
  },
  { name: "Arial", value: "Arial, sans-serif", category: "System" },
  { name: "Helvetica", value: "Helvetica, sans-serif", category: "System" },
  {
    name: "Times New Roman",
    value: "'Times New Roman', serif",
    category: "System",
  },
  {
    name: "Courier New",
    value: "'Courier New', monospace",
    category: "System",
  },
];

const typeScales = [
  { name: "Minor Third", ratio: 1.2 },
  { name: "Major Third", ratio: 1.25 },
  { name: "Perfect Fourth", ratio: 1.333 },
  { name: "Augmented Fourth", ratio: Math.SQRT2 },
  { name: "Perfect Fifth", ratio: 1.5 },
  { name: "Golden Ratio", ratio: 1.618 },
];

export default function TypographyPage() {
  const { tokens, updateTypography } = useDesignTokens();
  const [headingFont, setHeadingFont] = useState(tokens.typography.headingFont);
  const [bodyFont, setBodyFont] = useState(tokens.typography.bodyFont);
  const [baseSize, setBaseSize] = useState(tokens.typography.baseSize);
  const [typeScale, setTypeScale] = useState(tokens.typography.typeScale);
  const [baseLineHeight, setBaseLineHeight] = useState(
    tokens.typography.baseLineHeight,
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateTypography({
        headingFont,
        bodyFont,
        baseSize,
        typeScale,
        baseLineHeight,
      });
    }, 300); // Debounce updates

    return () => clearTimeout(timeoutId);
  }, [
    headingFont,
    bodyFont,
    baseSize,
    typeScale,
    baseLineHeight,
    updateTypography,
  ]);

  const generateSizes = () => {
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

  const calculateLineHeight = (fontSize: number) => {
    const minLineHeight = 1.0;
    const maxLineHeight = baseLineHeight;
    const minFontSize = sizes.xs;
    const maxFontSize = sizes.display;

    // Linear interpolation: larger fonts get smaller line heights
    const ratio = (fontSize - minFontSize) / (maxFontSize - minFontSize);
    const lineHeight = maxLineHeight - (maxLineHeight - minLineHeight) * ratio;

    return Math.round(lineHeight * 100) / 100;
  };

  const sizes = generateSizes();

  const sizesWithLineHeight = Object.entries(sizes).map(([key, fontSize]) => ({
    key,
    fontSize,
    lineHeight: calculateLineHeight(fontSize),
    lineHeightPx: Math.ceil(fontSize * calculateLineHeight(fontSize)),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Typography</h1>
        <p className="mt-2 text-muted-foreground">
          Choose fonts and define your typography scale for consistent text
          styling.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <div>
            <label
              htmlFor="heading-font"
              className="block text-sm font-medium mb-2"
            >
              Heading Font
            </label>
            <select
              id="heading-font"
              value={headingFont}
              onChange={(e) => setHeadingFont(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {fontOptions.map((font) => (
                <option key={font.name} value={font.value}>
                  {font.name} ({font.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="body-font"
              className="block text-sm font-medium mb-2"
            >
              Body Font
            </label>
            <select
              id="body-font"
              value={bodyFont}
              onChange={(e) => setBodyFont(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {fontOptions.map((font) => (
                <option key={font.name} value={font.value}>
                  {font.name} ({font.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="base-size"
              className="block text-sm font-medium mb-2"
            >
              Base Font Size (px)
            </label>
            <input
              type="number"
              id="base-size"
              value={baseSize}
              onChange={(e) => setBaseSize(Number(e.target.value))}
              min="12"
              max="20"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div>
            <label
              htmlFor="type-scale"
              className="block text-sm font-medium mb-2"
            >
              Type Scale
            </label>
            <select
              id="type-scale"
              value={typeScale}
              onChange={(e) => setTypeScale(Number(e.target.value))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {typeScales.map((scale) => (
                <option key={scale.name} value={scale.ratio}>
                  {scale.name} ({scale.ratio})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="line-height"
              className="block text-sm font-medium mb-2"
            >
              Base Line Height
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                id="line-height"
                value={baseLineHeight}
                onChange={(e) => setBaseLineHeight(Number(e.target.value))}
                min="1"
                max="2"
                step="0.05"
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={baseLineHeight}
                  onChange={(e) => setBaseLineHeight(Number(e.target.value))}
                  min="1"
                  max="2"
                  step="0.05"
                  className="w-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <span className="text-sm text-muted-foreground">
                  ({Math.round(baseLineHeight * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-medium">Preview</h3>

          <div className="space-y-4 rounded-lg border p-6">
            {sizesWithLineHeight
              .slice()
              .reverse()
              .map((item) => {
                const isHeading = ["h1", "h2", "h3", "h4", "display"].includes(
                  item.key,
                );
                const font = isHeading ? headingFont : bodyFont;
                const text = {
                  display: "Display",
                  h1: "Heading 1",
                  h2: "Heading 2",
                  h3: "Heading 3",
                  h4: "Heading 4",
                  lg: "Large text - Lorem ipsum dolor sit amet.",
                  base: "Body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                  sm: "Body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                  xs: "Small text - Lorem ipsum dolor sit amet.",
                }[item.key];

                return (
                  <div
                    key={item.key}
                    style={{
                      fontFamily: font,
                      fontSize: `${item.fontSize}px`,
                      lineHeight: item.lineHeight,
                    }}
                  >
                    {text}
                  </div>
                );
              })}
          </div>

          <div className="rounded-lg border p-4">
            <h4 className="mb-3 text-sm font-medium">Typography Scale</h4>
            <div className="overflow-hidden rounded border">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Size</th>
                    <th className="px-3 py-2 text-right font-medium">
                      Font Size
                    </th>
                    <th className="px-3 py-2 text-right font-medium">
                      Line Height
                    </th>
                    <th className="px-3 py-2 text-right font-medium">
                      Line Height (px)
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {sizesWithLineHeight
                    .slice()
                    .reverse()
                    .map((item, index) => (
                      <tr
                        key={item.key}
                        className={index % 2 === 0 ? "bg-muted/20" : ""}
                      >
                        <td className="px-3 py-2 text-muted-foreground">
                          {item.key}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {item.fontSize}px
                        </td>
                        <td className="px-3 py-2 text-right">
                          {item.lineHeight}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {item.lineHeightPx}px
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-between">
        <Link
          href="/colors"
          className="inline-flex items-center rounded-md border border-input bg-background px-6 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground"
        >
          Back: Colors
        </Link>
        <Link
          href="/spacing"
          className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Next: Spacing & Radius
        </Link>
      </div>
    </div>
  );
}
