let questions = [];
let currentQuestionIndex = 0;
const totalQuestions = 20;
const visitedStatus = Array(totalQuestions).fill(false);
const answeredStatus = Array(totalQuestions).fill(false);
const reviewStatus = Array(totalQuestions).fill(false);
const questionButtons = [];
let totalSeconds = 20 * 60;
let userAnswers = new Array(20).fill(null);
//timer
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
      window.location.href = "/result/result.html";
    }
  }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchQuestions();
//setting buttons
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
//previous button
  document.getElementById("prev-btn").addEventListener("click", () => {
    saveAnswerStatus(currentQuestionIndex);
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      displayQuestion(currentQuestionIndex);
    }
  });
  //next button

  document.getElementById("next-btn").addEventListener("click", () => {
    saveAnswerStatus(currentQuestionIndex);
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      displayQuestion(currentQuestionIndex);
    }
  });
  //for model pop-up

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
//fetching question from json file using API
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
//for displaying question
function displayQuestion(index) {
  const question = questions[index];
  const optionsContainer = document.getElementById("options-container");

  document.getElementById("question-count").textContent = `Question ${index + 1}/${questions.length}`;
  document.getElementById("question-text").textContent = question.question;
  document.getElementById("file").value = Math.floor(((index + 1) / totalQuestions) * 100);

   // for adding options
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
//Hide Previous and Next button when first and last question
if(index===0)
{
  document.getElementById("prev-btn").classList.add('hide');
}
else if(index===questions.length-1)
{
  document.getElementById("next-btn").classList.add('hide');
}
else{
  document.getElementById("prev-btn").classList.remove('hide');
  document.getElementById("next-btn").classList.remove('hide');
}

  markActive(index);
}
//for saving answer status
function saveAnswerStatus(index) {
  const marked = document.querySelector('input[name="mark"]')?.checked;
  const selected = document.querySelector('input[name="option"]:checked');
  const btn = questionButtons[index];

  btn.classList.remove("status-active", "status-not-visited", "status-answered", "status-review", "status-not-answered");
//for coloring  button
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
//for active status
  const btn = questionButtons[index];
  btn.classList.remove("status-not-visited", "status-not-answered");
  btn.classList.add("status-active");
  visitedStatus[index] = true;
}
//checking wrong /right answers and calculate scode and summary
function calculateAndSubmit() {
  const correctAnswers = ["42", "25", "V", "7.5°", "22", "15", "20", "120", "M", "Carrot",
    "4.50", "1/2", "Circle", "10 cents", "37", "Tuesday", "Thursday", "19", "Quarter and a nickel", "25"
  ];

  let correct = 0;
  let summaryData = [];
  var dd = questions;
debugger
//here store user's answered data and unanswred
  for (let i = 0; i < 20; i++) {
    const questionNum = i + 1;
    const ddq = dd[i].question;
    const selected = userAnswers[i] || "Not Answered";
    const correctAns = correctAnswers[i];

    if (selected === correctAns) correct++;
debugger
//push data to summary page
    summaryData.push({
      id: `Q${questionNum}`,
      question: ddq,
      yourAnswer: selected,
      correctAnswer: correctAns
    });
  }
debugger
//calculatescode
  const score = Math.round((correct / 20) * 100);
  localStorage.setItem('score', score);
  localStorage.setItem('summary', JSON.stringify(summaryData));
  window.location.href = "/result/result.html";
}
