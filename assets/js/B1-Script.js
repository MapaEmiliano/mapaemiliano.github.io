// LOCATE
const links = document.querySelectorAll(".locate");
const pin = document.querySelectorAll(".pin");

for (let i = 0; i < links.length; i++) {
  links[i].addEventListener("click", function(e) {
    e.preventDefault();
    for (let j = 0; j < pin.length; j++) {
      if (i === j) {
        if (links[i].classList.contains("active")) {
          pin[j].style.display = "none";
          pin[j].setAttribute("tabindex", "-1");
          links[i].classList.remove("active");
        } else {
          pin[j].style.display = "block";
          pin[j].setAttribute("tabindex", "0");
          pin[j].focus();
          links[i].classList.add("active");
        }
      } else {
        pin[j].style.display = "none";
        pin[j].setAttribute("tabindex", "-1");
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
      
      // Stop any ongoing speech synthesis when the page is refreshed or closed
      let synth = window.speechSynthesis;
      let utterance = new SpeechSynthesisUtterance();
      function speak(text) {
        utterance.text = text;
        synth.speak(utterance);
      }
      window.addEventListener('unload', () => synth.cancel());
    
    }


  
    // const navigate = document.querySelectorAll(".navigateBtn");
    // const route =  document.querySelectorAll(".path");
  
    // // loop through each link elementroute
    // for (let i = 0; i < navigate.length; i++) {
      
    //   // add a click event listener to the link 
    //   navigate[i].addEventListener("click", function(e) {
    //       e.preventDefault(); // prevent the link from redirecting
          

    //     // loop through each result element
    //     for (let j = 0; j < route.length; j++) {
    //       // check if the index of the link matches the index of the result
    //       if (i === j) {
            
            
    //         // if it does, toggle the display of the result and the "active" class of the link
    //         if (navigate[i].classList.contains("active")) {

    //           console.log(route[i]);

    //           route[j].style.visibility = "hidden";
    //           navigate[i].classList.remove("active");
    //           route[j].classList.remove("animate");
    //           window.speechSynthesis.cancel()
              
  
    //         } else {
    //           route[j].style.visibility = "visible";
    //           route[j].classList.toggle("animate");
    //           navigate[i].classList.add("active");
    //           window.speechSynthesis.cancel()

    //           // if (j===0){
    //           // speak("From the Building 5 entrance, go to Lobby 3 and the 1st room is the Radiologic Technology Laboratory.");
    //           // }
    //           // else if (j===1){
    //           //   speak("From the Building 5 entrance, go to lobby 3 and the 2nd room is the Nutrition Laboratory");
    //           // }
    //           // else if (j===2){
    //           //   speak("From the Building 5 entrance, go to lobby 3 and the 3rd room is the Biology Laboratory");
    //           // }
    //           // else if (j===3){
    //           //   speak("From the Building 5 entrance, go to lobby 3 and the 4th room is the Zoology Laboratory");
    //           // }
    //           // else if (j===4){
    //           //   speak("From the Building 5 entrance, go to lobby 3 and the 5th room is the chemistry Laboratory");
    //           // }
    //           // else if (j===5){
    //           //   speak("From the Building 5 entrance, go to lobby 3 and  the 6th room is the Physics Laboratory");
    //           // }
    //           // else if (j===6){
    //           //   speak("From the Building 5 entrance, go to 2nd floor. The 5th room in your right side is the Room 5201");
    //           // }
    //           // else if (j===7){
    //           //   speak("From the Building 5 entrance, go to 2nd floor. The 5th room in your left side is the Room 5202");
    //           // }
    //           // else if (j===8){
    //           //   speak("From the Building 5 entrance, go to 2nd floor. The 4th room in your right side is the Room 5203");
    //           // }
    //           // else if (j===9){
    //           //   speak("From the Building 5 entrance, go to 2nd floor. The 4th room in your left side is the Room 5204");
    //           // }
    //           // else if (j===10){
    //           //   speak("From the Building 5 entrance, go to 2nd floor. The 3rd room in your right side is the Room 5205");
    //           // }
    //           // else if (j===11){
    //           //   speak("From the Building 5 entrance, go to 2nd floor. The 3rd room in your left side is the Room 5206");
    //           // }
    //           // else if (j===12){
    //           //   speak("From the Building 5 entrance, go to 2nd floor. The 2nd room in your right side is the Room 5207");
    //           // }
    //           // else if (j===13){
    //           //   speak("From the Building 5 entrance, go to 2nd floor. The 2nd room in your left side is the Room 5208");
    //           // }
    //           // else if (j===14){
    //           //   speak("From the Building 5 entrance, go to 2nd floor. The 1st room in your right side is the Room 5209");
    //           // }
    //           // else if (j===15){
    //           //   speak("From the Building 5 entrance, go to 2nd floor. The 1st room in your left side is the Room 5210");
    //           // }
  
    //           // Hide all elements by default
    //           second.style.visibility = 'hidden';
    //           third.style.visibility = 'hidden';
    //           fourth.style.visibility = 'hidden';
    //           fifth.style.visibility = 'hidden';

    //           // Check which classes are present in the route element
    //           if (route[j].classList.contains('second')) {
    //             second.style.visibility = 'visible';
    //           }

    //           if (route[j].classList.contains('third')) {
    //             second.style.visibility = 'visible';
    //             third.style.visibility = 'visible';
    //           }

    //           if (route[j].classList.contains('fourth')) {
    //             second.style.visibility = 'visible';
    //             third.style.visibility = 'visible';
    //             fourth.style.visibility = 'visible';
    //           }

    //           if (route[j].classList.contains('fifth')) {
    //             second.style.visibility = 'visible';
    //             third.style.visibility = 'visible';
    //             fourth.style.visibility = 'visible';
    //             fifth.style.visibility = 'visible';
    //           }

    //         }  
    //       }
     
    //       else {
    //         // if it doesn't, hide the result and remove the "active" class of the link
    //         route[j].style.visibility = "hidden";
    //         navigate[j].classList.remove("active");
    //         route[j].classList.remove("animate");
    //       } 
    //     }
    //   });
    // }


  
    
  
    
    