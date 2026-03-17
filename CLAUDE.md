# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketing/landing page for **Construred**, a Mexican hardware store chain (Chihuahua, Mexico) specializing in construction, electrical, and plumbing materials. All user-facing content is in **Spanish (es-MX)**. This is a **single-page site** with anchor-based navigation (`#inicio`, `#nosotros`, `#ubicaciones`, `#contacto`). There is **no backend** — forms are UI-only.

## Commands

```bash
pnpm dev      # Dev server at localhost:4321
pnpm build    # Production build to ./dist/
pnpm preview  # Preview production build
```

## Tech Stack

- **Astro 5** with React 19 integration
- **TypeScript** (strict mode, JSX set to react-jsx)
- **Tailwind CSS v4** — configured via `@theme {}` in `src/styles/global.css`, not a JS config file
- **pnpm** as package manager
- **Google Maps JavaScript API** — requires `PUBLIC_GOOGLE_MAPS_API_KEY` in `.env`

## Architecture

**Hybrid component model:**
- **Astro components (.astro):** Static/server-rendered content — Header, Footer, AboutSection, SectionTitle, Layout, Button
- **React components (.tsx):** Interactive client-side features — HeroSlider, GoogleMap, ContactForm, MobileMenu, WhatsAppButton, Button

React components are hydrated via Astro client directives:
- `client:load` — immediate (HeroSlider, WhatsAppButton, MobileMenu)
- `client:visible` — lazy, when scrolled into view (GoogleMap, ContactForm)

**Cross-framework communication:** Header.astro dispatches custom DOM events (`headerScrollState`) that React components (MobileMenu) listen to.

**Single page structure** (`src/pages/index.astro`):
Header → HeroSlider → AboutSection → GoogleMap → ContactForm → Footer → WhatsAppButton (floating)

## Styling

Tailwind v4 with custom design tokens in `src/styles/global.css`:

**Brand colors:** Primary Yellow `#f5b932`, Secondary Blue `#2d3e7c`, Accent Red `#a32035`

**Fonts:** 'Bebas Neue' (display/headings, uppercase) and 'DM Sans' (body), loaded from Google Fonts in Layout.astro.

**Custom utilities defined in global.css:** `.pattern-industrial`, `.pattern-diagonal`, `.text-gradient`, `.shadow-industrial`, `.shadow-industrial-sm`, stagger animation classes (`.stagger-1` through `.stagger-5`).

## Key Conventions

- Button component exists in both `.astro` and `.tsx` versions with matching variants (primary, secondary, accent, outline, ghost) and sizes (sm, md, lg)
- Brand mascot "Meny" appears as PNG images throughout the site — treat as important brand element
- Hover effects use translate/scale/rotate transforms with 300ms transitions (500ms for complex animations)
- Animation pattern: CSS keyframes in global.css + inline `animationDelay` + `animationFillMode: 'forwards'`
