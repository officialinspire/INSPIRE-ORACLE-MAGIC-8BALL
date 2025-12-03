/* ═══════════════════════════════════════════════════════════════════════════
   INSPIRE MAGIC 8-BALL ORACLE - SCREEN MANAGEMENT & ENHANCED FEATURES
   ═══════════════════════════════════════════════════════════════════════════ */

// Screen management variables
let currentScreen = 'splash';
let selectedMood = 'balanced';
let gameHistory = [];

// Get all screen elements
const splashScreen = document.getElementById('inspire-splash-screen');
const introScreen = document.getElementById('inspire-intro-screen');
const startMenu = document.getElementById('inspire-start-menu');
const gameScreen = document.getElementById('inspire-game-screen');
const historyModal = document.getElementById('inspire-history-modal');

// Get buttons
const startButton = document.getElementById('inspire-start-button');
const menuStartButton = document.getElementById('inspire-menu-start-button');
const menuHistoryButton = document.getElementById('inspire-menu-history-button');
const gameHistoryButton = document.getElementById('inspire-game-history-button');
const backButton = document.getElementById('inspire-back-button');
const closeHistoryButton = document.getElementById('inspire-close-history');

// Get video and audio
const introVideo = document.getElementById('inspire-intro-video');
const backgroundMusic = document.getElementById('inspire-background-music');

// Mood selector
const menuMoodSelect = document.getElementById('inspire-menu-mood');

/* ═══════════════════════════════════════════════════════════════════════════
   SCREEN TRANSITION FUNCTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

function hideScreen(screen, callback) {
    screen.classList.add('inspire-fade-out');
    setTimeout(() => {
        screen.classList.remove('inspire-active', 'inspire-fade-out');
        if (callback) callback();
    }, 800);
}

function showScreen(screen) {
    screen.classList.add('inspire-active');
}

/* ═══════════════════════════════════════════════════════════════════════════
   AUDIO FADE-IN
   ═══════════════════════════════════════════════════════════════════════════ */

function fadeInAudio(audio, duration = 2000) {
    audio.volume = 0;
    audio.play().catch(err => console.log('Audio play prevented:', err));
    
    const steps = 50;
    const stepDuration = duration / steps;
    const volumeStep = 0.3 / steps; // Target volume 30%
    
    let currentStep = 0;
    const fadeInterval = setInterval(() => {
        if (currentStep >= steps) {
            clearInterval(fadeInterval);
            audio.volume = 0.3;
        } else {
            audio.volume = Math.min(audio.volume + volumeStep, 0.3);
            currentStep++;
        }
    }, stepDuration);
}

/* ═══════════════════════════════════════════════════════════════════════════
   HISTORY MANAGEMENT WITH TIMESTAMPS
   ═══════════════════════════════════════════════════════════════════════════ */

