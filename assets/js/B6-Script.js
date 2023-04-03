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

// Navigation building 6
function anim (but) {
    but.style.stroke = ('#cc0000');
    but.classList.toggle("animate");;
    }
    
  
    const navigate = document.querySelectorAll(".navigateBtn");
    const butoneez = [ route = document.querySelectorAll(".path")];
  
    // loop through each link elementroute
    for (let i = 0; i < navigate.length; i++) {
      
      // add a click event listener to the link 
      navigate[i].addEventListener("click", function(e) {
          e.preventDefault(); // prevent the link from redirecting
    
        // loop through each result element
        for (let j = 0; j < route.length; j++) {
          // check if the index of the link matches the index of the result
          if (i === j) {
            
            function speak(message, voiceName) {
              const msg = new SpeechSynthesisUtterance();
              msg.text = message;
              const voices = window.speechSynthesis.getVoices();
              const voice = voices[1];
              msg.voice = voice;
              msg.pitch = 10;
            
              const volumeBtn = document.getElementById('volume-btn');
              const volumeIcon = volumeBtn.querySelector('i');
            
              // check if the volume button is active
              
              if (volumeBtn.classList.contains('active')) {
                // if it is, speak the message
                speechSynthesis.speak(msg);
              } else {
                // if it isn't, cancel any current speech
                speechSynthesis.cancel();
              }
            
              // add an event listener to the volume button
              volumeBtn.addEventListener('click', () => {
                if (volumeBtn.classList.contains('active')) {
                  // if the button is currently active, deactivate it and cancel any speech
                  volumeBtn.classList.remove('active');
                  volumeIcon.classList.replace('fa-volume-high', 'fa-volume-mute');
                  speechSynthesis.cancel();
                } else {
                  // if the button is currently inactive, activate it and speak the message if there isn't already a speech in progress
                  volumeBtn.classList.add('active');
                  volumeIcon.classList.replace('fa-volume-mute', 'fa-volume-high');
                  if (!speechSynthesis.speaking) {
                    speechSynthesis.speak(msg);
                  }
                }
              });
            
              
              function speak(text) {
                utterance.text = text;
                synth.speak(utterance);
              }
              
              // Stop any ongoing speech synthesis when the page is refreshed or closed
              window.addEventListener('unload', () => synth.cancel());
            }
            
  
            // if it does, toggle the display of the result and the "active" class of the link
            if (navigate[i].classList.contains("active")) {
              route[j].style.visibility = "hidden";
              navigate[i].classList.remove("active");
              route[j].classList.remove("animate");
              window.speechSynthesis.cancel()
  
            } else {
              route[j].style.visibility = "visible";
              route[j].classList.toggle("animate");
              navigate[i].classList.add("active");
              window.speechSynthesis.cancel()
  
              if (j===0){
                speak("CANTEEN is located on the ground floor of building 6 ");
              }
              else if (j===1){
                speak("Al-Fresco is located on the ground floor of building 6 ");
              }
              else if (j===2){
                speak("From the Building 6 entrance, go to the 2nd floor and you'll see the Multi-purpose Hall");
              }
  

              if (route[j].classList.contains('second')){
                stairs.style.visibility = "visible";
                }
                else{
                  stairs.style.visibility = "hidden";
                }
  
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
  
    
  
    
    