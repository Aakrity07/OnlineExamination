let btn1 = document.querySelector("#btn1");
let btn2 = document.querySelector("#btn2");

function print1() {
  document.getElementById("btn1").style.visibility = "hidden";
  document.getElementById("btn2").style.visibility = "hidden";
  window.print();
  document.getElementById("btn1").style.visibility = "visible";
  document.getElementById("btn2").style.visibility = "visible";

}

function retake() {
  window.location.href = "/intro/intro.html";
}
window.onload = () => {
  const score = localStorage.getItem('score') || 0;
  const summary = JSON.parse(localStorage.getItem('summary') || '[]');

  // Left Panel
  document.querySelector('.left').innerHTML = `
    <p class="small fs-4 fw-semibold">Test Summary</p>
    <p class="small">Total Questions: <strong>20</strong></p>
    <p class="small">Answered: <strong>${summary.filter(q => q.yourAnswer !== "Not Answered").length}</strong></p>
    <p class="small">Correct Answers: <strong>${summary.filter(q => q.yourAnswer === q.correctAnswer).length}</strong></p>
    <p class="small">Incorrect Answers: <strong>${summary.filter(q => q.yourAnswer !== q.correctAnswer && q.yourAnswer !== "Not Answered").length}</strong></p>
    <p class="small">Your Score: <strong>${score}%</strong></p>
    <button id="btn1" class="btn btn-primary w-100 mt-3" onclick="retake()">↻ RETAKE TEST</button>
  `;

  // Right Panel
  const rightContainer = document.querySelector('.right');
  rightContainer.innerHTML = `<h3>Detailed Scorecard</h3>` +
    summary.map(q =>
      `<div class="card mb-2"><div class="card-body">
        <p><strong>${q.id} : ${q.question}:</strong></p>
        <p>Your Answer: ${q.yourAnswer}</p>
        <p>Correct Answer: ${q.correctAnswer}</p>
      </div></div>`)
      .join('') +
    `<button class="result btn btn-primary mt-2 w-100 w-md-auto float-md-end" onclick="print1()" id="btn2">Download Result</button>`;

  // Add Answer Status
  const card = document.querySelectorAll('.card');
  summary.forEach((q, index) => {
    if (index < card.length) {
      if (q.yourAnswer === q.correctAnswer) {
        card[index].classList.add('correct');
      }
      else if (q.yourAnswer === "Not Answered") {
        card[index].classList.add('not-answered');
      }
      else {
        card[index].classList.add('wrong');
      }
    }
  });

};


