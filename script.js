// Cultural Assessment Tool JavaScript

class CulturalAssessment {
    constructor() {
        this.currentQuestion = 0;
        this.answers = {};
        this.dimensions = [
            {
                name: "Communicating",
                scale: "Low-Context ↔ High-Context",
                description: "How explicit vs. implicit your communication style is",
                questions: [
                    { text: "I strive to communicate simply, clearly, and explicitly. I avoid reading — and speaking – between the lines.", reversed: false },
                    { text: "The most effective presenters spell out what they're going to tell you, then tell you, and then summarize what they've told you, to ensure that the communication is crystal clear.", reversed: false },
                    { text: "After a meeting or a phone call, it is important to recap in writing exactly what was said, to prevent misunderstanding or confusion.", reversed: false }
                ]
            },
            {
                name: "Evaluating",
                scale: "Direct Negative Feedback ↔ Indirect Negative Feedback",
                description: "How direct vs. indirect your feedback style is",
                questions: [
                    { text: "If I've done poor work, I prefer to be told bluntly rather than gently or diplomatically.", reversed: false },
                    { text: "When I give negative feedback I pay more attention to how the person feels receiving the message than to how clear my criticism is.", reversed: true },
                    { text: "I prefer to give negative feedback immediately and all at once rather than little by little, building the picture up over time.", reversed: false }
                ]
            },
            {
                name: "Leading",
                scale: "Egalitarian ↔ Hierarchical",
                description: "Your preference for flat vs. hierarchical structures",
                questions: [
                    { text: "If I don't agree with the senior leaders in the room, I feel comfortable speaking up.", reversed: false },
                    { text: "When meeting with other teams, I pay attention to the hierarchical position of the people attending the meeting.", reversed: true },
                    { text: "If I have ideas that I want to share with someone several levels above me in the company, I prefer to speak to my boss and ask them to pass it on to them.", reversed: true }
                ]
            },
            {
                name: "Deciding",
                scale: "Consensual ↔ Top-Down",
                description: "Whether you prefer group consensus or leader decisions",
                questions: [
                    { text: "Even if it takes a long time, it is better to involve all stakeholders in the decision-making process.", reversed: false },
                    { text: "Consensus-building ultimately leads to mediocre decisions and wasted time.", reversed: true },
                    { text: "If the boss makes a unilateral decision I disagree with I will still follow the decision.", reversed: true }
                ]
            },
            {
                name: "Trusting",
                scale: "Task-Based ↔ Relationship-Based",
                description: "How you build trust with colleagues",
                questions: [
                    { text: "It is better not to get too emotionally close to those you work with.", reversed: false },
                    { text: "I invest time socializing with colleagues, during which we don't discuss work but just get to know each other.", reversed: true },
                    { text: "I can't really trust colleagues or suppliers until I have spent time getting to know them personally.", reversed: true }
                ]
            },
            {
                name: "Disagreeing",
                scale: "Confrontational ↔ Avoids Confrontation",
                description: "Your comfort level with open disagreement",
                questions: [
                    { text: "Expressing open disagreement with other team members frequently is likely to have a positive impact on a team's success.", reversed: false },
                    { text: "When I disagree strongly with a point made by a colleague making a presentation I am comfortable expressing my disagreement.", reversed: false },
                    { text: "Open debate, where team members confront one another's ideas and opinions, is likely to end in bad feelings and difficult relationships.", reversed: true }
                ]
            },
            {
                name: "Scheduling",
                scale: "Linear-Time ↔ Flexible-Time",
                description: "Your approach to time and scheduling",
                questions: [
                    { text: "In order to show professionalism it is more important to be organized and structured than flexible and reactive.", reversed: false },
                    { text: "If I have a meeting at 9:00, that's when I will arrive, not 5 or 15 minutes later.", reversed: false },
                    { text: "A meeting agenda is just a guide. If the group wants to take the discussion in a different direction, the agenda can be adjusted to suit.", reversed: true }
                ]
            },
            {
                name: "Persuading",
                scale: "Principles-First ↔ Applications-First",
                description: "Whether you prefer theoretical or practical approaches",
                questions: [
                    { text: "A good presenter influences by first explaining and validating the concepts and principles behind the point before coming to practical examples and next steps.", reversed: false },
                    { text: "Presenters who get right to the point, stick to concrete examples and conclusions, rather than spending time examining principles, are more engaging to me.", reversed: true },
                    { text: "Before making a business decision it is important to spend ample time on conceptual debate.", reversed: false }
                ]
            }
        ];
        
        this.init();
    }

    init() {
        this.generateQuestions();
        this.setupEventListeners();
        this.showQuestion(0);
        this.updateProgress();
    }

