$(document).ready(function () { // Start of document ready function

  initiateIframes(); // initiate the iframes

  $(".mainCont").css({ // sets the width of the main content to be the same as the topbar width
    width: "calc(" + $(".topBar").width() + "px + 30px)",
  });

  $(".sidebar-dropdown-menu").slideUp("fast"); // hides the sidebar dropdown menu on page load

  $( // sidebar menu click event
    ".sidebar-menu-item.has-dropdown > a, .sidebar-dropdown-menu-item.has-dropdown > a"
  ).click(function (e) {
    e.preventDefault();

    if (!$(this).parent().hasClass("focused")) {
      $(this).parent().parent().find(".sidebar-dropdown-menu").slideUp("fast");
      $(this).parent().parent().find(".has-dropdown").removeClass("focused");
    }

    $(this).next().slideToggle("fast");
    $(this).parent().toggleClass("focused");
  });

  $(".sidebar-toggle").click(function () { // sidebar toggle click event
    $(".sidebar").toggleClass("collapsed");
    $(".mainCont").addClass("collapsed");

    if ( // set the width of the main content to be the same as the topbar width depending on device
      $(".mainCont").hasClass("collapsed") &&
      !$(".mainCont").hasClass("lowRes")
    ) {
      setTimeout(() => {
        $(".mainCont").css({
          width: "calc(" + $(".topBar").width() + "px + 30px)",
        });
      }, 200);
    } else {
      setTimeout(() => {
        $(".mainCont").css({
          width: "calc(" + $(".topBar").width() + "px + 30px)",
        });
      }, 200);
    }

    $(".sidebar.collapsed").mouseleave(function () { // sidebar mouseleave event
      $(".sidebar-dropdown-menu").slideUp("fast");
      $(
        ".sidebar-menu-item.has-dropdown, .sidebar-dropdown-menu-item.has-dropdown"
      ).removeClass("focused");
    });
  });

  $(".sidebar-overlay").click(function () { // sidebar overlay click event
    $(".sidebar").addClass("collapsed");
    $(".sidebar-dropdown-menu").slideUp("fast");
    $(
      ".sidebar-menu-item.has-dropdown, .sidebar-dropdown-menu-item.has-dropdown"
    ).removeClass("focused");
  });

  if (window.innerWidth < 768) { // if window width is less than 768px, collapse the sidebar and add the lowRes class to the main content
    $(".sidebar").addClass("collapsed"); 
    $(".mainCont").addClass("lowRes");
  }
});

$(window).resize(function () { // window resize event
  if ($(".mainCont").hasClass("collapsed")) {
    setTimeout(() => {
      $(".mainCont").css({
        width: "calc(" + $(".topBar").width() + "px + 30px)",
      });
    }, 100);
  } else {
    setTimeout(() => {
      $(".mainCont").css({
        width: "calc(" + $(".topBar").width() + "px + 30px)",
      });
    }, 100);
  }
});

function clearFunc() { // clears the sidebar menu click event
  $(
    ".sidebar-menu-item.has-dropdown > a, .sidebar-dropdown-menu-item.has-dropdown > a"
  ).off("click");
}

function sideFunc() { // adds the sidebar menu click event again
  $(".mainCont").width($(".topBar").width());

  $(".sidebar-dropdown-menu").slideUp("fast");

  $(
    ".sidebar-menu-item.has-dropdown > a, .sidebar-dropdown-menu-item.has-dropdown > a"
  ).click(function (e) {
    e.preventDefault();

    if (!$(this).parent().hasClass("focused")) {
      $(this).parent().parent().find(".sidebar-dropdown-menu").slideUp("fast");
      $(this).parent().parent().find(".has-dropdown").removeClass("focused");
    }

    $(this).next().slideToggle("fast");
    $(this).parent().toggleClass("focused");
  });

  $(".sidebar-overlay").click(function () {
    $(".sidebar").addClass("collapsed");
    setTimeout(() => {
      $(".mainCont").css({
        width: "calc(" + $(".topBar").width() + "px + 30px)",
      });
    }, 100);
    $(".sidebar-dropdown-menu").slideUp("fast");
    $(
      ".sidebar-menu-item.has-dropdown, .sidebar-dropdown-menu-item.has-dropdown"
    ).removeClass("focused");
  });

  if (window.innerWidth < 768) {
    $(".sidebar").addClass("collapsed");
    $(".mainCont").addClass("lowRes");
  }
}

