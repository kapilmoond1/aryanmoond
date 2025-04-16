// Alphabet data with sounds and information
const alphabetData = {
    vowels: [
        { letter: 'अ', transliteration: 'a', sound: 'a.mp3', example: 'अनार (anār) - Pomegranate', pronunciation: '"a" as in "about"' },
        { letter: 'आ', transliteration: 'ā', sound: 'aa.mp3', example: 'आम (ām) - Mango', pronunciation: '"aa" as in "father"' },
        { letter: 'इ', transliteration: 'i', sound: 'i.mp3', example: 'इमली (imlī) - Tamarind', pronunciation: '"i" as in "sit"' },
        { letter: 'ई', transliteration: 'ī', sound: 'ee.mp3', example: 'ईख (īkh) - Sugarcane', pronunciation: '"ee" as in "feet"' },
        { letter: 'उ', transliteration: 'u', sound: 'u.mp3', example: 'उल्लू (ullū) - Owl', pronunciation: '"u" as in "put"' },
        { letter: 'ऊ', transliteration: 'ū', sound: 'oo.mp3', example: 'ऊन (ūn) - Wool', pronunciation: '"oo" as in "boot"' },
        { letter: 'ऋ', transliteration: 'ṛ', sound: 'ri.mp3', example: 'ऋषि (ṛṣi) - Sage', pronunciation: '"ri" as in "rich"' },
        { letter: 'ए', transliteration: 'e', sound: 'e.mp3', example: 'एक (ek) - One', pronunciation: '"e" as in "bed"' },
        { letter: 'ऐ', transliteration: 'ai', sound: 'ai.mp3', example: 'ऐनक (ainak) - Glasses', pronunciation: '"ai" as in "aisle"' },
        { letter: 'ओ', transliteration: 'o', sound: 'o.mp3', example: 'ओस (os) - Dew', pronunciation: '"o" as in "go"' },
        { letter: 'औ', transliteration: 'au', sound: 'au.mp3', example: 'औरत (aurat) - Woman', pronunciation: '"au" as in "caught"' },
        { letter: 'अं', transliteration: 'aṃ', sound: 'am.mp3', example: 'अंगूर (aṃgūr) - Grapes', pronunciation: 'Nasal sound' },
        { letter: 'अः', transliteration: 'aḥ', sound: 'ah.mp3', example: 'दुःख (duḥkh) - Sorrow', pronunciation: 'Aspirated sound' }
    ],
    consonants: [
        { letter: 'क', transliteration: 'ka', sound: 'ka.mp3', example: 'कमल (kamal) - Lotus', pronunciation: '"k" as in "kite"' },
        { letter: 'ख', transliteration: 'kha', sound: 'kha.mp3', example: 'खरगोश (khargosh) - Rabbit', pronunciation: 'Aspirated "k"' },
        { letter: 'ग', transliteration: 'ga', sound: 'ga.mp3', example: 'गाय (gāy) - Cow', pronunciation: '"g" as in "go"' },
        { letter: 'घ', transliteration: 'gha', sound: 'gha.mp3', example: 'घर (ghar) - House', pronunciation: 'Aspirated "g"' },
        { letter: 'ङ', transliteration: 'ṅa', sound: 'nga.mp3', example: 'पंख (paṅkh) - Wing', pronunciation: 'Nasal "ng"' },
        { letter: 'च', transliteration: 'ca', sound: 'cha.mp3', example: 'चाय (cāy) - Tea', pronunciation: '"ch" as in "chair"' },
        { letter: 'छ', transliteration: 'cha', sound: 'chha.mp3', example: 'छाता (chātā) - Umbrella', pronunciation: 'Aspirated "ch"' },
        { letter: 'ज', transliteration: 'ja', sound: 'ja.mp3', example: 'जल (jal) - Water', pronunciation: '"j" as in "jump"' },
        { letter: 'झ', transliteration: 'jha', sound: 'jha.mp3', example: 'झंडा (jhaṇḍā) - Flag', pronunciation: 'Aspirated "j"' },
        { letter: 'ञ', transliteration: 'ña', sound: 'nya.mp3', example: 'ज्ञान (jñān) - Knowledge', pronunciation: '"ny" as in "canyon"' }
        // More consonants can be added here
    ]
};

// DOM Elements
const alphabetCards = document.querySelectorAll('.alphabet-card');
const soundPlayer = document.getElementById('sound-player');
const playSoundBtn = document.getElementById('play-sound-btn');
const optionsContainer = document.getElementById('options-container');
const feedbackElement = document.getElementById('feedback');
const startMatchingBtn = document.getElementById('start-matching-btn');
const matchingContainer = document.getElementById('matching-container');

// Create notification container
const notificationContainer = document.createElement('div');
notificationContainer.id = 'notification-container';
notificationContainer.style.display = 'none';
document.body.appendChild(notificationContainer);

