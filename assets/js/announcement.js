import { getDatabase, child, query, orderByKey, limitToLast, ref, get, remove, push, update} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
// import firebase from './firebase.js';
import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "https://cdnjs.cloudflare.com/ajax/libs/firebase/9.17.2/firebase-storage.min.js";

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

let data = ref(getDatabase(app)); // Get a reference to the database service
let user;

window.addEventListener('message', function (e) { // Listen for messages from parent window
  // Get the sent data
  const data = e.data.split(' ');
  
  if(data[0].includes("Notif")) { // If the data is a notification
    displayNotifFromDB(); // Display the notification
    user = data[1];
  } else {
    displayAnnouncementsFromDB(data[1]); // Display the announcements
    user = data[2];
  }
  
});

const db = getDatabase(); // Get a reference to the database service
 
// Save messages to Firebase Realtime Database
const saveMessages = (title, content, imgUrl) => {
  push(ref(getDatabase(app), "AnnouncementCont/"), {
    title: title,
    content: content,
    imageURL: imgUrl,
    timestamp: Date.now(),
  }).then(() => {
    console.log("Data added");
  });
};

function displayNotifFromDB(){ // Display the notifications from the database 
  let childDataNotif = [];
  get(child(data, `users/${user}/Notifications`)).then((snapshot) => {
    const data = snapshot.val();
    for(const key in data) {

      if(data[key].read == false) {
        childDataNotif.push(key);
      }

    }

  }).then(() => {
 
    for(const key in childDataNotif){ // Loop through the notifications and display them

      get(child(data, `AnnouncementCont/${childDataNotif[key]}`)).then((snapshot) => {
        const data = snapshot.val();
        displayNotif(data.key, data.title, data.content, data.timestamp, data.imageURL);
      });

    }

    childDataNotif = [];

  });

}

