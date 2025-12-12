// Quiz Engine
class QuizEngine {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeRemaining = 0;
        this.timerInterval = null;
        this.quizStarted = false;
        this.userAnswers = [];
        this.settings = {};
        this.hintsUsed = 0;
        this.startTime = null;
        
        this.initializeQuiz();
    }
    
    async initializeQuiz() {
        this.settings = JSON.parse(localStorage.getItem('quizSettings')) || {
            mode: 'standard',
            difficulty: 'mixed',
            topic: 'random',
            questionCount: 10
        };
        
        await this.loadQuestions();
        this.setupUI();
        this.startQuiz();
    }
    
    async loadQuestions() {
        try {
            const response = await fetch('data/questions.json');
            const allQuestions = await response.json();
            
            // Filter questions based on settings
            this.questions = this.filterQuestions(allQuestions);
            
            // Shuffle questions and select required number
            this.shuffleArray(this.questions);
            this.questions = this.questions.slice(0, this.settings.questionCount);
            
            console.log(`Loaded ${this.questions.length} questions`);
        } catch (error) {
            console.error('Error loading questions:', error);
            this.questions = this.getFallbackQuestions();
        }
    }
    
    filterQuestions(allQuestions) {
        let filtered = [...allQuestions];
        
        // Filter by difficulty
        if (this.settings.difficulty !== 'mixed') {
            filtered = filtered.filter(q => q.difficulty === this.settings.difficulty);
        }
        
        // Filter by topic
        if (this.settings.topic !== 'random') {
            filtered = filtered.filter(q => 
                q.topic.includes(this.settings.topic) || q.tags.includes(this.settings.topic)
            );
        }
        
        return filtered;
    }
    
    getFallbackQuestions() {
        // Return some default questions if loading fails
        return [
            {
                id: 1,
                type: 'multiple-choice',
                question: 'Who was the first man created by God?',
                choices: ['Adam', 'Eve', 'Noah', 'Abraham'],
                correctAnswer: 'Adam',
                reference: 'Genesis 2:7',
                difficulty: 'easy',
                topic: 'old-testament',
                points: 10,
                timer: 30,
                hints: ['Think about the creation story', 'He named all the animals', 'His wife was created from his rib'],
                explanations: {
                    'Eve': 'Eve was the first woman, not the first man',
                    'Noah': 'Noah built the ark during the flood',
                    'Abraham': 'Abraham is the father of many nations'
                }
            },
            // Add more fallback questions...
        ];
    }
    
    setupUI() {
        // Setup event listeners
        document.getElementById('nextQuestion')?.addEventListener('click', () => this.nextQuestion());
        document.getElementById('hintButton')?.addEventListener('click', () => this.showHint());
        document.getElementById('submitAnswer')?.addEventListener('click', () => this.submitAnswer());
        
        // Setup choice selection
        document.querySelectorAll('.choice').forEach(choice => {
            choice.addEventListener('click', (e) => this.selectChoice(e.currentTarget));
        });
        
        // Initialize timer display
        this.updateTimerDisplay();
    }
    
    startQuiz() {
        this.quizStarted = true;
        this.startTime = Date.now();
        this.showQuestion(this.currentQuestionIndex);
        this.startTimer();
        this.updateProgressBar();
    }
    
    showQuestion(index) {
        if (index >= this.questions.length) {
            this.endQuiz();
            return;
        }
        
        const question = this.questions[index];
        
        // Update question display
        document.getElementById('questionText').textContent = question.question;
        document.getElementById('questionReference').textContent = question.reference;
        document.getElementById('questionNumber').textContent = `Question ${index + 1} of ${this.questions.length}`;
        
        // Update choices
        const choicesContainer = document.getElementById('choicesContainer');
        choicesContainer.innerHTML = '';
        
        question.choices.forEach((choice, i) => {
            const choiceElement = document.createElement('div');
            choiceElement.className = 'choice';
            choiceElement.dataset.value = choice;
            choiceElement.innerHTML = `
                <span class="choice-letter">${String.fromCharCode(65 + i)}</span>
                <span class="choice-text">${choice}</span>
            `;
            choicesContainer.appendChild(choiceElement);
        });
        
        // Reset timer for this question
        this.timeRemaining = question.timer || 30;
        this.updateTimerDisplay();
        
        // Reset hint button
        this.hintsUsed = 0;
        document.getElementById('hintButton').disabled = false;
        document.getElementById('hintButton').innerHTML = '<i class="fas fa-lightbulb"></i> Hint (3 remaining)';
        
        // Reset UI state
        document.querySelectorAll('.choice').forEach(c => {
            c.classList.remove('selected', 'correct', 'wrong');
        });
        
        document.getElementById('feedback').classList.add('hidden');
        document.getElementById('nextQuestion').classList.add('hidden');
        document.getElementById('submitAnswer').classList.remove('hidden');
        
        // Reattach choice event listeners
        document.querySelectorAll('.choice').forEach(choice => {
            choice.addEventListener('click', (e) => this.selectChoice(e.currentTarget));
        });
    }
    
    selectChoice(choiceElement) {
        // Deselect all other choices
        document.querySelectorAll('.choice').forEach(c => {
            c.classList.remove('selected');
        });
        
        // Select clicked choice
        choiceElement.classList.add('selected');
        
        // Enable submit button
        document.getElementById('submitAnswer').disabled = false;
    }
    
    submitAnswer() {
        const selectedChoice = document.querySelector('.choice.selected');
        if (!selectedChoice) return;
        
        const question = this.questions[this.currentQuestionIndex];
        const userAnswer = selectedChoice.dataset.value;
        const isCorrect = userAnswer === question.correctAnswer;
        
        // Update score
        if (isCorrect) {
            this.score += question.points;
            selectedChoice.classList.add('correct');
            this.playSound('correct');
            
            // Add streak bonus
            const streakBonus = Math.floor(this.currentQuestionIndex / 5) * 5;
            if (streakBonus > 0) {
                this.score += streakBonus;
            }
        } else {
            this.score -= question.negativePoints || 0;
            selectedChoice.classList.add('wrong');
            
            // Highlight correct answer
            document.querySelectorAll('.choice').forEach(c => {
                if (c.dataset.value === question.correctAnswer) {
                    c.classList.add('correct');
                }
            });
            
            this.playSound('wrong');
        }
        
        // Store user answer
        this.userAnswers.push({
            questionId: question.id,
            userAnswer,
            isCorrect,
            timeSpent: (question.timer || 30) - this.timeRemaining
        });
        
        // Show feedback
        this.showFeedback(isCorrect, question);
        
        // Update UI
        document.getElementById('submitAnswer').classList.add('hidden');
        document.getElementById('nextQuestion').classList.remove('hidden');
        document.getElementById('currentScore').textContent = this.score;
        
        // Stop timer
        this.stopTimer();
        
        // Save progress
        this.saveProgress();
    }
    
    showFeedback(isCorrect, question) {
        const feedback = document.getElementById('feedback');
        const feedbackText = document.getElementById('feedbackText');
        const explanation = document.getElementById('explanation');
        
        feedback.classList.remove('hidden');
        
        if (isCorrect) {
            feedbackText.innerHTML = `<i class="fas fa-check-circle"></i> Correct! +${question.points} points`;
            feedbackText.className = 'correct-feedback';
        } else {
            feedbackText.innerHTML = `<i class="fas fa-times-circle"></i> Incorrect`;
            feedbackText.className = 'wrong-feedback';
            
            if (question.explanations && question.explanations[this.getSelectedAnswer()]) {
                explanation.textContent = question.explanations[this.getSelectedAnswer()];
                explanation.classList.remove('hidden');
            }
        }
        
        // Show AI insight
        this.showAIInsight(question);
    }
    
    showAIInsight(question) {
        const insights = [
            "This verse is often quoted in evangelism. Consider memorizing it!",
            "This story teaches us about God's faithfulness in difficult times.",
            "Remember this principle: it applies to many life situations.",
            "Great job! This is a key doctrine in Christian theology.",
            "This passage connects to the theme of redemption throughout Scripture."
        ];
        
        const aiInsight = document.getElementById('aiInsight');
        aiInsight.textContent = insights[Math.floor(Math.random() * insights.length)];
        aiInsight.classList.remove('hidden');
    }
    
    showHint() {
        if (this.hintsUsed >= 3) return;
        
        const question = this.questions[this.currentQuestionIndex];
        if (!question.hints || question.hints.length === 0) return;
        
        this.hintsUsed++;
        
        const hint = question.hints[this.hintsUsed - 1];
        const hintContainer = document.getElementById('hintContainer');
        
        const hintElement = document.createElement('div');
        hintElement.className = 'hint';
        hintElement.innerHTML = `
            <i class="fas fa-lightbulb"></i>
            <span>Hint ${this.hintsUsed}: ${hint}</span>
        `;
        
        hintContainer.appendChild(hintElement);
        
        // Update hint button
        const remaining = 3 - this.hintsUsed;
        document.getElementById('hintButton').innerHTML = 
            `<i class="fas fa-lightbulb"></i> Hint (${remaining} remaining)`;
        
        if (remaining === 0) {
            document.getElementById('hintButton').disabled = true;
        }
        
        // Deduct points for using hint
        this.score -= 2;
        document.getElementById('currentScore').textContent = this.score;
    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        this.updateProgressBar();
        
        if (this.currentQuestionIndex < this.questions.length) {
            this.showQuestion(this.currentQuestionIndex);
            this.startTimer();
        } else {
            this.endQuiz();
        }
    }
    
    startTimer() {
        this.stopTimer(); // Clear any existing timer
        
        const timerCircle = document.querySelector('.timer-circle');
        const circumference = 2 * Math.PI * 45; // r=45
        
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            // Update circular progress
            if (timerCircle) {
                const offset = circumference - (this.timeRemaining / this.questions[this.currentQuestionIndex].timer) * circumference;
                timerCircle.style.strokeDashoffset = offset;
            }
            
            if (this.timeRemaining <= 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    updateTimerDisplay() {
        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) {
            timerDisplay.textContent = this.timeRemaining;
        }
    }
    
    timeUp() {
        this.stopTimer();
        this.submitAnswer(); // Auto-submit when time's up
    }
    
    updateProgressBar() {
        const progress = ((this.currentQuestionIndex) / this.questions.length) * 100;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }
    
    async endQuiz() {
        this.stopTimer();
        this.quizStarted = false;
        
        // Calculate final score and statistics
        const totalTime = Date.now() - this.startTime;
        const accuracy = (this.userAnswers.filter(a => a.isCorrect).length / this.questions.length) * 100;
        const averageTime = totalTime / this.questions.length / 1000;
        
        // Save results
        const quizResults = {
            score: this.score,
            totalQuestions: this.questions.length,
            correctAnswers: this.userAnswers.filter(a => a.isCorrect).length,
            accuracy: accuracy.toFixed(1),
            totalTime: (totalTime / 1000).toFixed(1),
            averageTime: averageTime.toFixed(1),
            date: new Date().toISOString(),
            settings: this.settings,
            questions: this.userAnswers
        };
        
        // Save to localStorage
        this.saveQuizResults(quizResults);
        
        // Update user stats
        this.updateUserStats(quizResults);
        
        // Redirect to results page
        localStorage.setItem('lastQuizResults', JSON.stringify(quizResults));
        window.location.href = 'results.html';
    }
    
    saveQuizResults(results) {
        const allResults = JSON.parse(localStorage.getItem('quizHistory') || '[]');
        allResults.push(results);
        localStorage.setItem('quizHistory', JSON.stringify(allResults.slice(-50))); // Keep last 50 results
    }
    
    updateUserStats(results) {
        let user = JSON.parse(localStorage.getItem('bibleQuizUser') || '{}');
        
        // Update streak
        const lastQuizDate = localStorage.getItem('lastQuizDate');
        const today = new Date().toDateString();
        
        if (lastQuizDate === today) {
            // Already quizzed today
        } else if (lastQuizDate && 
                  new Date(lastQuizDate).getTime() === new Date(today).getTime() - 86400000) {
            // Quizzed yesterday - increment streak
            user.streak = (user.streak || 0) + 1;
        } else {
            // Broken streak
            user.streak = 1;
        }
        
        localStorage.setItem('lastQuizDate', today);
        
        // Update XP
        user.xp = (user.xp || 0) + results.score;
        
        // Update level
        user.level = this.calculateLevel(user.xp);
        
        localStorage.setItem('bibleQuizUser', JSON.stringify(user));
    }
    
    calculateLevel(xp) {
        const levels = [
            { xp: 0, name: 'Beginner' },
            { xp: 500, name: 'Learner' },
            { xp: 1500, name: 'Student' },
            { xp: 3000, name: 'Scholar' },
            { xp: 6000, name: 'Theologian' }
        ];
        
        for (let i = levels.length - 1; i >= 0; i--) {
            if (xp >= levels[i].xp) {
                return levels[i].name;
            }
        }
        return 'Beginner';
    }
    
    saveProgress() {
        const progress = {
            currentQuestionIndex: this.currentQuestionIndex,
            score: this.score,
            userAnswers: this.userAnswers,
            timeRemaining: this.timeRemaining,
            startTime: this.startTime
        };
        
        localStorage.setItem('quizProgress', JSON.stringify(progress));
    }
    
    loadProgress() {
        const progress = JSON.parse(localStorage.getItem('quizProgress'));
        if (progress) {
            this.currentQuestionIndex = progress.currentQuestionIndex;
            this.score = progress.score;
            this.userAnswers = progress.userAnswers;
            this.timeRemaining = progress.timeRemaining;
            this.startTime = progress.startTime;
            return true;
        }
        return false;
    }
    
    playSound(type) {
        // Use sound from main app or fallback
        if (window.QuizMaster && window.QuizMaster.playSound) {
            window.QuizMaster.playSound(type);
        } else {
            const audio = new Audio(`assets/sounds/${type}.mp3`);
            audio.volume = 0.3;
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    getSelectedAnswer() {
        const selected = document.querySelector('.choice.selected');
        return selected ? selected.dataset.value : null;
    }
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('quiz.html')) {
        const quiz = new QuizEngine();
        window.currentQuiz = quiz; // Make accessible for debugging
    }
}); 

