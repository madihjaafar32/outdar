# OUTDAR Frontend

React + Vite + Tailwind CSS frontend for OUTDAR.

## 📁 Structure

```
frontend/
├── public/
│   └── logos/             # Brand assets
├── src/
│   ├── assets/            # Illustrations, icons
│   ├── components/        # Reusable React components
│   │   ├── common/        # Buttons, inputs, modals
│   │   ├── layout/        # Navbar, footer, sidebar
│   │   ├── events/        # EventCard, RSVPCard, etc.
│   │   ├── chat/          # Message bubbles, etc.
│   │   ├── profile/       # Profile components
│   │   ├── ai/            # AI chat components
│   │   └── admin/         # Admin-only components
│   ├── pages/             # Route-level pages
│   ├── context/           # AuthContext, ThemeContext
│   ├── hooks/             # Custom React hooks
│   ├── services/          # Axios API client
│   ├── utils/             # Helpers, constants
│   ├── styles/            # Global CSS
│   ├── locales/           # i18n translation files
│   │   ├── en/            # English (active)
│   │   ├── fr/            # French (template)
│   │   └── ar/            # Arabic (template)
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   ├── i18n.js            # i18next config
│   └── index.css          # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🚀 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
copy .env.example .env  # Windows
# OR
cp .env.example .env  # Mac/Linux
```

The defaults work fine for local development. Update `VITE_API_URL` for production.

### 3. Run dev server
```bash
npm run dev
```

App opens at `http://localhost:5173`

## 🎨 Design System

The OUTDAR design system is loaded into `tailwind.config.js`:

```js
// Brand colors
'outdar-red'    // #E63946
'outdar-navy'   // #0B1220
'outdar-sky'    // #1D9BD6
'outdar-green'  // #7CB342
'outdar-yellow' // #FFD93D
'outdar-orange' // #F4A261

// Fonts
font-display    // Poppins (headings)
font-body       // Inter (body)
font-mono       // JetBrains Mono
```

## 🌍 Internationalization

OUTDAR is **i18n-ready** with `react-i18next`:

```jsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('app.tagline')}</h1>;
}
```

To add a new language:
1. Create `src/locales/<lang>/common.json`
2. Mirror the structure of `en/common.json`
3. Add it to the `resources` object in `src/i18n.js`

Currently:
- ✅ English — fully populated
- 🟡 French — template ready (Phase 2)
- 🟡 Arabic — template ready (Phase 2)

## 📜 Scripts

- `npm run dev` — Dev server with HMR
- `npm run build` — Production build → `dist/`
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

## 🌗 Dark Mode

Dark mode uses Tailwind's `class` strategy:

```jsx
<div className="bg-white dark:bg-outdar-navy">
  <h1 className="text-gray-900 dark:text-white">Hello</h1>
</div>
```

Toggle by adding/removing `dark` class on `<html>`.