// Function to show notification
function showNotification(message) {
    notificationContainer.textContent = message;
    notificationContainer.style.display = 'block';
    notificationContainer.style.position = 'fixed';
    notificationContainer.style.bottom = '20px';
    notificationContainer.style.right = '20px';
    notificationContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    notificationContainer.style.color = 'white';
    notificationContainer.style.padding = '10px 20px';
    notificationContainer.style.borderRadius = '5px';
    notificationContainer.style.zIndex = '1000';
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notificationContainer.style.display = 'none';
    }, 3000);
}

// Initialize voices for speech synthesis
let speechSynthesisVoices = [];
if ('speechSynthesis' in window) {
    // Try to load voices immediately
    speechSynthesisVoices = window.speechSynthesis.getVoices();
    
    // If voices aren't loaded yet, set up event listener
    if (speechSynthesisVoices.length === 0) {
        window.speechSynthesis.onvoiceschanged = function() {
            speechSynthesisVoices = window.speechSynthesis.getVoices();
            console.log('Voices loaded:', speechSynthesisVoices.length);
        };
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Set animation delay for cards
    alphabetCards.forEach((card, index) => {
        card.style.setProperty('--i', index);
    });

    // Add click event to alphabet cards
    alphabetCards.forEach(card => {
        card.addEventListener('click', () => {
            // Play sound
            const soundFile = card.getAttribute('data-sound');
            playSound(soundFile);
            
            // Flip card
            card.classList.toggle('flipped');
            
            // Reset card after 3 seconds if it's flipped to back
            if (card.classList.contains('flipped')) {
                setTimeout(() => {
                    card.classList.remove('flipped');
                }, 3000);
            }
        });
    });

    // Initialize listening exercise
    initListeningExercise();

    // Initialize matching exercise
    startMatchingBtn.addEventListener('click', initMatchingExercise);
});

