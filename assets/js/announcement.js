import {app, userData, auth, database, get, child, ref, getDatabase, remove, push, update } from './firebase.js';
// import firebase from './firebase.js';
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL, deleteObject } from "https://cdnjs.cloudflare.com/ajax/libs/firebase/9.17.2/firebase-storage.min.js";


let data = ref(getDatabase(app));
let curUserRole;
setTimeout(function() {
  curUserRole = userData.Role;
  displayAnnouncementsFromDB(curUserRole);
}, 1500);

const db = getDatabase();

// Save messages to Firebase Realtime Database
const saveMessages = (title, content, imgUrl) => {
  push(ref(getDatabase(app), "AnnouncementCont/"), {
    title: title,
    content: content,
    imageURL: imgUrl,
    timestamp: Date.now()
  }).then(() => {
    console.log("Data added")
  })
};

function displayAnnouncementsFromDB(role) {

  get(child(data, `AnnouncementCont`)).then((snapshot) => {
    const data = snapshot.val();
    const childData = [];

    for (const key in data) {
      childData.push({ key, ...data[key] });
    }

    for (let i = childData.length - 1; i >= 0; i--) { // loop backwards (display latest announcement first)

      const { key, title, content, timestamp, imageURL} = childData[i];

      displayAnnouncement(key, title, content, timestamp, imageURL, role);

    }

  }).catch((error) => {
    console.error(error);
  });
}

// Listen for form submission and save announcement to Firebase Realtime Database
document.getElementById('announcementModal').addEventListener("submit", submitForm);
  
// Function to submit the form and save announcements to Firebase Realtime Database
function submitForm(e) {
  e.preventDefault();
  var title = document.getElementById("title").value;
  var content = document.getElementById("content").value;
  var image = document.getElementById("image");
  
  const uploadFiles = (file) => {
    if(!file){
        console.log('no file exists')
        return;
    }
    const metadata = {
          contentType: 'image/jpeg',
        };

    const storageRef = sRef(getStorage(app), `AnnouncementImgs/${title}`);

    const uploadTask = uploadBytesResumable(storageRef, file.files[0], metadata);
    uploadTask.on('state_changed', null,
      (error) => {
          alert(error);
      },
      () => {
          getDownloadURL(uploadTask.snapshot.ref)
          .then((URL) => {
              saveMessages(title, content, URL)
                // Clear the form
              document.getElementById("announcement-form").reset();
                // Hide the modal
              var modal = document.getElementById("announcementModal");
              modal.style.display = "none";
              window.location.reload();
          });
      }
  )
    
}
  uploadFiles(image);

}

// Function to clear announcement container
function clearAnnouncementContainer() {
  const announcementsContainer = document.getElementById('announcements');
  announcementsContainer.innerHTML = '';
}

