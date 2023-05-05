const svgMap = document.getElementById("pngMap"); // get the map image
var curArea = svgMap.getAttribute("src").split('.png')[0]; // split the image name to get the area name

let gridWidth = svgMap.naturalWidth; // get the width of the map image
let gridHeight = svgMap.naturalHeight; // get the height of the map image

const gridNodeSize = { // list of areas and their respective node sizes
  eac2D: 47,
  B1: 40,
  B2: 43,
  B3: 44.5,
  B4: 41,
  B5: 40,
  B6: 42,
  B7: 40,
};

const gridDataSetter = (result) => gridNodeSize[result] || "Not found!"; // return the node size of the grid according to current area

var nodeSize = gridDataSetter(curArea); // set the node size of the grid according to current area

var data = window[curArea]; // get the data of the current area

var paper = Raphael("matrix", gridWidth, gridHeight); // initialize Raphael (Grid Canvas)

var numRows = Math.ceil(gridHeight / nodeSize), // get the number of rows and columns of the grid
    numCols = Math.ceil(gridWidth / nodeSize); 

var startedAnimation = false; // boolean to check if the route animation has started    

function refreshGrid(area) { // function to refresh the grid when the area is changed

  // $("#matrix svg").html(""); // clear the grid canvas
  const clearPaper = async () => {
  
  paper.remove(); // clear the grid canvas
  grid = null; // clear the grid
  gridObjs = []; // clear the grid objects array
  svgMap.setAttribute("src", area + ".png"); // set the map image according to the area
  data = window[area]; // get the data of the new area
  curArea = area; // set the current area to the new area
  nodeSize = gridDataSetter(curArea); // set the node size of the grid according to the new area

  };

    async function reinitialize() { // reinitialize the grid and its functions

      console.log("Map loaded. Clearing paper..");

      await clearPaper();
      
        $('#matrix').css({width: $('#pngMap').width(), height: $('#pngMap').height()});
        gridWidth = $('#pngMap').width();
        gridHeight = $('#pngMap').height();
        
        paper = Raphael("matrix", gridWidth, gridHeight);

        numRows = Math.ceil(gridHeight / nodeSize);
        numCols = Math.ceil(gridWidth / nodeSize);
      
        grid = new PF.Grid(numCols, numRows), //Initialize grid and Pathfinder using pathfinding.js
        finder = new PF.AStarFinder({
          heuristic: PF.Heuristic.octile,
          diagonalMovement: PF.DiagonalMovement.Always,
          dontCrossCorners: true,
        }); 
      
        drawGrid(data.startPoints); // draw the grid
        setWalkables(data.WalkableGrids); // set the walkable nodes of the grid

        checkElement('rect').then(() => { // waits for the grid objects to finish drawing then add event listeners to the grid objects.

          const gridCircles = document.querySelectorAll(".circlers"); // selects all the circles or entrances
        
          gridCircles.forEach((item) => {

            item.addEventListener("click", function (e) {
        
              var curX = this.getAttribute("cx"); // gets the x coordinate of the clicked circle
              var curY = this.getAttribute("cy"); // gets the y coordinate of the clicked circle
        
              var clicked = toGridCoordinate(curX, curY); // converts the coordinate of the clicked node to the grid coordinate
        
              let startID = document.getElementById("start");
              let endID = document.getElementById("end");
        
              let startImg = document.querySelector(".startImg");
              let endImg = document.querySelector(".endImg");
        
              if(data.CustomFunction){
        
                if(startPos){
                  var endPos = toGridCoordinate(curX, curY);

                  this.setAttribute("id", "end"); // sets the id of the clicked node to end
                  endImg.style.opacity = "1";
                  endImg.setAttribute("x", curX - 35);
                  endImg.setAttribute("y", curY - 45);
          
                  data.CustomFunction(startPos, endPos);
          
                  startPos = false;
                } else {
                  clearPath();
                  clearStairs();
                  startPos = toGridCoordinate(curX, curY);

                  this.setAttribute("id", "start"); // sets the id of the clicked node to start         
                  startImg.setAttribute("x", this.getAttribute("cx") - 30);
                  startImg.setAttribute("y", this.getAttribute("cy") - 45);
                  endImg.style.opacity = "0";
                  startImg.style.opacity = "1";
                }
        
              } else {
        
                if (startPos) { // if the start position is set, wait for the end position to be set then find the shortest possible path between the two positions using the A* algorithm provided by the pathfinding library.
                
                  if((clicked[0] == startPos[0]) && (clicked[1] == startPos[1])){ // if the start position is clicked again, reset the start position allowing user to click on another node to set the start position
                    startPos = false;
                    console.log("Start position reset");
                    checkElement('.focus').then((focusObj) => { 
          
                      focusObj.setAttribute("x", -20); // removes focus object on screen
                      focusObj.setAttribute("y", -20);
                      
                    });
                    return;
                  }
        
                  this.setAttribute("id", "end"); // sets the id of the clicked node to end
                  endImg.style.opacity = "1";
                  endImg.setAttribute("x", curX - 35);
                  endImg.setAttribute("y", curY - 45);
          
                  setWalkables(data.WalkableGrids); // resets the walkables for the current area
          
                  let endPos = toGridCoordinate(curX, curY); // if the start position is set, the next clicked node will be the end position
                  
                  let clonedGrid = grid.clone(); // clones the grid to prevent the original grid from being modified
        
                  if(!data.GridChanges){
                    
                      console.log("No grid changes for this area");
                    
                  } else {
                    console.log("Grid changes for this area");
                    data.GridChanges(clonedGrid, startPos, endPos); // calls the function that changes the grid for the current area if exists
                    
                  }
                  
                  let path = finder.findPath( // finds the shortest possible path between the two positions using the A* algorithm provided by the pathfinding library.
                    startPos[0],
                    startPos[1],
                    endPos[0],
                    endPos[1],
                    clonedGrid
                  );
          
                  drawPath(path); // calls drawPath function to draw the route.
                  startPos = false; // resets the start position to false
          
                } else {
        
                  if(startID){
                    startID.removeAttribute("id"); // removes the id of the start node if it exists
                    if(endID){
                      endID.removeAttribute("id"); // removes the id of the end node if it exists
                    }
                  }
        
                  clearStairs(); // clears the stairs if they exist
                  clearPath(); // clears the path if it exists
                  startPos = toGridCoordinate(curX, curY); // sets the start position to the clicked node
                  this.setAttribute("id", "start"); // sets the id of the clicked node to start
                  
                  startImg.setAttribute("x", this.getAttribute("cx") - 30);
                  startImg.setAttribute("y", this.getAttribute("cy") - 45);
                  endImg.style.opacity = "0";
                  startImg.style.opacity = "1";
          
                }
        
              }
        
            });
          });
        
        });

    }
    reinitialize(); // clears the paper and reinitializes the grid and pathfinder
}


