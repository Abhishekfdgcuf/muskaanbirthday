// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const interactiveScreen = document.getElementById('interactive-screen');
const continueBtn = document.getElementById('continue-btn');
const showCharactersBtn = document.getElementById('show-characters-btn');
const blowCandlesBtn = document.getElementById('blow-candles-btn');
const charactersContainer = document.getElementById('characters-container');
const confettiContainer = document.getElementById('confetti-container');
const balloonsContainer = document.getElementById('balloons-container');
const smokeContainer = document.getElementById('smoke-container');
const fireworksContainer = document.getElementById('fireworks-container');
const backgroundMusic = document.getElementById('background-music');
const birthdaySongDisplay = document.getElementById('birthday-song-display');
const musicalNotes = document.getElementById('musical-notes');

// State management
let charactersShown = false;
let candlesBlown = false;
let currentAudio = null;
let birthdaySongPlaying = false;

// Birthday song melody - "Happy Birthday to You"
const birthdaySongNotes = [
    // "Happy Birthday to You"
    { note: 'C4', duration: 0.5, delay: 0 },
    { note: 'C4', duration: 0.3, delay: 0.5 },
    { note: 'D4', duration: 0.7, delay: 0.8 },
    { note: 'C4', duration: 0.7, delay: 1.5 },
    { note: 'F4', duration: 0.7, delay: 2.2 },
    { note: 'E4', duration: 1.4, delay: 2.9 },
    
    // "Happy Birthday to You"
    { note: 'C4', duration: 0.5, delay: 4.5 },
    { note: 'C4', duration: 0.3, delay: 5.0 },
    { note: 'D4', duration: 0.7, delay: 5.3 },
    { note: 'C4', duration: 0.7, delay: 6.0 },
    { note: 'G4', duration: 0.7, delay: 6.7 },
    { note: 'F4', duration: 1.4, delay: 7.4 },
    
    // "Happy Birthday Dear [Name]"
    { note: 'C4', duration: 0.5, delay: 9.0 },
    { note: 'C4', duration: 0.3, delay: 9.5 },
    { note: 'C5', duration: 0.7, delay: 9.8 },
    { note: 'A4', duration: 0.7, delay: 10.5 },
    { note: 'F4', duration: 0.7, delay: 11.2 },
    { note: 'E4', duration: 0.7, delay: 11.9 },
    { note: 'D4', duration: 1.4, delay: 12.6 },
    
    // "Happy Birthday to You"
    { note: 'Bb4', duration: 0.5, delay: 14.2 },
    { note: 'Bb4', duration: 0.3, delay: 14.7 },
    { note: 'A4', duration: 0.7, delay: 15.0 },
    { note: 'F4', duration: 0.7, delay: 15.7 },
    { note: 'G4', duration: 0.7, delay: 16.4 },
    { note: 'F4', duration: 1.4, delay: 17.1 }
];

// Note frequencies in Hz
const noteFrequencies = {
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
    'G4': 392.00, 'A4': 440.00, 'Bb4': 466.16, 'C5': 523.25
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    startFloatingAnimations();
});

function initializeApp() {
    // Try to play background music (some browsers require user interaction)
    try {
        backgroundMusic.volume = 0.3;
        backgroundMusic.play().catch(e => console.log('Audio autoplay prevented:', e));
    } catch (e) {
        console.log('Audio initialization failed:', e);
    }
    
    // Create additional floating hearts and sparkles
    createFloatingElements();
}

function setupEventListeners() {
    // Continue button - transition to interactive screen
    continueBtn.addEventListener('click', () => {
        transitionToInteractiveScreen();
    });
    
    // Show characters button
    showCharactersBtn.addEventListener('click', () => {
        showAnimatedCharacters();
    });
    
    // Blow candles button
    blowCandlesBtn.addEventListener('click', () => {
        blowOutCandles();
    });
    
    // Touch support for mobile
    setupTouchSupport();
}

function transitionToInteractiveScreen() {
    welcomeScreen.classList.remove('active');
    
    setTimeout(() => {
        interactiveScreen.classList.add('active');
        // Start ambient music for interactive screen
        playAmbientMusic();
    }, 800);
}

function showAnimatedCharacters() {
    if (charactersShown) return;
    
    charactersShown = true;
    showCharactersBtn.style.opacity = '0.5';
    showCharactersBtn.disabled = true;
    
    // Show characters with animation
    charactersContainer.classList.add('show');
    
    // Animate speech bubbles in sequence
    const characters = document.querySelectorAll('.character');
    characters.forEach((character, index) => {
        setTimeout(() => {
            const bubble = character.querySelector('.speech-bubble');
            bubble.style.animationDelay = '0s';
            bubble.style.opacity = '1';
            
            // Add bounce effect to character
            character.style.animation = 'dance 0.8s ease-in-out, characterSpin 4s infinite linear';
        }, index * 500);
    });
    
    // Start confetti after characters appear
    setTimeout(() => {
        startConfetti();
        showBalloons();
        playBirthdayMusic();
    }, 1500);
}

