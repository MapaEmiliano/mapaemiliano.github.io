$(document).ready(function() {
    // start: Sidebar
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

        $('.sidebar.collapsed').mouseleave(function() {
            $('.sidebar-dropdown-menu').slideUp('fast')
            $('.sidebar-menu-item.has-dropdown, .sidebar-dropdown-menu-item.has-dropdown').removeClass('focused')
        })
    })

    $('.sidebar-overlay').click(function() {
        $('.sidebar').addClass('collapsed')

        $('.sidebar-dropdown-menu').slideUp('fast')
        $('.sidebar-menu-item.has-dropdown, .sidebar-dropdown-menu-item.has-dropdown').removeClass('focused')
    })

    if(window.innerWidth < 768) {
        $('.sidebar').addClass('collapsed')
    }
    // end: Sidebar
})

// Generate modal for room vt's //

$('#viewModal').on('shown.bs.modal', function(event) {

    let curModal = $(event.relatedTarget);
    let id = curModal.data('id');
    let vtBtn = document.getElementById('#vtBtn');
    let navBtn = document.getElementById('#navBtn');
    
    $('#viewModal h5').text(id)

    if(curModal.hasClass("noVT")) {
        console.log("no vt")
        vtBtn.style.display = "none";
        
    } else {

        console.log("has vt")
        var el = document.getElementById('modalVT');
        vtBtn.style.display = "block";

        if(el.contentWindow) {

        console.log("1");
        el.contentWindow.switchFromModal(curModal.attr("class"));

        }

        else if(el.contentDocument) {
        console.log("2");

        }
    }

    if($('#navBtn').attr("data-bs-target") == "#modal-B3") {

        let route =  document.querySelectorAll(".path");
        let route2 =  document.querySelectorAll(".path2");

        $('#modal-B3').on('shown.bs.modal', function(event) {

            if(location.href.split("/").slice(-1) == "B1.html" || location.href.split("/").slice(-1) == "B2.html") {

                let floors = [second, third, fourth, fifth];

                for(let i = 0; i < floors.length; i++) {
                    floors[i].style.visibility = "hidden";
                }

                console.log("mataas")
        
            } else if(location.href.split("/").slice(-1) == "B7.html") {
                let floors = [second, third, fourth];
                for(let i = 0; i < floors.length; i++) {
                    floors[i].style.visibility = "hidden";
                }
            } else {
        
                let floors = [second];
                
                console.log("mababa")

                for(let i = 0; i < floors.length; i++) {
                    floors[i].style.visibility = "hidden";
                }

            }
        
            function clearRoutes(){
                for(let i = 0; i < route.length; i++) {

                    if(route[i].style.visibility == "visible") {
        
                    route[i].style.visibility = "hidden";

                    if(route[i].classList.contains("second") || route2[i].classList.contains("second")) {
                        console.log("meron");
                        second.style.visibility = "hidden";
                    }

                    } else if(route2[i].style.visibility == "visible") {
                        route2[i].style.visibility = "hidden";
                    }
                }
            }
            
            function stairs(fp) {
                if(fp.classList.contains("second")) {
    
                    second.style.visibility = "visible";
    
                } else if(fp.classList.contains("third")) {
                    
                    second.style.visibility = "visible";
                    third.style.visibility = "visible";
    
                } else if(fp.classList.contains("fourth")) {
    
                    second.style.visibility = "visible";
                    third.style.visibility = "visible";
                    fourth.style.visibility = "visible";
    
                } else if(fp.classList.contains("fifth")) {
    
                    second.style.visibility = "visible";
                    third.style.visibility = "visible";
                    fourth.style.visibility = "visible";
                    fifth.style.visibility = "visible";
    
                }
            }

            let btn1 = document.getElementById("B3EntBtn");
            let btn2 = document.getElementById("B3ExtEntrance");


            btn1.addEventListener('click', function() {

                let path = document.getElementById(id + "Path");
                clearRoutes();
                stairs(path);
                
                path.style.visibility = "visible";
    
            });
            
            btn2.addEventListener('click', function() {

                let path2 = document.getElementById(id + "Path2");
                clearRoutes();
                stairs(path2);
                path2.style.visibility = "visible";

            });

        });
            
    } else {
        
        navBtn.addEventListener('click', function() {

            if(location.href.split("/").slice(-1) == "B1.html" || location.href.split("/").slice(-1) == "B2.html") {

                let floors = [second, third, fourth, fifth];

                for(let i = 0; i < floors.length; i++) {
                    floors[i].style.visibility = "hidden";
                }

                console.log("mataas")
        
            } else if(location.href.split("/").slice(-1) == "B7.html") {
                let floors = [second, third, fourth];
                for(let i = 0; i < floors.length; i++) {
                    floors[i].style.visibility = "hidden";
                }
            } else {
        
                let floors = [second];
                
                console.log("mababa")

                for(let i = 0; i < floors.length; i++) {
                    floors[i].style.visibility = "hidden";
                }

            }

        const navigate = document.querySelectorAll(".navigateBtn");
        const route =  document.querySelectorAll(".path");

        for(let i = 0; i < route.length; i++) {
            if(i != navigate.length){

                route[i].style.visibility = "hidden";
                continue;

            } else {
            
                route[i].style.visibility = "hidden";

            }
            
        }

        function stairs(fp) {
            if(fp.classList.contains("second")) {

                second.style.visibility = "visible";

            } else if(fp.classList.contains("third")) {
                
                second.style.visibility = "visible";
                third.style.visibility = "visible";

            } else if(fp.classList.contains("fourth")) {

                second.style.visibility = "visible";
                third.style.visibility = "visible";
                fourth.style.visibility = "visible";

            } else if(fp.classList.contains("fifth")) {

                second.style.visibility = "visible";
                third.style.visibility = "visible";
                fourth.style.visibility = "visible";
                fifth.style.visibility = "visible";

            }
        }

        if(curModal.hasClass("noVT")) {

            let path = document.getElementById(id + "Path");
            console.log(path);
            stairs(path);
            path.style.visibility = "visible";
            navBtn.classList.add("active");

        } else {

            let path = document.getElementById(id + "Path");
            console.log(path);
            stairs(path);
            path.style.visibility = "visible";
            navBtn.classList.add("active");

        }
    });
    }
 
})
   
// End Generate modal for room vt's //

    // function viewVT(scene) {

    // }

    // $('#viewVT').on('shown.bs.modal', function(event) {

    //     // The reference tag is your anchor tag here
    //     var reference_tag = $(event.relatedTarget); 
    //     var idVT = reference_tag.data('id')

    //     console.log(idVT)

    //     var el = document.getElementById('modalVT');

    //     if(el.contentWindow) {

    //     console.log("1");
    //     el.contentWindow.switchFromModal(idVT);

    //     }

    //     else if(el.contentDocument) {
    //     console.log("2");

    //     }


    // })

    