function displayAnnouncementsFromDB(role) { // Display the announcements from the database 
  get(child(data, `AnnouncementCont`))
    .then((snapshot) => {
      const data = snapshot.val();
      const childData = [];

      for (const key in data) {
        childData.push({ key, ...data[key] });
      }
      
      for (let i = childData.length - 1; i >= 0; i--) {
        // loop backwards (display latest announcement first)

        const { key, title, content, timestamp, imageURL } = childData[i];

        displayAnnouncement(key, title, content, timestamp, imageURL, role);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

// Listen for form submission and save announcement to Firebase Realtime Database
document
  .getElementById("announcementModal")
  .addEventListener("submit", submitForm); // Listen for form submission

// Function to submit the form and save announcements to Firebase Realtime Database
function submitForm(e) { 
  e.preventDefault(); // Prevent default form behavior
  var title = document.getElementById("title").value;
  var content = document.getElementById("content").value;
  var image = document.getElementById("image");

  const uploadFiles = (file) => { // Upload the image to Firebase Storage
    if (!file) {
      console.log("no file exists");
      return;
    }
    const metadata = {
      contentType: "image/jpeg",
    };

    const storageRef = sRef(getStorage(app), `AnnouncementImgs/${title}`); // Create a storage reference from our storage service

    const uploadTask = uploadBytesResumable( // Upload the file and metadata 
      storageRef, 
      file.files[0],
      metadata
    );
    uploadTask.on( // Listen for state changes, errors, and completion of the upload.
      "state_changed",
      null,
      (error) => {
        alert(error);
      },
      () => { // When the image has successfully uploaded, get its download URL and save it to the database
        getDownloadURL(uploadTask.snapshot.ref).then((URL) => { 
          saveMessages(title, content, URL); // Save the announcement to the database
          // Clear the form
          document.getElementById("announcement-form").reset();
          // Hide the modal
          var modal = document.getElementById("announcementModal");

          modal.style.display = "none";
          
          const recentPostsRef = query(ref(getDatabase(app), 'AnnouncementCont'), orderByKey(), limitToLast(1)); // Get the key of the announcement that was just added

          get(recentPostsRef).then((snapshot) => { // Get the key of the announcement that was just added
            if (snapshot.exists()) { 
              const data = snapshot.val(); // Get the key of the announcement that was just added
              for (const key in data) {
                update(ref(getDatabase(app), `users/${user}/Notifications/${key}`), { // Add the announcement to the user's notifications
                  key: key,
                  read: false
                }).then(() => {
                  parent.location.reload(); // Reload the page
                });
              }
            }
          });

        });
      }
    );
  };
  uploadFiles(image); // runs the function to upload the image
 
}

function displayAnnouncement(key, title, content, timestamp, imageURL, role) { // Display the announcements
  const announcements = document.getElementById("announcements");
  const createBtn = document.getElementById("createBtn");
  const userRole = // Get the user's role, if they are an admin, show the create, edit, and delete buttons
    role === "Admin"
      ? (createBtn.style.display = "block")
      : (createBtn.style.display = "none"); 

  const announcement = document.createElement("div"); // Create the announcement card
  announcement.classList.add("card", "my-3");
  announcement.setAttribute("data-key", key);

  // Add hover effect
  announcement.addEventListener("mouseover", () => {
    if (role == "Admin") {
      editButton.style.display = "inline-block";
      deleteButton.style.display = "inline-block";
    } else {
      editButton.style.display = "none";
      deleteButton.style.display = "none";
    }
  });

  announcement.addEventListener("mouseout", () => {
    editButton.style.display = "none";
    deleteButton.style.display = "none";
  });

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body", "w-100");

  // card-title to card-header
  const cardTitle = document.createElement("h5");
  cardTitle.classList.add(
    "card-header",
    "text-uppercase",
    "fw-bold",
    "text-white"
  );
  cardTitle.textContent = title;
  cardTitle.setAttribute("data-title", title);

  const cardImg = document.createElement("img");
  cardImg.classList.add("card-img-top", "w-100", "h-100");
  cardImg.setAttribute("src", imageURL);
  cardBody.appendChild(cardImg);

  const cardContent = document.createElement("p");
  cardContent.classList.add("card-text", "lead", "mx-3", "h-100", "text-black");
  cardContent.textContent = content;
  cardContent.setAttribute("data-content", content);

  const cardFooter = document.createElement("div");
  cardFooter.classList.add("card-footer", "text-muted", "lead");

  const footerText = document.createElement("small");
  footerText.classList.add("text-muted");

  // Display time since posted
  const currentTime = new Date();
  const publishTime = new Date(timestamp);
  const timeDiff = Math.abs(currentTime - publishTime);
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));
  const secondsDiff = Math.floor(timeDiff / 1000);

  let timeSincePosted = "";
  if (daysDiff > 0) {
    timeSincePosted += daysDiff + " day" + (daysDiff > 1 ? "s" : "") + " ago";
  } else if (hoursDiff > 0) {
    timeSincePosted +=
      hoursDiff + " hour" + (hoursDiff > 1 ? "s" : "") + " ago";
  } else if (minutesDiff > 0) {
    timeSincePosted +=
      minutesDiff + " minute" + (minutesDiff > 1 ? "s" : "") + " ago";
  } else {
    timeSincePosted +=
      secondsDiff + " second" + (secondsDiff > 1 ? "s" : "") + " ago";
  }

  const cardTimestamp = document.createElement("small");
  cardTimestamp.classList.add("text-muted", "mb-3");
  cardTimestamp.textContent = timeSincePosted;
  
  // Make the announcement card clickable
  announcement.addEventListener("click", (e) => {

    const announcementKey = e.target.parentElement.parentElement.getAttribute("data-key");

    const toRead = get(child(data, `users/${user}/Notifications`)).then((snapshot) => {
      
      if(snapshot.exists()) {
        
        if(snapshot.val()[announcementKey].read == false) {
          update(ref(getDatabase(app), `users/${user}/Notifications/${announcementKey}`), {
            read: true
          }).then(() => {
            console.log("Read");

            const notifCount = parent.document.getElementById("notifCount");
            if(notifCount.textContent > 0) {
              notifCount.textContent--;
              if(notifCount.textContent == 0) {
                notifCount.style.display = "none";
              }
            } else {
              console.log("No notifications");
              notifCount.style.display = "none";
            }
            });
          }

        }

    }).catch((error) => {
      console.error(error);
    });

    // Set the title and content of the View Announcement modal to the clicked announcement
    const viewAnnouncementModalTitle = document.getElementById(
      "viewAnnouncementModalLabel"
    );
    const viewAnnouncementModalContent = document.getElementById(
      "viewAnnouncementContent"
    );
    const viewModalImg = document.querySelector(".imgCont > img");
    viewModalImg.setAttribute("src", imageURL);
    viewAnnouncementModalTitle.textContent = title;
    viewAnnouncementModalContent.textContent = content;

    // Show the View Announcement modal
    const viewAnnouncementModal = new bootstrap.Modal(
      document.getElementById("viewAnnouncementModal"),
      {
        keyboard: false,
      }
    );
    viewAnnouncementModal.show();
  });

  const editButton = document.createElement("btn");
  editButton.classList.add("mx-2", "editBtn", "bi", "bi-pencil-square");
  // editButton.textContent = 'Edit';
  editButton.style.display = "none"; // Set default display to none
  editButton.addEventListener("click", (e) => {
    e.stopPropagation();
    // Populate the title and content fields in the edit-announcement-form modal with the original values
    const titleInput = document.getElementById("edit-title");
    const contentInput = document.getElementById("edit-content");
    const originalTitle = cardTitle.textContent;
    const originalContent = cardContent.getAttribute("data-content");
    titleInput.value = originalTitle;
    contentInput.value = originalContent;
    const announcementKey = e.target.closest(".card").getAttribute("data-key");

    // Show the edit-announcement-form modal
    const editAnnouncementModal = new bootstrap.Modal(
      document.getElementById("editAnnouncementModal"),
      {
        keyboard: false,
      }
    );
    editAnnouncementModal.show();

    // Modify the submit event listener for the edit-announcement-form modal to update the existing announcement
    const editAnnouncementForm = document.getElementById(
      "edit-announcement-form"
    );
    editAnnouncementForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const imgInput = document.getElementById("imageEdit");
      const newTitle = titleInput.value;
      const newContent = contentInput.value;
      let delImage;
      if (imgInput.files[0] != null) {
        console.log("file exists");

        const uploadFiles = async (file) => {
          const result = await delObject();
          const metadata = {
            contentType: "image/jpeg",
          };

          const storageRef = sRef(
            getStorage(app),
            `AnnouncementImgs/${newTitle}`
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
                cardTitle.setAttribute("data-title", newTitle);
                setTimeout(function () {
                  updatePost(newTitle, newContent, announcementKey, URL);
                  parent.location.reload();
                }, 1000);
              });
            }
          );
        };

        const delObject = () => { // Delete the old image
          if (!newTitle == cardTitle.getAttribute("data-title")) {
            delImage = sRef(getStorage(app), `AnnouncementImgs/${newTitle}`);
          } else {
            delImage = sRef(
              getStorage(app),
              `AnnouncementImgs/${cardTitle.getAttribute("data-title")}`
            );
          }

          deleteObject(delImage)
            .then(() => {
            })
            .catch((error) => {
              // Uh-oh, an error occurred!
            });
          return;
        };

        uploadFiles(imgInput);
      } else {
        updatePost(newTitle, newContent, announcementKey);
        parent.location.reload();
      }
    });
  });

  const deleteButton = document.createElement("btn");
  deleteButton.classList.add("deleteBtn", "bi", "bi-trash3", "mx-2");
  deleteButton.style.display = "none"; // Set default display to none
  deleteButton.addEventListener("click", (e) => {
    const announcementKey = e.target.closest(".card").getAttribute("data-key");
    const title = document.querySelector(
      "[data-key='" + announcementKey + "'] .card-header"
    ).textContent;
    const delKey = ref(db, `AnnouncementCont/${announcementKey}`);
    const delImage = sRef(getStorage(app), `AnnouncementImgs/${title}`);
    const userRef = ref(getDatabase(app), `users/`);

    deleteObject(delImage)
      .then(() => {
        // File deleted successfully
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });

    remove(delKey)
      .then(() => {
        
        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            for (const key in data) {
              console.log(key, "key", announcementKey, "data[key]");
  
              remove(ref(getDatabase(), `users/${key}/Notifications/${announcementKey}`))
              .then(() => {
                console.log(`Remove notification for", ${key}, succeeded.`);
                // window.location.reload();
              })
  
              .catch((error) => {
                console.log("Remove failed: " + error.message);
              });
  
            }
          } else {
            console.log("No data available");
          }
        });

        console.log("Remove succeeded.");
      })
      .catch((error) => {
        console.log("Remove failed: " + error.message);
      });
    

    announcement.remove();
    e.stopPropagation();
  });

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardContent);
  cardBody.appendChild(cardFooter);
  cardFooter.appendChild(cardTimestamp);
  cardFooter.appendChild(editButton);
  cardFooter.appendChild(deleteButton);
  announcement.appendChild(cardBody);
  announcements.appendChild(announcement);
}