// Function to play sound using Google Text-to-Speech API
function playSound(soundFile) {
    // Check if soundFile is provided
    if (!soundFile) {
        console.error('No sound file specified');
        return;
    }
    
    try {
        // Get the letter and its data from the sound file name
        const soundName = soundFile.split('.')[0];
        let letterData = null;
        
        // Find the letter data in our alphabet data
        for (const category of ['vowels', 'consonants']) {
            const found = alphabetData[category].find(item => item.sound === soundFile);
            if (found) {
                letterData = found;
                break;
            }
        }
        
        if (!letterData) {
            console.error(`Could not find letter data for sound: ${soundFile}`);
            return;
        }
        
        // Get the Hindi text to speak (the letter itself)
        const textToSpeak = letterData.letter;
        
        // Create Google TTS URL
        // Using the unofficial Google Translate TTS API
        const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(textToSpeak)}&tl=hi&client=tw-ob`;
        
        // Set the audio source and play it
        soundPlayer.src = googleTtsUrl;
        
        // Add error handling
        soundPlayer.onerror = function() {
            console.error(`Error playing sound for: ${textToSpeak}`);
            // Show a small notification to the user
            showNotification('Using fallback audio...');
            // Try Web Speech API as second fallback
            if ('speechSynthesis' in window) {
                useSpeechSynthesis(textToSpeak);
            } else {
                // Final fallback to local file if available
                soundPlayer.src = `sounds/${soundFile}`;
                soundPlayer.play().catch(error => {
                    console.error('Fallback playback failed:', error);
                    showNotification('Audio playback failed. Please try again.');
                });
            }
        };
        
        // Play the sound
        let playPromise = soundPlayer.play();
        
        // Handle play() promise to catch any autoplay issues
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('Playback failed:', error);
                // Try Web Speech API as fallback
                if ('speechSynthesis' in window) {
                    useSpeechSynthesis(textToSpeak);
                } else {
                    // Final fallback to local file
                    soundPlayer.src = `sounds/${soundFile}`;
                    soundPlayer.play().catch(err => {
                        console.error('All playback methods failed:', err);
                        showNotification('Audio playback failed. Please try again.');
                    });
                }
            });
        }
    } catch (error) {
        console.error('Error playing sound:', error);
        showNotification('Error playing sound. Please try again.');
    }
}

// Function to use Web Speech API for text-to-speech
function useSpeechSynthesis(text) {
    try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN'; // Hindi language
        utterance.rate = 0.8; // Slightly slower rate for better clarity
        utterance.pitch = 1;
        
        // Use preloaded voices if available
        let voices = speechSynthesisVoices.length > 0 ? speechSynthesisVoices : window.speechSynthesis.getVoices();
        
        // If voices array is empty, wait for the voiceschanged event
        if (voices.length === 0) {
            showNotification('Loading speech voices...');
            window.speechSynthesis.onvoiceschanged = function() {
                voices = window.speechSynthesis.getVoices();
                speechSynthesisVoices = voices; // Update the global voices array
                setVoiceAndSpeak();
            };
        } else {
            setVoiceAndSpeak();
        }
        
        function setVoiceAndSpeak() {
            // Find a Hindi voice if available
            const hindiVoice = voices.find(voice => voice.lang.includes('hi'));
            if (hindiVoice) {
                utterance.voice = hindiVoice;
            }
            
            // Show notification
            showNotification('Using browser speech synthesis...');
            
            // Speak the text
            window.speechSynthesis.speak(utterance);
            
            // Handle errors
            utterance.onerror = function(event) {
                console.error('Speech synthesis error:', event);
                showNotification('Speech synthesis failed. Please try again.');
            };
        }
    } catch (error) {
        console.error('Speech synthesis error:', error);
        showNotification('Speech synthesis failed. Please try again.');
    }
}

// Listening Exercise
function initListeningExercise() {
    let currentLetter = null;
    let allLetters = [...alphabetData.vowels, ...alphabetData.consonants];
    
    playSoundBtn.addEventListener('click', () => {
        // Clear previous options and feedback
        optionsContainer.innerHTML = '';
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback';
        
        // Select a random letter
        currentLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
        
        // Play the sound
        playSound(currentLetter.sound);
        
        // Generate options (1 correct, 3 random)
        const options = [currentLetter];
        while (options.length < 4) {
            const randomLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
            if (!options.includes(randomLetter)) {
                options.push(randomLetter);
            }
        }
        
        // Shuffle options
        shuffleArray(options);
        
        // Create option buttons
        options.forEach(option => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option-btn';
            optionBtn.textContent = option.letter;
            optionBtn.addEventListener('click', () => checkAnswer(option, currentLetter));
            optionsContainer.appendChild(optionBtn);
        });
    });
}

// Check answer for listening exercise
function checkAnswer(selected, correct) {
    if (selected === correct) {
        feedbackElement.textContent = 'Correct! Well done!';
        feedbackElement.className = 'feedback correct';
    } else {
        feedbackElement.textContent = `Incorrect. The correct answer is ${correct.letter} (${correct.transliteration})`;
        feedbackElement.className = 'feedback incorrect';
    }
    
    // Disable all option buttons
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correct.letter) {
            btn.style.backgroundColor = '#28a745';
            btn.style.borderColor = '#28a745';
            btn.style.color = 'white';
        }
    });
    
    // Play the sound again after 1 second
    setTimeout(() => {
        playSound(correct.sound);
    }, 1000);
}

// Matching Exercise
function initMatchingExercise() {
    // Clear previous matching game
    matchingContainer.innerHTML = '';
    startMatchingBtn.disabled = true;
    
    // Get a subset of letters for the matching game
    const gameLetters = getRandomItems([...alphabetData.vowels, ...alphabetData.consonants], 5);
    
    // Create pairs (letter and transliteration)
    const pairs = [];
    gameLetters.forEach(item => {
        pairs.push({ id: `letter-${item.letter}`, text: item.letter, pairId: item.letter, type: 'letter' });
        pairs.push({ id: `trans-${item.letter}`, text: item.transliteration, pairId: item.letter, type: 'transliteration' });
    });
    
    // Shuffle pairs
    shuffleArray(pairs);
    
    // Create matching items
    let selectedItems = [];
    let matchedPairs = 0;
    
    pairs.forEach(item => {
        const matchingItem = document.createElement('div');
        matchingItem.className = 'matching-item';
        matchingItem.textContent = item.text;
        matchingItem.dataset.id = item.id;
        matchingItem.dataset.pairId = item.pairId;
        
        matchingItem.addEventListener('click', () => {
            // Ignore if already matched or same item clicked twice
            if (matchingItem.classList.contains('matched') || 
                (selectedItems.length === 1 && selectedItems[0].dataset.id === matchingItem.dataset.id)) {
                return;
            }
            
            // Select the item
            matchingItem.classList.add('selected');
            selectedItems.push(matchingItem);
            
            // Check if we have a pair
            if (selectedItems.length === 2) {
                if (selectedItems[0].dataset.pairId === selectedItems[1].dataset.pairId) {
                    // Match found
                    selectedItems.forEach(item => {
                        item.classList.remove('selected');
                        item.classList.add('matched');
                    });
                    matchedPairs++;
                    
                    // Play sound for the matched letter
                    const matchedLetter = gameLetters.find(l => l.letter === selectedItems[0].dataset.pairId);
                    if (matchedLetter) {
                        playSound(matchedLetter.sound);
                    }
                    
                    // Check if game is complete
                    if (matchedPairs === gameLetters.length) {
                        setTimeout(() => {
                            alert('Congratulations! You matched all pairs!');
                            startMatchingBtn.disabled = false;
                        }, 1000);
                    }
                } else {
                    // No match
                    setTimeout(() => {
                        selectedItems.forEach(item => {
                            item.classList.remove('selected');
                        });
                    }, 1000);
                }
                selectedItems = [];
            }
        });
        
        matchingContainer.appendChild(matchingItem);
    });
}

// Helper function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Helper function to get random items from array
function getRandomItems(array, count) {
    const shuffled = [...array];
    shuffleArray(shuffled);
    return shuffled.slice(0, count);
}

// Create a folder for sounds (in a real implementation)
// For this demo, we're simulating sounds
// In a real implementation, you would need to add actual sound files
// console.log('Note: In a real implementation, add actual sound files in a "sounds" folder');