var grid = new PF.Grid(numCols, numRows), //Initialize grid and Pathfinder using pathfinding.js
  finder = new PF.AStarFinder({
    heuristic: PF.Heuristic.octile,
    diagonalMovement: PF.DiagonalMovement.Always,
    dontCrossCorners: true,
  }); 

var pinAnim; // initialize the pin animation

var gridObjs = []; // initialize the array of objects in Grid

var bldngStairs = {}; // initialize the object of stairs in the building

const upperFlrCheck = (m) => bldngStairs[m] || "Not found!";

var pathStyle = { // set the style of the path
  stroke: "green",
  "stroke-width": 5,
  "arrow-end": "classic-wide-long",
};

function setWalkables(walkArray) { // set the walkable nodes of the grid
  for (i = 0; i < numRows; ++i) { // Iterate through the grid using the number of rows and columns then set all nodes to unwalkable
    // HEIGHT
    for (j = 0; j < numCols; ++j) {
      // WIDTH
      grid.setWalkableAt(j, i, false);
    }
  }

  if(!walkArray) { // if array of walkable nodes exists, set the nodes to walkable. Else, return.
    console.log("No walkable nodes found");
    return;
  } else{
    for (var coords in walkArray) {
    grid.setWalkableAt(walkArray[coords][0], walkArray[coords][1], true);
    }
  }

  
}

function isArrayInObject(arr, obj) { // check if array is in object. used to check if the node is an entrance
  for (const key in obj) {
    if (Array.isArray(obj[key]) && obj[key].length === arr.length) {
      var isEqual = true;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== obj[key][i]) {
          isEqual = false;
          break;
        }
      }
      if (isEqual) {
        return true;
      }
    }
  }
  return false;
}

