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
    return game.boardState[game.rowIndex].reduce((word, letter) => word + letter)
}

function handleInput(letter){
    if(letter === 'Enter'){
        if(game.colIndex === numLetters){
            const word = getRowWord()     
            if(words.includes(word)){
                revealWord(word);
            } else {
                alert('Not in the word list')
            }
                  

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
            //Added name so I can locate the key to add classes
            handleInput(val);
        };
        key.setAttribute('name', `key-${key.dataset.key}`)   
    })

    //handle keyboard input
    document.body.onkeydown = ({key}) => {
        handleInput(key);
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
    //compare the current word against the solution
    for(let i = 0; i < word.length; i++){

        //Get all the tiles in the current row
        const rowTile = document.getElementById(`tile${game.rowIndex}${i}`);

        //If the letter is correct add the corresponding attribute to tile & keyboard btn
        addHintClassTile(rowTile, word, i);
        
        const key = document.getElementsByName(`key-${word[i]}`)[0];
        
        addHintClassKeyBoard(key, word, i);
    }

    game.rowIndex++;
    game.colIndex = 0;
}

function addHintClassTile(obj, word, letterIndex){
    if(word[letterIndex] === game.solution[letterIndex]){
        obj.classList.add('correct');
    } else if(game.solution.includes(word[letterIndex])){
        obj.classList.add('present');
    } else {
        obj.classList.add('absent');
    }
}

function addHintClassKeyBoard(obj, word, letterIndex){
        
    //If letter is not in word at all
    if(!game.solution.includes(word[letterIndex])){
        obj.setAttribute('data-state', 'absent')
    } else if(word[letterIndex] === game.solution[letterIndex]){
        obj.setAttribute('data-state', 'correct');
    } else {
        if(obj.getAttribute('data-state') !== 'correct'){
            obj.setAttribute('data-state', 'present');
        }
    }
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

console.log(words)





