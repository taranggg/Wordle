# Wordle Clone

A React-based Wordle game clone built with Vite and Tailwind CSS, featuring modern UI components and game mechanics.

## Features

- **Interactive Game Interface**
  - Dynamic grid layout for 6 guess attempts
  - Virtual keyboard with press animations
  - Real-time input validation
- **Game Components**
  - <mcsymbol name="GuessRow" filename="GuessRow.jsx" path="src/components/GuessRow.jsx" startline="1" type="function"></mcsymbol> component for tracking attempts
  - <mcsymbol name="Hint" filename="Hint.jsx" path="src/components/Hint.jsx" startline="1" type="function"></mcsymbol> system with color-coded feedback
  - <mcsymbol name="Modal" filename="Modal.jsx" path="src/components/Modal.jsx" startline="1" type="function"></mcsymbol> for game statistics
- **Technical Features**
  - Word validation using <mcfile name="wordHints.js" path="src/util/wordHints.js"></mcfile>
  - Responsive design with Tailwind CSS
  - ESLint configuration for code quality

## Project Structure

Wordle/

├── .gitignore

├── README.md

├── eslint.config.js

├── index.html

├── package-lock.json

├── package.json

├── public/

│ ├── W.svg

│ └── vite.svg

├── src/

│ ├── App.css

│ ├── App.jsx

│ ├── assets/

│ │ └── react.svg

│ ├── components/

│ │ ├── GuessRow.jsx

│ │ ├── Hint.jsx

│ │ ├── InputBox.jsx

│ │ ├── Modal.jsx

│ │ ├── OnScreenKeyboard.jsx

│ │ ├── Sidebar.jsx

│ │ └── WordleGame.jsx

│ ├── index.css

│ ├── main.jsx

│ └── util/

│ ├── wordHints.js

│ └── words.js

├── tailwind.config.js

└── vite.config.js

## Installation

```bash
npm install
npm run dev
```
