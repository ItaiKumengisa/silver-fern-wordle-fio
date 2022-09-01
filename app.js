let numLetters = 5;

const words = ['sauce', 'jeans', 'beans', 'horse', 'month']

const game = {
    boardState: Array(6).fill().map(() => Array(numLetters).fill('O')),
    currentRow: 0,
    currentCol: 0,
    solution: words[Math.floor(Math.random() * words.length)]
}

drawBoard();

mapBoardStateToGrid();

console.log(game)

function drawBoard(){
    const board = document.getElementById('board');

    for(let row = 0; row < 6; row++){
        for(let col = 0; col < numLetters; col++){
            //Add square to board grid
            addTile(board, row, col, letter='');
        }          
    }
}




//Add square
function addTile(board, row, col, letter=''){

    //Create square
    const tile = document.createElement('div');

    //add the tile class
    tile.classList.add('tile');

    //add tile id
    tile.id = `tile${row}${col}`;

    //set the text content for the tile div
    tile.textContent = letter;

    board.appendChild(tile);
}

function registerInputEvents(){
    
}

function mapBoardStateToGrid(){
    for(let row = 0; row < 6; row++){
        for(let col = 0; col < numLetters; col++){
            //Get grid tile, set the text content
            const tile = document.getElementById(`tile${row}${col}`);

            //Set the tile's text content
            tile.textContent = game.boardState[row][col];
        }
    }
}






