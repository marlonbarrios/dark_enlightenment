import './style.css';
import OpenAI from 'openai';

const openAIKey = import.meta.env.VITE_OPENAI_KEY;

let openai;
let isLoading = false;
let sampleSound; // Declare the variable for the sound
let isSoundPlaying = false; // Track the playing state

let textToShow = "";

let scrollY = 0;
let scrollSpeed = 0.3; // Moderate scrolling speed
let isGenerationActive = false;
let lastGenerationTime = 0;
const generationInterval = 120000; // 120 seconds (2 minutes) in milliseconds
let selectedLanguage = 1; // 1=English, 2=Spanish, 3=French, 4=German, 5=Portuguese, 6=Turkish

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
    // Preload the sound
    sampleSound = p.loadSound('/sample.mp3'); // Adjust path as necessary
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
        sampleSound.play();
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
      
      chat(`[${timestamp}-${randomSeed}] Generate a completely new and unique poetic-critical text that explores the intersection of technology, ideology, and power in a speculative, synthetic world. Draw on references to cybernetics (such as Project Cybersyn), post-democracy and Dark Enlightenment philosophies (Mencius Moldbug, Nick Bostrom's Singleton), the histories of colonialism and eugenics (Francis Galton, 'good genes'), and the logics of surveillance capitalism (Palantir, attention economies, influencer culture). Use a tone that moves between manifesto, liturgy, and techno-poetics, mixing academic analysis with lyrical, fractured imagery. The text should evoke aesthetics from German techno, Bauhaus modernism, Warholian pop, and surreal performance art. Include metaphors of hybridity, nomadic selves, migration, and fractured anatomies, where bodies, territories, and identities are constantly shifting under algorithmic regimes. Present the work as if it were part of an AI-generated media installation that critiques the confluence of Christian nationalism, white-supremacist fantasy, corporate techno-utopias, and the weaponization of faith, while also imagining new forms of solidarity, rupture, and epistemic resistance. The style should be experimental, recursive, and unsettling — a manifesto-song or ritual text that oscillates between critique and poetry. Generate this text ONLY in ${languageName}. Create a completely original and distinct variation - do not repeat previous generations. Write it as a complete, cohesive text in ${languageName}.`);
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

    // Check if it's time to generate new text (only if generation is active)
    if (isGenerationActive && !isLoading && (p.millis() - lastGenerationTime) > generationInterval) {
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