function formatTimestamp(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${month} ${day}, ${displayHours}:${minutes} ${ampm}`;
}

function addToGameHistory(question, answer, numerology) {
    const timestamp = new Date();
    const reading = {
        timestamp: timestamp,
        question: question,
        answer: answer,
        numerology: numerology
    };
    
    gameHistory.unshift(reading); // Add to beginning
    if (gameHistory.length > 20) {
        gameHistory.pop(); // Keep only last 20
    }
    
    // Save to localStorage
    try {
        localStorage.setItem('inspire-oracle-history', JSON.stringify(gameHistory));
    } catch (e) {
        console.log('Could not save history:', e);
    }
}

function loadHistory() {
    try {
        const saved = localStorage.getItem('inspire-oracle-history');
        if (saved) {
            gameHistory = JSON.parse(saved);
            // Convert timestamp strings back to Date objects
            gameHistory = gameHistory.map(item => ({
                ...item,
                timestamp: new Date(item.timestamp)
            }));
        }
    } catch (e) {
        console.log('Could not load history:', e);
    }
}

function displayHistory() {
    const historyList = document.getElementById('inspire-history-list');
    
    if (gameHistory.length === 0) {
        historyList.innerHTML = '<p class="inspire-history-empty">Your cosmic journey begins here...</p>';
        return;
    }
    
    historyList.innerHTML = gameHistory.map(item => `
        <div class="inspire-history-item">
            <div class="inspire-history-timestamp">${formatTimestamp(item.timestamp)}</div>
            <div class="inspire-history-question">Q: ${item.question}</div>
            <div class="inspire-history-answer">${item.answer} • ${item.numerology}</div>
        </div>
    `).join('');
}

function showHistoryModal() {
    displayHistory();
    historyModal.classList.add('inspire-show');
}

function hideHistoryModal() {
    historyModal.classList.remove('inspire-show');
}

/* ═══════════════════════════════════════════════════════════════════════════
   SPLASH SCREEN → INTRO VIDEO
   ═══════════════════════════════════════════════════════════════════════════ */

startButton.addEventListener('click', () => {
    hideScreen(splashScreen, () => {
        showScreen(introScreen);
        currentScreen = 'intro';
        
        // Fade in video as it starts playing
        setTimeout(() => {
            introVideo.classList.add('inspire-playing');
            introVideo.play().catch(err => console.log('Video play prevented:', err));
        }, 100);
        
        // When video ends, go to start menu
        introVideo.addEventListener('ended', () => {
            videoEndTransition();
        }, { once: true });
        
        // Allow skipping video with click/tap
        introVideo.addEventListener('click', () => {
            if (!introVideo.paused) {
                introVideo.pause();
                videoEndTransition();
            }
        }, { once: true });
    });
});

function videoEndTransition() {
    // Fade out video first
    introVideo.classList.remove('inspire-playing');
    
    setTimeout(() => {
        hideScreen(introScreen, () => {
            showScreen(startMenu);
            currentScreen = 'menu';
            
            // Add loaded class to trigger background fade-in
            setTimeout(() => {
                startMenu.classList.add('inspire-loaded');
            }, 100);
            
            // Start background music with fade-in
            fadeInAudio(backgroundMusic, 2000);
        });
    }, 500); // Wait for video fade-out
}

/* ═══════════════════════════════════════════════════════════════════════════
   START MENU → GAME SCREEN
   ═══════════════════════════════════════════════════════════════════════════ */

menuStartButton.addEventListener('click', () => {
    // Get selected mood
    selectedMood = menuMoodSelect.value;
    
    hideScreen(startMenu, () => {
        showScreen(gameScreen);
        currentScreen = 'game';
    });
});

/* ═══════════════════════════════════════════════════════════════════════════
   GAME SCREEN → START MENU (BACK BUTTON)
   ═══════════════════════════════════════════════════════════════════════════ */

backButton.addEventListener('click', () => {
    hideScreen(gameScreen, () => {
        showScreen(startMenu);
        currentScreen = 'menu';
        
        // Reset question input
        const questionInput = document.getElementById('inspire-question-input');
        if (questionInput) questionInput.value = '';
    });
});

/* ═══════════════════════════════════════════════════════════════════════════
   HISTORY MODAL CONTROLS
   ═══════════════════════════════════════════════════════════════════════════ */

menuHistoryButton.addEventListener('click', showHistoryModal);
gameHistoryButton.addEventListener('click', showHistoryModal);
closeHistoryButton.addEventListener('click', hideHistoryModal);

// Close modal when clicking outside
historyModal.addEventListener('click', (e) => {
    if (e.target === historyModal) {
        hideHistoryModal();
    }
});

/* ═══════════════════════════════════════════════════════════════════════════
   INITIALIZATION
   ═══════════════════════════════════════════════════════════════════════════ */

// Load history on startup
loadHistory();

/* ═══════════════════════════════════════════════════════════════════════════
   INSPIRE MAGIC 8-BALL ORACLE - SCRIPT
   
   CUSTOMIZATION GUIDE:
   - Responses: Edit the RESPONSES object below (organized by category)
   - Keywords: Edit the KEYWORDS object to change category detection
   - Mood Biases: Adjust moodBiasChances object
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    // DOM is already loaded since script is at end of body
    // Immediately execute the oracle setup
    
    // ═══════════════════════════════════════════════════════════════
    // NUMEROLOGY READINGS (0-10)
    // ═══════════════════════════════════════════════════════════════
        
        const NUMEROLOGY = {
            0: "The Void • Infinite potential awaits your first move.",
            1: "New Beginnings • Leadership energy surrounds you.",
            2: "Balance & Partnership • Cooperation is key.",
            3: "Creativity & Expression • Your voice matters now.",
            4: "Stability & Foundation • Build something lasting.",
            5: "Change & Freedom • Embrace the transformation.",
            6: "Harmony & Responsibility • Nurture what matters.",
            7: "Spiritual Wisdom • Trust your inner knowing.",
            8: "Abundance & Power • Your manifestation is near.",
            9: "Completion & Enlightenment • A cycle ends, wisdom remains.",
            10: "Cosmic Reset • Everything aligns for rebirth."
        };
        
        // ═══════════════════════════════════════════════════════════════
        // BACKGROUND MUSIC
        // ═══════════════════════════════════════════════════════════════
        
        const backgroundMusic = document.getElementById('inspire-background-music');
        let musicStarted = false;
        
        // Start music on first user interaction
        function startBackgroundMusic() {
            if (!musicStarted && backgroundMusic) {
                backgroundMusic.volume = 0.3; // Set to 30% volume
                backgroundMusic.play().catch(err => {
                    console.log('Audio autoplay prevented:', err);
                });
                musicStarted = true;
            }
        }
        
        // ═══════════════════════════════════════════════════════════════
        // PARTICLE EFFECTS
        // ═══════════════════════════════════════════════════════════════
        
        function createParticles() {
            const particlesContainer = document.querySelector('.inspire-8ball-particles');
            if (!particlesContainer) return;
            
            // Clear existing particles
            particlesContainer.innerHTML = '';
            
            // Create 20 particles
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'inspire-particle';
                
                // Random starting position within the triangle window
                const startX = Math.random() * 40 - 20; // -20 to 20
                const startY = Math.random() * 40 - 20; // -20 to 20
                
                // Random end position (further out)
                const endX = (Math.random() - 0.5) * 100; // -50 to 50
                const endY = (Math.random() - 0.5) * 100; // -50 to 50
                
                particle.style.left = `${50 + startX}%`;
                particle.style.top = `${50 + startY}%`;
                particle.style.setProperty('--tx', `${endX}px`);
                particle.style.setProperty('--ty', `${endY}px`);
                particle.style.animationDelay = `${Math.random() * 0.3}s`;
                
                particlesContainer.appendChild(particle);
            }
            
            // Remove particles after animation
            setTimeout(() => {
                particlesContainer.innerHTML = '';
            }, 1800);
        }
        
        // ═══════════════════════════════════════════════════════════════
        // EDITABLE: RESPONSE DATABASE
        // ═══════════════════════════════════════════════════════════════
        
        const RESPONSES = {
            love_relationships: {
                balanced: [
                    "The universe says yes—but your discipline is still pending.",
                    "Love is incoming. Clear the space for it to land.",
                    "This connection has potential. Your ego? Not invited.",
                    "The chemistry's real, but timing needs work. Be patient.",
                    "Your heart knows the answer. This is just confirmation.",
                    "Green light on this one. Trust your instincts, soldier.",
                    "They're thinking about you too. Move with confidence.",
                    "This path is worth exploring. Keep it real, stay grounded.",
                    "The feelings are mutual. Now show up authentically.",
                    "Love wants to find you. Stop hiding in doubt."
                ],
                brutal: [
                    "Nah. Move on. Next question.",
                    "You already know this ain't it. Stop wasting time.",
                    "The red flags are waving. Open your eyes.",
                    "This situation needs an exit strategy, not a love letter.",
                    "Stop forcing what doesn't flow naturally.",
                    "You deserve better. Act like it.",
                    "The universe is literally screaming 'no' right now.",
                    "Your gut's been trying to tell you. Listen up.",
                    "This energy is off. Trust that feeling.",
                    "Drop the fantasy. Face the reality."
                ],
                mystic: [
                    "The moon whispers secrets of hearts intertwined.",
                    "Two souls dancing in the cosmic void—fate is watching.",
                    "The stars align, but free will writes the final chapter.",
                    "Love's frequency vibrates through dimensions unseen.",
                    "The oracle sees threads of possibility weaving together.",
                    "Ancient energies stir when true connection awakens.",
                    "The universe conspires for those who dare to be vulnerable.",
                    "Hearts speak in a language older than words.",
                    "Destiny knocks, but the door is yours to open.",
                    "The answer lives in the space between question and doubt."
                ]
            },

            money_work: {
                balanced: [
                    "Money wants to find you. Stop hiding in doubt.",
                    "The opportunity is real. Your preparation will seal it.",
                    "This investment makes sense. Trust your analysis.",
                    "Grind now, prosper later. The math checks out.",
                    "Your value is solid. Negotiate with confidence.",
                    "This door leads somewhere good. Walk through it.",
                    "The risk is calculated. Take the shot.",
                    "Your skills are market-ready. Charge accordingly.",
                    "Financial breakthrough incoming. Stay focused.",
                    "The universe rewards the hustle. Keep pushing."
                ],
                brutal: [
                    "This deal smells wrong. Walk away.",
                    "You're undercharging because you're scared. Fix that.",
                    "Stop chasing the bag. Build the value first.",
                    "This job is draining your soul. Plan your exit.",
                    "The red flags are there. Don't ignore them for a paycheck.",
                    "You know this isn't sustainable. Time for real talk.",
                    "Desperation pricing attracts desperation clients. Level up.",
                    "This opportunity is a distraction from your real path.",
                    "Stop asking for permission to be paid what you're worth.",
                    "The money's there, but the cost is too high. Pass."
                ],
                mystic: [
                    "Abundance flows where intention meets action.",
                    "The cosmic accountant balances all books eventually.",
                    "Prosperity is a frequency you must tune into.",
                    "Your financial destiny awaits beyond the fear.",
                    "The universe tests commitment before granting abundance.",
                    "Golden opportunities wear disguises of hard work.",
                    "Trust the process—the harvest follows the planting.",
                    "Wealth consciousness precedes material wealth.",
                    "The oracle sees treasure where others see obstacles.",
                    "Your breakthrough is closer than your doubt suggests."
                ]
            },

            creativity_projects: {
                balanced: [
                    "This path is lit. Just watch your ego at the door.",
                    "Your idea has legs. Execute with discipline.",
                    "The vision is clear. Now put in the hours.",
                    "This project wants to be born. Help it happen.",
                    "Creative energy is high. Channel it into output.",
                    "The world needs this. Don't second-guess yourself.",
                    "Your instincts on this are solid. Trust the process.",
                    "This concept has real potential. Prototype it.",
                    "The muse is with you. Show up and do the work.",
                    "Green light on the creative front. Go all in."
                ],
                brutal: [
                    "This idea needs more cooking. Back to the drawing board.",
                    "You're overthinking it. Ship something, anything.",
                    "Stop planning and start building. Perfection is fake.",
                    "This project is procrastination in disguise. Real talk.",
                    "Your creative block is actually fear. Face it.",
                    "The concept is tired. Find a fresh angle.",
                    "You're solving the wrong problem. Zoom out.",
                    "This is busy work, not breakthrough work. Be honest.",
                    "The market doesn't care about your feelings. Validate first.",
                    "Stop collecting inspiration. Start creating output."
                ],
                mystic: [
                    "The muse whispers through cracks in reality.",
                    "Creation is channeling the infinite into form.",
                    "Your art is a portal—build it with intention.",
                    "The universe dreams through willing vessels.",
                    "Inspiration is a collaboration with cosmic forces.",
                    "Your vision exists in the quantum field. Collapse it into being.",
                    "The creative act is sacred ritual disguised as work.",
                    "Breakthrough awaits those who dance with uncertainty.",
                    "Your project is teaching you what you need to learn.",
                    "The oracle sees masterpiece potential in the chaos."
                ]
            },

            health_energy: {
                balanced: [
                    "Your body's been trying to tell you something. Listen.",
                    "Rest is productive. Schedule it like a meeting.",
                    "This wellness choice serves your highest good.",
                    "Energy management is everything. Audit your drains.",
                    "Your instincts on this health matter are correct.",
                    "The change you're considering? Your body approves.",
                    "Sustainable pace beats burnout hustle. Recalibrate.",
                    "You know what you need. Give yourself permission.",
                    "This healing path is worth exploring. Trust it.",
                    "Your vitality returns when you honor your limits."
                ],
                brutal: [
                    "You're running on fumes. This isn't sustainable.",
                    "Stop ignoring the warning signs. Get checked.",
                    "Your lifestyle is working against you. Fix it.",
                    "The hustle culture is literally killing you. Stop.",
                    "You can't pour from an empty cup. Fill it first.",
                    "This habit is sabotaging everything else. You know which one.",
                    "Your body keeps score. The bill is coming due.",
                    "Stop negotiating with your health. It always wins.",
                    "The answer is obvious: rest, water, movement, real food.",
                    "You're self-destructing in slow motion. Wake up."
                ],
                mystic: [
                    "Your vessel is a temple for universal energy.",
                    "The body speaks in symptoms before words.",
                    "Healing flows where awareness meets compassion.",
                    "Your energy field knows truths the mind denies.",
                    "Vitality is your birthright—claim it consciously.",
                    "The path to wellness is lit by inner knowing.",
                    "Your physical form houses infinite possibility.",
                    "Balance is dynamic, not static. Dance with it.",
                    "The universe supports those who honor their vessel.",
                    "Your healing journey serves a greater purpose."
                ]
            },

            luck_fate: {
                balanced: [
                    "Luck favors the prepared. You're ready.",
                    "The odds are better than you think. Play the game.",
                    "Fortune smiles on bold moves right now.",
                    "This gamble has cosmic backing. Take it.",
                    "Your timing is better than you realize. Move.",
                    "The universe is conspiring in your favor today.",
                    "Serendipity is scheduled for your calendar.",
                    "Chance encounters lead somewhere meaningful.",
                    "The stars are aligned for your next move.",
                    "Lucky breaks come to those who show up."
                ],
                brutal: [
                    "Luck is preparation meeting opportunity. Are you prepared?",
                    "Stop waiting for the universe. Make your own luck.",
                    "Fortune favors the brave, not the hesitant.",
                    "The odds are against you. Probably skip this one.",
                    "You're confusing hope with strategy. Be smarter.",
                    "This isn't about fate. It's about execution.",
                    "The universe helps those who help themselves first.",
                    "Wishing doesn't count as manifesting. Do the work.",
                    "Your luck changes when your effort does.",
                    "Stop consulting oracles. Start taking action."
                ],
                mystic: [
                    "Synchronicity dances at the edge of consciousness.",
                    "Fate weaves threads invisible to ordinary sight.",
                    "The cosmic lottery favors conscious players.",
                    "Your destiny hides in plain sight disguised as chance.",
                    "Fortune is a frequency you must tune into.",
                    "The universe's plan exceeds your imagination.",
                    "Serendipity is the universe winking at you.",
                    "Chaos and order conspire in mysterious ways.",
                    "Your path unfolds precisely as needed.",
                    "Magic happens when intention meets surrender."
                ]
            },

            yes_no_general: {
                balanced: [
                    "Yes, but with eyes wide open.",
                    "Not right now. Timing needs adjustment.",
                    "Absolutely. The green light is lit.",
                    "Proceed with caution and awareness.",
                    "The answer is yes—trust yourself on this.",
                    "Hold off. More information is needed.",
                    "Go for it. The conditions are favorable.",
                    "No—but a better option is coming.",
                    "Yes, and the universe has your back.",
                    "Wait for the right moment. It's close."
                ],
                brutal: [
                    "Hard yes. Stop overthinking it.",
                    "Hell no. What were you thinking?",
                    "Obviously yes. Why are you even asking?",
                    "No. Next question.",
                    "Yes, but only if you're serious this time.",
                    "Not a chance. Save yourself the trouble.",
                    "Absolutely not. Learn to recognize red flags.",
                    "Yes—and you already knew that.",
                    "No. You're better than this.",
                    "The answer is no, and deep down you know it."
                ],
                mystic: [
                    "The answer lives beyond yes and no.",
                    "The question contains its own answer.",
                    "The path reveals itself to the patient seeker.",
                    "Yes and no are illusions—there is only flow.",
                    "The universe responds to clarity, not questions.",
                    "Your answer arrives in divine timing.",
                    "The cosmic yes is louder than your doubts.",
                    "All questions dissolve in presence.",
                    "The oracle sees multiple timelines converging.",
                    "Your intuition knows what the mind questions."
                ]
            },

            self_growth: {
                balanced: [
                    "You already know the answer. This is just your confirmation ping.",
                    "The lesson you're avoiding? That's the breakthrough.",
                    "Growth is happening even when it doesn't feel like it.",
                    "Your transformation is on schedule. Trust the timeline.",
                    "This challenge is upgrading your operating system.",
                    "You're exactly where you need to be. Keep going.",
                    "The discomfort means you're expanding. Good.",
                    "This version of you is making space for the next.",
                    "Your evolution is inevitable. Embrace the process.",
                    "The work you're doing on yourself is working."
                ],
                brutal: [
                    "You're standing in your own way. Move.",
                    "Stop asking the same questions. Take different actions.",
                    "Your comfort zone is a cage. Break out.",
                    "The same patterns, different day. Change something.",
                    "You know what needs to happen. Stop stalling.",
                    "Personal growth requires actual change, not just thinking about it.",
                    "You're smarter than your self-sabotage. Act like it.",
                    "This victim story is old. Write a new chapter.",
                    "The excuses are getting boring. Level up.",
                    "You've outgrown who you're pretending to be."
                ],
                mystic: [
                    "The caterpillar doesn't know it's becoming a butterfly.",
                    "Your soul's curriculum is perfectly designed.",
                    "Evolution is a spiral, not a line—trust the journey.",
                    "Each challenge is an initiation in disguise.",
                    "You are becoming who you always were.",
                    "The universe grows you through what you go through.",
                    "Your transformation ripples through dimensions.",
                    "The self you seek is seeking you.",
                    "Awakening is remembering what you forgot.",
                    "Your expansion serves the collective evolution."
                ]
            },

            chaos_wildcard: {
                balanced: [
                    "The unexpected is heading your way. Stay flexible.",
                    "Plot twist incoming. Buckle up, buttercup.",
                    "Life's about to get interesting. You got this.",
                    "The universe has jokes. Roll with it.",
                    "Chaos is just order waiting to be understood.",
                    "The wildcard factor is high. Adapt accordingly.",
                    "Expect the unexpected, then expect more.",
                    "The cosmic joker is shuffling the deck.",
                    "Normal is suspended. Embrace the weird.",
                    "Reality is glitching. Feature, not bug."
                ],
                brutal: [
                    "Nothing is as it seems. Wake up.",
                    "Your carefully laid plans? About to get scrambled.",
                    "The universe doesn't owe you predictability.",
                    "Control is an illusion. Always was.",
                    "Reality check incoming at maximum velocity.",
                    "The comfortable narrative? Dead. Adapt.",
                    "Chaos is the only constant. Deal with it.",
                    "Your certainty just expired. Embrace confusion.",
                    "The script just got tossed. Improvise.",
                    "Welcome to the unknown. Hope you packed light."
                ],
                mystic: [
                    "Order and chaos dance in eternal embrace.",
                    "The random contains patterns only time reveals.",
                    "Chaos is the universe's creative principle.",
                    "In the void of uncertainty, all possibilities exist.",
                    "The unexpected is the universe speaking in riddles.",
                    "Wildcard moments are portals to new timelines.",
                    "Entropy and evolution are cosmic dance partners.",
                    "The mystery deepens, and that's the point.",
                    "In chaos, the rigid break and the flexible thrive.",
                    "The cosmic trickster teaches through disruption."
                ]
            }
        };

        // ═══════════════════════════════════════════════════════════════
        // EDITABLE: KEYWORD MAPPINGS
        // ═══════════════════════════════════════════════════════════════
        
        const KEYWORDS = {
            love_relationships: [
                'love', 'relationship', 'dating', 'partner', 'boyfriend', 'girlfriend',
                'crush', 'romance', 'marriage', 'wedding', 'date', 'heart',
                'soulmate', 'ex', 'breakup', 'kiss', 'flirt', 'attraction'
            ],
            money_work: [
                'money', 'job', 'work', 'career', 'salary', 'income', 'business',
                'financial', 'invest', 'cash', 'dollar', 'pay', 'rent', 'bills',
                'client', 'boss', 'raise', 'promotion', 'hire', 'contract',
                'profit', 'revenue', 'rich', 'wealth', 'expensive', 'afford'
            ],
            creativity_projects: [
                'project', 'create', 'art', 'music', 'write', 'design', 'build',
                'game', 'app', 'website', 'code', 'paint', 'draw', 'idea',
                'creative', 'innovation', 'brand', 'startup', 'launch', 'prototype',
                'album', 'song', 'book', 'novel', 'script', 'film', 'video'
            ],
            health_energy: [
                'health', 'sick', 'doctor', 'hospital', 'medicine', 'diet',
                'exercise', 'fitness', 'gym', 'workout', 'tired', 'energy',
                'sleep', 'rest', 'stress', 'anxiety', 'depression', 'therapy',
                'mental', 'physical', 'body', 'pain', 'heal', 'wellness'
            ],
            luck_fate: [
                'luck', 'lucky', 'chance', 'gamble', 'bet', 'lottery', 'win',
                'fate', 'destiny', 'fortune', 'odds', 'random', 'serendipity'
            ],
            self_growth: [
                'change', 'grow', 'improve', 'better', 'learn', 'study',
                'develop', 'evolve', 'transform', 'habit', 'goal', 'dream',
                'purpose', 'meaning', 'spiritual', 'mindset', 'confidence',
                'therapy', 'meditation', 'journey', 'path', 'lesson'
            ]
        };

        // ═══════════════════════════════════════════════════════════════
        // EDITABLE: MOOD BIAS SETTINGS
        // ═══════════════════════════════════════════════════════════════
        
        const moodBiasChances = {
            balanced: { balanced: 0.8, brutal: 0.1, mystic: 0.1 },
            brutal: { balanced: 0.2, brutal: 0.7, mystic: 0.1 },
            mystic: { balanced: 0.2, brutal: 0.1, mystic: 0.7 }
        };

        // ═══════════════════════════════════════════════════════════════
        // DOM REFERENCES
        // ═══════════════════════════════════════════════════════════════
        
        const root = document.getElementById('inspire-8ball-oracle');
        if (!root) return;

        const questionInput = document.getElementById('inspire-question-input');
        const askButton = document.getElementById('inspire-ask-button');
        const moodSelect = document.getElementById('inspire-oracle-mood');
        const inputHint = document.getElementById('inspire-input-hint');
        const ballSphere = document.querySelector('.inspire-8ball-sphere');
        const ballAnswer = document.getElementById('inspire-8ball-answer');
        const answerDisplay = document.getElementById('inspire-answer-display');
        const historyList = document.getElementById('inspire-history-list');

        // ═══════════════════════════════════════════════════════════════
        // STATE
        // ═══════════════════════════════════════════════════════════════
        
        let isAsking = false;
        let history = [];

        // ═══════════════════════════════════════════════════════════════
        // FUNCTIONS
        // ═══════════════════════════════════════════════════════════════

        function enableButton() {
            if (questionInput.value.trim().length > 0) {
                askButton.disabled = false;
            } else {
                askButton.disabled = true;
            }
        }

        function categorizeQuestion(question) {
            const lowerQ = question.toLowerCase();
            const matches = {};

            // Count keyword matches per category
            for (const [category, keywords] of Object.entries(KEYWORDS)) {
                matches[category] = keywords.filter(kw => lowerQ.includes(kw)).length;
            }

            // Find category with most matches
            let maxMatches = 0;
            let bestCategory = null;

            for (const [category, count] of Object.entries(matches)) {
                if (count > maxMatches) {
                    maxMatches = count;
                    bestCategory = category;
                }
            }

            // If no clear match, check for yes/no questions or default to wildcard
            if (maxMatches === 0) {
                if (lowerQ.includes('should') || lowerQ.includes('will') || 
                    lowerQ.includes('can') || lowerQ.includes('?')) {
                    return 'yes_no_general';
                }
                return Math.random() < 0.5 ? 'yes_no_general' : 'chaos_wildcard';
            }

            return bestCategory;
        }

        function selectMood(userMood) {
            const chances = moodBiasChances[userMood];
            const rand = Math.random();
            
            if (rand < chances.balanced) return 'balanced';
            if (rand < chances.balanced + chances.brutal) return 'brutal';
            return 'mystic';
        }

        function getResponse(category, mood) {
            const responses = RESPONSES[category][mood];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        function addToHistory(question, answer) {
            history.unshift({ question, answer });
            if (history.length > 5) history.pop();
            renderHistory();
        }

        function renderHistory() {
            if (history.length === 0) {
                historyList.innerHTML = '<p class="inspire-8ball-history-empty">Your cosmic journey begins here...</p>';
                return;
            }

            historyList.innerHTML = history.map(item => `
                <div class="inspire-8ball-history-item">
                    <div class="inspire-8ball-history-question">Q: ${escapeHtml(item.question)}</div>
                    <div class="inspire-8ball-history-answer">A: ${escapeHtml(item.answer)}</div>
                </div>
            `).join('');
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function askOracle() {
            if (isAsking) return;

            const question = questionInput.value.trim();
            if (!question) {
                inputHint.textContent = 'Please enter a question first.';
                return;
            }

            // Start background music on first interaction
            startBackgroundMusic();

            isAsking = true;
            askButton.disabled = true;
            askButton.classList.add('inspire-asking');
            askButton.textContent = 'CONSULTING THE COSMOS...';
            inputHint.textContent = '';

            // Hide answer display
            answerDisplay.classList.remove('inspire-visible');
            answerDisplay.textContent = '';

            // Reset ball to show "8"
            ballAnswer.textContent = '8';
            ballAnswer.classList.remove('inspire-number-reveal');

            // Start shake animation
            ballSphere.classList.add('inspire-shaking');
            
            // Create particle effects during shake
            createParticles();

            // After animation completes
            setTimeout(() => {
                ballSphere.classList.remove('inspire-shaking');

                // Categorize and respond
                const category = categorizeQuestion(question);
                const userMood = selectedMood; // Use the global selectedMood from menu
                const mood = selectMood(userMood);
                const answer = getResponse(category, mood);
                
                // Generate random numerology number (0-10)
                const numerologyNumber = Math.floor(Math.random() * 11);
                const numerologyReading = NUMEROLOGY[numerologyNumber];

                // Show number in ball with reveal animation
                ballAnswer.textContent = numerologyNumber;
                ballAnswer.classList.add('inspire-number-reveal');

                // Show answer with numerology in display area
                answerDisplay.innerHTML = `${answer}<span class="inspire-numerology-reading">${numerologyReading}</span>`;
                answerDisplay.classList.add('inspire-visible');

                // Add to history (including numerology)
                addToHistory(question, `${answer} • ${numerologyReading}`);

                // Reset UI
                setTimeout(() => {
                    isAsking = false;
                    askButton.classList.remove('inspire-asking');
                    askButton.textContent = 'ASK THE ORACLE';
                    enableButton();
                    
                    // Reset ball back to "8"
                    setTimeout(() => {
                        ballAnswer.textContent = '8';
                        ballAnswer.classList.remove('inspire-number-reveal');
                    }, 2000);
                }, 500);

            }, 1600); // Match animation duration (3 shakes * 0.5s + buffer)
        }

        // ═══════════════════════════════════════════════════════════════
        // EVENT LISTENERS
        // ═══════════════════════════════════════════════════════════════

        questionInput.addEventListener('input', enableButton);
        
        questionInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !askButton.disabled) {
                askOracle();
            }
        });

        askButton.addEventListener('click', askOracle);

    // Initialize
    enableButton();
    renderHistory();

})();

/* ═══════════════════════════════════════════════════════════════════════════
   PATCH: Update addToHistory to use new system
   ═══════════════════════════════════════════════════════════════════════════ */

// Find and wrap the original addToHistory function
const originalAddToHistory = window.addToHistory || function() {};

// Override with new version that includes timestamps
window.addToHistory = function(question, fullAnswer) {
    // Extract answer and numerology
    const parts = fullAnswer.split(' • ');
    const answer = parts[0] || fullAnswer;
    const numerology = parts.slice(1).join(' • ') || '';
    
    addToGameHistory(question, answer, numerology);
};

console.log('INSPIRE Oracle: Enhanced screen system loaded');