function displayAnnouncement(key, title, content, timestamp, imageURL, role) {

  const announcements = document.getElementById('announcements');
  
  const announcement = document.createElement('div');
  announcement.classList.add('card', 'my-3');
  announcement.setAttribute('data-key', key);


  // Add hover effect
  announcement.addEventListener('mouseover', () => {
    if(role === "Admin"){
      console.log("admin");
      editButton.style.display = 'inline-block';
      deleteButton.style.display = 'inline-block';
    } else {
      console.log("not admin");
      editButton.style.display = 'none';
      deleteButton.style.display = 'none';
    }
  });

  announcement.addEventListener('mouseout', () => {
    editButton.style.display = 'none';
    deleteButton.style.display = 'none';
  });

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body', 'w-100');

  // card-title to card-header
  const cardTitle = document.createElement('h5');
  cardTitle.classList.add('card-header', 'text-uppercase', 'fw-bold', 'text-white', );
  cardTitle.textContent = title;
  cardTitle.setAttribute('data-title', title)

  const cardImg = document.createElement('img');
  cardImg.classList.add('card-img-top', 'w-100', 'h-100',);
  cardImg.setAttribute('src', imageURL);
  cardBody.appendChild(cardImg);

  const cardContent = document.createElement('p');
  cardContent.classList.add('card-text', 'lead', 'mx-3', 'h-100', 'text-black');
  cardContent.textContent = content;
  cardContent.setAttribute('data-content', content);
  
  const cardFooter = document.createElement('div');
  cardFooter.classList.add('card-footer' , 'text-muted', 'lead');

  const footerText = document.createElement('small');
  footerText.classList.add('text-muted');


  // Display time since posted
  const currentTime = new Date();
  const publishTime = new Date(timestamp);
  const timeDiff = Math.abs(currentTime - publishTime);
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));
  const secondsDiff = Math.floor(timeDiff / 1000);

  let timeSincePosted = '';
  if (daysDiff > 0) {
    timeSincePosted += daysDiff + ' day' + (daysDiff > 1 ? 's' : '') + ' ago';
  } else if (hoursDiff > 0) {
    timeSincePosted += hoursDiff + ' hour' + (hoursDiff > 1 ? 's' : '') + ' ago';
  } else if (minutesDiff > 0) {
    timeSincePosted += minutesDiff + ' minute' + (minutesDiff > 1 ? 's' : '') + ' ago';
  } else {
    timeSincePosted += secondsDiff + ' second' + (secondsDiff > 1 ? 's' : '') + ' ago';
  }

  const cardTimestamp = document.createElement('small');
  cardTimestamp.classList.add('text-muted', 'mb-3');
  cardTimestamp.textContent = timeSincePosted;

  // Make the announcement card clickable
  announcement.addEventListener('click', () => {
    // Set the title and content of the View Announcement modal to the clicked announcement
    const viewAnnouncementModalTitle = document.getElementById('viewAnnouncementModalLabel');
    const viewAnnouncementModalContent = document.getElementById('viewAnnouncementContent');
    const viewModalImg = document.querySelector('.imgCont > img')
    viewModalImg.setAttribute('src', imageURL);
    viewAnnouncementModalTitle.textContent = title;
    viewAnnouncementModalContent.textContent = content;

    // Show the View Announcement modal
    const viewAnnouncementModal = new bootstrap.Modal(document.getElementById('viewAnnouncementModal'), {
      keyboard: false
    });
    viewAnnouncementModal.show();
  });

  // create notification
const notificationPopup = document.querySelector('.notification-popup');
const notificationContainer = document.querySelector('.notification-container');
const notificationButton = notificationContainer.querySelector('.notification-button');
const notificationPopupBody = notificationContainer.querySelector('.notification-popup-body');
const notificationBadge = notificationButton.querySelector('.badge');

let newNotificationCount = 1;

const notificationItem = document.createElement('a');
notificationItem.classList.add('notification-item', 'clickable');
notificationItem.href = ('../pages/announce.html'); 

const notificationTitle = document.createElement('h6');
notificationTitle.classList.add('notification-title');
notificationTitle.textContent = title;

const notificationContent = document.createElement('p');
notificationContent.classList.add('notification-content');
notificationContent.textContent = content;

const notificationTimestamp = document.createElement('small');
notificationTimestamp.classList.add('notification-timestamp');
notificationTimestamp.textContent = timeSincePosted;

notificationItem.appendChild(notificationTitle);
notificationItem.appendChild(notificationContent);
notificationItem.appendChild(notificationTimestamp);
notificationPopupBody.appendChild(notificationItem);

// update the notification badge
notificationBadge.textContent = newNotificationCount;
notificationBadge.style.display = newNotificationCount > 0 ? 'inline-block' : 'none';

notificationItem.addEventListener('click', (event) => {
  // Prevent the default behavior of the link and stop the event from propagating
  event.preventDefault();
  event.stopPropagation();

  // view announcement when click
  const viewAnnouncementModalTitle = document.getElementById('viewAnnouncementModalLabel');
  const viewAnnouncementModalContent = document.getElementById('viewAnnouncementContent');
  viewAnnouncementModalTitle.textContent = title;
  viewAnnouncementModalContent.textContent = content;

  // Show the View Announcement modal
  const viewAnnouncementModal = new bootstrap.Modal(document.getElementById('viewAnnouncementModal'), {
    keyboard: false
  });
  viewAnnouncementModal.show();

  // Clear count and update the badge
  newNotificationCount = 0;
  notificationBadge.textContent = newNotificationCount;
  notificationBadge.style.display = newNotificationCount > 0 ? 'inline-block' : 'none';


  notificationPopup.classList.remove('open');
  notificationPopup.style.display = 'none';
});

notificationButton.addEventListener('click', () => {
  // Clear the new notification count and update the badge when the button is clicked
  newNotificationCount = 0;
  notificationBadge.textContent = newNotificationCount;
  notificationBadge.style.display = newNotificationCount > 0 ? 'inline-block' : 'none';

  notificationPopup.classList.toggle('open');
  if (notificationPopup.classList.contains('open')) {
    notificationPopup.style.display = 'block';
  } else {
    notificationPopup.style.display = 'none';
  }
});

