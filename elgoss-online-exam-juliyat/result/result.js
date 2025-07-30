
window.onload = () => {
  const score = localStorage.getItem('score') || 0;
  document.querySelector('h1.text-primary').innerText = `${score}/100`;

  document.getElementById('viewSummary').addEventListener('click', function() {
  alert("Redirecting to summary page..."); 
   window.location.href = "/elgoss-online-exam-juliyat/summary/summary.html"; 
});

document.getElementById('logout').addEventListener('click', function() {
  alert("Logging out...");
  window.location.href = "/exam_registation_module/login.html"; 
});

 
};
