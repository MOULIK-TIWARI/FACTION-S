## Reddit Factions - Elemental Strategy Game

A revolutionary turn-based strategy game built on Reddit's Devvit platform where players join elemental factions and battle for supremacy through collective decision-making and democratic warfare.

### 🎮 What is Reddit Factions?

Reddit Factions is an innovative multiplayer strategy game that transforms Reddit users into faction warriors in an epic battle for elemental supremacy. Players choose from four distinct elemental factions (🔥 Fire, 💧 Water, 🌍 Earth, 💨 Air) and participate in turn-based battles where the majority vote determines each faction's action every 2 minutes. It's a unique blend of democracy, strategy, and social gaming that leverages Reddit's community-driven nature.

The game runs as a complete React web application directly within Reddit posts using Devvit's platform, creating a seamless social gaming experience where players can discuss strategy in the comments while making tactical decisions through an intuitive, mobile-optimized interface. Each faction starts with 100 HP and 0 score, and players must work together to survive attacks while maximizing their faction's score through strategic coordination and tactical voting.

### ⚡ What Makes This Game Revolutionary?

**🗳️ Democratic Warfare System**
- Unlike traditional strategy games, individual players don't control units directly. Instead, each faction's action is determined by majority vote from all players in that faction, creating unprecedented collective decision-making gameplay
- Every 2 minutes, all votes are tallied and the most popular action for each faction is executed simultaneously, leading to dramatic turn-by-turn battles

**🌐 Seamless Reddit Integration**
- Built as a complete React 19 web application using Devvit's platform, seamlessly integrated into Reddit posts for natural community engagement
- Players can discuss strategy, coordinate attacks, and form alliances directly in Reddit comments while playing the game
- No external apps or downloads required - everything happens within Reddit's ecosystem with automatic Reddit authentication

**⚔️ Strategic Combat Triangle**
- **Attack vs Defend**: Defenders win (attackers deal only 5 damage instead of 20)
- **Attack vs Train**: Attackers win (full 20 damage dealt, but trainers still get 10 score)
- **Mutual Attacks**: Both factions take 15 damage in simultaneous combat
- **Safe Training**: Gain 10 score points when not under attack from any faction

**🎯 Real-time Social Strategy**
- Live faction coordination through Reddit's comment system creates emergent social gameplay
- Players must balance individual goals with faction loyalty and collective strategy
- Real-time leaderboard updates every 15 seconds with animated health bars and faction rankings

**📱 Mobile-First Design**
- Fully responsive React interface optimized for mobile Reddit browsing with Tailwind CSS
- Touch-friendly faction selection with scaling animations and intuitive voting panels
- Seamless experience across desktop and mobile devices with user-scalable disabled for app-like feel

**⏰ Automated Turn Processing**
- Turns process automatically every 2 minutes with live countdown timers
- No waiting for other players - the game continues 24/7 with persistent Redis state
- Players can vote once per turn and see results immediately when turns process

**🏗️ Advanced Technical Architecture**
- Built with React 19, TypeScript 5.8, and Vite 6.2 for optimal performance
- Express 5.1 server with RESTful API endpoints and Redis data persistence
- Real-time game state synchronization with intelligent auto-refresh and error recovery
- Comprehensive admin controls for moderators with game restart and manual turn processing

### 🏛️ The Four Factions

- **🔥 Fire**: Masters of destruction and raw power (Red theme, aggressive playstyle)
- **💧 Water**: Fluid and adaptable warriors (Blue theme, balanced strategy)
- **🌍 Earth**: Steadfast defenders of the realm (Green theme, defensive focus)
- **💨 Air**: Swift and unpredictable fighters (Gray theme, tactical flexibility)

### 🎯 Complete Step-by-Step Guide

#### 🚀 Step 1: Access the Game
1. **Find a Reddit Factions post** in a participating subreddit (or create one using moderator menu)
2. **View the splash screen** with the title "⚔️ Reddit Factions War" and description "Choose your faction and battle for supremacy! Vote daily on Attack, Defend, or Train actions. Will your faction dominate the leaderboard?"
3. **Click "Join the Battle!"** button on the splash screen to open the full React application interface
4. **Game loads instantly** as a complete web application within Reddit, showing your Reddit username and current game state

