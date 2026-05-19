---
name: add-i18n-string
description: Add a new translation key to all four locales (uz, oz, ru, en) keeping them in sync. Use when the user adds user-visible text, asks to translate something, or you need to expose a new t() key.
---

# Add an i18n string in all 4 locales

The project ships with **four locales** in `src/locales/`:

| File | Locale | Notes |
|---|---|---|
| `uz.json` | Uzbek (Latin) | Default fallback; the primary language. |
| `oz.json` | Uzbek (Cyrillic) | Same content as `uz.json`, transliterated. |
| `ru.json` | Russian | |
| `en.json` | English | |

The i18next config (`src/i18n.ts`) falls back to `uz` if a key is missing in the active locale — which means *missing keys silently render in Uzbek*. Don't rely on that as graceful degradation; always add the key everywhere.

## Decision flow

1. **Where does the string belong in the key tree?** Look at the existing structure of `uz.json` first. Common roots:
   - `common.*` — generic verbs/nouns (save, cancel, delete, loading, error)
   - `auth.*` — login/registration/password reset
   - `<role>.*` — role-specific (e.g. `teacher.assignments.title`, `student.grades.empty`)
   - `errors.*` — error messages
   - `validation.*` — form validation labels
   - `menu.*` — navigation labels
2. **Is the string actually static, or does it have variables?** If it has variables, use **named placeholders**: `"Salom, {{name}}!"` — call via `t('greeting', { name: 'Aziz' })`. No positional placeholders.
3. **Plurals?** Use i18next's plural syntax: keys `foo_one`, `foo_other` (English-style), called via `t('foo', { count: n })`. Don't roll your own.
4. **Backend-driven content?** Translations for backend data (subject names, decree titles) come from the backend's `MultiTenantTranslationService` keyed by university. **Don't** mirror them in the frontend locale files. Only static UI text goes here.

## File checklist

For each new key, edit **all four** files. Maintain the same nested structure across all four.

1. **`src/locales/uz.json`** — write the Uzbek (Latin) text. Source of truth for translators.
2. **`src/locales/oz.json`** — Uzbek Cyrillic. Transliteration of `uz.json`:
   - q → қ, gʻ → ғ, oʻ → ў, sh → ш, ch → ч, ng → нг, x → х, h → ҳ (where appropriate), etc.
   - Apostrophes (`'` and `ʻ`) become specific Cyrillic letters; don't drop them.
3. **`src/locales/ru.json`** — Russian translation.
4. **`src/locales/en.json`** — English translation.

If you don't know a translation, use the English string as a placeholder in the unknown locale and **flag it in the PR/commit message** so a human translator can fix it. Do NOT leave the key absent — that triggers the silent fallback.

## Style guide

- **Sentence case** for buttons and labels (`"O'qituvchi qo'shish"`, not `"O'QITUVCHI QO'SHISH"`). Use CSS `text-uppercase` if you need all-caps visually.
- **No trailing punctuation** on button labels.
- **Localize numbers and dates via `Intl`**, not via string keys. (The `formatDate`, `formatCurrency` helpers in `src/lib/utils.ts` use `Intl` but hardcode `'uz-UZ'` — when fixing them, accept a locale parameter.)
- **Keep keys lowercased and dotted**: `teacher.assignments.create_button`, not `Teacher.Assignments.CreateButton`.
- **Avoid string concatenation** in the UI: `t('common.welcome') + ' ' + name` is wrong. Use `t('common.welcome', { name })` with a placeholder.

## Use in components

```tsx
import { useTranslation } from 'react-i18next'

function Foo() {
  const { t } = useTranslation()
  return (
    <button>{t('teacher.assignments.create_button')}</button>
  )
}
```

For the multi-locale sanity check, switch `localStorage.language` to each of `uz`, `oz`, `ru`, `en` in dev tools and reload the page.

## Verification

```bash
yarn type-check                       # surfaces missing keys if you use a typed i18n setup
yarn lint
node -e "const f=['uz','oz','ru','en'].map(l=>require('./src/locales/'+l+'.json')); console.log(JSON.stringify(f, null, 0).length)"
# Quick sanity that all four files parse as valid JSON.
```

In the browser:

- Verify the string renders correctly in all 4 locales (use the `<LanguageSwitcher />` or set `localStorage.language` manually).
- For RTL/CJK considerations: not applicable here; all four locales are LTR.
- For long Russian/English variants that overflow buttons: adjust the UI, not the translation.

## What NOT to do

- **Don't** add a key in only one file. The silent fallback to Uzbek masks the problem until a non-Uzbek user notices.
- **Don't** translate dynamic content (subject names, user-entered text). That belongs in the backend's translation service, keyed by `university_id`.
- **Don't** hardcode strings in `.tsx` files even temporarily. `t('todo.fix_me')` with placeholder values in all four locales is better than `"TODO"` JSX text.
- **Don't** restructure the existing key tree without checking grep across `src/`. A rename means hunting every `t('old.path')` call.
- **Don't** rely on `i18next-browser-languagedetector` outside its configured order (`localStorage` → `navigator` → `htmlTag`). If a user needs the language forced (e.g. from a URL param), do it through `languageStore`, not by patching the detector.
- **Don't** mix the backend's locale codes (`uz-UZ`, `oz-UZ`, `ru-RU`, `en-US`) with the frontend's short codes (`uz`, `oz`, `ru`, `en`). The frontend uses short codes everywhere; the axios interceptor / `languageStore` handles the mapping when sending headers.
