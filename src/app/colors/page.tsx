"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useDesignTokens } from "@/lib/design-tokens-context";

export default function ColorsPage() {
  const { tokens, updateColors } = useDesignTokens();
  const [primaryColor, setPrimaryColor] = useState(tokens.colors.primaryColor);
  const [errorColor, setErrorColor] = useState(tokens.colors.errorColor);
  const [warningColor, setWarningColor] = useState(tokens.colors.warningColor);
  const [successColor, setSuccessColor] = useState(tokens.colors.successColor);

  const [foregroundHSBA, setForegroundHSBA] = useState(
    tokens.colors.foregroundHSBA,
  );
  const [backgroundHSBA, setBackgroundHSBA] = useState(
    tokens.colors.backgroundHSBA,
  );

  // Update colors when individual values change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateColors({
        backgroundHSBA,
        errorColor,
        foregroundHSBA,
        primaryColor,
        successColor,
        warningColor,
      });
    }, 300); // Debounce updates

    return () => clearTimeout(timeoutId);
  }, [
    primaryColor,
    errorColor,
    warningColor,
    successColor,
    foregroundHSBA,
    backgroundHSBA,
    updateColors,
  ]);

  const hexToHSB = (hex: string) => {
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const brightness = max;

    if (delta !== 0) {
      s = delta / max;

      if (max === r) {
        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
      } else if (max === g) {
        h = ((b - r) / delta + 2) / 6;
      } else {
        h = ((r - g) / delta + 4) / 6;
      }
    }

    return {
      b: Math.round(brightness * 100),
      h: Math.round(h * 360),
      s: Math.round(s * 100),
    };
  };

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

  const calculateContrastRatio = (
    fg: typeof foregroundHSBA,
    bg: typeof backgroundHSBA,
  ) => {
    const fgRGB = hsbToRGB(fg.h, fg.s, fg.b);
    const bgRGB = hsbToRGB(bg.h, bg.s, bg.b);

    const fgWithAlpha = {
      b: Math.round(fgRGB.b * fg.a + bgRGB.b * (1 - fg.a)),
      g: Math.round(fgRGB.g * fg.a + bgRGB.g * (1 - fg.a)),
      r: Math.round(fgRGB.r * fg.a + bgRGB.r * (1 - fg.a)),
    };

    const bgWithAlpha = {
      b: Math.round(bgRGB.b * bg.a + 255 * (1 - bg.a)),
      g: Math.round(bgRGB.g * bg.a + 255 * (1 - bg.a)),
      r: Math.round(bgRGB.r * bg.a + 255 * (1 - bg.a)),
    };

    const getLuminance = (rgb: { b: number; g: number; r: number }) => {
      const rsRGB = rgb.r / 255;
      const gsRGB = rgb.g / 255;
      const bsRGB = rgb.b / 255;

      const r =
        rsRGB <= 0.03928 ? rsRGB / 12.92 : ((rsRGB + 0.055) / 1.055) ** 2.4;
      const g =
        gsRGB <= 0.03928 ? gsRGB / 12.92 : ((gsRGB + 0.055) / 1.055) ** 2.4;
      const b =
        bsRGB <= 0.03928 ? bsRGB / 12.92 : ((bsRGB + 0.055) / 1.055) ** 2.4;

      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const l1 = getLuminance(fgWithAlpha);
    const l2 = getLuminance(bgWithAlpha);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  };

  const generateColorScale = (baseColor: string) => {
    const hex = baseColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const hsb = hexToHSB(baseColor);

    return [
      {
        color: `rgba(${r}, ${g}, ${b}, 1.00)`,
        contrast: "4.5:1",
        hsba: `hsba(${hsb.h}, ${hsb.s}%, ${hsb.b}%, 1.00)`,
        name: "Text",
        opacity: 1.0,
      },
      {
        color: `rgba(${r}, ${g}, ${b}, 0.80)`,
        contrast: "3:1",
        hsba: `hsba(${hsb.h}, ${hsb.s}%, ${hsb.b}%, 0.80)`,
        name: "Stroke strong",
        opacity: 0.8,
      },
      {
        color: `rgba(${r}, ${g}, ${b}, 0.20)`,
        contrast: "N/A",
        hsba: `hsba(${hsb.h}, ${hsb.s}%, ${hsb.b}%, 0.20)`,
        name: "Stroke weak",
        opacity: 0.2,
      },
      {
        color: `rgba(${r}, ${g}, ${b}, 0.05)`,
        contrast: "N/A",
        hsba: `hsba(${hsb.h}, ${hsb.s}%, ${hsb.b}%, 0.05)`,
        name: "Fill",
        opacity: 0.05,
      },
    ];
  };

  const primaryScale = generateColorScale(primaryColor);

  const monochromaticScale = [
    {
      a: 0.9,
      b: 15,
      contrast: "4.5:1",
      h: 230,
      hsba: "hsba(230, 100%, 15%, 0.90)",
      name: "Text strong",
      s: 100,
    },
    {
      a: 0.65,
      b: 20,
      contrast: "4.5:1",
      h: 230,
      hsba: "hsba(230, 100%, 20%, 0.65)",
      name: "Text weak",
      s: 100,
    },
    {
      a: 0.45,
      b: 30,
      contrast: "3:1",
      h: 230,
      hsba: "hsba(230, 100%, 30%, 0.45)",
      name: "Stroke strong",
      s: 100,
    },
    {
      a: 0.1,
      b: 40,
      contrast: "N/A",
      h: 230,
      hsba: "hsba(230, 100%, 40%, 0.10)",
      name: "Stroke weak",
      s: 100,
    },
    {
      a: 0.04,
      b: 50,
      contrast: "N/A",
      h: 230,
      hsba: "hsba(230, 100%, 50%, 0.04)",
      name: "Fill weak",
      s: 100,
    },
    {
      a: 0.02,
      b: 50,
      contrast: "N/A",
      h: 230,
      hsba: "hsba(230, 100%, 50%, 0.02)",
      name: "Fill weaker",
      s: 100,
    },
  ];

  const statusColors = {
    error: {
      baseColor: errorColor,
      name: "Error",
      scale: generateColorScale(errorColor),
    },
    success: {
      baseColor: successColor,
      name: "Success",
      scale: generateColorScale(successColor),
    },
    warning: {
      baseColor: warningColor,
      name: "Warning",
      scale: generateColorScale(warningColor),
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Brand Colors</h1>
        <p className="mt-2 text-muted-foreground">
          Select your primary and secondary brand colors to generate a complete
          color palette.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" htmlFor="primary">
              Primary Color
            </label>
            <div className="flex items-center gap-4">
              <input
                className="h-12 w-24 cursor-pointer rounded border"
                id="primary"
                onChange={(e) => setPrimaryColor(e.target.value)}
                type="color"
                value={primaryColor}
              />
              <input
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onChange={(e) => setPrimaryColor(e.target.value)}
                type="text"
                value={primaryColor}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Primary Color Scale</h3>
            {primaryScale.map(({ color, contrast, hsba, name }) => (
              <div className="flex items-center gap-4" key={name}>
                <div
                  className="h-10 w-20 rounded border"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium">{name}</span>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="font-mono">{hsba}</span>
                    <span>Contrast: {contrast}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-6">
            <h3 className="text-lg font-medium">Monochromatic Scale</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Fixed grey scale for neutral UI elements
            </p>
          </div>

          <div className="space-y-2">
            {monochromaticScale.map(({ a, b, contrast, h, hsba, name, s }) => (
              <div className="flex items-center gap-4" key={name}>
                <div
                  className="h-10 w-20 rounded border"
                  style={{
                    backgroundColor: (() => {
                      const rgb = hsbToRGB(h, s, b);
                      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
                    })(),
                  }}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium">{name}</span>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="font-mono">{hsba}</span>
                    <span>Contrast: {contrast}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Status Colors</h2>
          <p className="mt-2 text-muted-foreground">
            System colors used to indicate different statuses in your
            application.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-medium">Error</h3>
              <div className="mt-2 flex items-center gap-2">
                <input
                  className="h-12 w-24 cursor-pointer rounded border"
                  onChange={(e) => setErrorColor(e.target.value)}
                  type="color"
                  value={errorColor}
                />
                <input
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onChange={(e) => setErrorColor(e.target.value)}
                  type="text"
                  value={errorColor}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Color Scale</h4>
              {statusColors.error.scale.map(
                ({ color, contrast, hsba, name }) => (
                  <div className="flex items-center gap-3" key={name}>
                    <div
                      className="h-8 w-16 rounded border"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex-1">
                      <span className="text-sm">{name}</span>
                      <div className="flex flex-col text-xs text-muted-foreground">
                        <span className="font-mono">{hsba}</span>
                        <span>Contrast: {contrast}</span>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h3 className="text-lg font-medium">Warning</h3>
              <div className="mt-2 flex items-center gap-2">
                <input
                  className="h-12 w-24 cursor-pointer rounded border"
                  onChange={(e) => setWarningColor(e.target.value)}
                  type="color"
                  value={warningColor}
                />
                <input
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onChange={(e) => setWarningColor(e.target.value)}
                  type="text"
                  value={warningColor}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Color Scale</h4>
              {statusColors.warning.scale.map(
                ({ color, contrast, hsba, name }) => (
                  <div className="flex items-center gap-3" key={name}>
                    <div
                      className="h-8 w-16 rounded border"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex-1">
                      <span className="text-sm">{name}</span>
                      <div className="flex flex-col text-xs text-muted-foreground">
                        <span className="font-mono">{hsba}</span>
                        <span>Contrast: {contrast}</span>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h3 className="text-lg font-medium">Success</h3>
              <div className="mt-2 flex items-center gap-2">
                <input
                  className="h-12 w-24 cursor-pointer rounded border"
                  onChange={(e) => setSuccessColor(e.target.value)}
                  type="color"
                  value={successColor}
                />
                <input
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onChange={(e) => setSuccessColor(e.target.value)}
                  type="text"
                  value={successColor}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Color Scale</h4>
              {statusColors.success.scale.map(
                ({ color, contrast, hsba, name }) => (
                  <div className="flex items-center gap-3" key={name}>
                    <div
                      className="h-8 w-16 rounded border"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex-1">
                      <span className="text-sm">{name}</span>
                      <div className="flex flex-col text-xs text-muted-foreground">
                        <span className="font-mono">{hsba}</span>
                        <span>Contrast: {contrast}</span>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Contrast Checker</h2>
          <p className="mt-2 text-muted-foreground">
            Check the contrast ratio between foreground and background colors in
            HSBA format.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-medium">Foreground Color</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Hue (0-360)
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    max="360"
                    min="0"
                    onChange={(e) =>
                      setForegroundHSBA({
                        ...foregroundHSBA,
                        h: Number(e.target.value),
                      })
                    }
                    type="number"
                    value={foregroundHSBA.h}
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Saturation (0-100)
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    max="100"
                    min="0"
                    onChange={(e) =>
                      setForegroundHSBA({
                        ...foregroundHSBA,
                        s: Number(e.target.value),
                      })
                    }
                    type="number"
                    value={foregroundHSBA.s}
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brightness (0-100)
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    max="100"
                    min="0"
                    onChange={(e) =>
                      setForegroundHSBA({
                        ...foregroundHSBA,
                        b: Number(e.target.value),
                      })
                    }
                    type="number"
                    value={foregroundHSBA.b}
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Alpha (0-1)
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    max="1"
                    min="0"
                    onChange={(e) =>
                      setForegroundHSBA({
                        ...foregroundHSBA,
                        a: Number(e.target.value),
                      })
                    }
                    step="0.01"
                    type="number"
                    value={foregroundHSBA.a}
                  />
                </label>
              </div>
              <div className="mt-4">
                <div
                  className="h-20 w-full rounded border"
                  style={{
                    backgroundColor: (() => {
                      const rgb = hsbToRGB(
                        foregroundHSBA.h,
                        foregroundHSBA.s,
                        foregroundHSBA.b,
                      );
                      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${foregroundHSBA.a})`;
                    })(),
                  }}
                />
                <p className="mt-2 text-sm font-mono text-muted-foreground">
                  hsba({foregroundHSBA.h}, {foregroundHSBA.s}%,{" "}
                  {foregroundHSBA.b}%, {foregroundHSBA.a.toFixed(2)})
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Background Color</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Hue (0-360)
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    max="360"
                    min="0"
                    onChange={(e) =>
                      setBackgroundHSBA({
                        ...backgroundHSBA,
                        h: Number(e.target.value),
                      })
                    }
                    type="number"
                    value={backgroundHSBA.h}
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Saturation (0-100)
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    max="100"
                    min="0"
                    onChange={(e) =>
                      setBackgroundHSBA({
                        ...backgroundHSBA,
                        s: Number(e.target.value),
                      })
                    }
                    type="number"
                    value={backgroundHSBA.s}
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brightness (0-100)
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    max="100"
                    min="0"
                    onChange={(e) =>
                      setBackgroundHSBA({
                        ...backgroundHSBA,
                        b: Number(e.target.value),
                      })
                    }
                    type="number"
                    value={backgroundHSBA.b}
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Alpha (0-1)
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    max="1"
                    min="0"
                    onChange={(e) =>
                      setBackgroundHSBA({
                        ...backgroundHSBA,
                        a: Number(e.target.value),
                      })
                    }
                    step="0.01"
                    type="number"
                    value={backgroundHSBA.a}
                  />
                </label>
              </div>
              <div className="mt-4">
                <div
                  className="h-20 w-full rounded border"
                  style={{
                    backgroundColor: (() => {
                      const rgb = hsbToRGB(
                        backgroundHSBA.h,
                        backgroundHSBA.s,
                        backgroundHSBA.b,
                      );
                      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${backgroundHSBA.a})`;
                    })(),
                  }}
                />
                <p className="mt-2 text-sm font-mono text-muted-foreground">
                  hsba({backgroundHSBA.h}, {backgroundHSBA.s}%,{" "}
                  {backgroundHSBA.b}%, {backgroundHSBA.a.toFixed(2)})
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="rounded-lg border p-6">
            <h3 className="mb-4 text-lg font-medium">Contrast Results</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Contrast Ratio</span>
                <span className="text-2xl font-bold">
                  {calculateContrastRatio(
                    foregroundHSBA,
                    backgroundHSBA,
                  ).toFixed(2)}
                  :1
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">WCAG AA Normal Text (4.5:1)</span>
                  <span
                    className={`text-sm font-medium ${calculateContrastRatio(foregroundHSBA, backgroundHSBA) >= 4.5 ? "text-green-600" : "text-red-600"}`}
                  >
                    {calculateContrastRatio(foregroundHSBA, backgroundHSBA) >=
                    4.5
                      ? "✓ Pass"
                      : "✗ Fail"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">WCAG AA Large Text (3:1)</span>
                  <span
                    className={`text-sm font-medium ${calculateContrastRatio(foregroundHSBA, backgroundHSBA) >= 3 ? "text-green-600" : "text-red-600"}`}
                  >
                    {calculateContrastRatio(foregroundHSBA, backgroundHSBA) >= 3
                      ? "✓ Pass"
                      : "✗ Fail"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">WCAG AAA Normal Text (7:1)</span>
                  <span
                    className={`text-sm font-medium ${calculateContrastRatio(foregroundHSBA, backgroundHSBA) >= 7 ? "text-green-600" : "text-red-600"}`}
                  >
                    {calculateContrastRatio(foregroundHSBA, backgroundHSBA) >= 7
                      ? "✓ Pass"
                      : "✗ Fail"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">WCAG AAA Large Text (4.5:1)</span>
                  <span
                    className={`text-sm font-medium ${calculateContrastRatio(foregroundHSBA, backgroundHSBA) >= 4.5 ? "text-green-600" : "text-red-600"}`}
                  >
                    {calculateContrastRatio(foregroundHSBA, backgroundHSBA) >=
                    4.5
                      ? "✓ Pass"
                      : "✗ Fail"}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div
                  className="p-4 rounded text-center font-medium"
                  style={{
                    backgroundColor: (() => {
                      const rgb = hsbToRGB(
                        backgroundHSBA.h,
                        backgroundHSBA.s,
                        backgroundHSBA.b,
                      );
                      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${backgroundHSBA.a})`;
                    })(),
                    color: (() => {
                      const rgb = hsbToRGB(
                        foregroundHSBA.h,
                        foregroundHSBA.s,
                        foregroundHSBA.b,
                      );
                      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${foregroundHSBA.a})`;
                    })(),
                  }}
                >
                  Sample Text
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-end">
        <Link
          className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          href="/typography"
        >
          Next: Typography
        </Link>
      </div>
    </div>
  );
}
