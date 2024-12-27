# Rectangle Battle Game

A fast-paced, two-player battle game where players control rectangles with strategic offensive and defensive capabilities. Built with React and styled using Tailwind CSS.

## 🎮 Game Overview

Battle Game is a strategic multiplayer game where two players control rectangles with special "striped" sides. The goal is to attack your opponent's vulnerable sides while protecting your own.

### Key Features

- Two-player local multiplayer
- Dynamic movement system
- Strategic combat mechanics
- Health power-ups
- Real-time health tracking
- Bouncing border mechanics
- Responsive controls

## 🎯 Game Mechanics

### Player Controls

- **Player 1:**
  - W: Move Up
  - S: Move Down
  - A: Move Left
  - D: Move Right

- **Player 2:**
  - ↑: Move Up
  - ↓: Move Down
  - ←: Move Left
  - →: Move Right

### Combat System

- Each rectangle has red stripes on two opposing sides
- Stripes change orientation based on movement direction:
  - Horizontal movement: Vertical stripes
  - Vertical movement: Horizontal stripes
- Damage occurs only when a striped side hits a non-striped side
- No damage when:
  - Striped sides collide with each other
  - Non-striped sides collide with each other

### Power-Ups

- Yellow power-up orbs appear randomly on the field
- Collecting a power-up restores 20 health points
- Maximum health is capped at 100

### Movement & Boundaries

- Players move continuously in their last chosen direction
- Rectangles bounce off the game borders
- Movement speed remains constant
- Size decreases as health decreases

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/omkar-107/battle-box.git
```

2. Install dependencies:
```bash
cd battle-game
npm install
```

3. Start the development server:
```bash
npm start
```

### Building for Production

```bash
npm run build
```

## 🛠️ Technical Implementation

Built using:
- React for game logic and UI
- Tailwind CSS for styling
- Lucide React for icons
- CSS Gradients for visual effects

Key technical features:
- Collision detection system
- Real-time game loop
- State management with React hooks
- Responsive design
- Smooth animations

## 🎨 Styling

The game features a modern, sleek design with:
- Gradient backgrounds
- Glowing effects
- Responsive layouts
- Dynamic health bars
- Smooth transitions
- Grid background pattern

## 🎯 Game Flow

1. Start Screen:
   - Press SPACE to begin
   - Displays control instructions

2. Gameplay:
   - Players move and attempt to damage each other
   - Collect power-ups to restore health
   - Health bars show current status

3. Game Over:
   - Displays winner
   - Shows final health statistics
   - Press SPACE to restart

## 🔄 Future Enhancements

Potential features for future updates:
- Online multiplayer support
- Additional power-up types
- Different game modes
- Customizable controls
- Special abilities
- Score tracking system
- Sound effects and music

## 📝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License 