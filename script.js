/* ═══════════════════════════════════════════════════════════════════════════
   INSPIRE MAGIC 8-BALL ORACLE - COMPLETE WORKING VERSION
   All features tested and verified
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    console.log('🔮 INSPIRE Oracle initializing...');

    // ═══════════════════════════════════════════════════════════════
    // STATE VARIABLES
    // ══════════════════════════════════════════════════════════════

    let currentScreen = 'splash';
    let selectedMood = 'balanced';
    let gameHistory = [];
    let isAsking = false;
    let musicStarted = false;

    // ═══════════════════════════════════════════════════════════════
    // DOM ELEMENTS
    // ═══════════════════════════════════════════════════════════════
    
    const splashScreen = document.getElementById('inspire-splash-screen');
    const introScreen = document.getElementById('inspire-intro-screen');
    const startMenu = document.getElementById('inspire-start-menu');
    const gameScreen = document.getElementById('inspire-game-screen');
    const historyModal = document.getElementById('inspire-history-modal');
    
    const startButton = document.getElementById('inspire-start-button');
    const menuStartButton = document.getElementById('inspire-menu-start-button');
    const menuHistoryButton = document.getElementById('inspire-menu-history-button');
    const gameHistoryButton = document.getElementById('inspire-game-history-button');
    const backButton = document.getElementById('inspire-back-button');
    const closeHistoryButton = document.getElementById('inspire-close-history');
    const newReadingButton = document.getElementById('inspire-new-reading-button');
    const mainMenuButton = document.getElementById('inspire-menu-button');
    
    const introVideo = document.getElementById('inspire-intro-video');
    const backgroundMusic = document.getElementById('inspire-background-music');
    const menuMoodSelect = document.getElementById('inspire-menu-mood');
    
    const questionInput = document.getElementById('inspire-question-input');
    const askButton = document.getElementById('inspire-ask-button');
    const inputHint = document.getElementById('inspire-input-hint');
    const ballSphere = document.querySelector('.inspire-8ball-sphere');
    const ballAnswer = document.getElementById('inspire-8ball-answer');
    const answerDisplay = document.getElementById('inspire-answer-display');
    const historyList = document.getElementById('inspire-history-list');

    console.log('✅ DOM loaded successfully');

    // ═══════════════════════════════════════════════════════════════
    // NUMEROLOGY DATABASE
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
    // RESPONSE DATABASE
    // ═══════════════════════════════════════════════════════════════
    
    const RESPONSES = {
        love_relationships: {
            balanced: [
                "The universe says yes—but your discipline is still pending.",
                "Love is incoming. Clear the space for it to land.",
                "This connection has potential. Your ego? Not invited.",
                "The chemistry's real, but timing needs work. Be patient.",
                "Your heart knows the answer. This is just confirmation."
            ],
            brutal: [
                "Nah. Move on. Next question.",
                "You already know this ain't it. Stop wasting time.",
                "The red flags are waving. Open your eyes.",
                "Stop forcing what doesn't flow naturally.",
                "You deserve better. Act like it."
            ],
            mystic: [
                "The moon whispers secrets of hearts intertwined.",
                "Two souls dancing in the cosmic void—fate is watching.",
                "The stars align, but free will writes the final chapter.",
                "Love's frequency vibrates through dimensions unseen.",
                "The oracle sees threads of possibility weaving together."
            ]
        },
        money_work: {
            balanced: [
                "Money wants to find you. Stop hiding in doubt.",
                "The opportunity is real. Your preparation will seal it.",
                "This investment makes sense. Trust your analysis.",
                "Your value is solid. Negotiate with confidence.",
                "Financial breakthrough incoming. Stay focused."
            ],
            brutal: [
                "This deal smells wrong. Walk away.",
                "You're undercharging because you're scared. Fix that.",
                "Stop chasing the bag. Build the value first.",
                "This job is draining your soul. Plan your exit.",
                "Stop asking for permission to be paid what you're worth."
            ],
            mystic: [
                "Abundance flows where intention meets action.",
                "The cosmic accountant balances all books eventually.",
                "Prosperity is a frequency you must tune into.",
                "Your financial destiny awaits beyond the fear.",
                "Golden opportunities wear disguises of hard work."
            ]
        },
        creativity_projects: {
            balanced: [
                "This path is lit. Just watch your ego at the door.",
                "Your idea has legs. Execute with discipline.",
                "The vision is clear. Now put in the hours.",
                "This project wants to be born. Help it happen.",
                "Creative energy is high. Channel it into output."
            ],
            brutal: [
                "This idea needs more cooking. Back to the drawing board.",
                "You're overthinking it. Ship something, anything.",
                "Stop planning and start building. Perfection is fake.",
                "Your creative block is actually fear. Face it.",
                "Stop collecting inspiration. Start creating output."
            ],
            mystic: [
                "The muse whispers through cracks in reality.",
                "Creation is channeling the infinite into form.",
                "Your art is a portal—build it with intention.",
                "The universe dreams through willing vessels.",
                "Your vision exists in the quantum field. Collapse it into being."
            ]
        },
        health_energy: {
            balanced: [
                "Your body's been trying to tell you something. Listen.",
                "Rest is productive. Schedule it like a meeting.",
                "This wellness choice serves your highest good.",
                "Energy management is everything. Audit your drains.",
                "Your instincts on this health matter are correct."
            ],
            brutal: [
                "You're running on fumes. This isn't sustainable.",
                "Stop ignoring the warning signs. Get checked.",
                "Your lifestyle is working against you. Fix it.",
                "You can't pour from an empty cup. Fill it first.",
                "Your body keeps score. The bill is coming due."
            ],
            mystic: [
                "Your vessel is a temple for universal energy.",
                "The body speaks in symptoms before words.",
                "Healing flows where awareness meets compassion.",
                "Vitality is your birthright—claim it consciously.",
                "Your healing journey serves a greater purpose."
            ]
        },
        luck_fate: {
            balanced: [
                "Luck favors the prepared. You're ready.",
                "The odds are better than you think. Play the game.",
                "Fortune smiles on bold moves right now.",
                "This gamble has cosmic backing. Take it.",
                "Lucky breaks come to those who show up."
            ],
            brutal: [
                "Luck is preparation meeting opportunity. Are you prepared?",
                "Stop waiting for the universe. Make your own luck.",
                "Fortune favors the brave, not the hesitant.",
                "You're confusing hope with strategy. Be smarter.",
                "Stop consulting oracles. Start taking action."
            ],
            mystic: [
                "Synchronicity dances at the edge of consciousness.",
                "Fate weaves threads invisible to ordinary sight.",
                "Your destiny hides in plain sight disguised as chance.",
                "Fortune is a frequency you must tune into.",
                "Magic happens when intention meets surrender."
            ]
        },
        yes_no_general: {
            balanced: [
                "Yes, but with eyes wide open.",
                "Not right now. Timing needs adjustment.",
                "Absolutely. The green light is lit.",
                "Proceed with caution and awareness.",
                "The answer is yes—trust yourself on this."
            ],
            brutal: [
                "Hard yes. Stop overthinking it.",
                "Hell no. What were you thinking?",
                "Obviously yes. Why are you even asking?",
                "No. Next question.",
                "The answer is no, and deep down you know it."
            ],
            mystic: [
                "The cosmos whispers: yes, if you dare.",
                "Negative space holds the answer you seek.",
                "Affirmative—but not in the way you expect.",
                "The oracle sees both paths leading to truth.",
                "Your question contains its own answer."
            ]
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SCREEN TRANSITION FUNCTIONS
    // ═══════════════════════════════════════════════════════════════
    
    function hideScreen(screen, callback) {
        if (!screen) return;
        screen.classList.add('inspire-fade-out');
        setTimeout(() => {
            screen.classList.remove('inspire-active', 'inspire-fade-out');
            if (callback) callback();
        }, 800);
    }

    function showScreen(screen) {
        if (!screen) return;
        screen.classList.add('inspire-active');
    }

    // ═══════════════════════════════════════════════════════════════
    // AUDIO MANAGEMENT
    // ═══════════════════════════════════════════════════════════════
    
    function startBackgroundMusic() {
        if (musicStarted || !backgroundMusic) return;
        musicStarted = true;
        
        backgroundMusic.volume = 0;
        backgroundMusic.play().catch(err => console.log('Audio play prevented'));
        
        const steps = 50;
        const stepDuration = 2000 / steps;
        const volumeStep = 0.3 / steps;
        
        let currentStep = 0;
        const fadeInterval = setInterval(() => {
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                backgroundMusic.volume = 0.3;
            } else {
                backgroundMusic.volume = Math.min(backgroundMusic.volume + volumeStep, 0.3);
                currentStep++;
            }
        }, stepDuration);
    }

    // ═══════════════════════════════════════════════════════════════
    // HISTORY MANAGEMENT
    // ═══════════════════════════════════════════════════════════════
    
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
        
        gameHistory.unshift(reading);
        if (gameHistory.length > 20) {
            gameHistory.pop();
        }
        
        saveHistory();
    }

    function saveHistory() {
        try {
            localStorage.setItem('inspireOracleHistory', JSON.stringify(gameHistory));
        } catch (e) {
            console.log('Could not save history');
        }
    }

    function loadHistory() {
        try {
            const saved = localStorage.getItem('inspireOracleHistory');
            if (saved) {
                const parsed = JSON.parse(saved);
                gameHistory = parsed.map(item => ({
                    ...item,
                    timestamp: new Date(item.timestamp)
                }));
            }
        } catch (e) {
            console.log('Could not load history');
        }
    }

    function displayHistory() {
        if (!historyList) return;
        
        if (gameHistory.length === 0) {
            historyList.innerHTML = '<p class="inspire-history-empty">Your cosmic journey begins here...</p>';
            return;
        }
        
        historyList.innerHTML = gameHistory.map(reading => `
            <div class="inspire-history-item">
                <div class="inspire-history-timestamp">${formatTimestamp(reading.timestamp)}</div>
                <div class="inspire-history-question">${reading.question}</div>
                <div class="inspire-history-answer">${reading.answer}</div>
                <div class="inspire-history-numerology">${reading.numerology}</div>
            </div>
        `).join('');
    }

    function showHistoryModal() {
        if (!historyModal) return;
        displayHistory();
        historyModal.classList.add('inspire-visible');
    }

    function hideHistoryModal() {
        if (!historyModal) return;
        historyModal.classList.remove('inspire-visible');
    }

    // ═══════════════════════════════════════════════════════════════
    // ORACLE LOGIC
    // ═══════════════════════════════════════════════════════════════
    
    function categorizeQuestion(question) {
        const lowerQ = question.toLowerCase();
        
        if (/\b(love|relationship|date|dating|partner|marriage|crush|boyfriend|girlfriend|spouse|romantic)\b/i.test(lowerQ)) {
            return 'love_relationships';
        }
        if (/\b(money|job|work|career|business|finance|salary|income|invest|promotion)\b/i.test(lowerQ)) {
            return 'money_work';
        }
        if (/\b(create|project|art|write|build|idea|design|music|film|startup)\b/i.test(lowerQ)) {
            return 'creativity_projects';
        }
        if (/\b(health|energy|tired|sick|wellness|exercise|sleep|stress|burnout)\b/i.test(lowerQ)) {
            return 'health_energy';
        }
        if (/\b(luck|fate|destiny|fortune|chance|risk|gamble|lottery)\b/i.test(lowerQ)) {
            return 'luck_fate';
        }
        
        return 'yes_no_general';
    }

    function selectMood(userMood) {
        const chances = {
            balanced: { balanced: 0.8, brutal: 0.1, mystic: 0.1 },
            brutal: { balanced: 0.2, brutal: 0.7, mystic: 0.1 },
            mystic: { balanced: 0.2, brutal: 0.1, mystic: 0.7 }
        };
        
        const rand = Math.random();
        const moodChances = chances[userMood];
        
        if (rand < moodChances.balanced) return 'balanced';
        if (rand < moodChances.balanced + moodChances.brutal) return 'brutal';
        return 'mystic';
    }

    function getResponse(category, mood) {
        const responses = RESPONSES[category][mood];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    function createParticles() {
        const particleContainer = document.querySelector('.inspire-8ball-particles');
        if (!particleContainer) return;
        
        particleContainer.innerHTML = '';
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: #FFD700;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.7 + 0.3};
                animation: inspire-particle-float ${Math.random() * 3 + 2}s infinite;
            `;
            particleContainer.appendChild(particle);
        }
    }

    function enableButton() {
        if (!questionInput || !askButton) return;
        if (questionInput.value.trim().length > 0) {
            askButton.disabled = false;
        } else {
            askButton.disabled = true;
        }
    }

    function askOracle() {
        if (isAsking || !questionInput || !askButton) return;
        
        const question = questionInput.value.trim();
        if (!question) return;
        
        startBackgroundMusic();
        
        isAsking = true;
        askButton.disabled = true;
        askButton.classList.add('inspire-asking');
        askButton.textContent = 'CONSULTING THE COSMOS...';
        if (inputHint) inputHint.textContent = '';
        
        if (answerDisplay) {
            answerDisplay.classList.remove('inspire-visible');
            answerDisplay.innerHTML = '';
        }
        
        if (ballAnswer) {
            ballAnswer.textContent = '8';
            ballAnswer.classList.remove('inspire-number-reveal');
        }
        
        if (ballSphere) {
            ballSphere.classList.add('inspire-shaking');
            createParticles();
        }
        
        setTimeout(() => {
            if (ballSphere) ballSphere.classList.remove('inspire-shaking');
            
            const category = categorizeQuestion(question);
            const mood = selectMood(selectedMood);
            const answer = getResponse(category, mood);
            const numerologyNumber = Math.floor(Math.random() * 11);
            const numerologyReading = NUMEROLOGY[numerologyNumber];
            
            console.log('✨ Answer:', { category, mood, number: numerologyNumber });
            
            if (ballAnswer) {
                ballAnswer.textContent = numerologyNumber;
                ballAnswer.classList.add('inspire-number-reveal');
            }
            
            if (answerDisplay) {
                answerDisplay.innerHTML = `
                    <div class="inspire-answer-section">
                        <h3 class="inspire-section-title">Oracle's Answer</h3>
                        <div class="inspire-oracle-answer">${answer}</div>
                    </div>
                    <div class="inspire-numerology-section">
                        <h3 class="inspire-section-title">Numerology Reading (${numerologyNumber})</h3>
                        <div class="inspire-numerology-reading">${numerologyReading}</div>
                    </div>
                `;
                answerDisplay.classList.add('inspire-visible');
            }
            
            addToGameHistory(question, answer, numerologyReading);
            
            setTimeout(() => {
                isAsking = false;
                askButton.classList.remove('inspire-asking');
                askButton.textContent = 'ASK THE ORACLE';
                enableButton();
                // FIXED: Number stays until new question
            }, 500);
        }, 1600);
    }

    function resetForNewReading() {
        console.log('🔄 Reset for new reading');
        if (questionInput) {
            questionInput.value = '';
            questionInput.focus();
        }
        if (answerDisplay) {
            answerDisplay.classList.remove('inspire-visible');
            answerDisplay.innerHTML = '';
        }
        if (ballAnswer) {
            ballAnswer.textContent = '8';
            ballAnswer.classList.remove('inspire-number-reveal');
        }
        enableButton();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ═══════════════════════════════════════════════════════════════
    // EVENT LISTENERS - SPLASH & INTRO
    // ═══════════════════════════════════════════════════════════════
    
    if (startButton) {
        startButton.addEventListener('click', () => {
            console.log('▶️ Start clicked');
            hideScreen(splashScreen, () => {
                showScreen(introScreen);
                currentScreen = 'intro';
                setTimeout(() => {
                    if (introVideo) {
                        introVideo.classList.add('inspire-playing');
                        introVideo.play().catch(err => console.log('Video prevented'));
                    }
                }, 100);
            });
        });
    }

    function videoEndTransition() {
        if (introVideo) introVideo.classList.remove('inspire-playing');
        setTimeout(() => {
            hideScreen(introScreen, () => {
                showScreen(startMenu);
                currentScreen = 'menu';
                setTimeout(() => {
                    if (startMenu) startMenu.classList.add('inspire-loaded');
                }, 100);
                startBackgroundMusic();
            });
        }, 500);
    }

    if (introVideo) {
        introVideo.addEventListener('ended', videoEndTransition);
        introVideo.addEventListener('click', () => {
            if (!introVideo.paused) {
                introVideo.pause();
                videoEndTransition();
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // EVENT LISTENERS - MENU
    // ═══════════════════════════════════════════════════════════════
    
    if (menuStartButton) {
        menuStartButton.addEventListener('click', () => {
            if (menuMoodSelect) selectedMood = menuMoodSelect.value;
            console.log('🎮 Begin reading | Mood:', selectedMood);
            hideScreen(startMenu, () => {
                showScreen(gameScreen);
                currentScreen = 'game';
            });
        });
    }

    if (menuHistoryButton) {
        menuHistoryButton.addEventListener('click', () => {
            console.log('📖 Menu history clicked');
            showHistoryModal();
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // EVENT LISTENERS - GAME
    // ═══════════════════════════════════════════════════════════════
    
    if (backButton) {
        backButton.addEventListener('click', () => {
            console.log('⬅️ Back clicked');
            hideScreen(gameScreen, () => {
                showScreen(startMenu);
                currentScreen = 'menu';
                resetForNewReading();
            });
        });
    }

    if (newReadingButton) {
        newReadingButton.addEventListener('click', () => {
            console.log('⚡ New reading clicked');
            resetForNewReading();
        });
    }

    if (mainMenuButton) {
        mainMenuButton.addEventListener('click', () => {
            console.log('↩ Main menu clicked');
            hideScreen(gameScreen, () => {
                showScreen(startMenu);
                currentScreen = 'menu';
                resetForNewReading();
            });
        });
    }

    if (gameHistoryButton) {
        gameHistoryButton.addEventListener('click', () => {
            console.log('📖 Game history clicked');
            showHistoryModal();
        });
    }

    if (questionInput) {
        questionInput.addEventListener('input', enableButton);
        questionInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !askButton.disabled) askOracle();
        });
    }

    if (askButton) {
        askButton.addEventListener('click', askOracle);
    }

    // ═══════════════════════════════════════════════════════════════
    // EVENT LISTENERS - HISTORY MODAL
    // ═══════════════════════════════════════════════════════════════
    
    if (closeHistoryButton) {
        closeHistoryButton.addEventListener('click', hideHistoryModal);
    }

    if (historyModal) {
        historyModal.addEventListener('click', (e) => {
            if (e.target === historyModal) hideHistoryModal();
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZE
    // ═══════════════════════════════════════════════════════════════
    
    loadHistory();
    enableButton();
    
    console.log('✅ Oracle ready!');
});
