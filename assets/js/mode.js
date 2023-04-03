const btns = document.querySelectorAll("#show-btn");
const results = document.querySelectorAll(".embed-responsive");
for (let i = 0; i < btns.length; i++) {
  
  btns[i].addEventListener("click", function(e) {
      e.preventDefault(); 
    
    for (let j = 0; j < results.length; j++) {
      
      if (i === j) {
        
        if (btns[i].classList.contains("active")) {
          results[j].style.display = "none";
          btns[i].classList.remove("active");
        } else {
          results[j].style.display = "block";
          btns[i].classList.add("active");
        }
      } else {
        results[j].style.display = "none";
        btns[j].classList.remove("active");

      }
    }
  });
}