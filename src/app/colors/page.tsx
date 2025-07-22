"use client"

import { useState } from "react"
import Link from "next/link"

export default function ColorsPage() {
  const [primaryColor, setPrimaryColor] = useState("#3b82f6")
  const [secondaryColor, setSecondaryColor] = useState("#8b5cf6")
  
  const generateColorScale = (baseColor: string) => {
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
    return shades.map(shade => ({
      shade,
      color: adjustColorBrightness(baseColor, shade)
    }))
  }
  
  const adjustColorBrightness = (color: string, shade: number) => {
    const factor = (500 - shade) / 500
    const hex = color.replace("#", "")
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    
    const adjust = (channel: number) => {
      if (shade < 500) {
        return Math.round(channel + (255 - channel) * factor * 1.5)
      } else {
        return Math.round(channel * (1 + factor))
      }
    }
    
    const newR = Math.min(255, Math.max(0, adjust(r)))
    const newG = Math.min(255, Math.max(0, adjust(g)))
    const newB = Math.min(255, Math.max(0, adjust(b)))
    
    return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`
  }
  
  const primaryScale = generateColorScale(primaryColor)
  const secondaryScale = generateColorScale(secondaryColor)

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Brand Colors</h1>
        <p className="mt-2 text-muted-foreground">
          Select your primary and secondary brand colors to generate a complete color palette.
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
            {primaryScale.map(({ shade, color }) => (
              <div key={shade} className="flex items-center gap-4">
                <div 
                  className="h-10 w-20 rounded border"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-mono">{shade}</span>
                <span className="text-sm font-mono text-muted-foreground">{color}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="mb-6">
            <label htmlFor="secondary" className="block text-sm font-medium mb-2">
              Secondary Color
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                id="secondary"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="h-12 w-24 cursor-pointer rounded border"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Secondary Color Scale</h3>
            {secondaryScale.map(({ shade, color }) => (
              <div key={shade} className="flex items-center gap-4">
                <div 
                  className="h-10 w-20 rounded border"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-mono">{shade}</span>
                <span className="text-sm font-mono text-muted-foreground">{color}</span>
              </div>
            ))}
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
  )
}