---
name: add-shadcn-component
description: Add a new shadcn-ui primitive to src/components/ui/ that uses the project's semantic color tokens and works with Tailwind v4. Use when the user asks to install/add a shadcn component (e.g. accordion, calendar, command, sheet) that is not yet present.
---

# Add a shadcn-ui primitive

shadcn-ui primitives live in `src/components/ui/`. They are owned source code (not a dependency), built on Radix primitives + Tailwind. New ones get added by either:

1. Copy-pasting from https://ui.shadcn.com/docs/components/<name> (preferred) and adapting to this project.
2. Using the shadcn CLI: `yarn dlx shadcn@latest add <component>` — works but may produce v3 Tailwind syntax that needs fixing.

## Pre-flight checklist

Before writing code:

1. **Is it already there?** `ls src/components/ui/` — check first. Already installed: alert, alert-dialog, avatar, badge, button, card, checkbox, date-range-picker, dialog, dropdown-menu, form, input, label, progress, radio-group, scroll-area, select, separator, skeleton, switch.
2. **Is the underlying Radix package in `package.json`?** Many shadcn components depend on `@radix-ui/react-<thing>`. Check `dependencies` — if missing, add via `yarn add @radix-ui/react-<thing>`.
3. **Will this work with Tailwind v4?** The project uses Tailwind 4 (`@tailwindcss/postcss`). Some shadcn snippets from older docs use v3-only syntax (`@apply` in CSS, certain plugin invocations). Verify against `tailwind.config.ts` before pasting.
4. **Does the project already use a competing primitive?** Notably: **toasts use sonner, not shadcn's `<Toaster>`**. Don't install `toast.tsx` from shadcn — `sonner` is mounted in `main.tsx` and is the project standard.

## File checklist

1. **`src/components/ui/<name>.tsx`**
   - Use `'use client'` directive only if the component uses hooks/state (most do).
   - Imports must use the `@/` alias (`@/lib/utils`, `@/components/ui/...`), not relative paths.
   - The `cn()` utility from `@/lib/utils` is the canonical class merger. Use it for all `className` composition.
   - Use **semantic color tokens** from `tailwind.config.ts`, not raw Tailwind palette. The project defines: `primary`, `accent`, `medical`, `math`, `code`, `philosophy`, `success`, `error`, plus shadcn's `background/foreground/muted/border/ring`. If a shadcn snippet uses `bg-zinc-900`, change it to `bg-primary-900` or whichever semantic token applies.
   - Keep the file **purely the primitive**. Don't add domain-specific variants (e.g. a "StudentCard" variant of Card) — put those in `src/components/common/`.
2. **`package.json`** — `yarn add @radix-ui/react-<thing>` if needed. Use the same major version range as the other Radix packages (`^1.x` for most).
3. **`src/index.css`** *(rare)* — Some components (calendar, sonner) inject global CSS variables. If the snippet asks for variables under `:root` or `.dark`, add them under the existing `:root` / `.dark` blocks in `index.css`. Don't create a parallel CSS file.
4. **Storybook / demo** — There's no Storybook today. If the user wants a demo page, put it under `src/modules/shared/pages/` and gate it with `import.meta.env.DEV` so it doesn't ship to production.

## Conventions to preserve

- **`darkMode: 'class'`** is set in `tailwind.config.ts`. Components must support both light and dark via the `dark:` prefix. The toggle lives in `themeStore`.
- **No `forwardRef` boilerplate** unless the primitive needs to be focused/measured externally — React 19 handles refs as regular props for function components. Match the style of the existing `button.tsx`.
- **Translatable strings**: any user-visible text inside a primitive (like a default placeholder "Search...") should accept a prop, not be hardcoded. The consuming page passes `t('...')`.
- **Accessibility**: use Radix's built-in a11y (`aria-*` props) — don't strip them. Add a sensible `aria-label` default if needed.

## Verification

```bash
yarn type-check
yarn lint
yarn dev                # render the component on a scratch page, verify light + dark + 4 locales
```

For complex primitives (calendar, command, sheet) also check:

- Keyboard navigation (Tab, arrow keys, Escape).
- Screen reader output (announce on open/close).
- Mobile touch (drag, swipe — `vaul` is already installed for sheets).

## What NOT to do

- **Don't** install `@radix-ui/react-toast` or shadcn's `toast.tsx` / `<Toaster>` — `sonner` is the project standard, already mounted globally.
- **Don't** copy the shadcn `cn()` implementation into a new file. Use the project's `@/lib/utils#cn`.
- **Don't** use raw Tailwind palette colors (`bg-blue-500`, `text-gray-700`) when a semantic token exists. The semantic tokens are how the visual identity stays consistent across the four-locale, four-role app.
- **Don't** add a new icon library. The project uses `lucide-react`; pick from there.
- **Don't** add `framer-motion` for animations. Tailwind transitions + Radix data attributes (`data-state="open"`) cover the existing animation patterns.
