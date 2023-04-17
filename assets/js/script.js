$(document).ready(function() {

    $('.mainCont').width($('.topBar').width()); 

    $('.sidebar-dropdown-menu').slideUp('fast')

    $('.sidebar-menu-item.has-dropdown > a, .sidebar-dropdown-menu-item.has-dropdown > a').click(function(e) {
        e.preventDefault()

        if(!($(this).parent().hasClass('focused'))) {
            $(this).parent().parent().find('.sidebar-dropdown-menu').slideUp('fast')
            $(this).parent().parent().find('.has-dropdown').removeClass('focused')
        }

        $(this).next().slideToggle('fast')
        $(this).parent().toggleClass('focused')
    })

    $('.sidebar-toggle').click(function() {
        
        $('.sidebar').toggleClass('collapsed')
        $('.mainCont').toggleClass('collapsed')

        if($('.mainCont').hasClass('collapsed')) {
            setTimeout(() => {
                $(".mainCont").css({
                    "width": "calc(" + $(".topBar").width() + "px + 30px)"
                  });
            }, 200);
        } else {

            setTimeout(() => {
                $(".mainCont").css({
                    "width": "calc(" + $(".topBar").width() + "px + 30px)"
                  });
            }, 200);

        }

        $('.sidebar.collapsed').mouseleave(function() {
            
            $('.sidebar-dropdown-menu').slideUp('fast')
            $('.sidebar-menu-item.has-dropdown, .sidebar-dropdown-menu-item.has-dropdown').removeClass('focused')
        })
    })

    $('.sidebar-overlay').click(function() {
        $('.sidebar').addClass('collapsed')
        // $('.mainCont').width($('.topBar').width()); 
        $('.sidebar-dropdown-menu').slideUp('fast')
        $('.sidebar-menu-item.has-dropdown, .sidebar-dropdown-menu-item.has-dropdown').removeClass('focused')
    })

    if(window.innerWidth < 768) {
        // $('.mainCont').width($('.topBar').width()); 
        $('.sidebar').addClass('collapsed')
    }

});

$(window).resize(function() {
    if($('.mainCont').hasClass('collapsed')) {
        setTimeout(() => {
            $(".mainCont").css({
                "width": "calc(" + $(".topBar").width() + "px + 30px)"
              });
        }, 100);
    } else {

        setTimeout(() => {
            $(".mainCont").css({
                "width": "calc(" + $(".topBar").width() + "px + 30px)"
              });
        }, 100);

    }
  });
  
function clearFunc(){
    $('.sidebar-menu-item.has-dropdown > a, .sidebar-dropdown-menu-item.has-dropdown > a').off('click')
}
  
function sideFunc() {
    $('.mainCont').width($('.topBar').width()); 
    $('.sidebar-dropdown-menu').slideUp('fast')

    $('.sidebar-menu-item.has-dropdown > a, .sidebar-dropdown-menu-item.has-dropdown > a').click(function(e) {
        e.preventDefault()

        if(!($(this).parent().hasClass('focused'))) {
            $(this).parent().parent().find('.sidebar-dropdown-menu').slideUp('fast')
            $(this).parent().parent().find('.has-dropdown').removeClass('focused')
        }

        $(this).next().slideToggle('fast')
        $(this).parent().toggleClass('focused')
    })

    $('.sidebar-overlay').click(function() {
        $('.sidebar').addClass('collapsed')
        $('.mainCont').width($('.topBar').width()); 
        $('.sidebar-dropdown-menu').slideUp('fast')
        $('.sidebar-menu-item.has-dropdown, .sidebar-dropdown-menu-item.has-dropdown').removeClass('focused')
    })

    if(window.innerWidth < 768) {
        $('.sidebar').addClass('collapsed')
    }
    $('.mainCont').width($('.topBar').width()); 
}

   
// End Generate modal for room vt's //

// Element exists checker //

const checkElement = async selector => { // checks if the element exists.

    while ( document.querySelector(selector) === null) {
      await new Promise( resolve =>  requestAnimationFrame(resolve) )
    }
    return document.querySelector(selector); 
  };