// End Generate modal for room vt's //

// Element exists checker //

const checkElement = async (selector) => {
  // checks if the element exists.

  while (document.querySelector(selector) === null) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return document.querySelector(selector);
};

// IFrame manipulate //

//Checking which button is clicked and showing the corresponding iframe//

const setIframeSrc = () => {

  const navFrame = document.querySelector("#navFrame");
  const eac3DFrame = document.querySelector("#eac3DFrame");
  const vtFrame = document.querySelector("#vtFrame");
  const annFrame = document.querySelector("#announceFrame");

  navFrame.setAttribute("src", "../pages/NavTemplateNew/2DEac.html");
  eac3DFrame.setAttribute("src", "../pages/EAC3D.html");
  vtFrame.setAttribute("src", "https://jzhmrtn.github.io/");
  annFrame.setAttribute("src", "../pages/announce.html");
  

};

const initiateIframes = async () => {

await setIframeSrc(); // checks if the button exists

checkIframe("eac3DFrame"); // sets the default iframe to be loaded on page load to be eac3DFrame
clearFunc(); // clears the sidebar menu click event

const btns = document.querySelectorAll("#show-btn");
const iframeDivs = document.querySelectorAll(".embed-responsive");
let activeFrame;

for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function (e) {
    e.preventDefault();

    for (let j = 0; j < iframeDivs.length; j++) {
      if (i === j) { // if the button index is equal to the iframe index
        if (btns[i].classList.contains("active")) { // if the button is already active
          return;
        } else { // if the button is not active
          iframeDivs[j].style.display = "block";  // show the iframe
          btns[i].classList.add("active"); // add the active class to the button
          if ($(".mainCont").hasClass("collapsed")) {  // align the width of the main content to the topbar width
            setTimeout(() => {
              $(".mainCont").css({
                width: "calc(" + $(".topBar").width() + "px + 30px)",
              });
            }, 200);
          } else {
            setTimeout(() => {
              $(".mainCont").css({
                width: "calc(" + $(".topBar").width() + "px + 30px)",
              });
            }, 200);
          }
          let activeDiv = iframeDivs[j].getAttribute("id"); // get the id of the iframe div based on the button index
          activeFrame = document.getElementById(activeDiv).childNodes[1].id; // get the id of the iframe
          checkIframe(activeFrame); // sets the functions of the corresponding iframe
        }
      } else { // if the button index is not equal to the iframe index
        iframeDivs[j].style.display = "none";  // hide the iframe
        if (btns[j].classList.contains("active")) { // if the button is active remove the active class from the button
          btns[j].classList.remove("active"); 
        }
      }
    }
  });
}

}

// get references to the elements that will have event listeners
const searchBox = document.getElementById("inpSrch"); 
const navBtn = document.querySelector("#navBtn");
const locBtn = document.querySelector("#locBtn");
const vtBtn = document.querySelector("#vtBtn");

let floors = {}; // object to store the floor names and their corresponding floor numbers

const floorGetter = (result) => floors[result] || "Not found!"; // function to get the floor number based on the floor name

//checks if the 2d and 3d iframes have already been loaded
let exists3D = false;
let exists2D = false;

