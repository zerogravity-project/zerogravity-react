<div align="center">

# 🌌 ZeroGravity

> ⚠️ _This project is currently in development. Official release coming soon!_

<br/>

![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&pause=1000&color=6366F1&center=true&vCenter=true&width=500&lines=Emotion+Tracking+App;3D+Visualization;Built+with+Next.js+15)

**3D Emotion Visualization & Personal Wellness Tracking Platform**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-zerogv.com-blue?style=for-the-badge)](https://www.zerogv.com)
![Chrome Extension](https://img.shields.io/badge/🧩_Extension-Coming_Soon-gray?style=for-the-badge)

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)

</div>

---

## 📑 Table of Contents

1. [📖 Overview](#-overview)
2. [✨ Key Features](#-key-features)
3. [🛠 Tech Stack](#-tech-stack)
4. [🏗 Architecture](#-architecture)
5. [🔧 Technical Challenges & Solutions](#-technical-challenges--solutions)
6. [📸 Screenshots](#-screenshots)
7. [🚀 Getting Started](#-getting-started)
8. [🗓 Roadmap](#-roadmap)
9. [🔗 Related](#-related)
10. [👤 Author](#-author)

---

## 📖 Overview

ZeroGravity is a personal wellness application that helps users track and visualize their emotions through an immersive 3D experience. The platform transforms emotional data into beautiful, interactive 3D planets that morph and change based on your emotional state.

> 📌 Rebuilt from an incomplete collaborative Vue project into a full-featured solo full-stack application.
> [Original Vue version](https://github.com/zerogravity-project/zerogravity-frontend/tree/main) | [Backend Repository](https://github.com/zerogravity-project/zerogravity-backend)

### Why ZeroGravity?

- 🎨 **Visual Emotion Tracking** - Transform abstract emotions into tangible 3D visualizations
- 📊 **Data-Driven Insights** - Analyze emotional patterns over time with interactive charts
- 🤖 **AI-Powered Insights** - Emotion prediction from diary entries and period-based trend analysis
- 🧩 **Cross-Platform** - Seamlessly sync between web app and Chrome extension

---

## ✨ Key Features

| Feature                    | Description                                                     | Tech                   |
| -------------------------- | --------------------------------------------------------------- | ---------------------- |
| 🌍 **3D Emotion Planets**  | Custom GLSL shaders with simplex noise, smooth lerp transitions | Three.js, R3F, GLSL    |
| 📝 **3-Step Recording**    | Emotion Level → Reason → Diary with URL-based navigation        | React Context, Next.js |
| 📅 **Responsive Calendar** | Desktop/mobile calendar with emotion detail drawer              | date-fns, Radix UI     |
| 📊 **Chart Analytics**     | Time period navigation (week/month/year) with statistics        | Chart.js               |
| 🤖 **AI Insights**         | Emotion prediction from diary + period-based trend analysis     | Google Gemini API      |
| 🧩 **Chrome Extension**    | New tab override synced with web app (auth & theme)             | Vite, Manifest V3      |
| 🔐 **OAuth Auth**          | Google & Kakao social login with secure session                 | NextAuth v5            |
| 🧘 **Spaceout Mode**       | Meditation feature with sequential video playback               | Next.js                |

---

## 🛠 Tech Stack

|       Category       | Technologies                                         |
| :------------------: | :--------------------------------------------------- |
|     **Frontend**     | Next.js 15 (App Router), React 19, TypeScript        |
|   **3D Graphics**    | Three.js, React Three Fiber, Custom GLSL Shaders     |
|        **AI**        | Google Gemini API                                    |
|  **Authentication**  | NextAuth v5 (Google, Kakao OAuth)                    |
| **State Management** | TanStack Query, React Context                        |
|     **Styling**      | Tailwind CSS 4, Radix UI Themes                      |
|     **Monorepo**     | pnpm Workspace                                       |
|      **Build**       | Next.js (web), Vite (extension, shared library mode) |
|  **Infrastructure**  | Docker, Docker Compose, Nginx                        |
|      **CI/CD**       | GitHub Actions (Zero-Downtime, Auto-Rollback)        |
|     **Testing**      | Playwright (E2E), Jest                               |

---

## 🏗 Architecture

```
zerogravity-react/
├── packages/
│   ├── web/              # Next.js 15 Web Application
│   │   ├── src/app/      # App Router with route groups
│   │   │   ├── (public)/    # Home, Terms
│   │   │   ├── (auth)/      # Login
│   │   │   ├── (protected)/ # Record, Profile, Spaceout
│   │   │   └── (api)/       # Route Handlers (Auth, Proxy, Health)
│   │   ├── src/services/ # API service layer (dto/query/service)
│   │   └── src/lib/      # Auth, Axios configuration
│   │
│   ├── extension/        # Chrome Extension (Manifest V3)
│   │   ├── src/lib/      # Chrome Cookies API integration
│   │   └── public/       # Extension manifest & assets
│   │
│   └── shared/           # Shared Library
│       ├── entities/     # Domain constants & types (zero deps)
│       ├── components/   # UI components (Clock, Navigation, etc.)
│       │   └── ui/emotion/ # 3D Planet with GLSL shaders
│       ├── hooks/        # Shared React hooks
│       └── utils/        # Utility functions
│
├── .github/workflows/    # CI/CD (deploy, build-extension)
├── pnpm-workspace.yaml   # Monorepo configuration
└── package.json          # Root dependencies
```

### Why Monorepo?

**🔍 The Challenge**: Chrome Extensions don't support SSR, making Next.js unusable for the extension. The goal was to let users see their emotion planet right from the new tab, sharing the same 3D planet and UI components with the web app.

**💡 The Solution**: Created a shared package (Vite library mode) instead of migrating the entire project to Vite, preserving Next.js benefits for the web app.

**✅ The Result**:

- **`packages/web`**: Full Next.js app with SSR, auth, and all features
- **`packages/extension`**: Lightweight Vite build for Chrome new tab
- **`packages/shared`**: Common components used by both (3D planet, clock, theme)

---

## 🔧 Technical Challenges & Solutions

### 1. 3D Rendering Optimization (29fps → 60fps)

**🔍 Problem**: Emotion planet rendered at 29fps with 408,040 triangles. The landing page felt heavy on every visit

**💡 Solution**:

- **Shader simplification**: Removed unnecessary vertex displacement (surface wobble) and kept only color animation, reducing noise calls from 6 to 2 per vertex
- **LOD (Level of Detail)**: Tuned subdivision per context
  - Large Planet (Home): 100→48 (desktop), 32 (mobile)
  - Normal Planet (Record, Calendar): 50→32 (desktop), 28 (mobile)

**✅ Outcome**: ~610K → ~48K noise calls per frame (**-92%**), 408K → 96K triangles (**-76%**), **29fps → 60fps**

```glsl
// Before — 6 noise calls per vertex (vertex displacement + normal recalculation)
void main() {
  float wobble = getWobble(csm_Position);      // 2 noise (self)
  positionA += getWobble(positionA) * normal;   // 2 noise (neighbor A)
  positionB += getWobble(positionB) * normal;   // 2 noise (neighbor B)
  csm_Normal = normalize(cross(toA, toB));
}

// After — 2 noise calls per vertex (color animation only)
void main() {
  float noise = getWobble(csm_Position);  // 2 noise (single call)
  vWobble = noise;
}
```

### 2. Bundle Optimization (First Load JS -58%)

**🔍 Problem**: Three.js (712KB) loaded on every page, even the chart page that uses zero 3D. Lighthouse Performance scored 27-71 across pages. Barrel export bundled emotion constants and 3D components together, so importing a single constant pulled in Three.js

**💡 Solution**:

- **Entity/Component separation**: Split domain data (names, colors, types, zero deps, ~28 importers) from 3D rendering (Three.js, R3F, GLSL, 712KB)
- **React.lazy**: Lazy-load 3D canvas with static placeholder images (7 emotions × 3 sizes) for instant visual feedback

**✅ Outcome**:

- Home 447→187KB (**-58%**), Record 514→254KB (**-51%**), Calendar 514→256KB (**-50%**)
- Lighthouse Performance: non-3D pages 66-69 → **97** (desktop)

```
// Before — single barrel bundles everything
emotion/index.ts
├── export * from './constants'    → EMOTION_STEPS, etc. (pure JS)
├── export * from './scene'        → EmotionPlanetScene (Three.js 712KB)
└── export * from './decorations'

// After — separated by dependency weight
entities/emotion/   → Domain data (zero deps, SSR-safe)
components/emotion/ → 3D rendering (Three.js, lazy-loaded)
```

### 3. Cross-Context Authentication (Web ↔ Extension)

**🔍 Problem**: Chrome Extension needs to access NextAuth session from web app without separate login

**💡 Solution**:

- Chrome Cookies API reads NextAuth session cookies
- Validates session by sending cookie to NextAuth `/api/auth/session` endpoint

**✅ Outcome**: Seamless authentication. Login once on web, automatically authenticated in extension

```typescript
// 1. Read NextAuth session cookie from Chrome cookie store
const cookie = await chrome.cookies.get({
  url: WEB_APP_URL,
  name: '__Secure-authjs.session-token',
});

// 2. Validate session via NextAuth endpoint
const response = await fetch(`${WEB_APP_URL}/api/auth/session`, {
  credentials: 'include',
});
const session = await response.json();
// NextAuth returns {} if no session, { user: {...} } if valid
```

### 4. E2E Testing for 3D Apps (Playwright)

**🔍 Problem**: Running 256 E2E tests in parallel caused GPU resource contention from WebGL/Canvas tests, making them flaky. Had to fall back to fully sequential execution, significantly increasing total run time

**💡 Solution**: Isolate WebGL tests into `chromium-3d` (sequential) to prevent GPU contention, while `chromium` (non-WebGL) runs in parallel

**✅ Outcome**: Fully sequential (22min) → selective parallel (9min, **-59%**), stable

```typescript
// playwright.config.ts — Project separation
fullyParallel: true,
projects: [
  {
    name: 'chromium-3d',
    testMatch: [/.*home.*/, /.*record-daily.*/, /.*spaceout.*/],
    fullyParallel: false,  // Sequential — prevent GPU contention
  },
  {
    name: 'chromium',
    testIgnore: [/.*home.*/, /.*record-daily.*/, /.*spaceout.*/],
    // Inherits fullyParallel: true — safe without WebGL
  },
],
```

---

## 📸 Screenshots

> Responsive design across all pages: Desktop and Mobile views

### 🏠 Home & Login

|           |                        Desktop                         |                        Mobile                        |
| :-------: | :----------------------------------------------------: | :--------------------------------------------------: |
| **Home**  |  ![Home Desktop](.github/assets/desktop/gif/home.gif)  |  ![Home Mobile](.github/assets/mobile/gif/home.gif)  |
| **Login** | ![Login Desktop](.github/assets/desktop/png/login.png) | ![Login Mobile](.github/assets/mobile/png/login.png) |

### 📝 Emotion Recording

|                   |                                Desktop                                 |                                Mobile                                |
| :---------------: | :--------------------------------------------------------------------: | :------------------------------------------------------------------: |
| **Record Daily**  |  ![Record Daily Desktop](.github/assets/desktop/gif/record-daily.gif)  |  ![Record Daily Mobile](.github/assets/mobile/gif/record-daily.gif)  |
| **Record Moment** | ![Record Moment Desktop](.github/assets/desktop/gif/record-moment.gif) | ![Record Moment Mobile](.github/assets/mobile/gif/record-moment.gif) |

### 🤖 AI Features

|                        |                                Desktop                                 |                                Mobile                                |
| :--------------------: | :--------------------------------------------------------------------: | :------------------------------------------------------------------: |
| **Emotion Prediction** | ![AI Prediction Desktop](.github/assets/desktop/gif/ai-prediction.gif) | ![AI Prediction Mobile](.github/assets/mobile/gif/ai-prediction.gif) |
|  **Period Analysis**   |    ![AI Analysis Desktop](.github/assets/desktop/gif/chart-ai.gif)     |    ![AI Analysis Mobile](.github/assets/mobile/gif/chart-ai.gif)     |

### 📊 Analytics

|              |                           Desktop                            |                           Mobile                           |
| :----------: | :----------------------------------------------------------: | :--------------------------------------------------------: |
| **Calendar** | ![Calendar Desktop](.github/assets/desktop/gif/calendar.gif) | ![Calendar Mobile](.github/assets/mobile/gif/calendar.gif) |
|  **Chart**   |    ![Chart Desktop](.github/assets/desktop/gif/chart.gif)    |    ![Chart Mobile](.github/assets/mobile/gif/chart.gif)    |

### 🧘 Spaceout & Settings

|              |                           Desktop                            |                           Mobile                           |
| :----------: | :----------------------------------------------------------: | :--------------------------------------------------------: |
| **Spaceout** | ![Spaceout Desktop](.github/assets/desktop/gif/spaceout.gif) | ![Spaceout Mobile](.github/assets/mobile/gif/spaceout.gif) |
| **Settings** | ![Settings Desktop](.github/assets/desktop/png/settings.png) | ![Settings Mobile](.github/assets/mobile/png/settings.png) |

### 🧩 Chrome Extension

|                       New Tab Override                        |
| :-----------------------------------------------------------: |
| ![Chrome Extension](.github/assets/desktop/png/extension.png) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Installation

```bash
# Clone the repository
git clone https://github.com/zerogravity-project/zerogravity-react.git
cd zerogravity-react

# Install dependencies
pnpm install

# Set up environment variables
cp packages/web/.env.example packages/web/.env.local
```

### Development

```bash
# Start web application
pnpm dev:web          # http://localhost:3000

# Start extension development
pnpm dev:extension    # Load unpacked from packages/extension/dist

# Build all packages
pnpm build:all

# Type check
pnpm type-check:all

# Lint
pnpm lint:all
```

### Environment Variables

```env
# NextAuth Configuration
AUTH_SECRET=your-secret
AUTH_URL=http://localhost:3000
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
AUTH_KAKAO_ID=your-kakao-client-id
AUTH_KAKAO_SECRET=your-kakao-client-secret

# Backend API
NEXT_PUBLIC_API_BASE_URL=https://api.zerogv.com
```

---

## 🗓 Roadmap

- [ ] Chat-based emotion analysis with AI
- [ ] Chrome Extension: additional views beyond landing (calendar, chart)
- [ ] Multi-language support (i18n)

---

## 🔗 Related

- [Backend (Spring Boot)](https://github.com/zerogravity-project/zerogravity-backend)
- [Original Vue Version](https://github.com/zerogravity-project/zerogravity-frontend/tree/main)

---

## 👤 Author

**Minuk Hwang** - Fullstack Developer

- 📧 [minuk.lucas.hwang@gmail.com](mailto:minuk.lucas.hwang@gmail.com)
- 💼 [LinkedIn](https://linkedin.com/in/minuk-hwang-934999157)
- 🌐 [Portfolio](https://www.minukhwang.com)
