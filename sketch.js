import './style.css';
import OpenAI from 'openai';

const openAIKey = import.meta.env.VITE_OPENAI_KEY;

let openai;
let isLoading = false;
let sampleSound; // Declare the variable for the sound
let isSoundPlaying = false; // Track the playing state

let textToShow = "";

let scrollY = 0;
let scrollSpeed = 0.36; // Increased by 20% for better performance on slower computers
let isGenerationActive = false;
let lastGenerationTime = 0;
const generationInterval = 60000; // 60 seconds (1 minute) in milliseconds
let selectedLanguage = 1; // 1=English, 2=Spanish, 4=German - auto-rotating
let languageRotation = [1, 2, 4]; // English, Spanish, German
let currentLanguageIndex = 0;

const languages = {
  1: { name: "English", code: "en" },
  2: { name: "Spanish", code: "es" },
  3: { name: "French", code: "fr" },
  4: { name: "German", code: "de" },
  5: { name: "Portuguese", code: "pt" },
  6: { name: "Turkish", code: "tr" }
};

const sketch = p => {
  p.preload = function() {
    // Preload the sound from public folder
    sampleSound = p.loadSound('/Dark.wav'); // Load Dark.wav from public folder
  };

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.fill(255); // White text
    p.textAlign(p.CENTER, p.CENTER);
    // Text size will be set dynamically in draw function
    p.noCursor(); // Hide cursor
    scrollY = p.height; // Start text at bottom of screen
  };

  // Make canvas responsive to window resize
  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.keyPressed = function() {
    if (p.keyCode === 80) { // Keycode for 'P'
      if (!isSoundPlaying) {
        sampleSound.loop(); // Loop the audio continuously
        isSoundPlaying = true;
      } else {
        sampleSound.stop();
        isSoundPlaying = false;
      }
    } else if (p.keyCode === 32) { // Space key to start automatic generation
      startGeneration();
    } else if (p.key === '1') { // Key 1: English
      selectedLanguage = 1;
      startGeneration();
    } else if (p.key === '2') { // Key 2: Spanish
      selectedLanguage = 2;
      startGeneration();
    } else if (p.key === '3') { // Key 3: French
      selectedLanguage = 3;
      startGeneration();
    } else if (p.key === '4') { // Key 4: German
      selectedLanguage = 4;
      startGeneration();
    } else if (p.key === '5') { // Key 5: Portuguese
      selectedLanguage = 5;
      startGeneration();
    } else if (p.key === '6') { // Key 6: Turkish
      selectedLanguage = 6;
      startGeneration();
    }
  };

  function startGeneration() {
    isGenerationActive = true;
    lastGenerationTime = p.millis();
    // Clear existing text and start fresh
    textToShow = "";
    scrollY = p.height; // Reset scroll position
    // Generate text immediately (even if already active)
    generateNewText();
  }

  function generateNewText() {
    if (!isLoading) {
      isLoading = true;
      let languageName = languages[selectedLanguage].name;
      
      // Add timestamp and random element to ensure unique generation
      let timestamp = Date.now();
      let randomSeed = Math.floor(Math.random() * 1000000);
      
      chat(`[${timestamp}-${randomSeed}] Generate a very short poetic-critical text (maximum 2 brief paragraphs) exploring how cybernetics and Bostrom's Singleton concept relate to techno-theocratic power structures and the Technical Republic. Connect Francis Galton's eugenics legacy to contemporary white supremacist ideologies embedded in surveillance capitalism. Reference the Treaty of Westphalia and how cartography centers European dominance - maps drawn from the imperial center. Invoke the "We Came to Rule" mentality of Eurocentric royal power and how colonial philosophy creates multi-territorial control through memory and distance from nations. Explore Project Cybersyn, Palantir, and algorithmic regimes as extensions of colonial cartographic control. Use a tone mixing manifesto, liturgy, and techno-poetics with fractured imagery from German techno, Bauhaus, and Warholian aesthetics. Present as AI-generated critique of Christian nationalism, corporate techno-utopias, and weaponized faith, while imagining epistemic resistance. Style should be experimental and unsettling. Generate ONLY in ${languageName}. Create completely original variation. Keep extremely concise - maximum 2 brief paragraphs only.`);
    }
  }
 
  async function chat(prompt) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        temperature: 0.9, // Increased temperature for more variation
        messages: [{ "role": "user", "content": prompt }]
      });

      // Completely replace text with new generation
      textToShow = completion.choices[0].message.content;
      scrollY = p.height; // Reset scroll position for new text
      
      isLoading = false;
      lastGenerationTime = p.millis(); // Update last generation time
      
      console.log("New text generated in " + languages[selectedLanguage].name + " at " + new Date().toLocaleTimeString());
    } catch (err) {
      console.error("An error occurred in the chat function:", err);
      isLoading = false;
    }
  }

  p.draw = function() {
    p.background(0); // Black background

    // Check if it's time to generate new text and rotate language (only if generation is active)
    if (isGenerationActive && !isLoading && (p.millis() - lastGenerationTime) > generationInterval) {
      // Rotate to next language
      currentLanguageIndex = (currentLanguageIndex + 1) % languageRotation.length;
      selectedLanguage = languageRotation[currentLanguageIndex];
      generateNewText();
    }

    if (isLoading) {
      displayLoader(p);
    } else if (textToShow) {
      // Update scroll position - continuous scrolling
      scrollY -= scrollSpeed;
      
      // Draw scrolling text - fully responsive to window width
      p.fill(255); // White text
      p.textAlign(p.CENTER, p.TOP);
      let textWidth = p.width * 0.8; // Always use 80% of window width, no maximum limit
      let textX = (p.width - textWidth) / 2; // Center the text
      
      // Make text size responsive to window size
      let responsiveTextSize = Math.max(16, Math.min(32, p.width / 40)); // Scale text size with window width
      p.textSize(responsiveTextSize);
      let responsiveLeading = responsiveTextSize * 1.5; // Line height proportional to text size
      p.textLeading(responsiveLeading);
      
      p.text(textToShow, textX, scrollY, textWidth);
      
      // Reset scroll when text goes completely off screen (but keep scrolling)
      // Estimate text height based on character count and line wrapping (fully responsive)
      let avgCharWidth = responsiveTextSize * 0.6; // Approximate character width
      let charsPerLine = Math.floor(textWidth / avgCharWidth);
      let lines = Math.ceil(textToShow.length / charsPerLine);
      let estimatedTextHeight = lines * responsiveLeading;
      if (scrollY < -estimatedTextHeight) {
        scrollY = p.height + 100; // Add some gap before restarting
      }
    }
    
    // Show instruction text if generation hasn't started
    if (!isGenerationActive) {
      p.fill(255);
      p.textAlign(p.CENTER, p.CENTER);
      
      // Responsive text sizes for instructions
      let titleSize = Math.max(24, Math.min(48, p.width / 30));
      let subtitleSize = Math.max(18, Math.min(32, p.width / 40));
      let menuSize = Math.max(16, Math.min(28, p.width / 45));
      let instructionSize = Math.max(14, Math.min(22, p.width / 55));
      
      p.textSize(titleSize);
      p.text("Dark Enlightenment Scroll", p.width / 2, p.height / 2 - titleSize * 2);
      
      p.textSize(subtitleSize);
      p.text("Select Language to Begin:", p.width / 2, p.height / 2 - subtitleSize);
      
      p.textSize(menuSize);
      let yPos = p.height / 2 + menuSize / 2;
      let lineSpacing = menuSize * 1.2;
      p.text("1 - English", p.width / 2, yPos);
      p.text("2 - Español", p.width / 2, yPos + lineSpacing);
      p.text("3 - Français", p.width / 2, yPos + lineSpacing * 2);
      p.text("4 - Deutsch", p.width / 2, yPos + lineSpacing * 3);
      p.text("5 - Português", p.width / 2, yPos + lineSpacing * 4);
      p.text("6 - Türkçe", p.width / 2, yPos + lineSpacing * 5);
      
      p.textSize(instructionSize);
      p.text("Press number key to start generation | Press P for music", p.width / 2, yPos + lineSpacing * 6.5);
    }
  }
};

function displayLoader(p) {
  p.push();
  p.translate(p.width / 2, p.height / 2);
  p.rotate(p.frameCount / 100.0);
  p.strokeWeight(5);
  p.stroke(255, 255, 255);
  p.line(0, 0, p.windowWidth, p.windowHeight -50 );

  p.pop();
  p.push();
  p.translate(p.width / 2, p.height / 2);
  p.rotate(p.frameCount / -180.0);
  p.strokeWeight(5);
  p.stroke(255, 255, 255); 
  p.line(0, 0, p.windowWidth, 100);
  p.pop();


  p.push();
  p.translate(p.width / 2, p.height / 2);
  p.rotate(p.frameCount / 180.0);
  p.strokeWeight(5); 
 
  p.stroke(255, 255, 255);
  p.line(0, 0, p.windowWidth, 100);
  p.pop();
  


}
function onReady() {
  openai = new OpenAI({
    apiKey: openAIKey,
    dangerouslyAllowBrowser: true
  });

  new p5(sketch);
}

if (document.readyState === 'complete') {
  onReady();
} else {
  document.addEventListener("DOMContentLoaded", onReady);
}



