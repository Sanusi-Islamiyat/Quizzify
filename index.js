let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let timer;
let timeLeft = 20;

const categorySelect = document.getElementById("category");
const startBtn = document.getElementById("start-btn");
const quizContainer = document.getElementById("quiz-container");
const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");
const nextBtn = document.getElementById("next-btn");
const timerDisplay = document.getElementById("timer");

startBtn.addEventListener("click", () => {
    let selectedCategory = categorySelect.value;
    fetchQuestions(selectedCategory);
});

async function fetchQuestions(category) {
    const API_URL = `https://opentdb.com/api.php?amount=5&category=${category}&type=multiple`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        questions = data.results.map(q => ({
            question: q.question,
            options: shuffleArray([...q.incorrect_answers, q.correct_answer]),
            answer: q.correct_answer
        }));
        
        document.getElementById("category-container").style.display = "none";
        quizContainer.style.display = "block";
        loadQuestion();
    } catch (error) {
        console.error("Error fetching questions:", error);
        questionText.innerText = "Failed to load quiz. Please try again.";
    }
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    questionText.innerHTML = currentQuestion.question;

    currentQuestion.options.forEach(option => {
        let button = document.createElement("button");
        button.classList.add("btn", "btn-outline-primary", "answer-btn", "col-12");
        button.textContent = option;
        button.dataset.value = option;
        button.addEventListener("click", () => selectAnswer(button, option));
        answerOptions.appendChild(button);
    });

    startTimer();
}

function resetState() {
    answerOptions.innerHTML = "";
    selectedAnswer = null;
    nextBtn.disabled = true;
    timeLeft = 20;
    clearInterval(timer);
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft === 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

function selectAnswer(selectedButton, option) {
    selectedAnswer = option;

    document.querySelectorAll(".answer-btn").forEach(btn => {
        btn.classList.remove("btn-primary", "selected");
        btn.classList.add("btn-outline-primary");
    });

    selectedButton.classList.remove("btn-outline-primary");
    selectedButton.classList.add("btn-primary", "selected");
    nextBtn.disabled = false;
}

function nextQuestion() {
    if (selectedAnswer === questions[currentQuestionIndex].answer) {
        score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        localStorage.setItem("quizScore", score);
        localStorage.setItem("totalQuestions", questions.length);
        window.location.href = "result.html";
    }
}

nextBtn.addEventListener("click", nextQuestion);