const editButton = document.createElement('btn');
editButton.classList.add('mx-2', 'editBtn', 'bi', 'bi-pencil-square', );
  // editButton.textContent = 'Edit';
  editButton.style.display = 'none'; // Set default display to none
  editButton.addEventListener('click', (e) => {
    e.stopPropagation();
  // Populate the title and content fields in the edit-announcement-form modal with the original values
  const titleInput = document.getElementById('edit-title');
  const contentInput = document.getElementById('edit-content');
  const originalTitle = cardTitle.textContent;
  const originalContent = cardContent.getAttribute('data-content');
  titleInput.value = originalTitle;
  contentInput.value = originalContent;
  console.log(cardTitle.getAttribute('data-title'), "gsdgsdg");
  const announcementKey = e.target.closest('.card').getAttribute('data-key');

  // Show the edit-announcement-form modal
  $('#editAnnouncementModal').modal('show');
  
  // Modify the submit event listener for the edit-announcement-form modal to update the existing announcement
  const editAnnouncementForm = document.getElementById('edit-announcement-form');
  editAnnouncementForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const imgInput = document.getElementById('imageEdit');
    const newTitle = titleInput.value;
    const newContent = contentInput.value;
    let delImage;
    if(imgInput.files[0] != null){
      
      console.log("file exists")
      console.log(cardTitle.getAttribute('data-title'));

      const uploadFiles = async (file) => {
        
        const result = await delObject();
        const metadata = {
          contentType: 'image/jpeg',
        };
      
      const storageRef = sRef(getStorage(app), `AnnouncementImgs/${newTitle}`);
      let delImage;
      
      const uploadTask = uploadBytesResumable(storageRef, file.files[0], metadata);
      
      uploadTask.on('state_changed', null,
      (error) => {
          alert(error);
      },
      () => {
          getDownloadURL(uploadTask.snapshot.ref)
          .then((URL) => {
            console.log(URL);                
            
            setTimeout(function(){
              updatePost(newTitle, newContent, announcementKey, URL);
              window.location.reload();
            }, 1000);
      
          });
      }
      )

    }

      const delObject = () => {

        if(!newTitle == cardTitle.getAttribute('data-title')){

          delImage = sRef(getStorage(app), `AnnouncementImgs/${newTitle}`);
          
        } else {
        
          delImage = sRef(getStorage(app), `AnnouncementImgs/${cardTitle.getAttribute('data-title')}`);
        
        }
        
        deleteObject(delImage).then(() => {
          
        }).catch((error) => {
          // Uh-oh, an error occurred!
        }); 
        return;
      }

      uploadFiles(imgInput);

    } else {
      
      updatePost(newTitle, newContent, announcementKey);
      window.location.reload();

    }
    

    });

  });

  const deleteButton = document.createElement('btn');
  deleteButton.classList.add('deleteBtn', 'bi', 'bi-trash3', 'mx-2');
  // deleteButton.textContent = 'Delete';
  deleteButton.style.display = 'none'; // Set default display to none
  deleteButton.addEventListener('click', (e) => {
    const announcementKey = e.target.closest('.card').getAttribute('data-key');
    const title = document.querySelector("[data-key='" + announcementKey + "'] .card-header").textContent;
    const delKey = ref(db, `AnnouncementCont/${announcementKey}`);
    const delImage = sRef(getStorage(app), `AnnouncementImgs/${title}`);

    deleteObject(delImage).then(() => {
      // File deleted successfully
    }).catch((error) => {
      // Uh-oh, an error occurred!
    });

    remove(delKey).then(() => {

      console.log('Remove succeeded.');

    }).catch((error) => {

      console.log('Remove failed: ' + error.message);

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
  // cardBody.appendChild(cardTimestamp);
  announcements.appendChild(announcement);


}

function updatePost(newTitle, newContent, announcementKey, imgURL) {
  
  let postData;

  if(imgURL){
    postData = {
      title: newTitle,
      content: newContent,
      imageURL: imgURL,
      timestamp: Date.now()
    };
  } else {
    postData = {
      title: newTitle,
      content: newContent,
      timestamp: Date.now()
    };
  }

  const db = getDatabase(app)
  
  const dbRef = ref(db, `AnnouncementCont/${announcementKey}`)
  update(dbRef, postData).then(() => {
    console.log("Data updated");
  }).catch((e) => {
    console.log(e);
  })
  
}