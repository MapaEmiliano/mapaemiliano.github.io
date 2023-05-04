  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
  import { getDatabase, set, child, query, orderByKey, limitToLast, ref, get, remove, push, update} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCapXE73R8f0zJammjBV3L1Or_Fac9KJFw",
    authDomain: "mapaemiliano-31b83.firebaseapp.com",
    databaseURL: "https://mapaemiliano-31b83-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mapaemiliano-31b83",
    storageBucket: "mapaemiliano-31b83.appspot.com",
    messagingSenderId: "577352319313",
    appId: "1:577352319313:web:7f05f521959ad5d09d1370"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth();

  //Check current page and run functions
  window.onload = function pageChecker(){

    let curPage = location.pathname; //get current page 

    if(curPage == "/index.html" || curPage == "/") { //User is not logged in and is in login page

      const loginBtn = document.getElementById("loginBtn"); //get login button
      const inputs = document.querySelectorAll("input"); //get all inputs

      inputs.forEach(input => { //add event listener to all inputs
        input.addEventListener("keyup", handler);
      })

      loginBtn.addEventListener("click", handler);  //add click event to login button
      loginBtn.addEventListener("keyup", handler);  //add enter key event to login button

      function handler(e) { //function to check if enter key or click is pressed
        
        if ((e.type === 'keyup' && e.which === 13) || e.type == 'click') { //if enter key or click is pressed

          login();
        }
    
    }

    } else if (curPage == "/pages/signup.html") { //User is not logged in and is in signup page

        const signUp = document.getElementById("createAcc"); //get signup button
        signUp.addEventListener("click", handler); //add click event to signup button
        const inputs = document.querySelectorAll("input"); //get all inputs
 
        inputs.forEach(input => { //add event listener to all inputs
          input.addEventListener("keyup", handler);
        })

        function handler(e) { //function to check if enter key or click is pressed
        
          if ((e.type === 'keyup' && e.which === 13) || e.type == 'click') { //if enter key or click is pressed
            register();
            
          }
      
      }
    
    } else { //User is logged in

      $(document).ready(function () { //run functions when document is ready
      inactivityTime(); //check for inactivity
      auth.onAuthStateChanged(user => { //check if user is logged in
        
        if(user) { //if user is logged in

          let annFrame = document.getElementById("announceFrame"); //get iframe element for announcements
          function sendRole(func, role) { //function to send role to iframe
            annFrame.contentWindow.postMessage(func + role); //send role to iframe
          }
  
          let data = ref(getDatabase(app)); //get database

          get(child(data, `users/${user.uid}`)).then((snapshot) => { //get user data from database
            if (snapshot.exists()) {  //if user data exists

              if(snapshot.val().newUser == true) { //if user is new, show tutorial modal
                
                const tutoModal = document.getElementById("demo-modal")
                const modalCreate = new bootstrap.Modal(document.getElementById("demo-modal"), {
                  keyboard: true,
                });

                modalCreate.show();
                tutoModal.addEventListener("hidden.bs.modal", () => {

                  update(ref(getDatabase(app), `users/${user.uid}`), {
                    newUser: false
                  }).then(() => {
                    console.log("New user set to false");
                    modalCreate.close();
                  });
                });

              }

              const notifButton = document.getElementById("show-notif-btn"); //get notification button
              notifButton.addEventListener("click", () => { //add click event to notification button
              
                const notifPanel = document.getElementById("notifCont"); //get notification panel
                notifPanel.innerHTML = ""; //clear notification panel
            
                sendRole("Notif ", user.uid); //send role to iframe
            
              });
            
              const notifBell = get(child(data, `users/${user.uid}/Notifications`)).then( //get notification count
                (snapshotBell) => {
            
                  if(snapshotBell.exists()) {
                    const notifBell = document.getElementById("notifCount"); //get notification count element
                    let notifCount = Object.keys(snapshotBell.val()).length; //get notification count length and set to variable
                    notifBell.innerHTML = notifCount; 
                    const data = snapshot.val().Notifications; //get notification data
            
                    for (const key in data) { //loop through notification data
                      if (data[key].read == true) { //if notification is read, remove from notification count
                        notifCount--;
                        
                        if (notifCount < 1) { //if notification count is 0, hide notification count
                          notifBell.style.display = "none";
                          console.log("empty");
                        } else {
                          notifBell.innerHTML = notifCount;
                          notifBell.style.display = "block";
                        }
                        
                      }
                      
                    }              
            
                  } else { //if notification data does not exist, add notification data
                    
                    get(child(data, `AnnouncementCont`)).then((snapshotBell) => { //get announcement data
            
                      if(snapshotBell.exists()) {
                        const data = snapshotBell.val(); 
                        for (const key in data) { //loop through announcement data and add to notification data
                          update(ref(getDatabase(app), `users/${user.uid}/Notifications/${key}`), {
                            key: key,
                            read: false
                          }).then(() => {
                            window.location.reload();
                          });
                        }
                      }
                      
                    });
            
                  }

                });
                
                sendRole("Display ", snapshot.val().Role + " " + user.uid); //send role to iframe

            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });

          if(window.location.pathname == "/pages/home.html") { //if user is in home page
            const logoutBtn = document.getElementById("signOut"); //get logout button and add click event
    
          logoutBtn.addEventListener("click", (e) => { //add click event to logout button that will sign out user

            auth.signOut(auth).then(() => {
              // Sign-out successful
              console.log("User has been logged out!");
              window.location = '../';
            }).catch((error) => {
              // An error happened.
            });
            
          }); 
          }

        } else { //if user is not logged in, redirect to login page

          alert("User is not logged in!");
          window.location = '../';

        }
      });
    });
  } 
}

    const email = document.getElementById('email'); //get email input
    const username = document.getElementById('usrName'); //get username input
    const password = document.getElementById('password'); //get password input
    const passConf = document.getElementById('passConf'); //get password confirmation input
  
  //Creating user accounts
  function register() { 
    
      if(!inputChecker()) { //check if inputs are correct 
        return;
      } else {
        createUserWithEmailAndPassword(auth, email.value, password.value) //create user with email and password
        .then((userCredential) => {
        // Signed in 
        const user = userCredential.user; //get user data

        alert("Your account has been created!");
        
        set(ref(database, 'users/' + user.uid), { //add user data to database
            username: username.value,
            email: email.value,
            LastLogin: new Date().toLocaleDateString(),
            Role: "User",
            newUser: true
        }).then(() => {
          updateProfile(auth.currentUser, { displayName: username.value, 
            Role: "User", newUser: true }) //update user profile
            .then(() => {
              // Update successful
              window.location = '../pages/home.html' //redirect to home page
            })
            .catch((error) => {
              // An error occurred

            });
        }).catch((error) => {
          // An error occurred
        });
        // ...
        })
        .catch((error) => {
          const errorMessage = error.message;
          alert(errorMessage);
        // ..
        });  
      }

  }

  function inputChecker() { //check if inputs are correct
    let validEmail = /^[a-z0-9._%+-]+@(gmail|yahoo|outlook)\.com$/; // email regex
    let validPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; // password regex

    if(!validEmail.test(email.value)) { //check if email is valid

      alert("Please enter a valid email address!");
      email.focus();
      return false;

    } else if(username.value == "") { //check if username is empty 
        
        alert("Please enter a username!");
        username.focus();
        return false;
  
      } else if(!validPass.test(password.value)) { //check if password is valid
        
        alert("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number!");
        password.focus();
        return false;
  
       } else if(password.value != passConf.value) { //check if password and password confirmation match
      
      alert("Passwords do not match!");
      passConf.focus();
      return false;

    } else { //if all inputs are correct, return true

      return true;

    }

  }

  //Logging in 
  function login() {

    let email = document.getElementById('email');
    let password = document.getElementById('password');

    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;

    update(ref(database, 'users/' + user.uid), { //update user data
        LastLogin: new Date().toLocaleDateString(),
    }).then(() => {
      auth.onAuthStateChanged(user => {
        if(user) {
          window.location = '/pages/home.html'; //After successful login, user will be redirected to home.html
        }
      });
    }).catch((error) => {
      // An error occurred
    });

    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
  });

  }

  var inactivityTime = function () { //check if user is inactive for 5 minutes
    var time;

    document.body.addEventListener('touchstart', function(e){ // if the user touches the screen or presses a key, reset the inactivity timer
      resetTimer();
    });
    document.body.addEventListener('touchpress', function(e){ // if the user touches the screen or presses a key, reset the inactivity timer
      resetTimer();
    });
    
    document.body.addEventListener('mousemove', function(e){ // if the user moves the mouse, reset the inactivity timer
      resetTimer();
    });
    document.body.addEventListener('keypress', function(e){ // if the user presses a key, reset the inactivity timer
      resetTimer();
    });

    function logout() { //if user is inactive for 5 minutes, sign out user
      alert("You have been logged out due to inactivity!");
      signOut(auth).then(() => {
        // Sign-out successful.
        window.location = '../' ;
      }).catch((error) => {
        // An error happened.
      });
    }

    function resetTimer() { //reset timer
        clearTimeout(time);
        time = setTimeout(logout, 1000 * 300) // 1000 * 300 = 5 minutes
    }
};
  