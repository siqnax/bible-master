// Multiplayer System
class MultiplayerSystem {
    constructor() {
        this.rooms = [];
        this.leaderboard = [];
        this.currentUser = {};
        this.socket = null;
        this.isConnected = false;
        
        this.initialize();
    }
    
    async initialize() {
        await this.loadUserData();
        this.setupEventListeners();
        this.loadRooms();
        this.loadLeaderboard();
        this.setupSocketConnection();
    }
    
    async loadUserData() {
        this.currentUser = JSON.parse(localStorage.getItem('bibleQuizUser')) || {
            name: 'Guest',
            rank: 24,
            wins: 42,
            winRate: 87,
            streak: 5
        };
        
        // Update UI
        document.querySelector('.player-rank .rank-badge span').textContent = `#${this.currentUser.rank}`;
        document.querySelectorAll('.stat-item')[0].querySelector('.stat-value').textContent = `${this.currentUser.winRate}%`;
        document.querySelectorAll('.stat-item')[1].querySelector('.stat-value').textContent = this.currentUser.wins;
        document.querySelectorAll('.stat-item')[2].querySelector('.stat-value').textContent = this.currentUser.streak;
    }
    
    setupEventListeners() {
        // Room creation
        document.querySelector('.btn-create-room')?.addEventListener('click', () => this.openRoomCreationModal());
        document.querySelector('.btn-find-match')?.addEventListener('click', () => this.findQuickMatch());
        document.getElementById('createPrivateRoom')?.addEventListener('click', () => this.openRoomCreationModal('private'));
        
        // Room code join
        document.querySelector('.btn-join')?.addEventListener('click', () => this.joinRoomByCode());
        document.getElementById('roomCode')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.joinRoomByCode();
        });
        
        // Play options
        document.querySelectorAll('.btn-play').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                if (type === 'quick') this.findQuickMatch();
                if (type === 'tournament') this.joinTournament();
            });
        });
        
        // Room filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.filterRooms(e.currentTarget.textContent);
            });
        });
        
        // Time filters
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.filterLeaderboard(e.currentTarget.textContent);
            });
        });
        
        // Tournament registration
        document.querySelectorAll('.btn-register').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.registerForTournament(e.currentTarget.closest('.tournament-card'));
            });
        });
        
        // Modal controls
        document.getElementById('cancelRoomBtn')?.addEventListener('click', () => this.closeRoomCreationModal());
        document.querySelector('.modal-close')?.addEventListener('click', () => this.closeRoomCreationModal());
        document.getElementById('createRoomBtn')?.addEventListener('click', () => this.createRoom());
        
        // Room type toggle
        document.querySelectorAll('input[name="roomType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const passwordField = document.getElementById('passwordField');
                passwordField.style.display = e.target.value === 'private' ? 'block' : 'none';
            });
        });
        
        // Max players slider
        const maxPlayersSlider = document.getElementById('maxPlayers');
        const maxPlayersValue = document.getElementById('maxPlayersValue');
        if (maxPlayersSlider && maxPlayersValue) {
            maxPlayersSlider.addEventListener('input', () => {
                maxPlayersValue.textContent = maxPlayersSlider.value;
            });
        }
        
        // Match modal
        document.getElementById('acceptMatch')?.addEventListener('click', () => this.acceptMatch());
        document.getElementById('declineMatch')?.addEventListener('click', () => this.declineMatch());
    }
    
    setupSocketConnection() {
        // Simulated WebSocket connection
        console.log('Simulating WebSocket connection for multiplayer...');
        this.isConnected = true;
        
        // Simulate receiving match found
        setTimeout(() => {
            this.simulateMatchFound();
        }, 5000);
    }
    
    loadRooms() {
        // Simulated room data
        this.rooms = [
            {
                id: 'room-1',
                name: 'Bible Beginners',
                host: 'SarahM',
                players: 3,
                maxPlayers: 4,
                difficulty: 'easy',
                topic: 'Gospels',
                questionCount: 10,
                timePerQuestion: 30,
                hasPassword: false,
                status: 'waiting'
            },
            {
                id: 'room-2',
                name: 'Theology Masters',
                host: 'BibleScholar',
                players: 2,
                maxPlayers: 2,
                difficulty: 'hard',
                topic: 'New Testament',
                questionCount: 20,
                timePerQuestion: 20,
                hasPassword: true,
                status: 'waiting'
            },
            {
                id: 'room-3',
                name: 'Sunday School',
                host: 'TeacherJohn',
                players: 5,
                maxPlayers: 8,
                difficulty: 'medium',
                topic: 'Random',
                questionCount: 15,
                timePerQuestion: 25,
                hasPassword: false,
                status: 'starting'
            },
            {
                id: 'room-4',
                name: 'Friday Night Challenge',
                host: 'QuizMaster',
                players: 7,
                maxPlayers: 10,
                difficulty: 'mixed',
                topic: 'Old Testament',
                questionCount: 25,
                timePerQuestion: 15,
                hasPassword: false,
                status: 'waiting'
            }
        ];
        
        this.displayRooms();
    }
    
    displayRooms() {
        const grid = document.getElementById('roomsGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        this.rooms.forEach(room => {
            const roomCard = this.createRoomCard(room);
            grid.appendChild(roomCard);
        });
    }
    
    createRoomCard(room) {
        const card = document.createElement('div');
        card.className = 'room-card';
        card.innerHTML = `
            <div class="room-header">
                <h4>${room.name}</h4>
                ${room.hasPassword ? '<span class="room-locked"><i class="fas fa-lock"></i></span>' : ''}
            </div>
            <div class="room-info">
                <div class="info-item">
                    <i class="fas fa-user"></i>
                    <span>${room.players}/${room.maxPlayers} players</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-chart-line"></i>
                    <span>${room.difficulty}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-book"></i>
                    <span>${room.topic}</span>
                </div>
            </div>
            <div class="room-stats">
                <span class="stat">${room.questionCount} Qs</span>
                <span class="stat">${room.timePerQuestion}s each</span>
                <span class="stat ${room.status}">${room.status}</span>
            </div>
            <button class="btn-join-room" data-room-id="${room.id}">
                <i class="fas fa-door-open"></i> Join Room
            </button>
        `;
        
        card.querySelector('.btn-join-room').addEventListener('click', (e) => {
            e.stopPropagation();
            this.joinRoom(room.id);
        });
        
        return card;
    }
    
    filterRooms(filter) {
        const grid = document.getElementById('roomsGrid');
        if (!grid) return;
        
        const roomCards = grid.querySelectorAll('.room-card');
        
        roomCards.forEach(card => {
            const difficulty = card.querySelector('.info-item:nth-child(2) span').textContent.toLowerCase();
            const shouldShow = filter === 'All' || filter.toLowerCase() === difficulty;
            card.style.display = shouldShow ? 'block' : 'none';
        });
    }
    
    loadLeaderboard() {
        // Simulated leaderboard data
        this.leaderboard = [
            { rank: 1, name: 'BibleMaster42', score: 9850, wins: 156, winRate: 94, streak: 24 },
            { rank: 2, name: 'GraceWarrior', score: 9420, wins: 142, winRate: 92, streak: 18 },
            { rank: 3, name: 'FaithWalker', score: 9120, wins: 135, winRate: 91, streak: 15 },
            { rank: 4, name: 'TheologyPro', score: 8950, wins: 128, winRate: 90, streak: 12 },
            { rank: 5, name: 'ScriptureSeeker', score: 8720, wins: 120, winRate: 89, streak: 10 },
            { rank: 6, name: 'GospelTeacher', score: 8450, wins: 115, winRate: 88, streak: 8 },
            { rank: 7, name: 'TruthSpeaker', score: 8210, wins: 108, winRate: 87, streak: 7 },
            { rank: 8, name: 'WordWarrior', score: 7980, wins: 102, winRate: 86, streak: 6 },
            { rank: 9, name: 'LightBearer', score: 7650, wins: 95, winRate: 85, streak: 5 },
            { rank: 10, name: 'HopeBuilder', score: 7320, wins: 88, winRate: 84, streak: 4 }
        ];
        
        this.displayLeaderboard();
    }
    
    displayLeaderboard() {
        const tbody = document.getElementById('leaderboardBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        this.leaderboard.forEach(player => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="rank-cell">
                    <span class="rank-badge ${player.rank <= 3 ? 'top-rank' : ''}">#${player.rank}</span>
                </td>
                <td class="player-cell">
                    <div class="player-info">
                        <span class="player-name">${player.name}</span>
                        ${player.rank <= 3 ? '<span class="player-badge"><i class="fas fa-crown"></i></span>' : ''}
                    </div>
                </td>
                <td>${player.score}</td>
                <td>${player.wins}</td>
                <td>${player.winRate}%</td>
                <td>
                    <span class="streak-badge">
                        <i class="fas fa-fire"></i> ${player.streak}
                    </span>
                </td>
            `;
            
            // Highlight current user
            if (player.name === this.currentUser.name) {
                row.classList.add('current-user');
            }
            
            tbody.appendChild(row);
        });
    }
    
    filterLeaderboard(filter) {
        // In a real app, this would fetch filtered data from server
        console.log(`Filtering leaderboard by: ${filter}`);
        this.displayLeaderboard(); // For now, just re-display
    }
    
    openRoomCreationModal(type = 'public') {
        const modal = document.getElementById('roomCreationModal');
        modal.classList.add('active');
        
        // Set default values
        if (type === 'private') {
            document.querySelector('input[name="roomType"][value="private"]').checked = true;
            document.getElementById('passwordField').style.display = 'block';
        }
    }
    
    closeRoomCreationModal() {
        document.getElementById('roomCreationModal').classList.remove('active');
        document.getElementById('roomCreationForm').reset();
        document.getElementById('passwordField').style.display = 'none';
    }
    
    createRoom() {
        const roomName = document.getElementById('roomName').value.trim();
        const questionCount = document.getElementById('roomQuestionCount').value;
        const timePerQuestion = document.getElementById('roomTimePerQuestion').value;
        const topic = document.getElementById('roomTopic').value;
        const difficulty = document.getElementById('roomDifficulty').value;
        const roomType = document.querySelector('input[name="roomType"]:checked').value;
        const password = document.getElementById('roomPassword')?.value;
        const maxPlayers = document.getElementById('maxPlayers').value;
        
        if (!roomName) {
            this.showNotification('Please enter a room name', 'error');
            return;
        }
        
        const newRoom = {
            id: `room-${Date.now()}`,
            name: roomName,
            host: this.currentUser.name,
            players: 1,
            maxPlayers: parseInt(maxPlayers),
            difficulty: difficulty,
            topic: topic,
            questionCount: parseInt(questionCount),
            timePerQuestion: parseInt(timePerQuestion),
            hasPassword: roomType === 'private',
            password: roomType === 'private' ? password : null,
            status: 'waiting'
        };
        
        // Add to rooms list
        this.rooms.unshift(newRoom);
        this.displayRooms();
        
        // Close modal
        this.closeRoomCreationModal();
        
        // Show success message
        this.showNotification(`Room "${roomName}" created successfully!`, 'success');
        
        // Auto-join the created room
        setTimeout(() => {
            this.joinRoom(newRoom.id);
        }, 1000);
    }
    
    joinRoom(roomId) {
        const room = this.rooms.find(r => r.id === roomId);
        if (!room) {
            this.showNotification('Room not found', 'error');
            return;
        }
        
        if (room.players >= room.maxPlayers) {
            this.showNotification('Room is full', 'error');
            return;
        }
        
        if (room.hasPassword) {
            const password = prompt('Enter room password:');
            if (password !== room.password) {
                this.showNotification('Incorrect password', 'error');
                return;
            }
        }
        
        // Simulate joining room
        this.showNotification(`Joining ${room.name}...`, 'info');
        
        // In real app, would redirect to game room
        setTimeout(() => {
            this.showNotification(`Successfully joined ${room.name}! Starting game...`, 'success');
            // Redirect to game page
            // window.location.href = `game.html?room=${roomId}`;
        }, 1500);
    }
    
    joinRoomByCode() {
        const roomCode = document.getElementById('roomCode').value.trim();
        
        if (!roomCode) {
            this.showNotification('Please enter a room code', 'error');
            return;
        }
        
        // Simulate finding room by code
        const room = this.rooms.find(r => r.id === roomCode);
        
        if (room) {
            this.joinRoom(room.id);
            document.getElementById('roomCode').value = '';
        } else {
            this.showNotification('Invalid room code', 'error');
        }
    }
    
    findQuickMatch() {
        this.showNotification('Finding opponent...', 'info');
        
        // Simulate matchmaking
        setTimeout(() => {
            this.showMatchFoundModal();
        }, 2000);
    }
    
    joinTournament() {
        this.showNotification('Registering for tournament...', 'info');
        
        setTimeout(() => {
            this.showNotification('Successfully registered! Tournament starts soon.', 'success');
        }, 1500);
    }
    
    registerForTournament(tournamentCard) {
        const tournamentName = tournamentCard.querySelector('h4').textContent;
        
        this.showNotification(`Registering for "${tournamentName}"...`, 'info');
        
        setTimeout(() => {
            tournamentCard.querySelector('.btn-register').innerHTML = '<i class="fas fa-check"></i> Registered';
            tournamentCard.querySelector('.btn-register').disabled = true;
            this.showNotification(`Successfully registered for "${tournamentName}"!`, 'success');
        }, 1000);
    }
    
    simulateMatchFound() {
        // Randomly show match found occasionally
        if (Math.random() > 0.7) {
            setTimeout(() => {
                if (document.visibilityState === 'visible') {
                    this.showMatchFoundModal();
                }
            }, 10000);
        }
    }
    
    showMatchFoundModal() {
        const modal = document.getElementById('matchFoundModal');
        modal.classList.add('active');
        
        // Start countdown
        this.startMatchCountdown();
    }
    
    startMatchCountdown() {
        let countdown = 5;
        const countdownElement = document.getElementById('matchCountdown');
        const secondsElement = document.getElementById('countdownSeconds');
        
        const timer = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;
            secondsElement.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(timer);
                this.acceptMatch();
            }
        }, 1000);
        
        // Store timer for cleanup
        this.matchTimer = timer;
    }
    
    acceptMatch() {
        if (this.matchTimer) {
            clearInterval(this.matchTimer);
        }
        
        document.getElementById('matchFoundModal').classList.remove('active');
        
        this.showNotification('Match accepted! Starting game...', 'success');
        
        // In real app, redirect to game
        setTimeout(() => {
            // window.location.href = 'game.html?mode=multiplayer';
            console.log('Starting multiplayer game...');
        }, 1000);
    }
    
    declineMatch() {
        if (this.matchTimer) {
            clearInterval(this.matchTimer);
        }
        
        document.getElementById('matchFoundModal').classList.remove('active');
        this.showNotification('Match declined', 'info');
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
    if (window.location.pathname.includes('multiplayer.html')) {
        const multiplayer = new MultiplayerSystem();
        window.multiplayer = multiplayer;
    }
});