function checkIframe (frame, bldng2D) { // sets the fucntions of the iframe based on the iframe id

  const data3D = document.querySelectorAll(".locate"); // gets the elements with the class locate

  setTimeout(() => { // waits for the iframe to load then sets the widht of the main content to the topbar width
    $(".mainCont").css({
      width: "calc(" + $(".topBar").width() + "px + 30px)",
    });
  }, 200);
  
  let eventListeners = searchBox.getEventListeners(); // gets the event listeners of the search box

  const sideItem3D = document.getElementById("sideItem3D"); // gets the element with the id sideItem3D and set its display to none
  sideItem3D.style.display = "none";
  const dataSrch = document.getElementById("suggestions"); // gets the elements inside the suggestion box

  if (floors) { // empties the floors object
    Object.keys(floors).forEach((k) => delete floors[k]);
  }

  const iframes = { // object to store the iframe references
    vtFrame: document.getElementById("vtFrame"),
    navFrame: document.getElementById("navFrame"),
    eac3DFrame: document.getElementById("eac3DFrame"),
  };

  const curFrame = (frame) => iframes[frame] || "Not found!"; // function to get the iframe reference based on the iframe id

  let selectedFrame = curFrame(frame); // gets the iframe reference based on the iframe id

  let newLists = document.querySelectorAll(".Added"); // gets the elements with the class Added and option then removes them
  let newOpts = document.querySelectorAll("option");
  if (newLists) { // if the elements with the class Added and option exist
    for (let i = 0; i < newLists.length; i++) {
      newLists[i].remove();
    }
    for (let j = 0; j < newOpts.length; j++) {
      newOpts[j].remove();
    }
  }

  const removeSearch = async () => { // function to remove the event listeners of the search box to avoid duplication

    for(k in eventListeners) {
      let eListener = eventListeners[k];
      if(Object.keys(eventListeners).length == 1){
        // console.log("more than 1");
        searchBox.removeEventListener(eListener[0].type, eListener[0].listener);
      }
    }

  }

  if (frame === "vtFrame") { // if the iframe id is vtFrame
    
    let placeHolders = { // object to store the place holders of the search box
      Building1: "B1",
      Building2: "B2",
      Building3: "B3",
      Building3Extension: "B3Ex",
      Building4: "B4",
      Building5: "B5",
      Building6: "B6",
      Canteen: "B6",
      Building7: "B7",
      Lobby1: "L1Hall",
      Lobby2: "L2",
      Lobby3: "L3",
      MainHall: "MainHall",
      Flr2Hall: "F2MainHall",
      WestRoad: "WestRoad",
      EastRoad: "EastRoad",
      MainRoad: "MainRoad",
      Field: "Field",
      Parking: "Parking",
      WestHall: "WestHall",
      OpenCourt: "OpenCourt",
      RoofDeck: "RoofDeck",
      SocialHall: "SocHall",
    };

    const placeHoldersGetter = (result) => placeHolders[result] || searchBox.value;

    for(scene in placeHolders) { // adds the place holders to the suggestion box

      let suggOptWord = document.createElement("option");
      suggOptWord.innerHTML = scene;
      suggOptWord.value = scene;
      suggOptWord.setAttribute("id", scene);
      dataSrch.appendChild(suggOptWord);

    }

    selectedFrame.style.height = "100%"; // sets the height of the iframe to 100%

    function searchFromFrame(e) { // function to search from the iframe

      if (e.keyCode === 13) {
      selectedFrame.contentWindow.postMessage(
        "Search || " + placeHoldersGetter(searchBox.value),
        "*"
      );
      }
    }

    const addSearchListener = async () => { // function to add the event listeners of the search box

      // console.log("removing search listener");

      await removeSearch(); // removes the event listeners of the search box after waiting for the function to finish

      // console.log("adding search listener");

      searchBox.addEventListener("keyup", searchFromFrame);

    }

    addSearchListener();

  } else if (frame === "navFrame") { // if the iframe id is navFrame

    if(selectedFrame.contentWindow.document.querySelector(".pin").style.opacity == 1) { // if the pin is visible then remove it
      selectedFrame.contentWindow.removePin();
    }
     
    selectedFrame.style.height = "100%"; // sets the height of the iframe to 100%

    const navModal = new bootstrap.Modal(document.getElementById("navModal"), { // creates a new modal for the 2D
      keyboard: true,
    });

    let areaList = document.getElementById("sidebarList"); // gets the element with the id sidebarList

    let selectVals; // variable to store the data of the iframe

    if (bldng2D) { // if bldng2D is not null then use the bldng2D data passed from the 2D script
      selectVals = selectedFrame.contentWindow[bldng2D];
    } else {
      selectVals = selectedFrame.contentWindow.data;
    }

    const selectOpts = document.getElementById("endPoint"); // gets the element with the id endPoint

    let defOpt = document.createElement("option"); // default option for the select element
    defOpt.value = "Select a destination";
    defOpt.innerHTML = "Select a destination";
    defOpt.setAttribute("id", "defOpt");
    defOpt.setAttribute("disabled", "disabled");
    defOpt.setAttribute("selected", "selected");
    selectOpts.appendChild(defOpt); // appends the default option to the select element
    let defOptVal = document.getElementById("defOpt");

    for (flr in selectVals.startPoints) {
      //sets floors data

      if (selectVals.startPoints[flr].Floor == 1 && !("F1" in floors)) {
        floors.F1 = "First Floor";

        createList("F1", areaList);
      } else if (selectVals.startPoints[flr].Floor == 2 && !("F2" in floors)) {
        floors.F2 = "Second Floor";

        createList("F2", areaList);
      } else if (selectVals.startPoints[flr].Floor == 3 && !("F3" in floors)) {
        floors.F3 = "Third Floor";
        createList("F3", areaList);
      } else if (selectVals.startPoints[flr].Floor == 4 && !("F4" in floors)) {
        floors.F4 = "Fourth Floor";
        createList("F4", areaList);
      } else if (selectVals.startPoints[flr].Floor == 5 && !("F5" in floors)) {
        floors.F5 = "Fifth Floor";
        createList("F5", areaList);
      }
    }

    let flrOpts = []

    for (sel in selectVals.startPoints) { // sets the start points data
      let name = selectVals.startPoints[sel].Name;
      let floor = document.getElementById(
        "F" + selectVals.startPoints[sel].Floor
      );

      let flrCheck = floors["F" + selectVals.startPoints[sel].Floor];
      let flrOptCreate = document.createElement("option");

      if (!flrOpts.includes(flrCheck)) {
        flrOptCreate.classList.add("floorOpt");
        flrOptCreate.value = "----" + flrCheck + "----";
        flrOptCreate.innerHTML = "------- " + flrCheck + " -------";
        flrOpts.push(flrCheck);
        selectOpts.appendChild(flrOptCreate);
      }

      let opt = document.createElement("option");
      opt.value = name;
      opt.innerHTML = name;
      opt.setAttribute("id", name);
      selectOpts.appendChild(opt);

      let suggOpt = document.createElement("option");
      suggOpt.value = name;
      suggOpt.innerHTML = name;
      suggOpt.setAttribute("id", name);
      dataSrch.appendChild(suggOpt);

      let li = document.createElement("li");
      li.classList.add("sidebar-menu-item");

      let a = document.createElement("a");
      a.setAttribute("data-id", name);
      if (selectVals.startPoints[sel].VTName) {
        let vtName = selectVals.startPoints[sel].VTName;

        a.setAttribute("data-vt", vtName);
      }
      a.style.cursor = "pointer";
      a.style.color = "#fff";
      a.classList.add("Added", "navItem");

      let span = document.createElement("span");
      span.innerHTML = name;
      a.appendChild(span);
      li.appendChild(a);

      if (floor) {
        floor.appendChild(li);
      } else {
        areaList.appendChild(li);
      }
    }
    
    let id;
    let vtId;
    let selected = document.getElementById("endPoint");
    let curOpts = document.querySelectorAll("option");
    let curList = document.querySelectorAll(".navItem");

    for (l of curList) { // adds event listeners to the list items
      l.addEventListener("click", function (e) {
        id = this.getAttribute("data-id"); 

        if (this.getAttribute("data-vt") != null) { // if the list item has a data-vt attribute then set the vtId variable to the value of the data-vt attribute and display the vtBtn
          vtId = this.getAttribute("data-vt");
          vtBtn.style.display = "block";
        } else { // else hide the vtBtn
          vtBtn.style.display = "none";
        }

        let starting = document.getElementById("startPoint");
        starting.innerHTML = id;

        curOpts.forEach((k) => { // disables the options that are the same as the selected list item
          if (k.value == id) {
            k.disabled = true;
            defOptVal.disabled = true;
          } else if(k.classList.contains("floorOpt")) {
            k.disabled = true;
          } else {
            k.disabled = false;
            defOptVal.disabled = true;
          }
        });

        navModal.show();
      });
    }


    function pin2D(e) { // adds a pin to the 2D map
      if (e.key === "Enter") {
        selectedFrame.contentWindow.addPin(searchBox.value);
      }
    }

    function navFunc(e) { // navigates to the selected list item
      selectedFrame.contentWindow.navigateTo(id, selected.value);
      navModal.hide();
    }

    function locFunc (e) { // adds a pin to the 2D map
      selectedFrame.contentWindow.addPin(id);
      navModal.hide();
    }

    function vtFunc(e) { // switches to the 360 view of the selected list item
  
      const btn2D = document.querySelector(".btn2D");
      const btnVT = document.querySelector(".btnVT");
      const div2D = document.getElementById("cont2D");
      const divVT = document.getElementById("contVT");

      div2D.style.display = "none";
      divVT.style.display = "block";

      btn2D.classList.remove("active");
      btnVT.classList.add("active");

      checkIframe("vtFrame");
      selectedFrame = curFrame("vtFrame");
      navModal.hide();

      setTimeout(function () {
        function searchFromFrame() {
          selectedFrame.contentWindow.postMessage("vtNav || " + vtId, "*"); //vtName not set yet
        }

        searchFromFrame();
      }, 500);
    }

    const removeBtns = async () => { // removes the event listeners from the buttons
  
      if(Object.keys(navBtn.getEventListeners()).length > 0) {
        if(Object.keys(navBtn.getEventListeners().click).length > 1) {
          // console.log("removing nav listener!!!!!!!!!!!");
          for(let nb in navBtn.getEventListeners().click) {
            navBtn.removeEventListener(navBtn.getEventListeners().click[nb].type, navBtn.getEventListeners().click[nb].listener);
          }
        }
      }

      if(Object.keys(locBtn.getEventListeners()).length > 0) {
        if(Object.keys(locBtn.getEventListeners().click).length > 1) {
          // console.log("removing loc listener!!!!!!!!!!!");
          for(let lb in locBtn.getEventListeners().click) {
            locBtn.removeEventListener(locBtn.getEventListeners().click[lb].type, locBtn.getEventListeners().click[lb].listener);
          }
        }
      }

      if(Object.keys(vtBtn.getEventListeners()).length > 0) {
        if(Object.keys(vtBtn.getEventListeners().click).length > 1) {
          // console.log("removing vt listener!!!!!!!!!!!");
          for(let vb in vtBtn.getEventListeners().click) {
            vtBtn.removeEventListener(vtBtn.getEventListeners().click[vb].type, vtBtn.getEventListeners().click[vb].listener);
          }
        }
      }

    }

    const addSearchListener = async () => { // adds the event listeners to the buttons and searchbox

      // console.log("removing search listener");
      await removeSearch();

      // console.log("adding search listener");

      searchBox.addEventListener("keyup", pin2D);
      
      navBtn.addEventListener("click", navFunc);
  
      locBtn.addEventListener("click", locFunc);
  
      vtBtn.addEventListener("click", vtFunc);

      // console.log(navBtn.getEventListeners());

      await removeBtns();

      // console.log(navBtn.getEventListeners());

    }
    exists2D = true; // sets the exists2D variable to true to indicate that the 2D map has already been loaded
    addSearchListener();

    clearFunc();
    sideFunc();

  } else if (frame === "eac3DFrame") { // if the frame is the 3D map

    const pinNames = []; // array of the names of the pins
    setTimeout(function () {
      const pin = selectedFrame.contentWindow.document.getElementById("pin");
      if(!pin) { // if the pin is visible then hide it
        if(pin.style.opacity == 1){
          selectedFrame.contentWindow.hidePin();
        }
      }
    }, 1000);

    data3D.forEach((d) => { 
      // Set data to the pinNames array

      let name = d.innerHTML.trim();

      let suggOpt = document.createElement("option");

      let insertSugg = function (val) {
        suggOpt.value = val;
        suggOpt.innerHTML = val;
        suggOpt.setAttribute("id", val);
        d.setAttribute("id", val);
        dataSrch.appendChild(suggOpt);
      };

      if (d.innerHTML.trim().includes("<i")) {
        name = name.split('<i class="sidebar-menu-item-icon"></i>')[1].trim();

        if (name.trim().includes("<br>")) {
          name =
            "Social Hall/Central Student Council/Board Magdalo Culture & Arts Production / NSTP/ROTC";
          pinNames.push(name);
          insertSugg(name);
        } else {
          pinNames.push(name);
          insertSugg(name);
        }
      } else {
        insertSugg(name);
        pinNames.push(name);
      }
    });

    if(!exists3D) { // if the 3D map has not been loaded yet then add the event listeners to the list items
      data3D.forEach((k) => {
        // add event listener
        k.addEventListener("click", function pinFromSidebar(e) {
          let id = this.getAttribute("id");
          selectedFrame.contentWindow.mapPin(id);
        });
      });
    }

    sideItem3D.style.display = "block"; // show the 3D map list items
    clearFunc();
    sideFunc();

    function pinFromSearch(e) { // adds a pin to the 3D map 
      if (e.key === "Enter") {
        selectedFrame.contentWindow.mapPin(searchBox.value);
      }
    }

    const addSearchListener = async () => { // adds the event listeners to the searchbox
 
      // console.log("removing search listener");

      await removeSearch();

      // console.log("adding search listener");

      searchBox.addEventListener("keyup", pinFromSearch);

    }
    exists3D = true; // sets the exists3D variable to true to indicate that the 3D map has already been loaded
    addSearchListener();

  }
}

function createList(floor, areaList) { // creates the list items for the 2D map
  let dropList = document.createElement("li"); //Creates dropdown list
  dropList.classList.add("Added", "sidebar-menu-item", "has-dropdown");
  areaList.appendChild(dropList);

  let dropDown = document.createElement("ul"); //Creates dropdown menu
  dropDown.classList.add("Added", "sidebar-menu-dropdown");
  dropDown.setAttribute("id", floor);

  let a = document.createElement("a");
  a.setAttribute("class", "Added");
  a.setAttribute("href", "#");

  let span = document.createElement("span");
  span.innerHTML = floorGetter(floor);

  let iCon = document.createElement("i");
  iCon.classList.add("sidebar-menu-item-icon", "Added");
  iCon.innerHTML = floor;

  let iRrow = document.createElement("i");
  iRrow.classList.add(
    "ri-arrow-down-s-line",
    "sidebar-menu-item-accordion",
    "ms-auto",
    "Added"
  );

  a.appendChild(iCon);
  a.appendChild(span);
  a.appendChild(iRrow);

  dropList.appendChild(a);
  dropList.appendChild(dropDown);
}