    generateQuestions() {
        const container = document.getElementById('questionContainer');
        let questionIndex = 0;

        this.dimensions.forEach((dimension, dimIndex) => {
            dimension.questions.forEach((question, qIndex) => {
                // Support both string and object question formats
                let qText, reversed;
                if (typeof question === 'string') {
                    qText = question;
                    reversed = false;
                } else {
                    qText = question.text;
                    reversed = !!question.reversed;
                }
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question';
                questionDiv.id = `question-${questionIndex}`;

                questionDiv.innerHTML = `
                    <p>${qText}</p>
                    <div class="scale-container">
                        <span class="likert-label likert-label-left">Strongly Disagree (1)</span>
                        <div class="likert-scale">
                            ${this.generateLikertOptions(questionIndex)}
                        </div>
                        <span class="likert-label likert-label-right">Strongly Agree (7)</span>
                    </div>
                `;

                container.appendChild(questionDiv);
                questionIndex++;
            });
        });

        // Add required event listeners to hide notice on answer
        for (let i = 0; i < this.getTotalQuestions(); i++) {
            document.querySelectorAll(`input[name="q${i}"]`).forEach(radio => {
                radio.addEventListener('change', () => {
                    this.hideNotice();
                });
            });
        }
    }

    getScaleLabels(scale) {
        const parts = scale.split('↔');
        return {
            left: parts[0].trim(),
            right: parts[1].trim()
        };
    }

    generateLikertOptions(questionIndex) {
        let options = '';
        for (let i = 1; i <= 7; i++) {
            options += `
                <div class="likert-option">
                    <input type="radio" name="q${questionIndex}" value="${i}" id="q${questionIndex}_${i}">
                    <label for="q${questionIndex}_${i}">${i}</label>
                </div>
            `;
        }
        return options;
    }

