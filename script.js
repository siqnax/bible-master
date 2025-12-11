// Global Variables
let currentUser = {
    name: 'Guest',
    level: 'Bronze',
    xp: 450,
    streak: 7,
    avatar: 'assets/avatars/default.png'
};

let quizSettings = {
    mode: 'standard',
    difficulty: 'mixed',
    topic: 'random',
    questionCount: 15
};

let achievements = [];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeUser();
    initializeQuizSettings();
    updateOnlineUsers();
    loadAchievements();
    initializeNavigation();
    initializeServiceWorker();
    
    // Update online users every 3 minutes
    setInterval(updateOnlineUsers, 180000);
});

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// User Management
function initializeUser() {
    const savedUser = localStorage.getItem('bibleQuizUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    
    updateUserBadge();
}

function updateUserBadge() {
    const badge = document.getElementById('userBadge');
    if (badge) {
        badge.querySelector('.streak').textContent = `🔥 ${currentUser.streak}`;
        badge.querySelector('.avatar').src = currentUser.avatar;
    }
}

// Quiz Settings
function initializeQuizSettings() {
    // Mode Selection
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.mode-card').forEach(c => {
                c.style.borderColor = '';
                c.style.boxShadow = '';
            });
            
            this.style.borderColor = 'var(--primary-color)';
            this.style.boxShadow = 'var(--shadow-md)';
            quizSettings.mode = this.dataset.mode;
            
            // Move to next step
            showStep(2);
        });
    });
    
    // Difficulty Selection
    document.querySelectorAll('.difficulty-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.difficulty-card').forEach(c => {
                c.style.borderColor = '';
                c.style.boxShadow = '';
            });
            
            this.style.borderColor = 'var(--primary-color)';
            this.style.boxShadow = 'var(--shadow-md)';
            quizSettings.difficulty = this.dataset.difficulty;
            
            showStep(3);
        });
    });
    
    // Topic Selection
    document.querySelectorAll('.topic-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.topic-card').forEach(c => {
                c.style.borderColor = '';
                c.style.boxShadow = '';
            });
            
            this.style.borderColor = 'var(--primary-color)';
            this.style.boxShadow = 'var(--shadow-md)';
            quizSettings.topic = this.dataset.topic;
            
            showStep(4);
        });
    });
    
    // Question Count Slider
    const slider = document.getElementById('questionSlider');
    const countDisplay = document.getElementById('questionCount');
    
    if (slider) {
        slider.addEventListener('input', function() {
            quizSettings.questionCount = parseInt(this.value);
            countDisplay.textContent = this.value;
        });
    }
    
    // Quick options for question count
    document.querySelectorAll('.btn-option').forEach(btn => {
        btn.addEventListener('click', function() {
            const count = parseInt(this.dataset.count);
            quizSettings.questionCount = count;
            slider.value = count;
            countDisplay.textContent = count;
        });
    });
    
    // Start Custom Quiz
    document.getElementById('startCustomQuiz')?.addEventListener('click', startCustomQuiz);
    
    // Quick Start Button
    document.querySelector('.btn-start-quiz')?.addEventListener('click', function() {
        startQuickQuiz();
    });
}

function showStep(stepNumber) {
    // Update step indicators
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.dataset.step) === stepNumber) {
            step.classList.add('active');
        }
    });
    
    // Show corresponding step content
    document.querySelectorAll('.settings-step').forEach(step => {
        step.classList.remove('active');
        if (step.id === `step${stepNumber}`) {
            step.classList.add('active');
        }
    });
}

function startCustomQuiz() {
    // Save settings and redirect to quiz page
    localStorage.setItem('quizSettings', JSON.stringify(quizSettings));
    window.location.href = 'pages/quiz.html';
}

function startQuickQuiz() {
    // Default quick quiz settings
    const quickSettings = {
        mode: 'standard',
        difficulty: 'mixed',
        topic: 'random',
        questionCount: 10
    };
    
    localStorage.setItem('quizSettings', JSON.stringify(quickSettings));
    window.location.href = 'pages/quiz.html';
}

// Online Users Counter
function updateOnlineUsers() {
    // Generate random number between 100 and 300
    const onlineCount = Math.floor(Math.random() * 201) + 100;
    const counter = document.getElementById('onlineUsers');
    
    if (counter) {
        // Animate the counter
        const currentCount = parseInt(counter.textContent);
        animateCounter(currentCount, onlineCount, counter);
    }
}

function animateCounter(start, end, element) {
    const duration = 1000; // 1 second
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    
    let current = start;
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Achievements
async function loadAchievements() {
    try {
        const response = await fetch('data/achievements.json');
        achievements = await response.json();
        displayAchievements();
    } catch (error) {
        console.error('Error loading achievements:', error);
        achievements = getDefaultAchievements();
        displayAchievements();
    }
}

function getDefaultAchievements() {
    return [
        {
            id: 1,
            name: "First Steps",
            description: "Complete your first quiz",
            icon: "fas fa-footsteps",
            unlocked: true,
            date: "2023-10-15"
        },
        {
            id: 2,
            name: "Bible Scholar",
            description: "Score 90% or higher on any quiz",
            icon: "fas fa-graduation-cap",
            unlocked: true,
            date: "2023-10-20"
        },
        {
            id: 3,
            name: "Streak Master",
            description: "Maintain a 7-day streak",
            icon: "fas fa-fire",
            unlocked: true,
            date: "2023-10-22"
        },
        {
            id: 4,
            name: "Speed Reader",
            description: "Answer 10 questions in under 30 seconds",
            icon: "fas fa-bolt",
            unlocked: false,
            date: null
        }
    ];
}

function displayAchievements() {
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    achievements.slice(0, 4).forEach(achievement => {
        const card = document.createElement('div');
        card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        
        card.innerHTML = `
            <div class="achievement-icon">
                <i class="${achievement.icon}"></i>
            </div>
            <h4>${achievement.name}</h4>
            <p>${achievement.description}</p>
            ${achievement.unlocked ? 
                `<small class="achievement-date">Unlocked: ${achievement.date}</small>` :
                `<small class="achievement-locked">Locked</small>`
            }
        `;
        
        grid.appendChild(card);
    });
}

// Navigation
function initializeNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
}

// Service Worker for PWA
function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful');
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
}

// AI Insights - Simulated AI functionality
function getAIInsights() {
    const insights = [
        "Based on your quiz history, you excel in New Testament questions but could improve on Old Testament prophets.",
        "Your average response time is 15% faster than other users at your level!",
        "Consider focusing on the Book of Psalms - your accuracy here is lower than average.",
        "You've mastered 75% of the Gospels content. Keep going!",
        "Try the Expert mode to challenge yourself with deeper theological questions."
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
}

// Local Storage Utilities
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
}

// Sound Effects
function playSound(type) {
    const audio = new Audio(`assets/sounds/${type}.mp3`);
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio play failed:', e));
}

// Export for other modules
window.QuizMaster = {
    currentUser,
    quizSettings,
    playSound,
    saveToLocalStorage,
    loadFromLocalStorage,
    getAIInsights
}; 


