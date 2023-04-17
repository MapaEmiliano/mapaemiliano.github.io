  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
  import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
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

  //Check current page (CAN BE REMOVED!!!!!!!!!!!!!)
  window.onload = function pageChecker(){
    
    let curPage = location.pathname;
    console.log(curPage)

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
          console.log(e.type)
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

      auth.onAuthStateChanged(user => {

        if(user) {

          // console.log(auth.currentUser.displayName) Get username of user

            window.setTimeout(function () {
              signOut(auth).then(() => {
                // Sign-out successful.
                alert("You have been logged out due to inactivity!");
                window.location = '../' ;
              }).catch((error) => {
                // An error happened.
              });
                
            }, 1000 * 300); // 1000 * 60 * 5 = 5 minutes   

          const logoutBtn = document.getElementById("signOut");
    
          logoutBtn.addEventListener("click", (e) => {

            signOut(auth).then(() => {
              // Sign-out successful.
              window.location = '../';
            }).catch((error) => {
              // An error happened.
            });
            
          }); 

        } else {

          console.log("User is not logged in!");
          // window.location = '../';

        }
      });
    });
  } 
}

  //Creating user accounts
  function register() {

    let email = document.getElementById('email');
    let username = document.getElementById('usrName');
    let password = document.getElementById('password');
    let passConf = document.getElementById('passConf');

    if (password.value == passConf.value && email.value.includes("@")) {

        createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;

        alert("Your account has been created!");

        set(ref(database, 'users/' + user.uid), {
            username: username.value,
            email: email.value,
            LastLogin: Date.now()
        })

        updateProfile(auth.currentUser, { displayName: username.value })

        window.location = '../pages/home.html';
        // ...
        })
        .catch((error) => {
          const errorMessage = error.message;
          alert(errorMessage);
        // ..
        });  

    } else {
        alert('An input is incorrect! Check if the passwords are the same or if the email is valid!');
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
    set(ref(database, 'users/' + user.uid), {
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