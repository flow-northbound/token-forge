import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Token Forge
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Generate base UI design tokens following Practical UI design
          principles. Create a consistent design system with colors, typography,
          spacing, and radius values.
        </p>
        <div className="mt-10">
          <Link
            className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            href="/colors"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="text-xl font-bold">1</span>
          </div>
          <h3 className="text-lg font-semibold">Brand Colors</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Select your primary brand colors and generate a complete color
            palette
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="text-xl font-bold">2</span>
          </div>
          <h3 className="text-lg font-semibold">Typography</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose fonts and define your typography scale for consistent text
            styling
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="text-xl font-bold">3</span>
          </div>
          <h3 className="text-lg font-semibold">Spacing & Radius</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Define component spacing and border radius values for consistent
            layouts
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="text-xl font-bold">4</span>
          </div>
          <h3 className="text-lg font-semibold">Export</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Export your design tokens in various formats (CSS, JSON, JS)
          </p>
        </div>
      </div>
    </div>
  );
}