function objectToArray(obj) { // convert object to array
  var arr = [];
  for (var key in obj) {
    arr.push([obj[key].Coordinates[0], obj[key].Coordinates[1]]);
  }
  return arr;
}

function drawGrid(arrEnt) { // arrEnt = array of entrances, arrClicks = array of clickable nodes. Draws the grid.
  
  for (i = 0; i < numRows; ++i) {
    gridObjs.push([]);
    for (j = 0; j < numCols; ++j) {

      x = j * nodeSize;
      y = i * nodeSize;

      var gridX = x / nodeSize, // get the coordinates of the node
      gridY = y / nodeSize;
      
      var coordToArr = [ gridX, gridY ]; // convert the coordinates to array

      var arrayCoords = objectToArray(arrEnt);
      // var arrayCoords = data.WalkableGrids
  
      if(isArrayInObject(coordToArr, arrayCoords)) { // if the node at coordinate exist, it is an entrance, draw a circle. Else, draw a rectangle.

        rect = paper.circle(x+20.5, y+21, 15); // CODE IF CIRCLE
        rect.attr("fill", "#00b300");
        rect.attr("class", "circlers");

        // rect = paper.rect(x, y, nodeSize, nodeSize); // CODE IF RECT (FOR TESTING)
        // rect.attr("fill", "#4bd670");
        // rect.attr("class", "walkers");

      } else { // if the node is not an entrance, draw a rectangle
        rect = paper.rect(x, y, nodeSize, nodeSize);
        rect.attr("fill", "#f00");
        rect.attr("class", "recters");
      }
      rect.attr("stroke", "#fff");     
    }
  }

  for (obj in data.startPoints) { // draw the stairs
    if(data.startPoints[obj].Floor) {
      if(data.startPoints[obj].Floor == 2 && !(data.startPoints[obj].Coordinates[1] in bldngStairs)) {
        bldngStairs[data.startPoints[obj].Coordinates[1]] = "F1";
      } else if(data.startPoints[obj].Floor == 3 && !(data.startPoints[obj].Coordinates[1] in bldngStairs)) {
        bldngStairs[data.startPoints[obj].Coordinates[1]] = "F2";
      } else if(data.startPoints[obj].Floor == 4 && !(data.startPoints[obj].Coordinates[1] in bldngStairs)) {
        bldngStairs[data.startPoints[obj].Coordinates[1]] = "F3";
      } else if(data.startPoints[obj].Floor == 5 && !(data.startPoints[obj].Coordinates[1] in bldngStairs)) {
        bldngStairs[data.startPoints[obj].Coordinates[1]] = "F4";
      }
    }
  }

  if(data.stairsDisplay) { // display the stairs
    data.stairsDisplay(gridObjs, bldngStairs);
  }

  var focusObj = paper.rect(0, 0, nodeSize, nodeSize); // initialize the focus object
  focusObj.attr("fill", "#fff");
  focusObj.attr("class", "focus");
  focusObj.attr("opacity", 0);

  var pinObj = paper.image("pin.png", 0, 0, nodeSize + 10, nodeSize + 10) // initialize the pin object
  .attr("class", "pin");
  pinObj.attr("opacity", 0);

  var startImg = paper.image("/imgs/start.png", 0, 0, nodeSize + 10, nodeSize + 10) // initialize the start and end objects
  .attr("class", "startImg")
  .attr("opacity", 0);

  var endImg = paper.image("/imgs/end.png", 0, 0, nodeSize + 10, nodeSize + 10) 
  .attr("class", "endImg")
  .attr("opacity", 0);

  var cover = paper.rect(0, 0, gridWidth, gridHeight) // initialize the cover object
  .attr("fill", "red")
  .attr("class", "cover")
  .attr("opacity", 0);
  
  gridObjs.push(startImg); // push the objects to the gridObjs array
  gridObjs.push(endImg);
  gridObjs.push(focusObj);
  gridObjs.push(pinObj);
  gridObjs.push(cover);
  

}

