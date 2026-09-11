# shadcn + Lenis Setup Guide

## ✅ What's Installed

- **Tailwind CSS v3** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lenis** - Smooth scrolling library
- **tailwind-merge** - Merge Tailwind classes
- **clsx** - Class composition utility

## 🚀 Quick Start

### 1. Using Tailwind CSS

Your app now supports Tailwind classes:

```jsx
<div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
  <h1 className="text-4xl font-bold text-white">Hello World</h1>
</div>
```

### 2. Using shadcn Components

The `Button` component is already available:

```jsx
import { Button } from "@/components/Button";

export function MyComponent() {
  return <Button onClick={() => alert("Clicked!")}>Click Me</Button>;
}
```

### 3. Lenis Smooth Scroll

Lenis is automatically initialized in your app. Just scroll normally and enjoy smooth scrolling!

To programmatically scroll:

```jsx
// In your component
const handleScroll = () => {
  window.lenis?.scrollTo("#target-id", { duration: 2 });
};
```

## 📦 File Structure

```
src/
├── components/          # shadcn components
│   └── Button.jsx      # Sample button component
├── lib/
│   └── utils.js        # Tailwind utility functions
├── App.js              # Main app with Lenis initialized
└── index.css           # Tailwind directives
```

## 🎨 Adding More shadcn Components

To add more components, copy them from [shadcn/ui](https://ui.shadcn.com/docs/components) into `src/components/`

Example: Adding an Input component

1. Go to https://ui.shadcn.com/docs/components/input
2. Copy the component code
3. Create `src/components/Input.jsx` and paste
4. Import and use in your app

## ✨ Tips

- Use `@/` alias to import from src (e.g., `@/components/Button`)
- Tailwind classes work directly in className
- jsconfig.json is configured for path aliases
- components.json has shadcn configuration

## 🔍 Useful Links

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [Lenis Documentation](https://lenis.studiofreight.com/)

Enjoy building! 🎉
