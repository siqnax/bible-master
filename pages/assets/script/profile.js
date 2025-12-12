// Profile System
class ProfileSystem {
    constructor() {
        this.userData = {};
        this.achievements = [];
        this.activities = [];
        
        this.initialize();
    }
    
    async initialize() {
        await this.loadUserData();
        await this.loadAchievements();
        await this.loadActivities();
        this.setupUI();
        this.setupEventListeners();
        this.updateProfileDisplay();
    }
    
    async loadUserData() {
        // Load from localStorage or create default
        this.userData = JSON.parse(localStorage.getItem('bibleQuizUser')) || {
            name: 'John Doe',
            email: 'john.doe@example.com',
            displayName: 'John Doe',
            bio: 'Passionate about studying God\'s Word and sharing biblical knowledge with others.',
            level: 'Theologian',
            xp: 8450,
            streak: 7,
            rank: 24,
            accuracy: 87,
            avgTime: 4.2,
            avatar: '../assets/avatars/default.png',
            settings: {
                dailyReminders: true,
                verseNotifications: true,
                achievementNotifications: true,
                multiplayerNotifications: true,
                emailNewsletter: true,
                publicProfile: true,
                showOnLeaderboards: true,
                allowFriendRequests: true,
                activityVisibility: true,
                defaultQuizLength: 15,
                defaultDifficulty: 'medium',
                bibleTranslation: 'niv',
                dailyGoal: 20
            },
            stats: {
                totalQuizzes: 142,
                questionsAnswered: 2845,
                totalXP: 8450,
                multiplayerWins: 42,
                flashcardsMastered: 98,
                daysActive: 67
            },
            mastery: {
                'old-testament': 92,
                'new-testament': 88,
                'gospels': 95,
                'prophets': 78,
                'wisdom': 85
            }
        };
        
        // Save back to localStorage
        this.saveUserData();
    }
    
    async loadAchievements() {
        try {
            const response = await fetch('../data/achievements.json');
            this.achievements = await response.json();
            
            // Mark some as unlocked for demo
            this.achievements.slice(0, 3).forEach(achievement => {
                achievement.unlocked = true;
                achievement.date = '2023-10-' + (15 + achievement.id);
            });
        } catch (error) {
            console.error('Error loading achievements:', error);
            this.achievements = this.getDefaultAchievements();
        }
    }
    
    async loadActivities() {
        // Generate recent activities
        this.activities = [
            {
                id: 1,
                type: 'quiz',
                title: 'Completed New Testament Quiz',
                description: 'Scored 92% on 15 questions',
                date: '2023-10-26T10:30:00',
                icon: 'fas fa-graduation-cap',
                color: 'var(--primary-color)'
            },
            {
                id: 2,
                type: 'achievement',
                title: 'Unlocked: Bible Scholar',
                description: 'Scored 90%+ on any quiz',
                date: '2023-10-25T14:20:00',
                icon: 'fas fa-trophy',
                color: 'var(--secondary-color)'
            },
            {
                id: 3,
                type: 'flashcard',
                title: 'Mastered 10 Flashcards',
                description: 'Old Testament characters',
                date: '2023-10-24T09:15:00',
                icon: 'fas fa-layer-group',
                color: 'var(--accent-color)'
            },
            {
                id: 4,
                type: 'multiplayer',
                title: 'Won Multiplayer Match',
                description: 'Defeated BibleMaster42',
                date: '2023-10-23T19:45:00',
                icon: 'fas fa-users',
                color: 'var(--success-color)'
            },
            {
                id: 5,
                type: 'streak',
                title: '7-Day Streak!',
                description: 'Completed daily goal for 7 days',
                date: '2023-10-22T08:00:00',
                icon: 'fas fa-fire',
                color: 'var(--warning-color)'
            }
        ];
    }
    
