$(document).ready(function() {

    checkIframe("eac3DFrame");

    $(".mainCont").css({
        "width": "calc(" + $(".topBar").width() + "px + 30px)"
      });

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
        $('.mainCont').width($('.topBar').width()); 
    }
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
          activeFrame = document.getElementById(activeDiv).childNodes[1].id;      
          checkIframe(activeFrame);
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

function checkIframe(frame, bldng2D) {
    const sideItem3D = document.getElementById("sideItem3D");
    sideItem3D.style.display="none"
    const dataSrch = document.getElementById("suggestions");

    if(floors) {
        Object.keys(floors).forEach(k => delete floors[k])
    }

    const iframes = {
        vtFrame: document.getElementById('vtFrame'),
        navFrame: document.getElementById('navFrame'),
        eac3DFrame: document.getElementById('eac3DFrame')
    }
    
    const curFrame = (frame) => iframes[frame] || "Not found!";

    let selectedFrame = curFrame(frame);

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

        selectedFrame.style.height = "100%";

        function searchFromFrame() {
            selectedFrame.contentWindow.postMessage("Search || " + searchBox.value ,'*');
            // selectedFrame.contentWindow.postMessage("vtNav || " + searchBox.value ,'*');
        }

        searchBox.addEventListener("keypress", function onEvent(event) {
            if (event.key === "Enter") {
                searchFromFrame()
            }
        });

    } else if (frame === "navFrame") {

        selectedFrame.style.height = "100%";

        const navModal = new bootstrap.Modal(document.getElementById("navModal"), {keyboard: true});

        let areaList = document.getElementById("sidebarList")
       
        let selectVals;

        if(bldng2D){
            console.log(bldng2D);
            selectVals = selectedFrame.contentWindow[bldng2D];
        } else {
            selectVals = selectedFrame.contentWindow.data;
        }

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

            let suggOpt = document.createElement("option");
            suggOpt.value = name;
            suggOpt.innerHTML = name;
            suggOpt.setAttribute("id", name);
            dataSrch.appendChild(suggOpt);
         
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

        searchBox.addEventListener("keypress", function onEvent(event) {
            if (event.key === "Enter") {
                selectedFrame.contentWindow.addPin(searchBox.value);
            }
        });

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
            
            setTimeout(function() {
                
                function searchFromFrame() {
                    selectedFrame.contentWindow.postMessage("vtNav || " + vtId ,'*'); //vtName not set yet
                }
        
                searchFromFrame();

            }, 500);

        });

        sideFunc();    

    } else if (frame === "eac3DFrame") {

        const pinNames = [];

        const data3D = document.querySelectorAll(".locate");

        data3D.forEach(d => { // Set data
        
            let name = d.innerHTML.trim();

            let suggOpt = document.createElement("option");
            
            let insertSugg = function(val) {
                suggOpt.value = val;
                suggOpt.innerHTML = val;
                suggOpt.setAttribute("id", val);
                d.setAttribute("id", val);
                dataSrch.appendChild(suggOpt);
            }

            if(d.innerHTML.trim().includes("<i")) {

                name = name.split('<i class="sidebar-menu-item-icon"></i>')[1].trim();
            
                if(name.trim().includes("<br>")) {
                    name = "Social Hall/Central Student Council/Board Magdalo Culture & Arts Production / NSTP/ROTC";
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

        data3D.forEach(k => { // add event listener
            k.addEventListener("click", function(e) {
                let id = this.getAttribute("id");
                selectedFrame.contentWindow.mapPin(id);
                
            });
        });

        sideItem3D.style.display="block";
        clearFunc();  
        sideFunc();

        searchBox.addEventListener("keypress", function onEvent(event) {
            if (event.key === "Enter") {
                pinFromSearch();
            }
        });

        function pinFromSearch() {
            selectedFrame.contentWindow.mapPin(searchBox.value) 
        }

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
