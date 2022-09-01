let numLetters = 5;

drawBoard();



function drawBoard(){
    for(let row = 0; row < 6; row++){
        for(let col = 0; col < numLetters; col++){
            //Add square to board grid
            addTile()
        }          
    }
}




//Add square
function addTile(){

    //Select board 
    const board = document.getElementById('board');

    //Create square
    const tile = document.createElement('div');

    //add the tile class
    tile.classList.add('tile');


    board.appendChild(tile);
}