    setupUI() {
        // Setup tab switching
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.currentTarget.dataset.tab;
                this.switchTab(tabId);
            });
        });
        
        // Setup avatar upload
        document.getElementById('editAvatarBtn')?.addEventListener('click', () => this.openAvatarModal());
        document.getElementById('uploadAvatarBtn')?.addEventListener('click', () => document.getElementById('avatarUpload').click());
        document.getElementById('avatarUpload')?.addEventListener('change', (e) => this.handleAvatarUpload(e));
        document.getElementById('saveAvatarBtn')?.addEventListener('click', () => this.saveAvatar());
        document.getElementById('cancelAvatarBtn')?.addEventListener('click', () => this.closeAvatarModal());
        
        // Setup form submission
        document.getElementById('profileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfileSettings();
        });
        
        // Setup data management
        document.getElementById('exportProgressBtn')?.addEventListener('click', () => this.exportData('progress'));
        document.getElementById('exportQuizHistoryBtn')?.addEventListener('click', () => this.exportData('quizHistory'));
        document.getElementById('exportAchievementsBtn')?.addEventListener('click', () => this.exportData('achievements'));
        document.getElementById('importDataBtn')?.addEventListener('click', () => document.getElementById('importFile').click());
        document.getElementById('importFile')?.addEventListener('change', (e) => this.handleImportFile(e));
        
        // Setup danger zone
        document.getElementById('resetProgressBtn')?.addEventListener('click', () => this.openResetModal());
        document.getElementById('deleteAccountBtn')?.addEventListener('click', () => this.deleteAccount());
        document.getElementById('resetConfirm')?.addEventListener('change', (e) => {
            document.getElementById('confirmResetBtn').disabled = !e.target.checked;
        });
        document.getElementById('confirmResetBtn')?.addEventListener('click', () => this.resetProgress());
        document.getElementById('cancelResetBtn')?.addEventListener('click', () => this.closeResetModal());
    }
    
    setupEventListeners() {
        // Notification toggles
        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const settingId = e.target.id;
                const value = e.target.checked;
                this.updateSetting(settingId, value);
            });
        });
        
        // Settings dropdowns
        document.querySelectorAll('#settingsTab select').forEach(select => {
            select.addEventListener('change', (e) => {
                const settingId = e.target.id;
                const value = e.target.value;
                this.updateSetting(settingId, value);
            });
        });
        
        // Activity filter
        document.getElementById('activityFilter')?.addEventListener('change', (e) => {
            this.filterActivities(e.target.value);
        });
        
        // Achievement filters
        document.querySelectorAll('.achievement-filters .filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.achievement-filters .filter-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.filterAchievements(e.currentTarget.textContent);
            });
        });
    }
    
    updateProfileDisplay() {
        // Update header
        document.getElementById('profileName').textContent = this.userData.name;
        document.getElementById('profileAvatar').src = this.userData.avatar;
        document.getElementById('userBadge')?.querySelector('.avatar').src = this.userData.avatar;
        
        // Update stats
        document.getElementById('streakStat').textContent = this.userData.streak;
        document.getElementById('rankStat').textContent = `#${this.userData.rank}`;
        document.getElementById('accuracyStat').textContent = `${this.userData.accuracy}%`;
        document.getElementById('timeStat').textContent = `${this.userData.avgTime}s`;
        
        // Update form fields
        document.getElementById('username').value = this.userData.name;
        document.getElementById('email').value = this.userData.email;
        document.getElementById('displayName').value = this.userData.displayName;
        document.getElementById('bio').value = this.userData.bio;
        
        // Update settings toggles
        Object.keys(this.userData.settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.userData.settings[key];
                } else if (element.tagName === 'SELECT') {
                    element.value = this.userData.settings[key];
                }
            }
        });
        
        // Update overview
        this.updateOverviewTab();
        
        // Update achievements
        this.updateAchievementsTab();
        
        // Update activities
        this.updateActivitiesTab();
    }
    
    updateOverviewTab() {
        // Update stats grid
        const stats = this.userData.stats;
        const statElements = document.querySelectorAll('.stats-grid .stat-value');
        if (statElements.length >= 6) {
            statElements[0].textContent = stats.totalQuizzes;
            statElements[1].textContent = stats.questionsAnswered;
            statElements[2].textContent = stats.totalXP;
            statElements[3].textContent = stats.multiplayerWins;
            statElements[4].textContent = stats.flashcardsMastered;
            statElements[5].textContent = stats.daysActive;
        }
        
        // Update mastery
        const masteryItems = document.querySelectorAll('.mastery-item');
        Object.entries(this.userData.mastery).forEach(([topic, percent], index) => {
            if (masteryItems[index]) {
                masteryItems[index].querySelector('.mastery-topic').textContent = 
                    this.getTopicName(topic);
                masteryItems[index].querySelector('.mastery-percent').textContent = `${percent}%`;
                masteryItems[index].querySelector('.bar-fill').style.width = `${percent}%`;
            }
        });
        
        // Update recent achievements
        this.updateRecentAchievements();
        
        // Update level progress
        this.updateLevelProgress();
    }
    
    updateAchievementsTab() {
        const grid = document.getElementById('allAchievements');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        this.achievements.forEach(achievement => {
            const card = document.createElement('div');
            card.className = `achievement-card-full ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            card.innerHTML = `
                <div class="achievement-icon">
                    <i class="${achievement.icon}"></i>
                </div>
                <div class="achievement-info">
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                    ${achievement.unlocked ? 
                        `<small class="achievement-date">Unlocked: ${achievement.date}</small>` :
                        `<small class="achievement-progress">0% complete</small>`
                    }
                </div>
                <div class="achievement-status">
                    ${achievement.unlocked ? 
                        '<i class="fas fa-check-circle"></i>' :
                        '<i class="fas fa-lock"></i>'
                    }
                </div>
            `;
            
            grid.appendChild(card);
        });
    }
    
    updateRecentAchievements() {
        const grid = document.getElementById('recentAchievements');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        const recent = this.achievements.filter(a => a.unlocked).slice(0, 4);
        
        recent.forEach(achievement => {
            const card = document.createElement('div');
            card.className = 'achievement-card-small';
            card.innerHTML = `
                <div class="achievement-icon">
                    <i class="${achievement.icon}"></i>
                </div>
                <div class="achievement-info">
                    <h5>${achievement.name}</h5>
                    <small>${achievement.date}</small>
                </div>
            `;
            
            grid.appendChild(card);
        });
    }
    
    updateActivitiesTab() {
        const timeline = document.getElementById('activityTimeline');
        if (!timeline) return;
        
        timeline.innerHTML = '';
        
        this.activities.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <div class="activity-icon" style="background: ${activity.color}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <small>${this.formatDate(activity.date)}</small>
                </div>
            `;
            
            timeline.appendChild(item);
        });
    }
    
    updateLevelProgress() {
        // Calculate level progress
        const xp = this.userData.xp;
        const level = this.userData.level;
        const nextLevelXP = this.getNextLevelXP(level);
        const progress = Math.min(100, Math.round((xp / nextLevelXP) * 100));
        
        // Update progress circle
        const circle = document.querySelector('.circle-progress');
        if (circle) {
            circle.style.background = `conic-gradient(var(--primary-color) ${progress}%, var(--border-color) 0)`;
            circle.dataset.progress = progress;
        }
        
        // Update level info
        const levelInfo = document.querySelector('.level-info');
        if (levelInfo) {
            levelInfo.querySelector('.level-number').textContent = this.getLevelNumber(level);
            levelInfo.querySelector('h4').textContent = level;
            levelInfo.querySelector('.next-level span').textContent = 
                `Next Level: ${nextLevelXP - xp} XP needed`;
            levelInfo.querySelector('.bar-fill').style.width = `${progress}%`;
        }
    }
    
    switchTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.tab === tabId) {
                tab.classList.add('active');
            }
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}Tab`) {
                content.classList.add('active');
            }
        });
    }
    
    openAvatarModal() {
        document.getElementById('avatarModal').classList.add('active');
        this.populateAvatarOptions();
    }
    
    closeAvatarModal() {
        document.getElementById('avatarModal').classList.remove('active');
    }
    
    populateAvatarOptions() {
        const grid = document.getElementById('avatarGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        // Default avatars
        const avatars = [
            'default.png',
            'avatar2.png',
            'avatar3.png',
            'avatar4.png'
        ];
        
        avatars.forEach(avatar => {
            const option = document.createElement('div');
            option.className = 'avatar-option';
            option.innerHTML = `
                <img src="../assets/avatars/${avatar}" alt="Avatar">
            `;
            
            option.addEventListener('click', () => {
                document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                this.selectedAvatar = `../assets/avatars/${avatar}`;
            });
            
            grid.appendChild(option);
        });
    }
    
    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            this.showNotification('Please select an image file', 'error');
            return;
        }
        
        if (file.size > 2 * 1024 * 1024) {
            this.showNotification('File size must be less than 2MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.selectedAvatar = e.target.result;
            this.showNotification('Avatar ready to save', 'success');
        };
        reader.readAsDataURL(file);
    }
    
    saveAvatar() {
        if (!this.selectedAvatar) {
            this.showNotification('Please select or upload an avatar', 'error');
            return;
        }
        
        this.userData.avatar = this.selectedAvatar;
        this.saveUserData();
        this.updateProfileDisplay();
        this.closeAvatarModal();
        
        this.showNotification('Avatar updated successfully!', 'success');
    }
    
    saveProfileSettings() {
        // Update user data from form
        this.userData.name = document.getElementById('username').value;
        this.userData.email = document.getElementById('email').value;
        this.userData.displayName = document.getElementById('displayName').value;
        this.userData.bio = document.getElementById('bio').value;
        
        this.saveUserData();
        this.updateProfileDisplay();
        
        this.showNotification('Profile settings saved!', 'success');
    }
    
    updateSetting(settingId, value) {
        if (this.userData.settings[settingId] !== undefined) {
            this.userData.settings[settingId] = value;
            this.saveUserData();
            
            // Show feedback for important changes
            if (settingId === 'publicProfile' || settingId === 'showOnLeaderboards') {
                this.showNotification('Setting updated', 'success');
            }
        }
    }
    
    filterActivities(filter) {
        const items = document.querySelectorAll('.activity-item');
        
        items.forEach(item => {
            const type = item.querySelector('.activity-icon i').className;
            const shouldShow = filter === 'all' || type.includes(filter);
            item.style.display = shouldShow ? 'flex' : 'none';
        });
    }
    
    filterAchievements(filter) {
        const cards = document.querySelectorAll('.achievement-card-full');
        
        cards.forEach(card => {
            const isUnlocked = card.classList.contains('unlocked');
            let shouldShow = true;
            
            if (filter === 'Unlocked') shouldShow = isUnlocked;
            if (filter === 'Locked') shouldShow = !isUnlocked;
            
            card.style.display = shouldShow ? 'flex' : 'none';
        });
    }
    
    exportData(type) {
        let data = {};
        let filename = '';
        
        switch(type) {
            case 'progress':
                data = {
                    user: this.userData,
                    exportDate: new Date().toISOString(),
                    type: 'progress'
                };
                filename = `bible-quiz-progress-${new Date().toISOString().split('T')[0]}.json`;
                break;
                
            case 'quizHistory':
                const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
                data = {
                    quizHistory: history,
                    exportDate: new Date().toISOString(),
                    type: 'quizHistory'
                };
                filename = `bible-quiz-history-${new Date().toISOString().split('T')[0]}.json`;
                break;
                
            case 'achievements':
                data = {
                    achievements: this.achievements,
                    exportDate: new Date().toISOString(),
                    type: 'achievements'
                };
                filename = `bible-quiz-achievements-${new Date().toISOString().split('T')[0]}.json`;
                break;
        }
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', filename);
        linkElement.click();
        
        this.showNotification(`${type} exported successfully!`, 'success');
    }
    
    handleImportFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.importData(data);
            } catch (error) {
                this.showNotification('Invalid file format', 'error');
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }
    
    importData(data) {
        if (!data.type) {
            this.showNotification('Invalid import file', 'error');
            return;
        }
        
        switch(data.type) {
            case 'progress':
                if (confirm('This will overwrite your current profile. Continue?')) {
                    localStorage.setItem('bibleQuizUser', JSON.stringify(data.user));
                    this.userData = data.user;
                    this.updateProfileDisplay();
                    this.showNotification('Progress imported successfully!', 'success');
                }
                break;
                
            case 'quizHistory':
                localStorage.setItem('quizHistory', JSON.stringify(data.quizHistory));
                this.showNotification('Quiz history imported!', 'success');
                break;
                
            case 'achievements':
                this.achievements = data.achievements;
                this.updateAchievementsTab();
                this.showNotification('Achievements imported!', 'success');
                break;
        }
    }
    
    openResetModal() {
        document.getElementById('resetModal').classList.add('active');
    }
    
    closeResetModal() {
        document.getElementById('resetModal').classList.remove('active');
        document.getElementById('resetConfirm').checked = false;
        document.getElementById('confirmResetBtn').disabled = true;
    }
    
    resetProgress() {
        // Reset user data to defaults
        this.userData = {
            name: 'New User',
            email: '',
            displayName: 'New User',
            bio: '',
            level: 'Beginner',
            xp: 0,
            streak: 0,
            rank: 999,
            accuracy: 0,
            avgTime: 0,
            avatar: '../assets/avatars/default.png',
            settings: {
                dailyReminders: true,
                verseNotifications: true,
                achievementNotifications: true,
                multiplayerNotifications: true,
                emailNewsletter: true,
                publicProfile: true,
                showOnLeaderboards: true,
                allowFriendRequests: true,
                activityVisibility: true,
                defaultQuizLength: 15,
                defaultDifficulty: 'medium',
                bibleTranslation: 'niv',
                dailyGoal: 20
            },
            stats: {
                totalQuizzes: 0,
                questionsAnswered: 0,
                totalXP: 0,
                multiplayerWins: 0,
                flashcardsMastered: 0,
                daysActive: 0
            },
            mastery: {
                'old-testament': 0,
                'new-testament': 0,
                'gospels': 0,
                'prophets': 0,
                'wisdom': 0
            }
        };
        
        // Clear other data
        localStorage.removeItem('quizHistory');
        localStorage.removeItem('flashcards');
        localStorage.removeItem('lastQuizDate');
        
        // Save and update
        this.saveUserData();
        this.updateProfileDisplay();
        this.closeResetModal();
        
        this.showNotification('All progress has been reset', 'success');
    }
    
    deleteAccount() {
        if (confirm('Are you sure you want to delete your account? This cannot be undone!')) {
            // Clear all data
            localStorage.clear();
            
            // Redirect to home
            window.location.href = '../index.html';
        }
    }
    
    saveUserData() {
        try {
            localStorage.setItem('bibleQuizUser', JSON.stringify(this.userData));
            return true;
        } catch (error) {
            console.error('Error saving user data:', error);
            return false;
        }
    }
    
    getTopicName(topic) {
        const names = {
            'old-testament': 'Old Testament',
            'new-testament': 'New Testament',
            'gospels': 'The Gospels',
            'prophets': 'Prophets',
            'wisdom': 'Wisdom Books'
        };
        return names[topic] || topic;
    }
    
    getLevelNumber(level) {
        const levels = {
            'Beginner': 1,
            'Learner': 2,
            'Student': 3,
            'Scholar': 4,
            'Theologian': 5
        };
        return levels[level] || 1;
    }
    
    getNextLevelXP(level) {
        const xpRequirements = {
            'Beginner': 500,
            'Learner': 1500,
            'Student': 3000,
            'Scholar': 6000,
            'Theologian': 10000
        };
        return xpRequirements[level] || 500;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
        
        return date.toLocaleDateString();
    }
    
    getDefaultAchievements() {
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
            }
        ];
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('profile.html')) {
        const profile = new ProfileSystem();
        window.profile = profile;
    }
});

