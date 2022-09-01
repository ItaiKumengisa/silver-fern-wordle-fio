let numLetters = 5;

const words = ['sauce', 'jeans', 'beans', 'horse', 'month']

const state = {
    boardState: Array(6).fill().map(() => Array(numLetters).fill('')),
    currentRow: 0,
    currentCol: 0,
    solution: words[Math.floor(Math.random() * words.length)]
}

drawBoard();

console.log(state)

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

function registerInputEvents(){
    
}






