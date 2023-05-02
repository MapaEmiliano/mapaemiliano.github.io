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

  var userData = {};

  //Check current page (CAN BE REMOVED!!!!!!!!!!!!!)
  window.onload = function pageChecker(){
    
    let curPage = location.pathname;

    if(curPage == "/index.html" || curPage == "/") {

      const loginBtn = document.getElementById("loginBtn");
      const inputs = document.querySelectorAll("input");

      inputs.forEach(input => {
        input.addEventListener("keyup", handler);
      })

      loginBtn.addEventListener("click", handler); 
      loginBtn.addEventListener("keyup", handler); 

      function handler(e) {
        
        if ((e.type === 'keyup' && e.which === 13) || e.type == 'click') {

          login();
        }
    
    }

    } else if (curPage == "/pages/signup.html") {

        const signUp = document.getElementById("createAcc");
        signUp.addEventListener("click", handler);
        const inputs = document.querySelectorAll("input");

        inputs.forEach(input => {
          input.addEventListener("keyup", handler);
        })

        function handler(e) {
        
          if ((e.type === 'keyup' && e.which === 13) || e.type == 'click') {
            register();
          }
      
      }
    
    } else { //User is logged in

      $(document).ready(function () {
      inactivityTime();
      auth.onAuthStateChanged(user => {
        
        if(user) {

          let annFrame = document.getElementById("announceFrame");
          function sendRole(func, role) {
            annFrame.contentWindow.postMessage(func + role); //vtName not set yet
          }
  
          let data = ref(getDatabase(app));
          get(child(data, `users/${user.uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
              
              const notifButton = document.getElementById("show-notif-btn");
              notifButton.addEventListener("click", () => {
              
                const notifPanel = document.getElementById("notifCont");
                notifPanel.innerHTML = "";
            
                sendRole("Notif ", user.uid);
            
              });
            
              const notifBell = get(child(data, `users/${user.uid}/Notifications`)).then(
                (snapshotBell) => {
            
                  if(snapshotBell.exists()) {
                    const notifBell = document.getElementById("notifCount");
                    let notifCount = Object.keys(snapshotBell.val()).length;
                    notifBell.innerHTML = notifCount;
                    const data = snapshot.val();
            
                    for (const key in data) {
            
                      if (data[key].read == true) {
                        notifCount--;
                        
                        if (notifCount == 0) {
                          notifBell.style.display = "none";
                          console.log("empty");
                        } else {
                          notifBell.innerHTML = notifCount;
                          notifBell.style.display = "block";
                        }
                        
                      }
                    }
            
                  } else {
                    
                    get(child(data, `AnnouncementCont`)).then((snapshotBell) => {
            
                      if(snapshotBell.exists()) {
                        const data = snapshotBell.val();
                        for (const key in data) {
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
                
                sendRole("Display ", snapshot.val().Role + " " + user.uid);

            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });

          if(window.location.pathname == "/pages/home.html") {
            const logoutBtn = document.getElementById("signOut");
    
          logoutBtn.addEventListener("click", (e) => {

            auth.signOut(auth).then(() => {
              // Sign-out successful
              console.log("User has been logged out!");
              window.location = '../';
            }).catch((error) => {
              // An error happened.
            });
            
          }); 
          }

        } else {

          alert("User is not logged in!");
          window.location = '../';

        }
      });
    });
  } 
}

    const email = document.getElementById('email');
    const username = document.getElementById('usrName');
    const password = document.getElementById('password');
    const passConf = document.getElementById('passConf');
  
  //Creating user accounts
  function register() {

      if(!inputChecker()) {
        return ;
      }
        
        createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;

        alert("Your account has been created!");
        
        set(ref(database, 'users/' + user.uid), {
            username: username.value,
            email: email.value,
            LastLogin: Date.now(),
            Role: "User",
            newUser: true
        }).then(() => {
          updateProfile(auth.currentUser, { displayName: username.value, 
            Role: "User", newUser: true })
            .then(() => {
              // Update successful
              window.location = '../pages/home.html'
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

  function inputChecker() {
    let validEmail = /^[a-z0-9._%+-]+@(gmail|yahoo|outlook)\.com$/;
    let validPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if(!validEmail.test(email.value)) {

      alert("Please enter a valid email address!");
      email.focus();
      return false;

    }

    if(username.value == "") {
        
        alert("Please enter a username!");
        username.focus();
        return false;
  
      }

    if(!validPass.test(password.value)) {
        
        alert("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number!");
        password.focus();
        return false;
  
      }

    if(password.value != passConf.value) {
      
      alert("Passwords do not match!");
      passConf.focus();
      return false;

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
    update(ref(database, 'users/' + user.uid), {
        LastLogin: Date.now()
    })

    auth.onAuthStateChanged(user => {
      if(user) {
        window.location = '/pages/home.html'; //After successful login, user will be redirected to home.html
      }
    });
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
  });

  }

  var inactivityTime = function () {
    var time;

    document.body.addEventListener('touchstart', function(e){
      resetTimer();
    });
    document.body.addEventListener('touchpress', function(e){
      resetTimer();
    });
    
    document.body.addEventListener('mousemove', function(e){
      resetTimer();
    });
    document.body.addEventListener('keypress', function(e){
      resetTimer();
    });

    function logout() {
      alert("You have been logged out due to inactivity!");
      signOut(auth).then(() => {
        // Sign-out successful.
        window.location = '../' ;
      }).catch((error) => {
        // An error happened.
      });
    }

    function resetTimer() {
        clearTimeout(time);
        time = setTimeout(logout, 1000 * 300) // 1000 * 300 = 5 minutes
    }
};
  


  export { database, orderByKey, auth, userData, set, query, limitToLast, app, getDatabase, child, ref, get, remove, push, update };