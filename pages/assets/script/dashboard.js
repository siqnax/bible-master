// Dashboard Charts using Chart.js
class DashboardCharts {
    constructor() {
        this.charts = {};
        this.timeRange = 'week';
        this.initializeCharts();
        this.setupEventListeners();
        this.loadData();
    }
    
    initializeCharts() {
        // Initialize all chart canvases
        this.initPerformanceChart();
        this.initTopicChart();
        this.initActivityChart();
        this.initTimeChart();
        this.initDifficultyChart();
        this.initGoalsChart();
    }
    
    initPerformanceChart() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        
        this.charts.performance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Score',
                        data: [85, 92, 78, 95, 88, 90, 87],
                        borderColor: 'rgb(139, 69, 19)',
                        backgroundColor: 'rgba(139, 69, 19, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Accuracy',
                        data: [82, 88, 75, 92, 85, 87, 84],
                        borderColor: 'rgb(75, 0, 130)',
                        backgroundColor: 'rgba(75, 0, 130, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    initTopicChart() {
        const ctx = document.getElementById('topicChart').getContext('2d');
        
        this.charts.topic = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['OT Law', 'OT History', 'OT Poetry', 'OT Prophets', 'Gospels', 'Acts', 'Paul\'s Letters', 'General Epistles'],
                datasets: [{
                    label: 'Accuracy',
                    data: [92, 88, 85, 78, 95, 90, 87, 82],
                    backgroundColor: [
                        'rgba(139, 69, 19, 0.8)',
                        'rgba(139, 69, 19, 0.7)',
                        'rgba(139, 69, 19, 0.6)',
                        'rgba(139, 69, 19, 0.5)',
                        'rgba(75, 0, 130, 0.8)',
                        'rgba(75, 0, 130, 0.7)',
                        'rgba(75, 0, 130, 0.6)',
                        'rgba(75, 0, 130, 0.5)'
                    ],
                    borderColor: [
                        'rgb(139, 69, 19)',
                        'rgb(139, 69, 19)',
                        'rgb(139, 69, 19)',
                        'rgb(139, 69, 19)',
                        'rgb(75, 0, 130)',
                        'rgb(75, 0, 130)',
                        'rgb(75, 0, 130)',
                        'rgb(75, 0, 130)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    initActivityChart() {
        const ctx = document.getElementById('activityChart').getContext('2d');
        
        this.charts.activity = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM'],
                datasets: [{
                    label: 'Activity Level',
                    data: [15, 45, 60, 40, 85, 92, 30],
                    borderColor: 'rgb(212, 175, 55)',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    initTimeChart() {
        const ctx = document.getElementById('timeChart').getContext('2d');
        
        this.charts.time = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Quizzes', 'Flashcards', 'Devotionals', 'Multiplayer'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: [
                        'rgba(139, 69, 19, 0.8)',
                        'rgba(212, 175, 55, 0.8)',
                        'rgba(75, 0, 130, 0.8)',
                        'rgba(46, 139, 87, 0.8)'
                    ],
                    borderColor: [
                        'rgb(139, 69, 19)',
                        'rgb(212, 175, 55)',
                        'rgb(75, 0, 130)',
                        'rgb(46, 139, 87)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.raw + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    initDifficultyChart() {
        const ctx = document.getElementById('difficultyChart').getContext('2d');
        
        this.charts.difficulty = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Accuracy', 'Speed', 'Consistency', 'Completion', 'Improvement'],
                datasets: [
                    {
                        label: 'Easy',
                        data: [95, 85, 90, 98, 80],
                        backgroundColor: 'rgba(46, 139, 87, 0.2)',
                        borderColor: 'rgb(46, 139, 87)',
                        borderWidth: 2
                    },
                    {
                        label: 'Medium',
                        data: [87, 75, 85, 92, 70],
                        backgroundColor: 'rgba(212, 175, 55, 0.2)',
                        borderColor: 'rgb(212, 175, 55)',
                        borderWidth: 2
                    },
                    {
                        label: 'Hard',
                        data: [78, 65, 72, 85, 60],
                        backgroundColor: 'rgba(220, 20, 60, 0.2)',
                        borderColor: 'rgb(220, 20, 60)',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    initGoalsChart() {
        const ctx = document.getElementById('goalsChart').getContext('2d');
        
        this.charts.goals = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Daily Study', 'Accuracy', 'Topic Mastery', 'Multiplayer'],
                datasets: [
                    {
                        label: 'Current',
                        data: [75, 87, 65, 100],
                        backgroundColor: 'rgba(139, 69, 19, 0.8)',
                        borderColor: 'rgb(139, 69, 19)',
                        borderWidth: 1
                    },
                    {
                        label: 'Target',
                        data: [100, 90, 100, 100],
                        backgroundColor: 'rgba(75, 0, 130, 0.3)',
                        borderColor: 'rgb(75, 0, 130)',
                        borderWidth: 1,
                        type: 'line',
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    setupEventListeners() {
        // Time range selector
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.timeRange = e.target.dataset.range;
                this.updateCharts();
            });
        });
        
        // Topic filter
        document.getElementById('topicFilter').addEventListener('change', (e) => {
            this.updateTopicChart(e.target.value);
        });
        
        // Time filter
        document.getElementById('timeFilter').addEventListener('change', (e) => {
            this.updateTimeChart(e.target.value);
        });
        
        // Export stats button
        document.getElementById('exportStatsBtn').addEventListener('click', () => {
            this.exportStats();
        });
        
        // Edit goals button
        document.getElementById('editGoalsBtn').addEventListener('click', () => {
            this.editGoals();
        });
        
        // Set new goal button
        document.getElementById('setNewGoalBtn').addEventListener('click', () => {
            this.setNewGoal();
        });
    }
    
    loadData() {
        // Load user data from localStorage
        const userData = JSON.parse(localStorage.getItem('bibleQuizUser') || '{}');
        const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
        
        // Update dashboard with user data
        this.updateUserStats(userData, quizHistory);
    }
    
    updateUserStats(userData, quizHistory) {
        // Update KPI cards with real data
        if (quizHistory.length > 0) {
            const recentQuiz = quizHistory[quizHistory.length - 1];
            document.querySelector('.kpi-card:nth-child(1) .kpi-value').textContent = recentQuiz.score;
            
            // Calculate weekly average
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const weeklyQuizzes = quizHistory.filter(q => new Date(q.date) >= weekAgo);
            if (weeklyQuizzes.length > 0) {
                const weeklyAvg = Math.round(weeklyQuizzes.reduce((sum, q) => sum + q.score, 0) / weeklyQuizzes.length);
                document.querySelector('.kpi-card:nth-child(2) .kpi-value').textContent = weeklyAvg;
            }
            
            // Calculate monthly accuracy
            const monthAgo = new Date();
            monthAgo.setDate(monthAgo.getDate() - 30);
            const monthlyQuizzes = quizHistory.filter(q => new Date(q.date) >= monthAgo);
            if (monthlyQuizzes.length > 0) {
                const totalCorrect = monthlyQuizzes.reduce((sum, q) => sum + q.correctAnswers, 0);
                const totalQuestions = monthlyQuizzes.reduce((sum, q) => sum + q.totalQuestions, 0);
                const accuracy = Math.round((totalCorrect / totalQuestions) * 100);
                document.querySelector('.kpi-card:nth-child(3) .kpi-value').textContent = accuracy + '%';
            }
        }
    }
    
    updateCharts() {
        // Update all charts based on selected time range
        this.updatePerformanceChart();
        this.updateActivityChart();
        this.updateTimeChart();
    }
    
    updatePerformanceChart() {
        // Generate data based on time range
        let labels, scoreData, accuracyData;
        
        switch(this.timeRange) {
            case 'week':
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                scoreData = [85, 92, 78, 95, 88, 90, 87];
                accuracyData = [82, 88, 75, 92, 85, 87, 84];
                break;
            case 'month':
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                scoreData = [82, 88, 85, 90];
                accuracyData = [78, 85, 82, 87];
                break;
            case 'quarter':
                labels = ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];
                scoreData = [78, 82, 85, 87];
                accuracyData = [75, 78, 82, 85];
                break;
            case 'year':
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                scoreData = [75, 78, 82, 85, 87, 85, 88, 90, 87, 92, 90, 88];
                accuracyData = [72, 75, 78, 82, 85, 82, 85, 87, 85, 88, 87, 85];
                break;
            default:
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                scoreData = [85, 92, 78, 95, 88, 90, 87];
                accuracyData = [82, 88, 75, 92, 85, 87, 84];
        }
        
        this.charts.performance.data.labels = labels;
        this.charts.performance.data.datasets[0].data = scoreData;
        this.charts.performance.data.datasets[1].data = accuracyData;
        this.charts.performance.update();
    }
    
    updateActivityChart() {
        // Update activity chart based on time range
        let labels, data;
        
        switch(this.timeRange) {
            case 'week':
                labels = ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM'];
                data = [15, 45, 60, 40, 85, 92, 30];
                break;
            case 'month':
                labels = ['Morning', 'Afternoon', 'Evening', 'Night'];
                data = [40, 55, 85, 35];
                break;
            default:
                labels = ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM'];
                data = [15, 45, 60, 40, 85, 92, 30];
        }
        
        this.charts.activity.data.labels = labels;
        this.charts.activity.data.datasets[0].data = data;
        this.charts.activity.update();
    }
    
    updateTimeChart(timePeriod = 'week') {
        // Update time distribution chart
        let data;
        
        if (timePeriod === 'week') {
            data = [45, 25, 20, 10]; // Quizzes, Flashcards, Devotionals, Multiplayer
        } else {
            data = [50, 20, 15, 15];
        }
        
        this.charts.time.data.datasets[0].data = data;
        this.charts.time.update();
    }
    
    updateTopicChart(topicFilter) {
        // Filter topic data based on selection
        let labels, data;
        
        if (topicFilter === 'old-testament') {
            labels = ['OT Law', 'OT History', 'OT Poetry', 'OT Prophets'];
            data = [92, 88, 85, 78];
        } else if (topicFilter === 'new-testament') {
            labels = ['Gospels', 'Acts', 'Paul\'s Letters', 'General Epistles'];
            data = [95, 90, 87, 82];
        } else {
            labels = ['OT Law', 'OT History', 'OT Poetry', 'OT Prophets', 'Gospels', 'Acts', 'Paul\'s Letters', 'General Epistles'];
            data = [92, 88, 85, 78, 95, 90, 87, 82];
        }
        
        this.charts.topic.data.labels = labels;
        this.charts.topic.data.datasets[0].data = data;
        this.charts.topic.update();
    }
    
    exportStats() {
        // Create data object for export
        const exportData = {
            user: JSON.parse(localStorage.getItem('bibleQuizUser') || '{}'),
            quizHistory: JSON.parse(localStorage.getItem('quizHistory') || '[]'),
            achievements: JSON.parse(localStorage.getItem('achievements') || '[]'),
            flashcards: JSON.parse(localStorage.getItem('flashcards') || '[]'),
            exportDate: new Date().toISOString()
        };
        
        // Create and download JSON file
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `bible-quiz-stats-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        // Show success message
        this.showNotification('Statistics exported successfully!', 'success');
    }
    
    editGoals() {
        // Show goal editing modal or interface
        this.showNotification('Goal editing feature coming soon!', 'info');
    }
    
    setNewGoal() {
        // Show new goal creation interface
        this.showNotification('New goal creation feature coming soon!', 'info');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    // Theme-aware chart colors
    getThemeColors() {
        const theme = document.documentElement.getAttribute('data-theme');
        
        if (theme === 'dark') {
            return {
                primary: '#D4AF37',
                secondary: '#8B4513',
                accent: '#9370DB',
                success: '#2E8B57',
                warning: '#FFA500',
                error: '#DC143C'
            };
        }
        
        return {
            primary: '#8B4513',
            secondary: '#D4AF37',
            accent: '#4B0082',
            success: '#2E8B57',
            warning: '#FFA500',
            error: '#DC143C'
        };
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html')) {
        const dashboard = new DashboardCharts();
        window.dashboard = dashboard; // Make accessible for debugging
    }
}); 