function drawPath(path, path2) { // draw the route using the passed in path. path = array of coordinates. if no path found, return. else, draw the path.
  if (!path.length) {
    console.log("No path found");
    return;
  }

  if(path2){

    for(var i = 1; i < path2.length; i++) {
      path.push(path2[i])
    }

  }
  
  for (crd in path) {
    
    if(upperFlrCheck(path[crd][1]) == "F1") {
      document.querySelector(".F1L").style.opacity = "1";
      document.querySelector(".F1R").style.opacity = "1";
    } else if(upperFlrCheck(path[crd][1]) == "F2") {
      document.querySelector(".F2L").style.opacity = "1";
      document.querySelector(".F2R").style.opacity = "1";
    } else if(upperFlrCheck(path[crd][1]) == "F3") {
      document.querySelector(".F3L").style.opacity = "1";
      document.querySelector(".F3R").style.opacity = "1";
      document.querySelector(".F4L").style.opacity = "1";
      document.querySelector(".F4R").style.opacity = "1";
    } else if(upperFlrCheck(path[crd][1]) == "F4") {
      document.querySelector(".F5L").style.opacity = "1";
      document.querySelector(".F5R").style.opacity = "1";
    }
    
  }

  clearAnims();
    
    this.path = this.paper.path().attr(this.pathStyle);
    var focusPath = document.querySelector(".focus")
    focusPath.style.position = "absolute";
    focusPath.setAttribute("x", 0);
    focusPath.setAttribute("y", 0);

    let coverRect = document.querySelector(".cover");
    coverRect.style.display = "block";

    startedAnimation = true;

    var i = 0;
    var size = this.nodeSize;
    var animatePath = function () {
      if (i < path.length) {
        var x = path[i][0] * size + size / 2;
        var y = path[i][1] * size + size / 2;
        focusPath.style.opacity = "0";
        focusPath.setAttribute("x", x);
        focusPath.setAttribute("y", y);
        if(i === 1) {
          focusPath.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' })
          focusPath.style.transition = "all 0.1s";
        } else {
          focusPath.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' }, false)
        }
  
        var point = i === 0 ? "M" : "L";
        var newPath = this.path.attr("path") + "s " + point + x + "," + y;
        
        this.path.animate({ path: newPath }, 100, animatePath);
        i++;
      } else {
        coverRect.style.display = "none";
        startedAnimation = false;
      }

    }.bind(this);
  
    animatePath();

}


function clearPath() { // clear the path if it exists.
  if (this.path) {
    this.path.remove();
  }
}

function toGridCoordinate(pageX, pageY) { // converts the coordinate of the clicked node to the grid coordinate

  return [Math.floor(pageX / this.nodeSize), Math.floor(pageY / this.nodeSize)];
}

var startPos = false; // boolean to check if the start position is set

const checkElement = async selector => { // checks if the element exists.

  while ( document.querySelector(selector) === null) {
    await new Promise( resolve =>  requestAnimationFrame(resolve) )
  }
  return document.querySelector(selector); 
};