#### ⚔️ Step 2: Choose Your Faction (One-Time Decision)
1. **Faction Selection Screen** displays four elemental factions with interactive cards:
   - **🔥 Fire**: "Masters of destruction and raw power" (Red theme, aggressive playstyle)
   - **💧 Water**: "Fluid and adaptable warriors" (Blue theme, balanced strategy)  
   - **🌍 Earth**: "Steadfast defenders of the realm" (Green theme, defensive focus)
   - **💨 Air**: "Swift and unpredictable fighters" (Gray theme, tactical flexibility)

2. **Interactive Faction Cards** feature:
   - Large emoji icons for instant recognition
   - Hover scaling effects and smooth animations with transform scale
   - Strategic descriptions for each faction's playstyle
   - Mobile-optimized responsive grid layout (2x2 on mobile, 4x1 on desktop)
   - Color-coded themes matching faction identity

3. **Click your chosen faction** to join permanently
4. **⚠️ CRITICAL**: Once you join a faction, you cannot change - choose based on your preferred strategy!

#### 🗳️ Step 3: Cast Your Strategic Vote
1. **Voting Panel** appears showing your faction affiliation with color-coded styling
2. **Choose from three strategic actions** (displayed as interactive buttons):
   - **⚔️ Attack**: Deal 20 damage to target faction (5 damage if they defend)
   - **🛡️ Defend**: Reduce all incoming damage to your faction to only 5 HP
   - **💪 Train**: Gain 10 score points (vulnerable to full 20 damage from attacks)

3. **Interactive Voting Interface**:
   - Grid of action buttons with live vote counts displayed
   - Selected action highlighted with teal background and checkmark
   - Target selection dropdown for Attack actions (cannot attack your own faction)
   - Real-time vote tallies shown on each action button

4. **Submit Your Vote**:
   - Click "Submit Vote" to cast your ballot for the current turn
   - Green confirmation appears: "✅ Vote Submitted! You have voted this turn."
   - Wait for turn processing (every 2 minutes) to see results

#### 📊 Step 4: Monitor Real-Time Battle Progress
1. **Faction Header Bar** (top of screen):
   - **Live HP display** for all four factions with emoji indicators
   - **Color-coded faction names** (Fire=red, Water=blue, Earth=green, Air=gray)
   - **Current round information** with "Vote now!" call-to-action
   - **Dark theme styling** for clear visibility and contrast

2. **Live Leaderboard Sidebar**:
   - **Health Stats section** showing current HP for all factions
   - **Global Power Rankings** with faction positioning by score
   - **Player counts** showing faction membership size
   - **Your faction highlighted** with star (★) indicator
   - **Crown icon** (👑 LEADING) for highest-scoring faction

3. **Turn Timer Widget**:
   - **Precise countdown** in format "1m 34s" until next turn processing
   - **Status updates**: "Ready!" when processing is imminent
   - **Auto-refresh** every 5 seconds for accurate timing
   - **Processing animation** with spinning ⚡ during turn resolution
   - **Compact mode** for sidebar display with essential information only

4. **Battle Updates Section**:
   - **Latest turn results** with sample battle narratives like:
     - "🔥 Fire attacked 🌍 Earth!"
     - "🔥 Fire attacked 🌍 Earth defended successfully!"
     - "💧 Water trained, increasing their resolve by 10 HP."
   - **Action summaries** for each faction with emoji indicators
   - **Real battle results** when turns are processed

#### 🎮 Step 5: Master the Strategic Combat System
**Combat Triangle Mechanics**:
- **🛡️ Attack vs Defend**: Defender wins (attacker deals only 5 damage instead of 20)
- **⚔️ Attack vs Train**: Attacker wins (full 20 damage, but trainer still gets 10 score)
- **⚔️ Mutual Attacks**: Both factions take 15 damage simultaneously
- **💪 Safe Training**: Gain 10 score when no faction attacks you