function blowOutCandles() {
    if (candlesBlown) return;
    
    candlesBlown = true;
    blowCandlesBtn.style.opacity = '0.5';
    blowCandlesBtn.disabled = true;
    
    // Blow out candles one by one
    const flames = document.querySelectorAll('.flame');
    flames.forEach((flame, index) => {
        setTimeout(() => {
            flame.classList.add('out');
            
            // Create smoke effect for each candle
            createSmokeEffect(flame);
            
            // Play blow sound effect
            playBlowSound();
        }, index * 300);
    });
    
    // After all candles are out, start birthday song and celebration
    setTimeout(() => {
        playTraditionalBirthdaySong();
        startCelebration();
    }, flames.length * 300 + 500);
}

function playTraditionalBirthdaySong() {
    if (birthdaySongPlaying) return;
    
    birthdaySongPlaying = true;
    
    // Stop background music
    if (backgroundMusic) {
        backgroundMusic.pause();
    }
    
    // Show birthday song display
    birthdaySongDisplay.classList.add('show');
    musicalNotes.classList.add('playing');
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Play each note of the birthday song
        birthdaySongNotes.forEach(({ note, duration, delay }) => {
            setTimeout(() => {
                playBirthdayNote(audioContext, noteFrequencies[note], duration);
            }, delay * 1000);
        });
        
        // Hide birthday song display after song ends and resume celebration music
        setTimeout(() => {
            birthdaySongDisplay.classList.remove('show');
            musicalNotes.classList.remove('playing');
            birthdaySongPlaying = false;
            
            // Resume celebration music
            setTimeout(() => {
                playCelebrationMusic();
            }, 1000);
        }, 19000); // Song duration is about 19 seconds
        
    } catch (e) {
        console.log('Birthday song playback failed:', e);
        // Fallback: hide display after timeout
        setTimeout(() => {
            birthdaySongDisplay.classList.remove('show');
            musicalNotes.classList.remove('playing');
            birthdaySongPlaying = false;
        }, 5000);
    }
}

function playBirthdayNote(audioContext, frequency, duration) {
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Use a more pleasant waveform for the melody
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        
        // Volume envelope for smoother sound
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.2, audioContext.currentTime + duration - 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
        console.log('Note playback failed:', e);
    }
}

function startConfetti() {
    const colors = ['#ff6b9d', '#c44569', '#f8b500', '#20B2AA', '#FF69B4', '#FFD700', '#FF6347'];
    
    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfettiPiece(colors);
        }, i * 100);
    }
}

function createConfettiPiece(colors) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 2 + 's';
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
    
    confettiContainer.appendChild(confetti);
    
    // Remove confetti piece after animation
    setTimeout(() => {
        if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
        }
    }, 4000);
}

function showBalloons() {
    balloonsContainer.classList.add('show');
    
    // Remove balloons after animation
    setTimeout(() => {
        balloonsContainer.classList.remove('show');
    }, 6000);
}

function createSmokeEffect(flame) {
    const rect = flame.getBoundingClientRect();
    const containerRect = smokeContainer.getBoundingClientRect();
    
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const smoke = document.createElement('div');
            smoke.className = 'smoke';
            smoke.style.left = (rect.left - containerRect.left + rect.width/2) + 'px';
            smoke.style.top = (rect.top - containerRect.top) + 'px';
            smoke.style.animationDelay = (i * 0.2) + 's';
            
            smokeContainer.appendChild(smoke);
            
            // Remove smoke after animation
            setTimeout(() => {
                if (smoke.parentNode) {
                    smoke.parentNode.removeChild(smoke);
                }
            }, 3000);
        }, i * 200);
    }
}

function startCelebration() {
    // Characters start clapping
    const characters = document.querySelectorAll('.character-body');
    characters.forEach(character => {
        character.style.animation = 'dance 0.5s ease-in-out infinite, characterSpin 2s infinite linear';
    });
    
    // Update speech bubbles to cheering
    const bubbles = document.querySelectorAll('.speech-bubble');
    const cheerMessages = ['Hooray! 🎉', 'Amazing! 👏', 'Celebrate! 🎊'];
    bubbles.forEach((bubble, index) => {
        bubble.textContent = cheerMessages[index] || 'Yay! 🎉';
        bubble.style.background = 'linear-gradient(45deg, #FFD700, #FFA500)';
        bubble.style.animation = 'pulse 0.8s ease-in-out infinite';
    });
    
    // Start fireworks after birthday song starts
    setTimeout(() => {
        startFireworks();
    }, 2000);
}

