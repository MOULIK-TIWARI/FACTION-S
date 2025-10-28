## Reddit Factions - Elemental Strategy Game

A turn-based strategy game built on Reddit's Devvit platform where players join elemental factions and battle for supremacy through collective decision-making.

### 🎮 What is Reddit Factions?

Reddit Factions is an innovative multiplayer strategy game that transforms Reddit users into faction warriors. Players choose from four elemental factions (Fire, Water, Earth, Air) and participate in turn-based battles where the majority vote determines each faction's action. It's a unique blend of democracy and strategy that leverages Reddit's community-driven nature.

The game runs directly within Reddit posts, creating a seamless social gaming experience where players can discuss strategy in the comments while making tactical decisions through an intuitive web interface. Each faction starts with 100 HP and 0 score, and players must work together to survive attacks while maximizing their faction's score through strategic voting.

### ⚡ What Makes This Game Unique?

- **Democratic Strategy**: Unlike traditional strategy games, individual players don't control units directly. Instead, each faction's action is determined by majority vote from all players in that faction
- **Reddit Integration**: Seamlessly integrated into Reddit posts, allowing for natural community engagement and discussion in the comments
- **Real-time Collective Decision Making**: Players must coordinate and discuss strategy within their faction to succeed, creating emergent social gameplay
- **Persistent Game State**: Games continue across multiple Reddit sessions, with results stored and displayed for ongoing engagement
- **Automated Turn Processing**: Turns process automatically every 24 hours, creating anticipation and allowing global participation across time zones
- **Rock-Paper-Scissors Combat**: Strategic depth through action interactions (Attack vs Defend vs Train) with nuanced damage calculations
- **Live Leaderboard**: Real-time faction standings showing HP, score, and player counts with visual indicators for the leading faction
- **Turn History**: Detailed battle results showing exactly what happened each turn, including damage dealt and strategic outcomes

### 🏛️ The Four Factions

- **🔥 Fire**: Masters of destruction and raw power
- **💧 Water**: Fluid and adaptable warriors  
- **🌍 Earth**: Steadfast defenders of the realm
- **💨 Air**: Swift and unpredictable fighters

### 🎯 How to Play

#### Step 1: Access the Game
1. Find a Reddit Factions post in a participating subreddit
2. Click the "Launch App" button to open the game interface
3. The game will load showing your Reddit username and current game state

#### Step 2: Join a Faction
1. When you first open the game, you'll see the faction selection screen with four options:
   - **🔥 Fire**: Masters of destruction and raw power (Red)
   - **💧 Water**: Fluid and adaptable warriors (Blue)  
   - **🌍 Earth**: Steadfast defenders of the realm (Green)
   - **💨 Air**: Swift and unpredictable fighters (Gray)
2. Click on your chosen faction to join
3. **Important**: Once you join a faction, you cannot change - choose wisely!

#### Step 3: Cast Your Vote
1. After joining a faction, you'll see the voting panel showing your faction affiliation
2. Choose from three possible actions for your faction:
   - **⚔️ Attack**: Deal damage to another faction (you must select a target faction)
   - **🛡️ Defend**: Reduce incoming damage from attacks to your faction
   - **💪 Train**: Gain 10 score points but become vulnerable to full attack damage
3. If you choose Attack, select which faction to target from the dropdown menu
4. Click "Submit Vote" to cast your ballot for the current turn
5. Once voted, you'll see a confirmation and must wait for the next turn

#### Step 4: Monitor the Battle
1. **Leaderboard**: View real-time faction standings showing:
   - Current HP (out of 100) with visual health bars
   - Total score points earned
   - Number of players in each faction
   - Your faction is highlighted with a "YOUR FACTION" badge
2. **Turn Timer**: See exactly when the next turn will process (every 24 hours)
3. **Turn Results**: Review detailed results from the previous turn showing:
   - What action each faction took
   - Damage dealt and received
   - Score points gained
   - Strategic outcomes and interactions

#### Step 5: Strategic Gameplay
- **Combat System**: 
  - **Attack vs Defend**: Defender wins (attacker deals only 5 damage instead of 20)
  - **Attack vs Train**: Attacker wins (full 20 damage, but trainer still gets 10 score)
  - **Attack vs Attack**: Both factions take 15 damage in mutual combat
  - **Train safely**: Gain 10 score points when not attacked
- **Victory Conditions**: Survive with HP while maximizing your faction's score
- **Coordination**: Discuss strategy with your faction members in the Reddit post comments
- **Timing**: Plan your votes knowing turns process automatically every 24 hours

#### Step 6: Ongoing Participation
1. After each turn resolves, all players can vote again for the next turn
2. Game continues indefinitely until moderators restart
3. Use the "🔄 Refresh Game State" button to get the latest information
4. Track your faction's progress and adapt your strategy based on results
5. Engage with other players in the Reddit comments to coordinate faction strategy

#### Advanced Features
- **Admin Controls**: Moderators can restart the game using the admin panel
- **Auto-refresh**: Game state automatically updates every 30 seconds
- **Mobile Optimized**: Fully responsive design works on all devices
- **Real-time Updates**: Live faction standings and turn countdown timers

### 🛠️ Technical Stack

- [Devvit](https://developers.reddit.com/): Reddit's developer platform for immersive games
- [React](https://react.dev/): Frontend UI framework
- [TypeScript](https://www.typescriptlang.org/): Type-safe development
- [Express](https://expressjs.com/): Backend API server
- [Redis](https://redis.io/): Game state persistence
- [Tailwind CSS](https://tailwindcss.com/): Styling framework
- [Vite](https://vite.dev/): Build tool and development server

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