**Victory Conditions**:
- **Survival**: Keep your faction's HP above 0
- **Dominance**: Maximize faction score through strategic training
- **Coordination**: Work with faction members for collective success

**Strategic Considerations**:
- **Timing**: Coordinate attacks when enemies are training (vulnerable)
- **Defense**: Defend when multiple factions might attack you
- **Training**: Train when you're safe to build score advantage
- **Alliances**: Use Reddit comments to coordinate with other factions

#### 🌐 Step 6: Engage in Social Strategy
1. **Reddit Comment Integration**:
   - **Built-in comment section** within the game interface
   - **Sample player interactions** showing strategic discussions
   - **Your username displayed** with faction affiliation in comments
   - **Real-time coordination** with faction members and opponents

2. **Real-Time Game Updates**:
   - **Auto-refresh every 15 seconds** without user action required
   - **Manual refresh available** for immediate updates
   - **Live connection status** (✅ Connected / 🔄 Updating)
   - **Persistent game state** continues 24/7 across Reddit sessions

3. **Game Information Panel**:
   - **Total player count** across all factions
   - **Connection status indicators** with real-time updates
   - **Quick access** to game rules and FAQ
   - **Mobile-optimized sidebar** with essential game information

#### 🛠️ Advanced Features & Tools
**For Regular Players**:
- **Mobile-first responsive design** with Tailwind CSS styling
- **Smooth animations** and hover effects for enhanced user experience
- **Error handling** with user-friendly messages and retry options
- **Loading states** with clear indicators during API operations
- **Auto-detection** of game state changes and turn processing

**For Moderators** (auto-detected by username containing 'mod' or 'admin'):
- **Compact Admin Panel** in sidebar with essential controls
- **Force Turn Processing** (⚡ Force Turn) for immediate turn resolution
- **Game Reset** (🔄 Restart) to restart with fresh faction stats
- **Confirmation dialogs** to prevent accidental administrative actions
- **Administrative API endpoints** for game management

#### 🏆 Winning Strategies
1. **Early Game**: Focus on training to build score advantage while HP is high
2. **Mid Game**: Balance attacks on weak factions with defensive positioning
3. **Late Game**: Coordinate with allies to eliminate threats and secure victory
4. **Communication**: Use Reddit comments to build faction loyalty and coordinate strategies
5. **Timing**: Vote strategically based on turn countdown and enemy patterns
6. **Adaptation**: Monitor leaderboard and adjust strategy based on faction standings

### 🛠️ Advanced Technical Stack

