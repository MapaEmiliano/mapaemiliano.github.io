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

