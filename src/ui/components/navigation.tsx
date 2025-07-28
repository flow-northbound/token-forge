"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/colors", label: "Colors", step: 1 },
  { href: "/typography", label: "Typography", step: 2 },
  { href: "/spacing", label: "Spacing & Radius", step: 3 },
  { href: "/export", label: "Export", step: 4 },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Image
              src="/logo-no-bg.svg"
              alt="Token Forge Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            Token Forge
          </Link>
          <div className="flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div key={item.href} className="flex items-center">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                    {item.step}
                  </span>
                  {item.label}
                </Link>
                {index < navItems.length - 1 && (
                  <div className="mx-2 h-4 w-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
