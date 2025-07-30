let questions = [];
let currentQuestionIndex = 0;
const totalQuestions = 20;
const visitedStatus = Array(totalQuestions).fill(false);
const answeredStatus = Array(totalQuestions).fill(false);
const reviewStatus = Array(totalQuestions).fill(false);
const questionButtons = [];
let totalSeconds = 15 * 60;
let userAnswers = new Array(20).fill(null);

function timer(n) {
  return n < 10 ? "0" + n : n;
}
startTimer();

function startTimer() {
  const timerInterval = setInterval(() => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    document.getElementById("minutes").innerText = timer(minutes);
    document.getElementById("seconds").innerText = timer(seconds);
    document.getElementById("hours").innerText = "00";

    totalSeconds--;

    if (totalSeconds < 0) {
      clearInterval(timerInterval);
      alert("Time Over! Submitting your test...");
      window.location.href = "/elgoss-online-exam-juliyat/result/result.html";
    }
  }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchQuestions();

  for (let i = 0; i < totalQuestions; i++) {
    const btn = document.getElementById(`btn${i + 1}`);
    questionButtons[i] = btn;
    btn.classList.add("status-not-visited");

    btn.addEventListener("click", () => {
      saveAnswerStatus(currentQuestionIndex);
      currentQuestionIndex = i;
      displayQuestion(currentQuestionIndex);
    });
  }

  document.getElementById("prev-btn").addEventListener("click", () => {
    saveAnswerStatus(currentQuestionIndex);
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      displayQuestion(currentQuestionIndex);
    }
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    saveAnswerStatus(currentQuestionIndex);
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      displayQuestion(currentQuestionIndex);
    }
  });

  document.getElementById("submit").addEventListener("click", () => {
    model_container.classList.add("show");
  });

  document.getElementById("YES").addEventListener("click", () => {
    model_container.classList.remove("show");
    calculateAndSubmit();
  });

  document.getElementById("no").addEventListener("click", () => {
    model_container.classList.remove("show");
  });

  document.getElementById("options-container").addEventListener("change", (e) => {
    userAnswers[currentQuestionIndex] = e.target.value;
  });
});

function fetchQuestions() {
  fetch("./Question.Json")
    .then(res => res.json())
    .then(data => {
      questions = data;
      displayQuestion(currentQuestionIndex);
    })
    .catch(err => {
      console.error("Error loading questions:", err);
      document.getElementById("question-text").textContent = "Failed to load questions.";
    });
}

function displayQuestion(index) {
  const question = questions[index];
  const optionsContainer = document.getElementById("options-container");

  document.getElementById("question-count").textContent = `Question ${index + 1}/${questions.length}`;
  document.getElementById("question-text").textContent = question.question;
  document.getElementById("file").value = Math.floor(((index + 1) / totalQuestions) * 100);

  // Clear options
  optionsContainer.innerHTML = "";
  question.options.forEach((option, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <input type="radio" name="option" id="option-${i}" value="${option}">
      <label for="option-${i}">${option}</label><br>
    `;
    optionsContainer.appendChild(div);
  });

  // Pre-select user's previous answer
  if (userAnswers[index]) {
    const selected = optionsContainer.querySelector(`input[value="${userAnswers[index]}"]`);
    if (selected) selected.checked = true;
  }

  // Reset mark checkbox
  const markBox = document.querySelector('input[name="mark"]');
  if (markBox) markBox.checked = false;

  document.getElementById("prev-btn").disabled = index === 0;
  document.getElementById("next-btn").disabled = index === questions.length - 1;

  markActive(index);
}

function saveAnswerStatus(index) {
  const marked = document.querySelector('input[name="mark"]')?.checked;
  const selected = document.querySelector('input[name="option"]:checked');
  const btn = questionButtons[index];

  btn.classList.remove("status-active", "status-not-visited", "status-answered", "status-review", "status-not-answered");

  if (marked) {
    reviewStatus[index] = true;
    btn.classList.add("status-review");
  } else if (selected) {
    answeredStatus[index] = true;
    btn.classList.add("status-answered");
  } else {
    btn.classList.add("status-not-answered");
  }
}

function markActive(index) {
  questionButtons.forEach((btn, i) => {
    if (i !== index) btn.classList.remove("status-active");
  });

  const btn = questionButtons[index];
  btn.classList.remove("status-not-visited", "status-not-answered");
  btn.classList.add("status-active");
  visitedStatus[index] = true;
}

function calculateAndSubmit() {
  const correctAnswers = ["42", "25", "V", "7.5°", "22", "15", "20", "120", "M", "Carrot",
    "4.50", "1/2", "Circle", "10 cents", "37", "Tuesday", "Thursday", "19", "Quarter and a nickel", "25"
  ];

  let correct = 0;
  let summaryData = [];
    var dd = questions;


  for (let i = 0; i < 20; i++) {
    const questionNum = i + 1;
    const ddq = dd[i].question;
    const selected = userAnswers[i] || "Not Answered";
    const correctAns = correctAnswers[i];

    if (selected === correctAns) correct++;

    summaryData.push({
      id: `Q${questionNum}`,
            question: ddq,

      yourAnswer: selected,
      correctAnswer: correctAns
    });
  }

  const score = Math.round((correct / 20) * 100);
  localStorage.setItem('score', score);
  localStorage.setItem('summary', JSON.stringify(summaryData));
  window.location.href = "/elgoss-online-exam-juliyat/result/result.html";
}
