# ECSG1 - Enterprise Cleaning Services Platform

A modern, production-ready Next.js 15 application for enterprise cleaning services with AI-powered booking, gamification, and transparent pricing.

## 🚀 Features

### Core Features
- **Multi-Step Booking System** - Intuitive step-by-step booking flow with service selection, date/time picker, and confirmation
- **AI Assistant** - Built-in chatbot for service recommendations, pricing info, and booking assistance
- **Gamification & Rewards** - Points system, achievement badges, and redeemable rewards
- **Dynamic Pricing** - Transparent pricing tiers with interactive calculator and frequency discounts
- **Responsive Design** - Fully responsive with mobile-first approach
- **Type-Safe** - Full TypeScript support with strict mode

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 3, Framer Motion
- **State Management**: Zustand with persistence
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
ECSG1/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Main landing page
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── ai-assistant/           # AI chatbot components
│   │   │   ├── AIAssistant.tsx     # Floating chat widget
│   │   │   └── ChatWindow.tsx      # Chat interface
│   │   ├── booking-steps/          # Booking flow components
│   │   │   ├── BookingForm.tsx     # Main booking container
│   │   │   ├── StepWizard.tsx      # Progress indicator
│   │   │   ├── ServiceSelection.tsx
│   │   │   ├── DateTimePicker.tsx
│   │   │   ├── BookingDetails.tsx
│   │   │   └── BookingConfirmation.tsx
│   │   ├── gamification/           # Rewards & achievements
│   │   │   ├── GamificationSection.tsx
│   │   │   ├── PointsTracker.tsx
│   │   │   ├── AchievementBadges.tsx
│   │   │   └── RewardsDisplay.tsx
│   │   ├── pricing/                # Pricing components
│   │   │   ├── PricingSection.tsx
│   │   │   ├── PricingTiers.tsx
│   │   │   └── PricingCalculator.tsx
│   │   ├── landing/                # Landing page sections
│   │   │   └── HeroSection.tsx
│   │   ├── layout/                 # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── providers.tsx           # App providers
│   ├── store/                      # Zustand stores
│   │   ├── bookingStore.ts         # Booking state
│   │   ├── gamificationStore.ts    # Points & rewards
│   │   ├── chatStore.ts            # Chat state
│   │   └── uiStore.ts              # UI state
│   ├── types/                      # TypeScript types
│   │   └── index.ts                # All type definitions
│   ├── data/                       # Mock data
│   │   └── mockData.ts             # Sample services, pricing, etc.
│   └── lib/                        # Utilities
│       └── utils.ts                # Helper functions
├── public/                         # Static assets
├── next.config.js                  # Next.js configuration
├── tailwind.config.js              # Tailwind configuration
├── postcss.config.js               # PostCSS configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json
```

## 🎯 Key Components

### Booking System
- 4-step wizard: Services → Date/Time → Details → Confirmation
- Service selection with quantity controls
- Interactive calendar with date picker
- Time slot selection
- Form validation with Zod
- Persistent booking state (localStorage)

### AI Assistant
- Floating chat widget
- Simulated AI responses
- Intent detection (booking, pricing, recommendations)
- Typing indicators
- Message history

### Gamification
- Points tracking (available, total, lifetime)
- Level system (Bronze → Silver → Gold → Platinum → Diamond)
- Achievement badges with unlock mechanism
- Redeemable rewards with point costs
- Progress bars and visual indicators

### Pricing
- 3 pricing tiers with feature comparison
- Interactive calculator with service selection
- Add-ons customization
- Frequency discounts (weekly: 20%, biweekly: 15%, monthly: 10%)
- Real-time price calculation

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific variables:

```env
# API endpoints (when connecting to backend)
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Customization
- **Colors**: Edit `tailwind.config.js` theme section
- **Services**: Modify `src/data/mockData.ts`
- **Achievements**: Update `mockAchievements` array
- **Rewards**: Edit `mockRewards` array

## 📊 State Management

The app uses Zustand for state management with localStorage persistence:

### Stores
1. **bookingStore** - Booking flow state (services, date, address)
2. **gamificationStore** - Points, achievements, rewards
3. **chatStore** - Chat messages and UI state
4. **uiStore** - Mobile menu, scroll position, active section

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```bash
# Build Docker image
docker build -t ecsg1 .

# Run container
docker run -p 3000:3000 ecsg1
```

## 📝 Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#0ea5e9 → #0c4a6e)
- **Accent**: Purple (#d946ef → #701a75)
- **Success**: Green (#22c55e)
- **Warning**: Yellow (#eab308)
- **Error**: Red (#ef4444)

### Typography
- Font: Inter (Google Fonts)
- Weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@ecsg1.com or open an issue in the repository.

---

Built with ❤️ using Next.js 15 and React 19
