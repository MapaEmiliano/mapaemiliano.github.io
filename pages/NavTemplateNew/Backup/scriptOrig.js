// costMatrix = window.matrix; 

const svgMap = document.getElementById('pngMap');
const gridWidth = svgMap.naturalWidth;
const gridHeight = svgMap.naturalHeight;

var $matrix = $('.matrix'),
    grid = new PF.Grid(gridWidth, gridHeight),
    finder = new PF.AStarFinder({
        heuristic: PF.Heuristic.octile,
        diagonalMovement : PF.DiagonalMovement.Always
    }),

    // startPos = false

  square = 30;
    
  matrixWidth = grid.width,
  matrixHeight = grid.height;

  // console.log(parseFloat(matrixWidth / square), parseFloat(matrixHeight / square));

$matrix.css('width', (matrixWidth) + 'px');
$matrix.css('height', (matrixHeight) + 'px');

for (let i = 0; i < (matrixHeight/square); i++) {
    for (let j = 0; j < (matrixWidth/square); j++) {

      var $square = $('<div class="square"><span id="num">'+i+','+j+'</span></div>').appendTo( $matrix );
      
      if(j == 1) {
        grid.setWalkableAt(j, i, true);

        // console.log(j, i);

      } else {
        grid.setWalkableAt(j, i, false);
        
      }
      
    }
}

posToCords = function(pos){
    return [
      pos % matrixWidth,
    ~~(pos / matrixWidth),
    ];
}

cordsToPos = function(cords){ //array
    return (cords[1] * matrixWidth) + cords[0] ;
}

    let startCords = [1,2]
    let endCords = [3,4]
    var path = finder.findPath(startCords[0], startCords[1], endCords[0], endCords[1], grid.clone());
    console.log('from:', startCords, 'to:', endCords, 'path:', path);
    console.log(startCords[0], startCords[1]);
    
  // animatePath(path)

// $matrix.on('click', '.square', function(){
//   var $this = $(this);
//   var thisIndex = $this.index();
//   console.log($this);
//   $('.square').removeClass('path');
//   if( startPos ){
//     console.log('startPos', startPos);
//     var startCords = posToCords(startPos);
//     var endCords = posToCords(thisIndex);

//     console.log(startPos, thisIndex);

//     var path = aStarFinder.findPath(startCords[0], startCords[1], endCords[0], endCords[1], grid.clone());
//     console.log('from:', startCords, 'to:', endCords, 'path:', path);
//     console.log(startCords[0], startCords[1]);

//     animatePath(path); // Call the function to animate the path
//     startPos = false;

//   } else { 
//     $('.square').removeClass('start');
//     $this.addClass('start');
//     startPos = thisIndex;
//   }
//   });

  // window.addEventListener('load', function() {

  //   navigate([26, 139], [20, 134]);
  
  // });

  // function navigate(posEnt, posExit) {
  //   console.log(posEnt, posExit);

  //     var path = aStarFinder.findPath(posEnt[0], posEnt[1], posExit[0], posExit[1], grid.clone());
  
  //     animatePath(path); // Call the function to animate the path
  
  // }
  

  // var squareSize = 30; 

  // function animatePath(path) {
  //   $('.route').remove();
  
  //   // Iterate through each coordinate in the path
  //   path.forEach(function(cord, index) {
  //     setTimeout(function() {

  //       // Add 'path' class to the corresponding square
  //       $('.square:eq('+cordsToPos(cord)+')').addClass('path');
        

  //       // If not the last coordinate, calculate the position of the next square
  //       if (index < path.length - 1) {
  //         var nextCord = path[index + 1];
  //         var startX = cord[0] * squareSize + squareSize / 2;
  //         var startY = cord[1] * squareSize + squareSize / 2;
  //         var endX = nextCord[0] * squareSize + squareSize / 2;
  //         var endY = nextCord[1] * squareSize + squareSize / 2;
  
  //         // Create a line element with CSS properties
  //         var $route = $('<div class="route"></div>');
  //         $route.css({
  //           'position': 'absolute',
  //           'left': (startX + 6) + 'px',
  //           'top': (startY + 6) + 'px',
  //           'width': Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) + 'px',
  //           'transform-origin': 'top left',
  //           'transform': 'rotate(' + (Math.atan2(endY - startY, endX - startX) * 180 / Math.PI) + 'deg)',
  //           'background-color': 'red',
  //           'height': '2px'
  //         });
  
  //         // Append the line element to the DOM
  //         $('body').append($route);
  //       }
  //     }, 50 * index); // Add a delay of 50ms for each step of the path
  //   });
  // }