checkElement('rect').then(() => { // waits for the grid objects to finish drawing then add event listeners to the grid objects.

  const gridCircles = document.querySelectorAll(".circlers"); // selects all the circles or entrances

  gridCircles.forEach((item) => {

    item.addEventListener("click", function (e) { // add event listener to each circle or entrance

      var curX = this.getAttribute("cx"); // gets the x coordinate of the clicked circle
      var curY = this.getAttribute("cy"); // gets the y coordinate of the clicked circle

      var clicked = toGridCoordinate(curX, curY); // converts the coordinate of the clicked node to the grid coordinate

      let startID = document.getElementById("start"); // gets the start and end elements
      let endID = document.getElementById("end"); 

      let startImg = document.querySelector(".startImg"); // gets the start and end images
      let endImg = document.querySelector(".endImg");

      if(data.CustomFunction){ // if the custom function is set, run the custom function 

        if(startPos){ // if the start position is set, set the end position and run the custom function
          var endPos = toGridCoordinate(curX, curY);
  
          data.CustomFunction(startPos, endPos); // run the custom function
  
          startPos = false;
        } else { // if the start position is not set, set the start position and run the custom function
          clearPath();
          clearStairs();
          startPos = toGridCoordinate(curX, curY);
        }

      } else {

        if (startPos) { // if the start position is set, wait for the end position to be set then find the shortest possible path between the two positions using the A* algorithm provided by the pathfinding library.
        
          if((clicked[0] == startPos[0]) && (clicked[1] == startPos[1])){ // if the start position is clicked again, reset the start position allowing user to click on another node to set the start position
            startPos = false;
            console.log("Start position reset");
            checkElement('.focus').then((focusObj) => { 
  
              focusObj.setAttribute("x", -20); // removes focus object on screen
              focusObj.setAttribute("y", -20);
              
            });
            return;
          }

          this.setAttribute("id", "end"); // sets the id of the clicked node to end
          endImg.style.opacity = "1";
          endImg.setAttribute("x", curX - 35);
          endImg.setAttribute("y", curY - 45);
  
          setWalkables(data.WalkableGrids); // resets the walkables for the current area
  
          let endPos = toGridCoordinate(curX, curY); // if the start position is set, the next clicked node will be the end position
          
          let clonedGrid = grid.clone(); // clones the grid to prevent the original grid from being modified

          if(!data.GridChanges){
            
              console.log("No grid changes for this area");
            
          } else {
            console.log("Grid changes for this area");
            data.GridChanges(clonedGrid, startPos, endPos); // calls the function that changes the grid for the current area if exists
            
          }
          
          let path = finder.findPath( // finds the shortest possible path between the two positions using the A* algorithm provided by the pathfinding library.
            startPos[0],
            startPos[1],
            endPos[0],
            endPos[1],
            clonedGrid
          );
  
          drawPath(path); // calls drawPath function to draw the route.
          startPos = false; // resets the start position to false
  
        } else {

          if(startID){
            startID.removeAttribute("id"); // removes the id of the start node if it exists
            if(endID){
              endID.removeAttribute("id"); // removes the id of the end node if it exists
            }
          }

          clearStairs(); // clears the stairs if they exist
          clearPath(); // clears the path if it exists
          startPos = toGridCoordinate(curX, curY); // sets the start position to the clicked node
          this.setAttribute("id", "start"); // sets the id of the clicked node to start
          
          startImg.setAttribute("x", this.getAttribute("cx") - 30);
          startImg.setAttribute("y", this.getAttribute("cy") - 45);
          endImg.style.opacity = "0";
          startImg.style.opacity = "1";
  
        }

      }

    });
  });

});

function navigateTo(posFrom, posTo) { // used to navigate to a location from the sidebar

  if(startedAnimation == false) {
    console.log("Started animation");

      const coordinates = {} // object to store the coordinates of the start points
  for (var key in data.startPoints) { // loop through the start points and store the coordinates in the coordinates object
    coordinates[data.startPoints[key].Name] = [data.startPoints[key].Coordinates[0], data.startPoints[key].Coordinates[1]];
  }

  const coordSetter = (locationPicked) => coordinates[locationPicked] || "Not found!"; // return the picked location from sidebar

  var start = coordSetter(posFrom); // gets the start position
  var end = coordSetter(posTo);

  let clonedGrid = grid.clone();  // clones the grid to prevent the original grid from being modified

  let allSP = document.querySelectorAll(".circlers"); // gets all the circles or entrances
  allSP.forEach((item) => { // loops through all the circles or entrances
   
    let curCircle = toGridCoordinate(item.getAttribute("cx"), item.getAttribute("cy")); // converts the coordinate of the current node to the grid coordinate

    if(curCircle[0] == start[0] && curCircle[1] == start[1]){ // if the current node is the start node, set the id of the node to start
      item.setAttribute("id", "start");

      let startImg = document.querySelector(".startImg"); // gets the start image
      startImg.setAttribute("x", item.getAttribute("cx") - 30);
      startImg.setAttribute("y", item.getAttribute("cy") - 45);
      startImg.style.opacity = "1";
    }

    if(curCircle[0] == end[0] && curCircle[1] == end[1]){ // if the current node is the end node, set the id of the node to end
      item.setAttribute("id", "end");

      let endImg = document.querySelector(".endImg"); // gets the end image
      endImg.setAttribute("x", item.getAttribute("cx") - 35);
      endImg.setAttribute("y", item.getAttribute("cy") - 45);
      endImg.style.opacity = "1";
    }

  });

  clearStairs();
  clearPath();

  if(data.CustomFunction){ // if the current area has a custom function, run the custom function
    startPos = true;
    data.CustomFunction(start, end);
    startPos = false;
  } else {

    if(!data.GridChanges){
              
      console.log("No grid changes for this area");
      
    } else {
      
      console.log("Grid changes for this area");
      data.GridChanges(clonedGrid, start, end); // calls the function that changes the grid for the current area if exists
      
    }
    
    let path = finder.findPath( // finds the shortest possible path between the two positions using the A* algorithm provided by the pathfinding library.
      start[0],
      start[1],
      end[0],
      end[1],
      clonedGrid
    );

    drawPath(path); // calls drawPath function to draw the route.

  }

    

  } else {
    alert("Animation already started. Please wait until it's finished!");
    return;
  }

}