    setupEventListeners() {
        document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('prevBtn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('assessmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateResults();
        });
        document.getElementById('retakeBtn').addEventListener('click', () => this.retakeAssessment());
        // document.getElementById('downloadBtn').addEventListener('click', () => this.downloadResults());
    }

    showNotice(message) {
        let notice = document.getElementById('requiredNotice');
        if (!notice) {
            notice = document.createElement('div');
            notice.id = 'requiredNotice';
            notice.style.color = '#b00020';
            notice.style.background = '#fff3f3';
            notice.style.border = '1px solid #f5c2c7';
            notice.style.padding = '12px 18px';
            notice.style.borderRadius = '8px';
            notice.style.marginBottom = '18px';
            notice.style.textAlign = 'center';
            notice.style.fontWeight = '500';
            const nav = document.querySelector('.navigation-buttons');
            nav.parentNode.insertBefore(notice, nav);
        }
        notice.textContent = message;
        notice.style.display = 'block';
    }

    hideNotice() {
        const notice = document.getElementById('requiredNotice');
        if (notice) {
            notice.style.display = 'none';
        }
    }

    showQuestion(index) {
        const questions = document.querySelectorAll('.question');
        questions.forEach((q, i) => {
            q.classList.toggle('active', i === index);
        });

        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        prevBtn.disabled = index === 0;
        nextBtn.style.display = index === questions.length - 1 ? 'none' : 'inline-block';
        submitBtn.style.display = index === questions.length - 1 ? 'inline-block' : 'none';

        this.currentQuestion = index;
        this.updateProgress();
        this.hideNotice();
    }

    nextQuestion() {
        // Require answer for current question
        if (!this.isQuestionAnswered(this.currentQuestion)) {
            this.showNotice('Please answer this question before continuing.');
            return;
        }
        if (this.currentQuestion < this.getTotalQuestions() - 1) {
            this.showQuestion(this.currentQuestion + 1);
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.showQuestion(this.currentQuestion - 1);
        }
    }

    isQuestionAnswered(index) {
        return !!document.querySelector(`input[name="q${index}"]:checked`);
    }

    getTotalQuestions() {
        return this.dimensions.reduce((total, dim) => total + dim.questions.length, 0);
    }

    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.getTotalQuestions()) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = `Question ${this.currentQuestion + 1} of ${this.getTotalQuestions()}`;
    }

    collectAnswers() {
        this.answers = {};
        for (let i = 0; i < this.getTotalQuestions(); i++) {
            const selected = document.querySelector(`input[name="q${i}"]:checked`);
            if (selected) {
                this.answers[i] = parseInt(selected.value);
            }
        }
        return Object.keys(this.answers).length === this.getTotalQuestions();
    }

    calculateResults() {
        // Require answer for last question
        if (!this.isQuestionAnswered(this.currentQuestion)) {
            this.showNotice('Please answer this question before viewing results.');
            return;
        }
        if (!this.collectAnswers()) {
            this.showNotice('Please answer all questions before viewing results.');
            return;
        }
        const scores = this.calculateDimensionScores();
        this.displayResults(scores);
    }

    calculateDimensionScores() {
        const scores = {};
        let questionIndex = 0;

        this.dimensions.forEach(dimension => {
            const dimensionAnswers = [];
            for (let i = 0; i < dimension.questions.length; i++) {
                const question = dimension.questions[i];
                let reversed = false;
                if (typeof question === 'object' && question !== null) {
                    reversed = !!question.reversed;
                }
                const userValue = this.answers[questionIndex];
                if (userValue !== undefined) {
                    // If reversed, invert the score
                    dimensionAnswers.push(reversed ? userValue : (8 - userValue) );
                }
                questionIndex++;
            }

            // Calculate average score for this dimension
            const average = dimensionAnswers.reduce((sum, val) => sum + val, 0) / dimensionAnswers.length;
            scores[dimension.name] = {
                score: Math.round(average * 10) / 10, // Round to 1 decimal place
                dimension: dimension
            };
        });

        return scores;
    }

    displayResults(scores) {
        document.getElementById('questionnaire').style.display = 'none';
        document.getElementById('results').style.display = 'block';

        this.createScalesChart(scores);
        this.displayDetailedScores(scores);
    }

    createScalesChart(scores) {
        const container = document.getElementById('scalesChart');
        container.innerHTML = '';
        // Create canvas
        const margin = { left: 210, right: 210, top: 120, bottom: 40 };
        const chartWidth = 900;
        const rowHeight = 90;
        const chartHeight = rowHeight * Object.keys(scores).length;
        const canvas = document.createElement('canvas');
        canvas.width = chartWidth + margin.left + margin.right;
        canvas.height = chartHeight + margin.top + margin.bottom;
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        // Chart settings
        const barLength = chartWidth;
        const barHeight = 8;
        const dotRadius = 16;
        const lineColor = '#218c2c';
        const dotColor = '#218c2c';
        const labelFont = '18px Segoe UI, Arial, sans-serif';
        const dimFont = 'bold 18px Segoe UI, Arial, sans-serif';
        const scaleFont = '15px Segoe UI, Arial, sans-serif';

        // Draw legend
        // ctx.beginPath();
        // ctx.arc(margin.left - 70, margin.top - 30, 18, 0, 2 * Math.PI);
        // ctx.fillStyle = dotColor;
        // ctx.fill();
        // ctx.font = '20px Segoe UI, Arial, sans-serif';
        // ctx.fillStyle = '#222';
        // ctx.textAlign = 'left';
        // ctx.fillText('Your Profile', margin.left - 40, margin.top - 22);

        // Draw each scale
        const labels = Object.keys(scores);
        let prevX = null, prevY = null;
        labels.forEach((label, i) => {
            const y = margin.top + i * rowHeight;
            // Bar
            ctx.fillStyle = '#e0e0e0';
            ctx.fillRect(margin.left, y - barHeight / 2, barLength, barHeight);

            // Left label
            ctx.font = scaleFont;
            ctx.fillStyle = '#888';
            ctx.textAlign = 'right';
            ctx.fillText(this.getScaleLabels(scores[label].dimension.scale).left, margin.left - 20, y + 6);

            // Right label
            ctx.textAlign = 'left';
            ctx.fillText(this.getScaleLabels(scores[label].dimension.scale).right, margin.left + barLength + 20, y + 6);

            // Dimension name (centered)
            ctx.font = dimFont;
            ctx.fillStyle = '#888';
            ctx.textAlign = 'center';
            ctx.fillText(label.toUpperCase(), margin.left + barLength / 2, y - 18);

            // Dot position
            const score = scores[label].score;
            const x = margin.left + ((score - 1) / 6) * barLength;

            // Line to previous dot
            if (prevX !== null && prevY !== null) {
                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(x, y);
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 4;
                ctx.stroke();
            }

            // Dot
            ctx.beginPath();
            ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
            ctx.fillStyle = dotColor;
            ctx.fill();
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#fff';
            ctx.stroke();

            prevX = x;
            prevY = y;
        });
    }

    displayDetailedScores(scores) {
        const container = document.getElementById('scoresGrid');
        container.innerHTML = '';

        Object.entries(scores).forEach(([dimensionName, data]) => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'score-item';
            
            const description = this.getScoreDescription(data.score, data.dimension.scale);
            
            scoreItem.innerHTML = `
                <h4>${dimensionName}</h4>
                <div class="score-value">${data.score}/7</div>
                <div class="score-description">${description}</div>
            `;
            
            container.appendChild(scoreItem);
        });
    }

    getScoreDescription(score, scale) {
        const labels = this.getScaleLabels(scale);
        
        if (score <= 2.5) {
            return `You lean toward: ${labels.left}`;
        } else if (score >= 5.5) {
            return `You lean toward: ${labels.right}`;
        } else {
            return `You are balanced between both approaches`;
        }
    }

    retakeAssessment() {
        this.currentQuestion = 0;
        this.answers = {};
        
        // Clear all radio button selections
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
        
        document.getElementById('results').style.display = 'none';
        document.getElementById('questionnaire').style.display = 'block';
        this.showQuestion(0);
    }

    downloadResults() {
        if (!this.answers || Object.keys(this.answers).length === 0) {
            alert('No results to download. Please complete the assessment first.');
            return;
        }

        const scores = this.calculateDimensionScores();
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Dimension,Score,Scale\n";
        
        Object.entries(scores).forEach(([dimensionName, data]) => {
            csvContent += `${dimensionName},${data.score},${data.dimension.scale}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "cultural_assessment_results.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CulturalAssessment();
}); 
