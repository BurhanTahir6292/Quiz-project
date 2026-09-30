# ⚡ QuizSpark — React Quiz Challenge

A modern, fast, and responsive Quiz application built with **React 19**, **Vite**, and **Bootstrap 5**, featuring sound synthesis, real-time timer countdowns, customizable categories, instant answer review, and persistent leaderboard rankings.

---

## ✨ Features

- **🎯 Interactive Quiz Engine**: Multiple-choice questions covering Web Development, Programming, JavaScript, Science, and Geography.
- **⏳ Real-Time Countdown Timer**: 15-second per-question timer with dynamic color shifting (Green ➔ Amber ➔ Pulsing Red alert).
- **🔊 Synthesized Audio Effects**: In-browser audio synthesis using the native Web Audio API with zero external file dependencies (correct chime, wrong buzzer, fanfare, and ticks).
- **💡 Instant Feedback & Explanations**: Immediate didactic feedback after answering each question with fun facts and explanations.
- **🏆 Hall of Fame Leaderboard**: Persistent high-score rankings stored in `localStorage` with medal badges (🥇 Gold, 🥈 Silver, 🥉 Bronze) and real-time player search.
- **🎉 Celebratory Result Screen**: Particle confetti animations, accuracy percentage metrics, copy-to-clipboard sharing, and a complete question-by-question review mode.
- **💎 Sleek UI Design**: Modern frosted glassmorphism interface, custom typography (*Outfit* & *Inter*), and smooth micro-interactions.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler & Dev Server**: [Vite](https://vite.dev/)
- **Styling**: [Bootstrap 5](https://getbootstrap.com/) + Custom Glassmorphism CSS Design System
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio**: Native Web Audio API

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