// IFrame manipulate //

//Checking which button is clicked and showing the corresponding iframe//
const btns = document.querySelectorAll("#show-btn");
const iframeDivs = document.querySelectorAll(".embed-responsive");
let activeFrame;

for (let i = 0; i < btns.length; i++) {
  
  btns[i].addEventListener("click", function(e) {
      e.preventDefault(); 
    
    for (let j = 0; j < iframeDivs.length; j++) {
      if (i === j) {
        if (btns[i].classList.contains("active")) {
          iframeDivs[j].style.display = "none";
          btns[i].classList.remove("active");
        } else {
          iframeDivs[j].style.display = "block";
          btns[i].classList.add("active");

          if($('.mainCont').hasClass('collapsed')) {
            setTimeout(() => {
                $(".mainCont").css({
                    "width": "calc(" + $(".topBar").width() + "px + 30px)"
                  });
            }, 200);
        } else {

            setTimeout(() => {
                $(".mainCont").css({
                    "width": "calc(" + $(".topBar").width() + "px + 30px)"
                  });
            }, 200);

        }

          let activeDiv = iframeDivs[j].getAttribute("id");
          this.activeFrame = document.getElementById(activeDiv).childNodes[1].id;      
          checkIframe(this.activeFrame);

        }

      } else {

        iframeDivs[j].style.display = "none";
        if(btns[j].classList.contains("active")){
            btns[j].classList.remove("active");
        }
        
      }
    }
  });
}

const searchBox = document.getElementById("inpSrch");

let floors = {};    

const floorGetter = (result) => floors[result] || "Not found!";

