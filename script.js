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
                    { text: "When giving instructions or information, do you prefer to be very explicit and detailed, or do you rely on shared understanding and context?", reversed: true },
                    { text: "How comfortable are you with messages that are not stated directly but implied through tone, body language, or context?", reversed: true },
                    { text: "On a scale from 1 (I prefer clear, direct communication) to 7 (I prefer subtle, indirect communication), where do you see yourself?", reversed: true }
                ]
            },
            {
                name: "Evaluating",
                scale: "Direct Negative Feedback ↔ Indirect Negative Feedback",
                description: "How direct vs. indirect your feedback style is",
                questions: [
                    { text: "When giving negative feedback, do you tend to be straightforward and explicit, or do you soften criticism and use indirect language?", reversed: false },
                    { text: "How do you prefer to receive constructive criticism: directly and clearly, or with careful phrasing and positive framing?", reversed: false },
                    { text: "On a scale from 1 (very direct) to 7 (very indirect), how do you prefer to give and receive feedback?", reversed: false }
                ]
            },
            {
                name: "Persuading",
                scale: "Principles-First ↔ Applications-First",
                description: "Whether you prefer theoretical or practical approaches",
                questions: [
                    { text: "A good presenter influences by first explaining and validating the concepts and principles behind the point before coming to practical examples and next steps.", reversed: false },
                    { text: "Presenters who arrive quickly to outcomes, conclusions and next steps without spending time explaining theory and concepts first are less engaging to me.", reversed: false },
                    { text: "Before making a business decision it is important to spend ample time on conceptual debate.", reversed: false }
                ]
            },
            {
                name: "Leading",
                scale: "Egalitarian ↔ Hierarchical",
                description: "Your preference for flat vs. hierarchical structures",
                questions: [
                    { text: "In a team setting, do you prefer flat structures where everyone is equal, or clear hierarchies with defined authority?", reversed: false },
                    { text: "How comfortable are you challenging or questioning a manager or leader in a group?", reversed: false },
                    { text: "On a scale from 1 (very egalitarian) to 7 (very hierarchical), where do you feel most comfortable?", reversed: false }
                ]
            },
            {
                name: "Deciding",
                scale: "Consensual ↔ Top-Down",
                description: "Whether you prefer group consensus or leader decisions",
                questions: [
                    { text: "Do you prefer decisions to be made by group consensus, or by a leader making the final call?", reversed: false },
                    { text: "How important is it for you to be involved in the decision-making process?", reversed: false },
                    { text: "On a scale from 1 (consensus-driven) to 7 (leader-driven), what is your preference?", reversed: false }
                ]
            },
            {
                name: "Trusting",
                scale: "Task-Based ↔ Relationship-Based",
                description: "How you build trust with colleagues",
                questions: [
                    { text: "Do you build trust with colleagues primarily through working together and delivering results, or through personal relationships and social interactions?", reversed: false },
                    { text: "How important is it for you to know your colleagues personally to trust them at work?", reversed: false },
                    { text: "On a scale from 1 (trust through work/tasks) to 7 (trust through relationships), where do you stand?", reversed: false }
                ]
            },
            {
                name: "Disagreeing",
                scale: "Confrontational ↔ Avoids Confrontation",
                description: "Your comfort level with open disagreement",
                questions: [
                    { text: "Are you comfortable expressing disagreement openly in a group, or do you prefer to avoid open conflict?", reversed: false },
                    { text: "How do you react when someone challenges your ideas directly?", reversed: false },
                    { text: "On a scale from 1 (comfortable with open disagreement) to 7 (prefer to avoid confrontation), what is your style?", reversed: false }
                ]
            },
            {
                name: "Scheduling",
                scale: "Linear-Time ↔ Flexible-Time",
                description: "Your approach to time and scheduling",
                questions: [
                    { text: "Do you prefer to follow a strict schedule and value punctuality, or do you see time as flexible and adapt plans as needed?", reversed: false },
                    { text: "How do you feel about changing plans or deadlines at short notice?", reversed: false },
                    { text: "On a scale from 1 (very structured and punctual) to 7 (very flexible and adaptable), what is your approach?", reversed: false }
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
                        <span class="likert-label likert-label-left">Strongly Disagree</span>
                        <div class="likert-scale">
                            ${this.generateLikertOptions(questionIndex)}
                        </div>
                        <span class="likert-label likert-label-right">Strongly Agree</span>
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
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadResults());
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
                    dimensionAnswers.push(reversed ? (8 - userValue) : userValue);
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
        ctx.beginPath();
        ctx.arc(margin.left - 70, margin.top - 30, 18, 0, 2 * Math.PI);
        ctx.fillStyle = dotColor;
        ctx.fill();
        ctx.font = '20px Segoe UI, Arial, sans-serif';
        ctx.fillStyle = '#222';
        ctx.textAlign = 'left';
        ctx.fillText('Your Profile', margin.left - 40, margin.top - 22);

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