  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
  import { getDatabase, set, child, ref, get, update, remove} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
  import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
  import {
    getStorage,
    ref as sRef,
    uploadBytesResumable, 
    getDownloadURL,
    deleteObject,
  } from "https://cdnjs.cloudflare.com/ajax/libs/firebase/9.17.2/firebase-storage.min.js";

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

  let curPage = window.location.pathname; //get current page 
  let timer;
  if(curPage == "/pages/home.html") { //if current page is home page
      let countDown = 0; //set countdown to 0
      console.log(countDown);
      timer = setInterval(() => { //set interval to check for inactivity
        countDown++; //increase countdown by 1
        console.log(countDown);
        if(countDown == 60) { //if countdown reaches 60 seconds
          window.location.reload(); //reload page
        }
      }, 1000);
  }

  //Check current page and run functions
  window.onload = function pageChecker(){
    
    if(curPage == "/index.html" || curPage == "/") { //User is not logged in and is in login page

      const showPass = document.getElementById('passToggle');
      const password = document.getElementById('password');
      
      showPass.addEventListener("click", function(){
        this.classList.toggle("fa-eye-slash")
        const type = password.getAttribute("type") === "password" ? "text" : "password"
        password.setAttribute("type", type)
      })

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

      const forgotPass = document.getElementById("forgotPass"); //get forgot password button
      forgotPass.addEventListener("click", (e) => { //add click event to forgot password button
        
        e.preventDefault(); //prevent default action
        const resetPassEmail = prompt("Enter your email address to reset your password"); //prompt user to enter email address
        if(resetPassEmail != null) { //if user entered an email address
          sendPasswordResetEmail(auth, resetPassEmail) //send password reset email
          .then(() => {
            alert("Password reset email sent!");
          }).catch((error) => {
            alert(error.message);
          });
        } else { //if user did not enter an email address
          alert("Please enter your email address to reset your password");
        }

      })
      
    } else if (curPage == "/pages/signup.html") { //User is not logged in and is in signup page

      let showPass = document.getElementById('passToggle');
      let password = document.getElementById('password');
      let passConf = document.getElementById('passConf');

      showPass.addEventListener("click", function(){
        this.classList.toggle("fa-eye-slash")
        const type = password.getAttribute("type") === "password" ? "text" : "password"
        password.setAttribute("type", type), passConf.setAttribute("type", type)
      })

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
   
      inactivityTime(); //check for inactivity
      let blocker = document.getElementById("blocker"); //get blocker element
      let loading = document.getElementById("loading"); //get loading element

      auth.onAuthStateChanged(user => { //check if user is logged in
        
        if(user) { //if user is logged in
 
          let annFrame = document.getElementById("announceFrame"); //get iframe element for announcements
          function sendRole(func, role) { //function to send role to iframe
            annFrame.contentWindow.postMessage(func + role); //send role to iframe
          }
  
          let data = ref(getDatabase(app)); //get database

          get(child(data, `users/${user.uid}`)).then((snapshot) => { //get user data from database
            
            if (snapshot.exists()) {  //if user data exists
              blocker.style.display = "none"; //hide blocker
              loading.style.display = "none"; //hide loading
              clearInterval(timer); //clear countdown
              displayProfile();

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
                    modalCreate.hide();
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
            newUser: true,
            profilePic: "https://firebasestorage.googleapis.com/v0/b/mapaemiliano-31b83.appspot.com/o/ProfilePics%2Fuser.png?alt=media&token=4db67858-baa5-4a38-b922-2c4122eacd72"
        }).then(() => {

          updateProfile(auth.currentUser, { displayName: username.value, 
            Role: "User", newUser: true }) //update user profile
            .then(() => {
              // Update successful
              console.log("User profile updated!");
              // window.location = '../pages/home.html' //redirect to home page
              sendEmailVerification(auth.currentUser).then(() => {
                // Email verification sent!
                alert("Email verification sent! Make sure to verify first before logging in!");
                window.location = '../'; //redirect to login page
              });

              
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
        
        alert("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number! Do not use special characters!");
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
          if(user.emailVerified || email.value.includes("adminMapa")) { //check if user has verified their email
            console.log("User has logged in!");
            window.location = '../pages/home.html'; //redirect to home page
          } else {
            alert("Please verify your email first!");
            const choice = confirm("Did not receive an email? Click OK to resend verification email!");
            if(choice) {
              sendEmailVerification(auth.currentUser).then(() => {
                // Email verification sent!
                alert("Email verification sent! Verify and login again!");
                signOut(auth).then(() => {
                window.location = '../'; //redirect to login page
                }).catch((error) => {
                  // An error happened.
                });
              });   
            } 
          }
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
  
function editAccount() {
  const newUsername = document.getElementById("newUserName").value; // Display a prompt dialog to enter the new username
  const user = auth.currentUser;

  if (newUsername !== null && newUsername.trim() !== "") {
    // If the user entered a new username and it's not empty    
    // Update the username in the authentication profile
    updateProfile(user, { displayName: newUsername })
      .then(() => {
        // Update successful
        update(ref(getDatabase(app), `users/${user.uid}`), { username: newUsername}).then(() => {
          const usernameLabel = profileModal.querySelector("p:first-of-type");
          usernameLabel.textContent = "Username: " + newUsername;
          alert("Username updated successfully!");

          const editProfileModal = document.getElementById("editProfile");
          const bootstrapModal = bootstrap.Modal.getInstance(editProfileModal);

          const imgInput = document.getElementById("newProfPic");
          if (imgInput.files[0] != null) {
            console.log("file exists");
        
            const uploadFiles = async (file) => {
              
              console.log("uploading");
              
              const metadata = {
                contentType: "image/jpeg",
              };
        
              const storageRef = sRef(
                getStorage(app),
                `ProfilePics/${user.uid}`
              );
        
              const uploadTask = uploadBytesResumable(
                storageRef,
                file.files[0],
                metadata
              );
        
              uploadTask.on(
                "state_changed",
                null,
                (error) => {
                  alert(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then((URL) => {
                    console.log(URL);
        
                    update(ref(getDatabase(app), `users/${user.uid}`), { profilePic: URL}).then(() => {
                      window.location.reload();
                      console.log("Profile picture updated successfully!");
                    });
                    
                  });
                }
              );
            };
        
            uploadFiles(imgInput);
          } else {
            bootstrapModal.hide();
            window.location.reload();
          }      
        });

      })
      .catch((error) => {
        // An error occurred
        alert("Failed to update the username. Please try again later.");
      });
  } else {
    const imgInput = document.getElementById("newProfPic");
    if (imgInput.files[0] != null) {
      console.log("file exists");
  
      const uploadFiles = async (file) => {
        
        console.log("uploading");
        
        const metadata = {
          contentType: "image/jpeg",
        };
  
        const storageRef = sRef(
          getStorage(app),
          `ProfilePics/${user.uid}`
        );
  
        const uploadTask = uploadBytesResumable(
          storageRef,
          file.files[0],
          metadata
        );
  
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            alert(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((URL) => {
              console.log(URL);
  
              update(ref(getDatabase(app), `users/${user.uid}`), { profilePic: URL}).then(() => {
                window.location.reload();
                console.log("Profile picture updated successfully!");
              });
              
            });
          }
        );
      };
  
      uploadFiles(imgInput);
    }
  }

}
  
function deleteAccount() {
  const user = auth.currentUser;

  // Delete user data from the database
  remove(ref(database, 'users/' + user.uid))
    .then(() => {
      // Delete the user
      user.delete()
        .then(() => {
          // User deleted successfully
          window.location = '../'; // Redirect to the login page
        })
        .catch((error) => {
          // An error occurred while deleting the user
          console.error(error);
        });
    })
    .catch((error) => {
      // An error occurred while deleting user data from the database
      console.error(error);
    });
}
  
function displayProfile() {
  const profileTitle = document.getElementById("Profile");
  const saveBtn = document.getElementById("saveBtn");
  const delBtn = document.getElementById("delBtn");
  const profileCont = document.querySelector(".ProfileCont");
  const imgCont = document.querySelector(".profilePic");
  const imgIcon = document.querySelector('.profileIcon');

  auth.onAuthStateChanged(user => {
    if (user) {
      const username = user.displayName;
      const email = user.email;
     
      const usernamePlaceholder = document.getElementById("usernamePlaceholder");
      usernamePlaceholder.textContent = username;
      profileTitle.textContent = "Profile";

      // Create elements to display the profile information
      const usernameLabel = document.createElement("p");
      const emailLabel = document.createElement("p");

      usernameLabel.textContent = "Username: " + username;
      emailLabel.textContent = "Email: " + email;

      profileCont.innerHTML = ""; // Clear previous content
      imgCont.innerHTML = ""; // Clear previous content

      // Create and set the profile picture
      const profilePic = document.createElement("img");
      const IconprofilePic = document.createElement("img");

      get(ref(database, 'users/' + user.uid + '/profilePic')).then((snapshot) => {
        profilePic.src = snapshot.val(); // Replace with the actual profile picture source
        IconprofilePic.src = snapshot.val(); 
      }).catch((error) => { console.error(error); });

      profilePic.alt = "Profile Picture";
      profilePic.classList.add("img-fluid", "profilePicStyle");
      IconprofilePic.classList.add("profileIcon");

      imgIcon.appendChild(IconprofilePic);
      imgCont.appendChild(profilePic);
      profileCont.appendChild(usernameLabel);
      profileCont.appendChild(emailLabel);

      // Add event listeners to the buttons
      saveBtn.addEventListener("click", () => {
        editAccount();
      });

      delBtn.addEventListener("click", () => {
        // Display an alert dialog
        const confirmed = window.confirm("Are you sure you want to delete your account?");
      
        // Check the user's response
        if (confirmed) {
          deleteAccount(); // Call the deleteAccount() function
        } else {
          // Do nothing or handle the "no" response
        }
      });
    }
  });
}