function checkIframe(frame) {
    const sideItem3D = document.getElementById("sideItem3D");
    sideItem3D.style.display="none"

    if(floors) {
        Object.keys(floors).forEach(k => delete floors[k])
    }

    const iframes = {
        vtFrame: document.getElementById('vtFrame'),
        navFrame: document.getElementById('navFrame'),
        eac3DFrame: document.getElementById('eac3DFrame')
    }
    
    const curFrame = (frame) => iframes[frame] || "Not found!";

    const selectedFrame = curFrame(frame);

    let newLists = document.querySelectorAll(".Added");
    let newOpts = document.querySelectorAll("option");
    if(newLists) {
        for(let i = 0; i < newLists.length; i++) {    
            newLists[i].remove();
        }
        for(let j = 0; j < newOpts.length; j++) {    
            newOpts[j].remove();
        }
    }

    if(frame === "vtFrame") {

        selectedFrame.style.height = "94%";

        function searchFromFrame() {
            // selectedFrame.contentWindow.postMessage("Search || " + searchBox.value ,'*');
            selectedFrame.contentWindow.postMessage("vtNav || " + searchBox.value ,'*');
        }

        searchBox.addEventListener("keypress", function onEvent(event) {
            if (event.key === "Enter") {
                searchFromFrame()
            }
        });

    } else if (frame === "navFrame") {

        selectedFrame.style.height = "100%";

        console.log(selectedFrame.contentDocument.readyState);

        const navModal = new bootstrap.Modal(document.getElementById("navModal"), {keyboard: true});

        let areaList = document.getElementById("sidebarList")

        const selectVals = selectedFrame.contentWindow.data;

        const selectOpts = document.getElementById("endPoint");

        let defOpt = document.createElement("option");
        defOpt.value = "Select a destination";
        defOpt.innerHTML = "Select a destination";
        defOpt.setAttribute("id", "defOpt");
        defOpt.setAttribute("disabled", "disabled");
        defOpt.setAttribute("selected", "selected");
        selectOpts.appendChild(defOpt);
        
        let defOptVal = document.getElementById("defOpt");

        for(flr in selectVals.startPoints) { //sets floors data

            if(selectVals.startPoints[flr].Floor == 1 && !("F1" in floors)){

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

        for(sel in selectVals.startPoints) {

            let name = selectVals.startPoints[sel].Name
            let floor = document.getElementById("F" + selectVals.startPoints[sel].Floor);

            let opt = document.createElement("option");
            opt.value = name;
            opt.innerHTML = name;
            opt.setAttribute("id", name);
            selectOpts.appendChild(opt);
         
            let li = document.createElement("li");
            li.classList.add("sidebar-menu-item");

            let a = document.createElement("a");
            a.setAttribute("data-id", name); 
            if(selectVals.startPoints[sel].VTName){
                let vtName = selectVals.startPoints[sel].VTName;
                
                a.setAttribute("data-vt", vtName);
            } else {
                console.log("no vt");
            }
            a.style.cursor = "pointer";
            a.style.color = "#fff";
            a.classList.add("Added", "navItem");

            let span = document.createElement("span");
            span.innerHTML = name;
            a.appendChild(span);
            li.appendChild(a);

            if(floor) {
                floor.appendChild(li);
            } else {
                areaList.appendChild(li);
            }
            
        }

        let id;
        let vtId;
        let selected;
        let curOpts = document.querySelectorAll("option");
        let curList = document.querySelectorAll(".navItem");
        const navBtn = document.querySelector('#navBtn');
        const locBtn = document.querySelector('#locBtn');
        const vtBtn = document.querySelector('#vtBtn');

        for(l of curList) {
            l.addEventListener("click", function(e) {
                id = this.getAttribute("data-id");  
                
                if(this.getAttribute("data-vt") != null) {
                    vtId = this.getAttribute("data-vt");
                    vtBtn.style.display = "block";
                    console.log(vtId);
                } else {
                    console.log("no vttt");
                    vtBtn.style.display = "none";
                }
                  
                let starting = document.getElementById("startPoint");
                starting.innerHTML = id;

                selected = document.getElementById("endPoint");

                curOpts.forEach(k => {
                    if (k.value == id) {
                        k.disabled = true;
                        defOptVal.disabled = true;
                    } else {
                        k.disabled = false;
                        defOptVal.disabled = true;
                    }
                });
                
                navModal.show();

            });
        }

        navBtn.addEventListener("click", function(e) {  
                selectedFrame.contentWindow.navigateTo(id, selected.value); 
                navModal.hide();
        });    

        locBtn.addEventListener("click", function(e) {
            selectedFrame.contentWindow.addPin(id);
            navModal.hide();
        });

        vtBtn.addEventListener("click", function(e) {
            
            console.log("vtId: " + vtId);

            function searchFromFrame() {
                selectedFrame.contentWindow.postMessage("vtNav || " + vtId ,'*'); //vtName not set yet
            }
    
            searchBox.addEventListener("keypress", function onEvent(event) {
                if (event.key === "Enter") {
                    searchFromFrame()
                }
            });

        });

        sideFunc();    

    } else if (frame === "eac3DFrame") {
        sideItem3D.style.display="block";
        clearFunc();  
        sideFunc();
    }

}

function createList(floor, areaList) {

    let dropList = document.createElement("li"); //Creates dropdown list
    dropList.classList.add("Added", "sidebar-menu-item", "has-dropdown")
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
    iRrow.classList.add("ri-arrow-down-s-line", "sidebar-menu-item-accordion", "ms-auto", "Added");
    
    a.appendChild(iCon);
    a.appendChild(span);
    a.appendChild(iRrow);
    
    dropList.appendChild(a);
    dropList.appendChild(dropDown);

}

// eac 3D LOCATE
document.addEventListener("DOMContentLoaded", function() {
    const buildingBtns = document.querySelectorAll(".locate");
    const eac3dIframe = document.getElementById("eac3DFrame");
    const pinLoc = eac3dIframe.contentDocument.querySelectorAll("#pin");
     for (let i = 0; i < buildingBtns.length; i++) {
        buildingBtns[i].addEventListener("click", function(e) {
          e.preventDefault();
          console.log("clicked")
          for (let j = 0; j < pinLoc.length; j++) {
            pinLoc[i].setAttribute("tabindex", i + 1);  
            if (i === j) {
              pinLoc[j].style.display = "block";      
              pinLoc[j].scrollIntoView({behaviour: "smooth", block: "center", inline: "center"}); 
            } else {
            pinLoc[j].style.display = "none";
            }
          }
        });
     }
});