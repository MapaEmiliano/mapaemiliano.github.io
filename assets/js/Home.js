// LOCATE
const links = document.querySelectorAll(".locate");
const pin = document.querySelectorAll(".pin");

  // loop through each link element
  for (let i = 0; i < links.length; i++) {
    // add a click event listener to the link 
    links[i].addEventListener("click", function(e) {
        e.preventDefault(); // prevent the link from redirecting 
      
      // loop through each pin element
      for (let j = 0; j < pin.length; j++) {
        // check if the index of the link matches the index of the pin
        if (i === j) {
          // if it does, toggle the display of the result and the "active" class of the link
          if (links[i].classList.contains("active")) {
            pin[j].style.display = "none";
            links[i].classList.remove("active");
          } else {
            pin[j].style.display = "block";
            links[i].classList.add("active");
          }
        } else {
          // if it doesn't, hide the result and remove the "active" class of the link
          pin[j].style.display = "none";
          links[j].classList.remove("active");
        }
      }
    });
  }

// Navigation building 5
function anim (but) {
    but.style.stroke = ('#cc0000');
    but.classList.toggle("animate");;
    }

   
    const navigate = document.querySelectorAll(".navigateBtn");
    const route =  document.querySelectorAll(".path");
  
    // loop through each link elementroute
    for (let i = 0; i < navigate.length; i++) {
      
      // add a click event listener to the link 
      navigate[i].addEventListener("click", function(e) {
          e.preventDefault(); // prevent the link from redirecting
          

        // loop through each result element
        for (let j = 0; j < route.length; j++) {
          // check if the index of the link matches the index of the result
          if (i === j) {
            
            
            // if it does, toggle the display of the result and the "active" class of the link
            if (navigate[i].classList.contains("active")) {
              route[j].style.visibility = "hidden";
              navigate[i].classList.remove("active");
              route[j].classList.remove("animate");

              
  
            } else {
              route[j].style.visibility = "visible";
              route[j].classList.toggle("animate");
              navigate[i].classList.add("active");
            }
          }

     
          else {
            // if it doesn't, hide the result and remove the "active" class of the link
            route[j].style.visibility = "hidden";
            navigate[j].classList.remove("active");
            route[j].classList.remove("animate");
          } 
        }
      });
    }


  
    
  
    
    