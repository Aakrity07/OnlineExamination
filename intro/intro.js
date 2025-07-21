const open = document.getElementById("open");
const model_container = document.getElementById("model_container");
const close = document.getElementById("close");

open.addEventListener("click", () => {
  model_container.classList.add("show");
  startCountdown(); // Start the countdown when modal opens
});

close.addEventListener("click", () => {
  model_container.classList.remove("show");
});

let btn=document.getElementById("close");
btn.onclick=()=>{
    window.location.href="/exam/exam.html";
}


function startCountdown() {
  const start_time = 1; // minutes
  let time = start_time * 60;
  const countdownEl = document.getElementById('countdown');

  const countdownInterval = setInterval(updateCountdown, 1000);
  
  function updateCountdown() {
    if (time <= 0) {
      clearInterval(countdownInterval);
      countdownEl.textContent = "Time's up!";
      // Redirect to the exam page after a short delay (1 second)
      setTimeout(() => {
        window.location.href = "/elgoss-online-exam-juliyat/exam/exam.html";
      }, 1000);
      return;
    }
    
    const minutes = Math.floor(time / 60);
    let seconds = time % 60; 

    seconds = seconds < 10 ? '0' + seconds : seconds; // Fixed to 10 (was 5 in your code)

    countdownEl.textContent = `${minutes}:${seconds}`;
    time--;
  }
  
  // Initial call to display immediately
  updateCountdown();
}