function startFireworks() {
    const colors = ['#ff6b9d', '#c44569', '#f8b500', '#20B2AA', '#FF69B4', '#FFD700', '#FF6347', '#9370DB'];
    
    // Create multiple fireworks over time
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createFirework(colors);
        }, i * 400);
    }
}

function createFirework(colors) {
    const centerX = Math.random() * window.innerWidth;
    const centerY = Math.random() * (window.innerHeight * 0.6) + 100;
    
    // Create multiple particles for each firework
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        
        // Calculate random direction for particle
        const angle = (i / 12) * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        particle.style.setProperty('--end-x', endX + 'px');
        particle.style.setProperty('--end-y', endY + 'px');
        
        // Custom animation for this particle
        particle.style.animation = `fireworkParticle 1.5s ease-out forwards`;
        
        fireworksContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1500);
    }
}

function createFloatingElements() {
    // Create additional floating hearts
    const heartsContainer = document.querySelectorAll('.floating-hearts');
    heartsContainer.forEach(container => {
        // Add more heart elements dynamically
        for (let i = 0; i < 3; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = ['💖', '💝', '💕'][i];
            heart.style.position = 'absolute';
            heart.style.fontSize = '1.5rem';
            heart.style.left = (20 + i * 30) + '%';
            heart.style.animation = `floatHeart ${8 + i * 2}s infinite linear`;
            heart.style.animationDelay = (i * 2) + 's';
            heart.style.opacity = '0.6';
            container.appendChild(heart);
        }
    });
    
    // Create additional sparkles
    const sparklesContainer = document.querySelectorAll('.sparkles');
    sparklesContainer.forEach(container => {
        for (let i = 0; i < 4; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.position = 'absolute';
            sparkle.style.fontSize = '1.2rem';
            sparkle.style.top = (10 + i * 20) + '%';
            sparkle.style.left = (10 + i * 25) + '%';
            sparkle.style.animation = `sparkle ${3 + i}s infinite ease-in-out`;
            sparkle.style.animationDelay = (i * 0.8) + 's';
            container.appendChild(sparkle);
        }
    });
}

function startFloatingAnimations() {
    // Add CSS animation for firework particles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fireworkParticle {
            0% {
                transform: translate(0, 0) scale(0);
                opacity: 1;
            }
            50% {
                opacity: 1;
            }
            100% {
                transform: translate(calc(var(--end-x) - 50vw), calc(var(--end-y) - 50vh)) scale(1);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function setupTouchSupport() {
    // Add touch event support for mobile devices
    const buttons = [continueBtn, showCharactersBtn, blowCandlesBtn];
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(1)';
            // Trigger click after brief delay for visual feedback
            setTimeout(() => {
                this.click();
            }, 50);
        });
    });
}

// Audio functions
function playAmbientMusic() {
    // Create a simple romantic melody using Web Audio API tones
    try {
        if (backgroundMusic && !birthdaySongPlaying) {
            backgroundMusic.volume = 0.2;
            backgroundMusic.play().catch(e => console.log('Ambient music play failed:', e));
        }
    } catch (e) {
        console.log('Ambient music setup failed:', e);
    }
}

function playBirthdayMusic() {
    try {
        // Simple birthday tune simulation
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(261.63, audioContext.currentTime); // C4
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 2);
    } catch (e) {
        console.log('Birthday music playback failed:', e);
    }
}

function playBlowSound() {
    try {
        // Create blow sound effect
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.log('Blow sound effect failed:', e);
    }
}

function playCelebrationMusic() {
    try {
        // Celebration fanfare
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
            }, index * 200);
        });
    } catch (e) {
        console.log('Celebration music failed:', e);
    }
}

// Utility functions for enhanced effects
function createRandomParticle(container, className, emoji, count = 5) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = className;
        particle.innerHTML = emoji;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 5000);
    }
}

// Enhanced mobile experience
function handleDeviceOrientation() {
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(e) {
            // Add subtle tilt effects for mobile devices
            const tilt = e.gamma * 0.1; // Limit tilt effect
            document.body.style.transform = `rotate(${tilt}deg)`;
        });
    }
}

// Initialize enhanced mobile features
if (window.innerWidth <= 768) {
    handleDeviceOrientation();
}