# 🌱 BLOOM
> **Grow at your own pace.**

BLOOM is a premium student wellness, self-growth, productivity, and social community mobile application built with **React Native**, **Expo**, **Expo Router**, and **TypeScript**.

---

## ✨ Features (Phase 1 — Mobile UI Foundation)

- **Calming Sage Green & Warm Ivory Identity**: Consistent design tokens, soft pastel backgrounds, rounded cards, subtle shadows, and comfortable spacing.
- **Header**: Dynamic time-of-day greeting (*"Good morning, Melroy 🌱"*), motivational subtitle, notification alert dot, and profile avatar.
- **Daily Inspiration**: Botanical quote card with leaf motifs.
- **Before & After Growth Journey**:
  - Interactive Before/After toggle directly inspired by the design reference.
  - **Before**: Warm sunset cluttered workspace scene (`#F9E4D4` → `#C9A992`), low productivity alert banner, baseline statistics.
  - **After**: Calming mountain/lake landscape (`#D2EBE4` → `#78B29C`), high productivity badge, growth statistics.
- **Today's Overview**: 2x2 grid of productivity statistics (Tasks Done, Focus Time, Energy Level, Screen Time) with live progress indicators.
- **Quick Access**: Quick action navigation cards routing to Heal Zone, Bloom AI, Add Journal, and Focus Mode.
- **Your Daily Goals**: Interactive checklist with local state, check toggle, strikethrough styling, dynamic completion percentage bar, and celebration feedback.
- **Closing Motivation**: Botanical card with signature Bloom seedling branding.
- **Bottom Navigation Bar**: 5 sections with Lucide icons, safe-area insets, and active pill backgrounds:
  1. 🏠 **Home**
  2. 💚 **Heal Zone** (Healing Bubble, Music Zone, Journal, Mood Tracking, Healing Games)
  3. ✨ **AI Companion** (Bloom AI welcome, character personality selector, preview dialogue, chat input UI)
  4. 📋 **Tasks** (Screen Time, Assignment Tracker, Student Tasks, Sleep Tracking, Stress Tracking, Goals, SOS Signal, Focus Mode)
  5. 👥 **Collabs** (Global Community, Friends, Trending Challenges, Group Streaks, Community Activity)

---

## 🛠️ Technology Stack

- **Framework**: React Native 0.88 & Expo SDK 58
- **Language**: TypeScript
- **Routing**: Expo Router v58
- **Icons**: Lucide React Native
- **Gradients**: Expo Linear Gradient
- **Styling**: React Native StyleSheet with custom design tokens
- **Device Support**: Expo Safe Area Context, Android/iOS compatible with Expo Go

---

## 📂 Project Structure

```text
bloom/
├── app/
│   ├── _layout.tsx                     # Root layout (SafeAreaProvider, StatusBar)
│   └── (tabs)/
│       ├── _layout.tsx                 # 5-tab bottom navigation
│       ├── index.tsx                   # Home Dashboard
│       ├── heal-zone.tsx               # Heal Zone
│       ├── ai.tsx                      # AI Companion
│       ├── tasks.tsx                   # Tasks & Tracking
│       └── collabs.tsx                 # Collabs & Community
├── components/
│   ├── common/
│   │   ├── SectionHeader.tsx           # Reusable section header
│   │   ├── ProfileAvatar.tsx           # Circular avatar with initials
│   │   ├── PrimaryButton.tsx           # Styled button with variants
│   │   └── EmptyStateCard.tsx          # Empty state placeholder
│   ├── dashboard/
│   │   └── BloomHeader.tsx             # Header component
│   └── cards/
│       ├── QuoteCard.tsx               # Daily inspiration card
│       ├── ProgressComparisonCard.tsx  # Before/After comparison card
│       ├── StatisticCard.tsx           # Stat cards with progress bars
│       ├── QuickActionCard.tsx         # Quick action navigation cards
│       └── DailyGoalCard.tsx           # Interactive goal card
├── constants/
│   ├── colors.ts                       # Brand design tokens
│   ├── spacing.ts                      # Spacing, radius & icon sizes
│   ├── typography.ts                   # Typography scale presets
│   └── shadows.ts                      # Multi-platform shadow presets
├── data/
│   └── mockData.ts                     # Local demo data
├── types/
│   └── index.ts                        # TypeScript interfaces
├── design-references/                  # Original design mockups
└── assets/                             # Icons, splashes, and QR codes
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npx expo start
```
Or with LAN connection for physical devices on the same Wi-Fi:
```bash
npx expo start --lan
```

### 3. Open on Android via Expo Go
1. Install **Expo Go** from Google Play Store on your Android phone.
2. Ensure your phone and development machine are connected to the same Wi-Fi network.
3. Open Expo Go and scan the QR code displayed in the terminal.

---

## 📄 License
MIT