function displayNotif(key, title, content, timestamp, imgURL) {
  const notifs = parent.document.getElementById("notifCont");
  
  console.log(key, "key", title, "title", content, "content", timestamp, "timestamp");

  const notif = parent.document.createElement("div");
  notif.classList.add("card", "my-3");
  notif.setAttribute("data-key", key);
  
  const notifBody = parent.document.createElement("div");
  notifBody.classList.add("card-body", "w-100");

  const notifTitle = parent.document.createElement("h5");
  notifTitle.classList.add(
    "card-header",
    "text-uppercase",
    "fw-bold",
    "fs-3",
  );
  
  notifTitle.textContent = title;
  notifTitle.setAttribute("data-title", title);

  const notifContent = parent.document.createElement("p");
  notifContent.classList.add("card-text", "lead", "mx-3", "h-100", "text-black", "fs-6", "pt-3");
  notifContent.textContent = content;
  notifContent.setAttribute("data-content", content);
    
  const notifFooter = parent.document.createElement("div");
  notifFooter.classList.add("card-footer", "text-muted", "lead");

  const notifText = parent.document.createElement("small");
  notifText.classList.add("text-muted");

  // Display time since posted
  const currentTime = new Date();
  const publishTime = new Date(timestamp);
  const timeDiff = Math.abs(currentTime - publishTime);
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));
  const secondsDiff = Math.floor(timeDiff / 1000);

  let timeSincePosted = "";
  if (daysDiff > 0) {
    timeSincePosted += daysDiff + " day" + (daysDiff > 1 ? "s" : "") + " ago";
  } else if (hoursDiff > 0) {
    timeSincePosted +=
      hoursDiff + " hour" + (hoursDiff > 1 ? "s" : "") + " ago";
  } else if (minutesDiff > 0) {
    timeSincePosted +=
      minutesDiff + " minute" + (minutesDiff > 1 ? "s" : "") + " ago";
  } else {
    timeSincePosted +=
      secondsDiff + " second" + (secondsDiff > 1 ? "s" : "") + " ago";
  }

  const notifTimestamp = parent.document.createElement("small");
  notifTimestamp.classList.add("text-muted", "mb-3");
  notifTimestamp.textContent = timeSincePosted;

  notifBody.appendChild(notifTitle);
  notifBody.appendChild(notifContent);
  notifBody.appendChild(notifFooter);
  notifFooter.appendChild(notifTimestamp);
  notif.appendChild(notifBody);
  notifs.appendChild(notif);
}

function updatePost(newTitle, newContent, announcementKey, imgURL) {
  let postData;

  if (imgURL) {
    postData = {
      title: newTitle,
      content: newContent,
      imageURL: imgURL,
      timestamp: Date.now(),
    };
  } else {
    postData = {
      title: newTitle,
      content: newContent,
      timestamp: Date.now(),
    };
  }

  const db = getDatabase(app);

  const dbRef = ref(db, `AnnouncementCont/${announcementKey}`);
  update(dbRef, postData)
    .then(() => {
      console.log("Data updated");
    })
    .catch((e) => {
      console.log(e);
    });
}
