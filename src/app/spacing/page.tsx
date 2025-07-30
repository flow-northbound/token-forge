"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useDesignTokens } from "@/lib/design-tokens-context";

const spacingScales = [
  { multiplier: 1, name: "Linear" },
  { multiplier: 1.618, name: "Fibonacci" },
  { multiplier: 1.618, name: "Golden Ratio" },
  { multiplier: 2, name: "Material Design" },
];

export default function SpacingPage() {
  const { tokens, updateSpacing } = useDesignTokens();
  const [baseSpacing, setBaseSpacing] = useState(tokens.spacing.baseSpacing);
  const [spacingScale, setSpacingScale] = useState(tokens.spacing.spacingScale);
  const [baseRadius, setBaseRadius] = useState(tokens.spacing.baseRadius);
  const [radiusScale] = useState(tokens.spacing.radiusScale);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateSpacing({
        baseRadius,
        baseSpacing,
        radiusScale,
        spacingScale,
      });
    }, 300); // Debounce updates

    return () => clearTimeout(timeoutId);
  }, [baseSpacing, spacingScale, baseRadius, radiusScale, updateSpacing]);

  const generateSpacing = () => {
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

  const generateRadius = () => {
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

  const spacing = generateSpacing();
  const radius = generateRadius();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Spacing & Radius</h1>
        <p className="mt-2 text-muted-foreground">
          Define component spacing and border radius values for consistent
          layouts.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 text-xl font-semibold">Spacing</h2>

          <div className="space-y-4 mb-8">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="base-spacing"
              >
                Base Spacing Unit (px)
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                id="base-spacing"
                max="8"
                min="2"
                onChange={(e) => setBaseSpacing(Number(e.target.value))}
                type="number"
                value={baseSpacing}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="spacing-scale"
              >
                Spacing Scale
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                id="spacing-scale"
                onChange={(e) => setSpacingScale(Number(e.target.value))}
                value={spacingScale}
              >
                {spacingScales.map((scale) => (
                  <option key={scale.name} value={scale.multiplier}>
                    {scale.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium mb-4">Spacing Values</h3>
            {Object.entries(spacing).map(([key, value]) => (
              <div className="flex items-center gap-4" key={key}>
                <span className="w-12 text-sm font-mono">{key}</span>
                <div
                  className="h-8 bg-primary/20 border border-primary/40"
                  style={{ width: `${value}px` }}
                />
                <span className="text-sm font-mono text-muted-foreground">
                  {value}px
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-xl font-semibold">Border Radius</h2>

          <div className="space-y-4 mb-8">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="base-radius"
              >
                Base Radius Unit (px)
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                id="base-radius"
                max="8"
                min="2"
                onChange={(e) => setBaseRadius(Number(e.target.value))}
                type="number"
                value={baseRadius}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium mb-4">Radius Values</h3>
            {Object.entries(radius).map(([key, value]) => (
              <div className="flex items-center gap-4" key={key}>
                <span className="w-16 text-sm font-mono">{key}</span>
                <div
                  className="h-16 w-16 bg-primary/20 border-2 border-primary/40"
                  style={{ borderRadius: `${value}px` }}
                />
                <span className="text-sm font-mono text-muted-foreground">
                  {value === 9999 ? "9999px" : `${value}px`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-between">
        <Link
          className="inline-flex items-center rounded-md border border-input bg-background px-6 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground"
          href="/typography"
        >
          Back: Typography
        </Link>
        <Link
          className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          href="/export"
        >
          Next: Export
        </Link>
      </div>
    </div>
  );
}
