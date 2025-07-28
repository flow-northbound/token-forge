"use client";

import Link from "next/link";
import { useState } from "react";

export default function ColorsPage() {
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [errorColor, setErrorColor] = useState("#dc2626");
  const [warningColor, setWarningColor] = useState("#f59e0b");
  const [successColor, setSuccessColor] = useState("#16a34a");
  const [foregroundHSBA, setForegroundHSBA] = useState({
    h: 0,
    s: 0,
    b: 0,
    a: 1,
  });
  const [backgroundHSBA, setBackgroundHSBA] = useState({
    h: 0,
    s: 0,
    b: 100,
    a: 1,
  });

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
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      b: Math.round(brightness * 100),
    };
  };

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

  const calculateContrastRatio = (
    fg: typeof foregroundHSBA,
    bg: typeof backgroundHSBA,
  ) => {
    const fgRGB = hsbToRGB(fg.h, fg.s, fg.b);
    const bgRGB = hsbToRGB(bg.h, bg.s, bg.b);

    const fgWithAlpha = {
      r: Math.round(fgRGB.r * fg.a + bgRGB.r * (1 - fg.a)),
      g: Math.round(fgRGB.g * fg.a + bgRGB.g * (1 - fg.a)),
      b: Math.round(fgRGB.b * fg.a + bgRGB.b * (1 - fg.a)),
    };

    const bgWithAlpha = {
      r: Math.round(bgRGB.r * bg.a + 255 * (1 - bg.a)),
      g: Math.round(bgRGB.g * bg.a + 255 * (1 - bg.a)),
      b: Math.round(bgRGB.b * bg.a + 255 * (1 - bg.a)),
    };

    const getLuminance = (rgb: { r: number; g: number; b: number }) => {
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
        name: "Text",
        opacity: 1.0,
        color: `rgba(${r}, ${g}, ${b}, 1.00)`,
        hsba: `hsba(${hsb.h}, ${hsb.s}%, ${hsb.b}%, 1.00)`,
        contrast: "4.5:1",
      },
      {
        name: "Stroke strong",
        opacity: 0.8,
        color: `rgba(${r}, ${g}, ${b}, 0.80)`,
        hsba: `hsba(${hsb.h}, ${hsb.s}%, ${hsb.b}%, 0.80)`,
        contrast: "3:1",
      },
      {
        name: "Stroke weak",
        opacity: 0.2,
        color: `rgba(${r}, ${g}, ${b}, 0.20)`,
        hsba: `hsba(${hsb.h}, ${hsb.s}%, ${hsb.b}%, 0.20)`,
        contrast: "N/A",
      },
      {
        name: "Fill",
        opacity: 0.05,
        color: `rgba(${r}, ${g}, ${b}, 0.05)`,
        hsba: `hsba(${hsb.h}, ${hsb.s}%, ${hsb.b}%, 0.05)`,
        contrast: "N/A",
      },
    ];
  };

  const primaryScale = generateColorScale(primaryColor);

  const monochromaticScale = [
    {
      name: "Text strong",
      hsba: "hsba(230, 100%, 15%, 0.90)",
      h: 230,
      s: 100,
      b: 15,
      a: 0.9,
      contrast: "4.5:1",
    },
    {
      name: "Text weak",
      hsba: "hsba(230, 100%, 20%, 0.65)",
      h: 230,
      s: 100,
      b: 20,
      a: 0.65,
      contrast: "4.5:1",
    },
    {
      name: "Stroke strong",
      hsba: "hsba(230, 100%, 30%, 0.45)",
      h: 230,
      s: 100,
      b: 30,
      a: 0.45,
      contrast: "3:1",
    },
    {
      name: "Stroke weak",
      hsba: "hsba(230, 100%, 40%, 0.10)",
      h: 230,
      s: 100,
      b: 40,
      a: 0.1,
      contrast: "N/A",
    },
    {
      name: "Fill weak",
      hsba: "hsba(230, 100%, 50%, 0.04)",
      h: 230,
      s: 100,
      b: 50,
      a: 0.04,
      contrast: "N/A",
    },
    {
      name: "Fill weaker",
      hsba: "hsba(230, 100%, 50%, 0.02)",
      h: 230,
      s: 100,
      b: 50,
      a: 0.02,
      contrast: "N/A",
    },
  ];

  const statusColors = {
    error: {
      name: "Error",
      baseColor: errorColor,
      scale: generateColorScale(errorColor),
    },
    warning: {
      name: "Warning",
      baseColor: warningColor,
      scale: generateColorScale(warningColor),
    },
    success: {
      name: "Success",
      baseColor: successColor,
      scale: generateColorScale(successColor),
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
            <label htmlFor="primary" className="block text-sm font-medium mb-2">
              Primary Color
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                id="primary"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-12 w-24 cursor-pointer rounded border"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Primary Color Scale</h3>
            {primaryScale.map(({ name, color, hsba, contrast }) => (
              <div key={name} className="flex items-center gap-4">
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
            {monochromaticScale.map(({ name, hsba, h, s, b, a, contrast }) => (
              <div key={name} className="flex items-center gap-4">
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
                  type="color"
                  value={errorColor}
                  onChange={(e) => setErrorColor(e.target.value)}
                  className="h-12 w-24 cursor-pointer rounded border"
                />
                <input
                  type="text"
                  value={errorColor}
                  onChange={(e) => setErrorColor(e.target.value)}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Color Scale</h4>
              {statusColors.error.scale.map(
                ({ name, color, hsba, contrast }) => (
                  <div key={name} className="flex items-center gap-3">
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
                  type="color"
                  value={warningColor}
                  onChange={(e) => setWarningColor(e.target.value)}
                  className="h-12 w-24 cursor-pointer rounded border"
                />
                <input
                  type="text"
                  value={warningColor}
                  onChange={(e) => setWarningColor(e.target.value)}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Color Scale</h4>
              {statusColors.warning.scale.map(
                ({ name, color, hsba, contrast }) => (
                  <div key={name} className="flex items-center gap-3">
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
                  type="color"
                  value={successColor}
                  onChange={(e) => setSuccessColor(e.target.value)}
                  className="h-12 w-24 cursor-pointer rounded border"
                />
                <input
                  type="text"
                  value={successColor}
                  onChange={(e) => setSuccessColor(e.target.value)}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Color Scale</h4>
              {statusColors.success.scale.map(
                ({ name, color, hsba, contrast }) => (
                  <div key={name} className="flex items-center gap-3">
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
                    type="number"
                    min="0"
                    max="360"
                    value={foregroundHSBA.h}
                    onChange={(e) =>
                      setForegroundHSBA({
                        ...foregroundHSBA,
                        h: Number(e.target.value),
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Saturation (0-100)
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={foregroundHSBA.s}
                    onChange={(e) =>
                      setForegroundHSBA({
                        ...foregroundHSBA,
                        s: Number(e.target.value),
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brightness (0-100)
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={foregroundHSBA.b}
                    onChange={(e) =>
                      setForegroundHSBA({
                        ...foregroundHSBA,
                        b: Number(e.target.value),
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Alpha (0-1)
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={foregroundHSBA.a}
                    onChange={(e) =>
                      setForegroundHSBA({
                        ...foregroundHSBA,
                        a: Number(e.target.value),
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                    type="number"
                    min="0"
                    max="360"
                    value={backgroundHSBA.h}
                    onChange={(e) =>
                      setBackgroundHSBA({
                        ...backgroundHSBA,
                        h: Number(e.target.value),
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Saturation (0-100)
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={backgroundHSBA.s}
                    onChange={(e) =>
                      setBackgroundHSBA({
                        ...backgroundHSBA,
                        s: Number(e.target.value),
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brightness (0-100)
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={backgroundHSBA.b}
                    onChange={(e) =>
                      setBackgroundHSBA({
                        ...backgroundHSBA,
                        b: Number(e.target.value),
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Alpha (0-1)
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={backgroundHSBA.a}
                    onChange={(e) =>
                      setBackgroundHSBA({
                        ...backgroundHSBA,
                        a: Number(e.target.value),
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
          href="/typography"
          className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Next: Typography
        </Link>
      </div>
    </div>
  );
}