function changeGrids(clone, minGrid, plusGrid) { // changes the grids for the current area
  console.log("Changing grids");

  for (var i = 0; i < plusGrid.length; i++) {
    clone.setWalkableAt(plusGrid[i][0], plusGrid[i][1], true);
  }

  for (var i = 0; i < minGrid.length; i++) {
    clone.setWalkableAt(minGrid[i][0], minGrid[i][1], false);
  }

  return clone;

}

function checkCoordinatesExist(outerArray, innerArray) { // checks if the coordinates exist in the array
  for (var i = 0; i < outerArray.length; i++) {
    var coord = outerArray[i];
    if (coord[0] === innerArray[0] && coord[1] === innerArray[1]) {
      return true;
    }
  }
  return false;
}

function addPin(location) { // adds a pin to the map

  clearAnims(); // clears the animations if they exist

  const pinCoords = {} // object to store the coordinates of the start points

  const pinCoordGetter = (pinLocPicked) => pinCoords[pinLocPicked] || "Not found!"; // return the picked location from sidebar

  if(curArea == "eac2D") { 

    for (var key in data.startPoints) {
      pinCoords[data.startPoints[key].Name] = [data.startPoints[key].Coordinates[0] * nodeSize - 8, data.startPoints[key].Coordinates[1] * nodeSize - 40];
    }

    var pinCoord = pinCoordGetter(location);

  } else {

    for (var key in data.startPoints) {
      pinCoords[data.startPoints[key].Name] = [data.startPoints[key].PinLoc[0], data.startPoints[key].PinLoc[1]];
    }

    var pinCoord = pinCoordGetter(location); // gets the coordinates of the pin
    
  }

  var pin = document.querySelector(".pin"); // gets the pin reference

  pin.setAttribute("transform", "translate(" + pinCoord[0] + "," + pinCoord[1] + ")"); // sets the coordinates of the pin

  pin.scrollIntoView({behavior: "smooth", block: "center", inline: "center"}); // scrolls to the pin

  requestAnimationFrame(toZeroCap) // calls the toZeroCap function to make the pin blink

}

function removePin() { // removes the pin from the map
  clearAnims();
  var pin = document.querySelector(".pin");
  // console.log("hiding pin");
  pin.style.opacity = 0;

}

function toZeroCap() { // makes the pin blink

  var pin = document.querySelector(".pin");

  pin.style.transition = "ease-in-out 1s";
  pin.style.opacity = 0;

  setTimeout(function() {
    requestAnimationFrame(function() {
      pin.style.opacity = 1;
      setTimeout(function() {
        requestAnimationFrame(toZeroCap)
      }, 1000);
    });
  }, 1000);

}

function clearAnims() { // clears the animations

  let curAnims = window.requestAnimationFrame(function() {}, 0);

  let curTimeouts = window.setTimeout(function() {}, 0);

  while (curTimeouts--) {
    window.clearTimeout(curTimeouts);
  }

  while (curAnims--) {
    window.cancelAnimationFrame(curAnims);
  }

}

function clearStairs () { // clears the stairs
  for (var i = 0; i < Object.keys(bldngStairs).length; i++) {
    document.querySelector("." + upperFlrCheck(Object.keys(bldngStairs)[i]) + "L").style.opacity = "0";
    document.querySelector("." + upperFlrCheck(Object.keys(bldngStairs)[i]) + "R").style.opacity = "0";
  }

}