<div align="center">

# 🌌 ZeroGravity

> ⚠️ _This project is currently in development. Official release coming soon!_

<br/>

![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&pause=1000&color=6366F1&center=true&vCenter=true&width=500&lines=Emotion+Tracking+App;3D+Visualization;Built+with+Next.js+15)

**3D Emotion Visualization & Personal Wellness Tracking Platform**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-dev.zerogv.com-blue?style=for-the-badge)](https://dev.zerogv.com)
![Chrome Extension](https://img.shields.io/badge/🧩_Extension-Coming_Soon-gray?style=for-the-badge)

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)

</div>

---

## 📖 Overview

ZeroGravity is a personal wellness application that helps users track and visualize their emotions through an immersive 3D experience. The platform transforms emotional data into beautiful, interactive 3D planets that morph and change based on your emotional state.

> 📌 Rebuilt from an incomplete collaborative Vue project into a full-featured solo full-stack application.
> [Original Vue version](https://github.com/zerogravity-project/zerogravity-frontend/tree/main) | [Backend Repository](https://github.com/zerogravity-project/zerogravity-backend)

### Why ZeroGravity?

- 🎨 **Visual Emotion Tracking** - Transform abstract emotions into tangible 3D visualizations
- 📊 **Data-Driven Insights** - Analyze emotional patterns over time with interactive charts
- 🤖 **AI-Powered Suggestions** - Get intelligent emotion predictions from diary entries
- 🧩 **Cross-Platform** - Seamlessly sync between web app and Chrome extension

---

## ✨ Key Features

| Feature                    | Description                                                     | Tech                   |
| -------------------------- | --------------------------------------------------------------- | ---------------------- |
| 🌍 **3D Emotion Planets**  | Custom GLSL shaders with simplex noise, smooth lerp transitions | Three.js, R3F, Lamina  |
| 📝 **3-Step Recording**    | Emotion Level → Reason → Diary with URL-based navigation        | React Context, Next.js |
| 📅 **Responsive Calendar** | Desktop/mobile calendar with emotion detail drawer              | date-fns, Radix UI     |
| 📊 **Chart Analytics**     | Time period navigation (week/month/year) with statistics        | Chart.js               |
| 🤖 **AI Prediction**       | Gemini-powered emotion suggestions from diary entries           | Google Gemini API      |
| 🧩 **Chrome Extension**    | New tab override synced with web app (auth & theme)             | Vite, Manifest V3      |
| 🔐 **OAuth Auth**          | Google & Kakao social login with secure session                 | NextAuth v5            |
| 🧘 **Spaceout Mode**       | Meditation feature with sequential video playback               | Next.js                |

---

## 🛠 Tech Stack

|       Category       | Technologies                                             |
| :------------------: | :------------------------------------------------------- |
|     **Frontend**     | Next.js 15 (App Router), React 19, TypeScript            |
|   **3D Graphics**    | Three.js, React Three Fiber, Lamina, Custom GLSL Shaders |
|        **AI**        | Google Gemini API                                        |
|  **Authentication**  | NextAuth v5 (Google, Kakao OAuth)                        |
| **State Management** | TanStack Query, React Context                            |
|     **Styling**      | Tailwind CSS 4, Radix UI Themes                          |
|      **Build**       | pnpm Workspace, Vite (library mode)                      |
|      **Deploy**      | Docker, nginx, OCI (Oracle Cloud), GitHub Actions        |
|      **DevOps**      | Zero-downtime deployment, Health checks, Auto-rollback   |

---

## 🏗 Architecture

```
zerogravity-react/
├── packages/
│   ├── web/              # Next.js 15 Web Application
│   │   ├── src/app/      # App Router with route groups
│   │   │   ├── (public)/ # Login, Home, Terms
│   │   │   └── (protected)/ # Record, Profile, Spaceout
│   │   ├── src/services/ # API service layer (dto/query/service)
│   │   └── src/lib/      # Auth, Axios configuration
│   │
│   ├── extension/        # Chrome Extension (Manifest V3)
│   │   ├── src/lib/      # Chrome Cookies API integration
│   │   └── public/       # Extension manifest & assets
│   │
│   └── shared/           # Shared Library
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

**The Challenge**: I wanted to build a Chrome Extension to improve accessibility - users could see their emotion planet right from their new tab. But Chrome Extensions don't support SSR, making Next.js unusable for the extension.

**The Solution**: Instead of migrating everything to Vite (losing Next.js benefits), I created a shared package containing the 3D planet and common UI components. The extension displays the same home experience, then links users to the full web app for recording and analytics.

**The Result**:

- **`packages/web`**: Full Next.js app with SSR, auth, and all features
- **`packages/extension`**: Lightweight Vite build for Chrome new tab
- **`packages/shared`**: Common components used by both (3D planet, clock, theme)

---

## 🔧 Technical Challenges & Solutions

### 1. Monorepo Package Architecture

**Problem**: Share UI components between Next.js app and Chrome Extension with full type safety

**Solution**:

- pnpm workspace with 3 packages (web, extension, shared)
- Vite library mode with multiple entry points
- TypeScript declaration generation for shared package

**Outcome**: Tree-shakeable shared library with full type safety across packages

### 2. Custom 3D Shaders for Emotion Visualization

**Problem**: Need organic, smooth emotion visualization that morphs based on emotional state

**Solution**:

- Custom GLSL vertex shader with simplex noise 4D (Ian McEwan's Ashima Arts implementation)
- Smooth lerp transitions (0.03 speed) for colors, frequencies, and material properties
- `three-custom-shader-material` for extending MeshPhysicalMaterial

**Outcome**: Visually engaging 3D planets that smoothly morph based on emotion level

```glsl
// Wobble effect using simplex noise
float getWobble(vec3 position) {
  vec3 warpedPosition = position;
  warpedPosition += simplexNoise4d(vec4(
    position * uWarpPositionFrequency,
    uTime * uWarpTimeFrequency
  )) * uWarpStrength;

  return simplexNoise4d(vec4(
    warpedPosition * uPositionFrequency,
    uTime * uTimeFrequency
  )) * uStrength;
}
```

### 3. Cross-Context Authentication (Web ↔ Extension)

**Problem**: Chrome Extension needs to access NextAuth session from web app without separate login

**Solution**:

- Chrome Cookies API reads NextAuth session cookies (`authjs.session-token`)
- HTTP/HTTPS cookie name handling for different environments
- Session validation via `/api/auth/session` endpoint

**Outcome**: Seamless authentication - login once on web, automatically authenticated in extension

### 4. Zero-Downtime Deployment Strategy

**Problem**: 502 errors during failed deployments caused service interruption

**Solution**:

- **Build-first strategy**: Build new Docker image BEFORE stopping old container
- **Image-based rollback**: Backup current image, restore instantly on failure (no rebuild)
- **150-second health check**: 30 attempts × 5 seconds with container inspection

**Outcome**: Old container keeps running if build fails, instant rollback from backup image

```yaml
# Build new image (old container still running)
docker build -t zerogv-frontend:${ENV}-new .

# Backup current image
docker tag zerogv-frontend:${ENV} zerogv-frontend:${ENV}-backup

# Swap containers only after successful build
docker compose down && docker compose up -d
```

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

## 📸 Screenshots

> 🚧 Screenshots are being prepared...

<!--
> Responsive design across all pages - Desktop and Mobile views

### 🏠 Home & Login

Main landing page with interactive 3D emotion planet and OAuth login.

| | Desktop | Mobile |
|:-:|:-------:|:------:|
| **Home** | ![Home Desktop](screenshots/home-desktop.png) | ![Home Mobile](screenshots/home-mobile.png) |
| **Login** | ![Login Desktop](screenshots/login-desktop.png) | ![Login Mobile](screenshots/login-mobile.png) |

- **Home**: Interactive 3D planet visualization with real-time emotion color mapping
- **Login**: Google & Kakao OAuth social login

### 🧘 Onboarding (Spaceout)

Optional meditation flow before emotion recording - helps users relax and reflect.

| | Desktop | Mobile |
|:-:|:-------:|:------:|
| **Selection** | ![Spaceout Select Desktop](screenshots/spaceout-select-desktop.png) | ![Spaceout Select Mobile](screenshots/spaceout-select-mobile.png) |
| **Video** | ![Spaceout Video Desktop](screenshots/spaceout-video-desktop.png) | ![Spaceout Video Mobile](screenshots/spaceout-video-mobile.png) |

- **Selection**: Choose to enter spaceout mode or skip to recording
- **Video**: Sequential meditation videos with ambient sound

### 📝 Emotion Recording

3-step emotion recording flow with AI-powered suggestions.

| | Desktop | Mobile |
|:-:|:-------:|:------:|
| **Step 1: Emotion** | ![Record Emotion Desktop](screenshots/record-emotion-desktop.png) | ![Record Emotion Mobile](screenshots/record-emotion-mobile.png) |
| **Step 2: Reason** | ![Record Reason Desktop](screenshots/record-reason-desktop.png) | ![Record Reason Mobile](screenshots/record-reason-mobile.png) |
| **Step 3: Diary** | ![Record Diary Desktop](screenshots/record-diary-desktop.png) | ![Record Diary Mobile](screenshots/record-diary-mobile.png) |

- **Step 1**: Select emotion level (1-7) with real-time 3D planet preview
- **Step 2**: Choose reasons for your emotion from predefined categories
- **Step 3**: Write diary entry with optional AI emotion prediction

### 📊 Analytics

Track and analyze emotional patterns over time.

| | Desktop | Mobile |
|:-:|:-------:|:------:|
| **Calendar** | ![Calendar Desktop](screenshots/calendar-desktop.png) | ![Calendar Mobile](screenshots/calendar-mobile.png) |
| **Chart** | ![Chart Desktop](screenshots/chart-desktop.png) | ![Chart Mobile](screenshots/chart-mobile.png) |

- **Calendar**: Monthly view with emotion indicators, detail drawer on date selection
- **Chart**: Week/month/year statistics with emotion counts, levels, and reasons

### 🤖 AI Features

Gemini-powered intelligent emotion analysis.

| | Desktop | Mobile |
|:-:|:-------:|:------:|
| **Emotion Prediction** | ![AI Prediction Desktop](screenshots/ai-prediction-desktop.png) | ![AI Prediction Mobile](screenshots/ai-prediction-mobile.png) |
| **Period Analysis** | ![AI Analysis Desktop](screenshots/ai-analysis-desktop.png) | ![AI Analysis Mobile](screenshots/ai-analysis-mobile.png) |

- **Emotion Prediction**: AI suggests emotions based on diary content
- **Period Analysis**: Weekly/monthly/yearly emotion pattern insights

### 🧩 Chrome Extension

New tab override synced with web app authentication and theme.

| New Tab Override |
|:----------------:|
| ![Chrome Extension](screenshots/extension.png) |

- Displays current emotion planet with synced theme colors
- Quick access to web app for emotion recording
-->

---

## 🗓 Roadmap

- [ ] Mobile app (React Native)
- [ ] More emotion visualization themes
- [ ] Social features (share emotions with friends)
- [ ] Advanced AI insights with trend analysis

---

## 🔗 Related

- [Backend (Spring Boot)](https://github.com/zerogravity-project/zerogravity-backend)
- [Original Vue Version](https://github.com/zerogravity-project/zerogravity-frontend/tree/main)

---

## 👤 Author

**Minuk Hwang** - Fullstack Developer

---

<div align="center">

Made with ❤️ and ☕

</div>
