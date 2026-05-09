🚀 STAGE 1 — GAME SYSTEM CORE
Viết

You are a senior fullstack developer.

Build a modular mini game system for an English learning platform.

Requirements:

Support multiple games
Structure: Game → Set → Level
Each level belongs to a set
Each set has unlock condition

Database logic:

GameSets (id, name, order)
GameLevels (id, setId, levelNumber, difficulty, isLocked)
GameQuestions (id, levelId, type, content, answer)
UserGameProgress (userId, levelId, score, isCompleted)

Features:

Load levels by set
Lock/unlock system
Save progress
Calculate score

Output:

Backend structure (controller, service)
Sample API endpoints
🚀 STAGE 2 — MATCHING GAME
Viết

Build a Matching Game (Word Match).

Gameplay:

Match English word with Vietnamese meaning or image
Click or drag to match pairs
Show correct/incorrect feedback

Features:

Timer
Score system
Difficulty scaling by level

Frontend:

React component for matching UI
Animation when correct

Backend:

Load matching pairs from database

Output:

MatchingGame component
API integration
🚀 STAGE 3 — LISTENING GAME
Viết

Build a Listening Quiz game.

Gameplay:

Play audio
User selects correct answer

Features:

Replay audio
Multiple choice
Score tracking

Backend:

Store audio URL in database

Frontend:

Audio player + options

Output:

ListeningGame component
API endpoints
🚀 STAGE 4 — TYPING GAME
Viết

Build a Typing Challenge game.

Gameplay:

Show sentence or play audio
User types the correct sentence

Features:

Real-time checking
Speed calculation (WPM)
Accuracy score

Output:

TypingGame component
Scoring logic
🚀 STAGE 5 — SENTENCE BUILDER
Viết

Build a Sentence Builder game.

Gameplay:

Words are shuffled
User drags to correct order

Features:

Drag and drop UI
Validate sentence order
Difficulty scaling

Output:

SentenceBuilder component
🚀 STAGE 6 — UNLOCK SYSTEM (CANDY CRUSH STYLE)
Viết

Implement level progression system.

Logic:

User must complete previous level to unlock next
Completing all levels in a set unlocks next set

Features:

Lock UI (disabled button)
Show stars (score rating)
Save progress

Output:

Progress service
Unlock logic
🚀 STAGE 7 — ADMIN PANEL
Viết

Build admin features for game management.

Features:

Create Game Set
Add levels
Add questions
Upload audio/image

UI:

Admin dashboard

Output:

Admin APIs
Basic UI