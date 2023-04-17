
costMatrix = window.matrix; 
  
  var $matrix = $('.matrix'),
      grid = new PF.Grid(costMatrix),
    aStarFinder = new PF.AStarFinder({
          heuristic: PF.Heuristic.octile,
          diagonalMovement : PF.DiagonalMovement.Always
      }),
      

    startPos = false,
    matrixWidth = costMatrix[0].length;
    console.log('matrixWidth', matrixWidth);
  
  $matrix.css('width', (matrixWidth * 27) + 'px');
  costMatrix.forEach(function(line, x){
      line.forEach(function(cost, y){
        var $square = $('<div class="square">'+y+','+x+'</div>').appendTo( $matrix );
        // var $square = $('<div class="square">w</div>').appendTo( $matrix );
      if( cost === 1 ){
          $square.addClass('blocker');
      }
    });
  });
  
  posToCords = function(pos){
      return [
        pos % matrixWidth,
      ~~(pos / matrixWidth),
      ];
  }
  cordsToPos = function(cords){ //array
      return (cords[1] * matrixWidth) + cords[0] ;
  }

  $matrix.on('click', '.square', function(){
      var $this = $(this);
    var thisIndex = $this.index();
    $('.square').removeClass('path')
    if( startPos ){
        var startCords = posToCords(startPos);
        var endCords = posToCords(thisIndex);
        var path = aStarFinder.findPath(startCords[0],startCords[1], endCords[0],endCords[1], grid.clone());
        
      console.log('from:', startCords, 'to:', endCords, 'path:', path);
      path.forEach(function(cord){
          
          $('.square:eq('+cordsToPos(cord)+')').addClass('path');
      });
      // buildSVGPath(path)

      $('.output').text('from:'+ JSON.stringify(startCords)+ ' to:'+ JSON.stringify(endCords) + ' path:'+ JSON.stringify(path));
      startPos = false;
    } else { 
           $('.square').removeClass('start');
         $this.addClass('start');
        startPos = thisIndex;
    }
  });