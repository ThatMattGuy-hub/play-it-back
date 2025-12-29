# Product Requirements Document (PRD)
## Project: Timeline Music Game (Working Title)

## 1. Overview

### 1.1 Summary
Timeline Music Game is a multiplayer party game inspired by *Hitster*, designed primarily for **Android mobile devices**, with a possible **web-based fallback**. The game allows multiple teams to compete by identifying songs and correctly placing them into a chronological timeline based on release year. All gameplay occurs inside the application — **no QR codes or physical cards required**.

The app integrates with **Spotify Premium** to stream music while hiding song metadata until revealed.

---

### 1.2 End Goal
Deliver a stable, fun, and intuitive digital party game that:
- Requires only one device to host gameplay
- Works fully inside the app
- Uses recognisable music
- Is simple enough for casual players but competitive enough for repeat play

---

## 2. Core Gameplay

### 2.1 Game Setup Flow
1. User selects **Start New Game**
2. User chooses number of teams (1–9)
3. Each team:
   - Is assigned a default name (Team 1, Team 2, etc.)
   - Can optionally edit the team name
4. Each team is assigned:
   - A **random starting year**
5. User selects a **Timeline Goal**
   - Default: 10 songs
   - Configurable (minimum 1, no hard max)

---

### 2.2 Turn-Based Gameplay
- Teams take turns in order
- On a team’s turn:
  1. Team taps **Play Song**
  2. App plays a **random Spotify track**
     - Song metadata hidden
  3. Players guess:
     - Song title
     - Artist
  4. Team taps **Reveal Song**
  5. Team marks:
     - ✅ Correct
     - ❌ Incorrect

---

### 2.3 Timeline Mechanics
- Each team has an independent timeline
- Timeline begins with the team’s **random starting year**
- If guess is correct:
  - The revealed song appears as a draggable card
  - Team must drag it into the correct chronological position
  - Team taps **Check Timeline**
    - If correct → song stays
    - If incorrect → song is discarded
- If guess is incorrect:
  - No timeline placement attempt
  - Turn immediately ends

---

### 2.4 Win Condition
- First team to reach the **timeline goal** (number of correctly placed songs) wins
- Game ends immediately upon win

---

## 3. Song Selection Strategy

### 3.1 Requirements
- Songs must be:
  - Recognisable
  - Spread across decades
  - Playable via Spotify
- Must support ~1000 songs minimum

---

### 3.2 Implementation Approach (V1)
**Curated Song Pool**
- Predefined list of Spotify track IDs
- Stored in backend or bundled JSON
- Each song includes:
  - Track ID
  - Title
  - Artist(s)
  - Release year

**Optional Mode (Future):**
- Allow host to select a Spotify playlist as the song pool

---

## 4. Functional Requirements

### 4.1 Game Management
- Start new game
- Restart game
- Reset game state
- Randomise starting years
- Prevent duplicate songs per game

### 4.2 Spotify Integration
- Spotify Premium required
- Login via Spotify OAuth
- Playback control only (no audio hosting)
- Metadata hidden until reveal

### 4.3 Timeline Validation Logic
- Compare inserted song year against:
  - Starting year
  - Existing timeline entries
- Accept placement only if strictly chronological

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Song playback latency < 1 second
- Timeline drag/drop must be smooth (60fps target)

### 5.2 Reliability
- Graceful handling of Spotify disconnects
- Clear error messaging if playback fails

### 5.3 Usability
- One-device party friendly UI
- Large buttons
- Minimal text during gameplay
- Clear visual timelines

---

## 6. Tech Stack

### 6.1 Frontend (Primary)
- **Android (Kotlin)**
- Jetpack Compose
- Spotify Android App Remote SDK

### 6.2 Alternative Frontend (Optional)
- Web app
- React + TypeScript
- Spotify Web Playback SDK

### 6.3 Backend
- Node.js (TypeScript)
- Lightweight REST API
- Responsibilities:
  - Serve random tracks
  - Track used songs per game
  - Host curated song pool

### 6.4 Authentication
- Spotify OAuth 2.0
- Premium account validation

### 6.5 Data Storage
- Song pool: JSON / database
- Game state:
  - Local device memory (V1)
  - Optional backend sync (future)

---

## 7. Out of Scope (V1)
- Multiplayer across multiple devices
- Chat or voice features
- User accounts beyond Spotify login
- Offline mode

---

## 8. Risks & Considerations
- Spotify API restrictions
- Spotify Premium dependency
- Licensing limitations
- Party environment UX challenges

---

## 9. Future Enhancements
- Difficulty modes
- Decade-specific games
- Leaderboards
- Online multiplayer
- Apple iOS support

---

## 10. Success Metrics
- Time to start game < 2 minutes
- High session completion rate
- Repeat play sessions
- Low rule clarification friction

---

## 11. Appendix

### 11.1 Key Entities
- Game
- Team
- Song
- TimelineEntry

### 11.2 Terminology
- Timeline Goal: Number of correctly placed songs required to win
- Starting Year: Random baseline year per team