**🌐 Frontend Architecture**
- **[React 19](https://react.dev/)**: Latest React with StrictMode, createRoot, and modern hooks for optimal performance
- **[TypeScript 5.8](https://www.typescriptlang.org/)**: Strict type safety across entire codebase with project references
- **[Tailwind CSS 4.1](https://tailwindcss.com/)**: Utility-first CSS with custom animations, responsive design, and mobile-first approach
- **[Vite 6.2](https://vite.dev/)**: Lightning-fast build tool with hot module reloading and optimized production builds
- **Mobile-Optimized HTML**: Viewport configuration with user-scalable disabled for app-like experience

**⚙️ Backend Infrastructure**
- **[Devvit Platform](https://developers.reddit.com/)**: Reddit's developer platform for seamless Reddit integration and hosting
- **[Express 5.1](https://expressjs.com/)**: Modern Node.js server with RESTful API endpoints and comprehensive middleware
- **[Redis](https://redis.io/)**: Managed Redis instance via Devvit for game state persistence and real-time data
- **Node.js 22+**: Latest Node.js runtime with ES modules and modern JavaScript features

**🔧 Development Tools & Dependencies**
- **[ESLint 9](https://eslint.org/)**: Advanced code linting with TypeScript rules and React hooks validation
- **[Prettier 3.5](https://prettier.io/)**: Consistent code formatting with Tailwind CSS plugin support
- **[Concurrently](https://www.npmjs.com/package/concurrently)**: Parallel development server management for client, server, and Devvit
- **[Vitest 3.1](https://vitest.dev/)**: Fast unit testing framework with TypeScript support
- **Additional Libraries**: clsx, tailwind-merge for dynamic styling, @types packages for full TypeScript support

### 🏗️ Sophisticated Game Architecture

#### 🎯 React Application Structure
- **main.tsx**: Application entry point with React 19 createRoot and StrictMode for optimal performance and development debugging
- **App.tsx**: Central game orchestrator managing state, auto-refresh logic, conditional rendering, moderator detection, and user experience flow
- **useGame.ts**: Comprehensive custom hook managing game state, API calls, loading states, error handling, and user actions with full TypeScript safety
- **index.html**: Optimized HTML template with mobile viewport settings, user-scalable disabled, and full-height layout for seamless Reddit integration
- **index.css**: Tailwind CSS 4.1 imports with utility-first styling system and responsive design patterns

#### 🧩 Advanced Component Architecture
- **App.tsx**: Central game orchestrator with auto-refresh logic, moderator detection, conditional rendering, and comprehensive state management
- **FactionSelection.tsx**: Interactive faction onboarding with animated cards, hover scaling effects, strategic descriptions, and mobile-optimized responsive grid
- **VotingPanel.tsx**: Strategic action interface with interactive button grid, vote count displays, target selection, and compact mode for mobile
- **Leaderboard.tsx**: Real-time faction standings with animated HP bars, player counts, ranking systems, faction highlighting, and victory indicators
- **TurnSummary.tsx**: Comprehensive battle results with color-coded indicators, faction interactions, sample battle narratives, and emoji-enhanced readability
- **TurnTimer.tsx**: Live countdown system with 5-second updates, status messages, readiness indicators, and animated turn processing feedback
- **AdminPanel.tsx**: Moderator controls with game restart, manual turn processing, confirmation dialogs, and compact sidebar design
- **FactionHeader.tsx**: Dark-themed header bar with live HP display for all factions, round information, and responsive design for quick reference

#### 🔄 State Management & Data Flow
- **Centralized useGame Hook**: TypeScript-safe state management with comprehensive error handling and loading states
- **Intelligent Auto-refresh**: 15-second polling with turn processing detection and background synchronization
- **Real-time Updates**: Live faction standings, countdown timers, and instant feedback with smooth animations
- **Error Recovery**: User-friendly error messages with retry functionality and graceful degradation
- **Persistent State**: Redis-backed data persistence across Reddit sessions with automatic state restoration

#### 🌐 API & Backend Integration
- **RESTful Architecture**: Complete `/api/*` endpoint system for all game operations
  - `/api/init` - Game initialization and user authentication
  - `/api/join-faction` - Faction selection and player registration
  - `/api/vote` - Strategic action submission and validation
  - `/api/game-state` - Real-time game state synchronization
  - `/api/process-turn` - Automated turn processing and results
  - `/api/turn-status` - Live countdown and timing information
  - `/api/restart-game` - Administrative game reset functionality
  - `/api/force-turn` - Manual turn processing for moderators

- **Seamless Authentication**: Reddit user integration through Devvit middleware with automatic username detection
- **Redis Data Layer**: High-performance game state storage with vote tracking, player management, and turn scheduling
- **Automated Scheduling**: 2-minute turn processing with intelligent timing and manual override capabilities

## Getting Started

> Make sure you have Node 22 downloaded on your machine before running!

1. Run `npm create devvit@latest --template=react`
2. Go through the installation wizard. You will need to create a Reddit account and connect it to Reddit developers
3. Copy the command on the success page into your terminal

## Commands

- `npm run dev`: Starts a development server where you can develop your application live on Reddit.
- `npm run build`: Builds your client and server projects
- `npm run deploy`: Uploads a new version of your app
- `npm run launch`: Publishes your app for review
- `npm run login`: Logs your CLI into Reddit
- `npm run check`: Type checks, lints, and prettifies your app

## Cursor Integration

This template comes with a pre-configured cursor environment. To get started, [download cursor](https://www.cursor.com/downloads) and enable the `devvit-mcp` when prompted.
