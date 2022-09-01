let numLetters = 5;

const words = ['sauce', 'jeans', 'beans', 'horse', 'month']

const game = {
    boardState: Array(6).fill().map(() => Array(numLetters).fill('')),
    rowIndex: 0,
    colIndex: 0,
    solution: words[Math.floor(Math.random() * words.length)]
}

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

function getRowWord(){
    game.boardState[game.rowIndex].reduce((word, letter) => word + letter)
}

function handleInput(letter){
    if(letter === 'Enter'){
        if(game.colIndex === numLetters){
            const word = getRowWord()

            revealWord(word);
        } else {
            alert(`The word must be ${numLetters} letters long`)
        }
    }

    if(letter === 'Backspace'){
        if(game.colIndex > 0){
            deleteLetter();
        }
    }

    if(letter.match(/[a-z]/i) && letter.length === 1){
        if(game.colIndex < numLetters){
            addLetter(letter)
        }
    }

    mapBoardStateToGrid();
}

function registerInputEvents(){
    //Add event listeners to keyboard buttons

    //get all keyboard buttons
    const keys = document.querySelectorAll('.keyboard-btn');

    //add event handlers to keys onClick event
    keys.forEach(key => {
        key.onclick = ({target}) => {
            const val = target.dataset.key;            
            handleInput(val);
        };
    })

    //handle keyboard input
    document.body.onkeydown = (e) => {
        const val = e.key;
        handleInput(val);
    };
}

function addLetter(letter){
    //Add letter to game state board and ui grid
    
    game.boardState[game.rowIndex][game.colIndex] = letter
    game.colIndex++;
}

function deleteLetter(){
    //Set last letter to empty string
    game.boardState[game.rowIndex][game.colIndex - 1] = '';

    //set the column index in the game state back one letter
    game.colIndex--;
}

function revealWord(word){

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

drawBoard();

mapBoardStateToGrid();

registerInputEvents();






