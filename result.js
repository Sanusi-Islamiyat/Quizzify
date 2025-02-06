const score = localStorage.getItem("quizScore");
const totalQuestions = localStorage.getItem("totalQuestions");
const scoreText = document.getElementById("score-text");
const passFailMessage = document.getElementById("pass-fail-message");

const percentage = (score / totalQuestions) * 100;
scoreText.innerText = `You scored ${score} out of ${totalQuestions} (${percentage.toFixed(1)}%)`;

if (percentage >= 50) {
    passFailMessage.innerText = "Yay! You Passed!";
    passFailMessage.classList.add("text-success");
} else {
    passFailMessage.innerText = "Oops! You Failed. Try Again!";
    passFailMessage.classList.add("text-danger");
}

function restartQuiz() {
    window.location.href = "index.html";
}