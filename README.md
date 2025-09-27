# Dark Enlightenment Scroll

**An AI-Generated Media Installation Exploring Technology, Ideology, and Power**

🌐 **[Live Application](https://dark-enlightenment.vercel.app/)**

## Screenshots

### Language Selection Interface
![Language Selection](./public/Screenshot%202025-09-27%20at%2012.59.45%20PM.png)

### Text Generation in Progress
![Text Generation](./public/Screenshot%202025-09-27%20at%2012.59.53%20PM.png)

### Full Screen Text Display
![Full Screen Display](./public/Screenshot%202025-09-27%20at%201.00.53%20PM.png)

## Overview

Dark Enlightenment Scroll is an experimental, AI-powered text generation and visualization application that creates poetic-critical texts exploring the intersection of technology, ideology, and power in speculative, synthetic worlds. The application generates unique, continuously scrolling manifestos that oscillate between critique and poetry, presented as an immersive full-screen canvas experience.

## Concept & Vision

This project critiques the confluence of:
- **Cybernetics** (Project Cybersyn)
- **Post-democracy and Dark Enlightenment philosophies** (Mencius Moldbug, Nick Bostrom's Singleton)
- **Colonial and eugenic histories** (Francis Galton, 'good genes')
- **Surveillance capitalism** (Palantir, attention economies, influencer culture)
- **Christian nationalism and white-supremacist fantasy**
- **Corporate techno-utopias**

The generated texts imagine new forms of solidarity, rupture, and epistemic resistance while exploring themes of hybridity, nomadic selves, migration, and fractured anatomies under algorithmic regimes.

## Features

### 🌍 Multi-Language Support
- **English** (Press `1`)
- **Español** (Press `2`) 
- **Français** (Press `3`)
- **Deutsch** (Press `4`)
- **Português** (Press `5`)
- **Türkçe** (Press `6`)

### 🎨 Visual Experience
- **Full-screen immersive canvas** with no HTML interface
- **Responsive text layout** that adapts to any screen size
- **Continuous vertical scrolling** text display
- **Dynamic text sizing** based on viewport dimensions
- **80% screen width text constraint** for optimal readability

### 🎵 Audio Integration
- **Ambient soundscape** (Press `P` to toggle)
- **Synchronized audio-visual experience**

### 🤖 AI Text Generation
- **GPT-4 powered** unique text generation
- **Automatic regeneration** every 2 minutes during active sessions
- **Temperature-controlled creativity** for varied outputs
- **Timestamp and randomization** to ensure unique generations

## Technical Implementation

### Technologies Used
- **p5.js** - Creative coding framework for canvas rendering
- **OpenAI GPT-4** - AI text generation
- **Vite** - Build tool and development server
- **Vanilla JavaScript** - Core application logic

### Architecture
- **Responsive Design**: Text and UI elements scale dynamically with window size
- **Liquid Layout**: Always maintains 80% screen width for text content
- **Event-Driven**: Keyboard interactions for language selection and audio control
- **Modular Structure**: Separate concerns for text generation, rendering, and user interaction

### Key Features
```javascript
// Responsive text sizing
let responsiveTextSize = Math.max(16, Math.min(32, p.width / 40));

// 80% screen width constraint
let textWidth = p.width * 0.8;

// Dynamic line height
let responsiveLeading = responsiveTextSize * 1.5;
```

## Usage

### Getting Started
1. Visit the [live application](https://dark-enlightenment.vercel.app/)
2. Select your preferred language (1-6 keys)
3. Watch as AI-generated text begins scrolling
4. Press `P` to toggle ambient music
5. Text automatically regenerates every 2 minutes

### Controls
| Key | Action |
|-----|--------|
| `1` | English |
| `2` | Español |
| `3` | Français |
| `4` | Deutsch |
| `5` | Português |
| `6` | Türkçe |
| `P` | Toggle Music |
| `Space` | Restart Generation |

## Aesthetic Influences

The visual and conceptual design draws from:
- **German Techno** - Rhythmic, hypnotic patterns
- **Bauhaus Modernism** - Clean, functional design
- **Warholian Pop** - Repetition and mass media critique
- **Surreal Performance Art** - Experimental, unsettling aesthetics

## Installation & Development

### Prerequisites
- Node.js (v14 or higher)
- OpenAI API key

### Setup
```bash
# Clone the repository
git clone [repository-url]
cd dark-enlightment-scroll

# Install dependencies
npm install

# Set up environment variables
# Create .env file with:
VITE_OPENAI_KEY=your_openai_api_key_here

# Run development server
npm run dev

# Build for production
npm run build
```

### Project Structure
```
├── index.html          # Minimal HTML structure
├── sketch.js           # Main p5.js application logic
├── style.css           # Responsive styling
├── public/
│   └── sample.mp3      # Ambient audio file
└── package.json        # Dependencies and scripts
```

## Artistic Statement

Dark Enlightenment Scroll operates as a digital séance, channeling the ghosts of failed utopias and emerging dystopias through algorithmic mediation. Each generated text serves as both archaeological artifact and prophetic vision, excavating the buried logics of our technological present while imagining alternative futures.

The application transforms the browser into a ritual space where viewers encounter machine-generated liturgies that expose the entangled relationships between computation, ideology, and power. Through its multilingual capacity, it acknowledges the global scope of technological colonization while offering spaces for linguistic and cultural resistance.

## Credits

**Concept and Programming**: [Marlon Barrios Solano](https://linktr.ee/marlonbarriososolano)

## License

This project is open source and available under the [MIT License](LICENSE).

---

*"In the space between human intention and machine interpretation, new forms of meaning emerge—fractured, recursive, and perpetually in motion."*