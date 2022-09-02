let numLetters = 5;

const words = ['sauce', 'jeans', 'beans', 'horse', 'month']

const gameStatus = {IN_PROGRESS: 0, PAUSED: 1, WON: 2, LOST: 3};

const numTries = 6;

const game = {
    boardState: Array(numTries).fill().map(() => Array(numLetters).fill('')),
    rowIndex: 0,
    colIndex: 0,
    solution: words[Math.floor(Math.random() * words.length)],
    gameStatus: gameStatus.IN_PROGRESS
}

function drawBoard(){
    const board = document.getElementById('board');

    //Clear out existing innerHTML
    board.innerHTML = '';

    for(let row = 0; row < numTries; row++){
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
        console.log("colIndex", game.colIndex)
        console.log("numLetters", numLetters)
        console.log("equal? : ", game.colIndex == numLetters)
        if(game.colIndex == numLetters){
            console.log("Entered loop")
            const word = getRowWord();     
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
            if(game.gameStatus === gameStatus.IN_PROGRESS){
                const val = target.dataset.key;               
                handleInput(val);
            }
        };

        //Shortcut to set some attributes
        key.setAttribute('name', `key-${key.dataset.key}`);   
        key.setAttribute('tabIndex', -1);   
    })

    //handle keyboard input
    document.body.onkeydown = ({key}) => {
        if(game.gameStatus === gameStatus.IN_PROGRESS){
            handleInput(key);
        }
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

    if(word === game.solution){
        showWinMessage()
        game.gameStatus = gameStatus.WON;
    } else if(game.rowIndex === numTries - 1){
        alert('Better Luck Next Time!')
        game.gameStatus = gameStatus.LOST;
    }
    
    game.rowIndex++;
    game.colIndex = 0;
}

function showWinMessage(){
    switch(game.rowIndex){
        case 0:
            alert('Genius');
            break;
        case 1:
            alert('Magnificent');
            break;
        case 2:
            alert('Impressive');
            break;
        case 3:
            alert('Splendid');
            break;
        case 4:
            alert('Great');
            break;
        case 5:
            alert('Phew');
            break;
    }
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
    for(let row = 0; row < numTries; row++){
        for(let col = 0; col < numLetters; col++){
            //Get grid tile, set the text content
            const tile = document.getElementById(`tile${row}${col}`);

            //Set the tile's text content
            tile.textContent = game.boardState[row][col];
        }
    }
}

function changeWordLength(){
    
    //change the root variable length option
    const input = document.getElementsByName('word-length-input');
    if(input[0].value > 1 && input[0].value < 8){
        const root = document.querySelector(':root');
    
        root.style.setProperty('--num-of-letters',  input[0].value)
    
        numLetters = input[0].value;
    
        //Clear the keyboard
        resetKeyBoardDataStates();
        boardSetup();
    } else {
        alert('Number of char must be between 2 and 7')
    }
}

function boardSetup(){    
    game.boardState = Array(numTries).fill().map(() => Array(numLetters).fill(''));
    game.rowIndex = 0;
    game.colIndex = 0;
    drawBoard();
    mapBoardStateToGrid();
}

function resetKeyBoardDataStates(){
    //get all of the keys
    const keys = document.querySelectorAll('.keyboard-btn');

    keys.forEach( (k) => {
        k.setAttribute('data-state', 'untouched');
    })
}

function getNewWord(){
    fetch(`https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=${numLetters}&lettersMax=${numLetters}&partOfSpeech=verb`,
    {   
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '3ff3ef9c4fmshccc55004f0a484cp15bd1ejsn315604227e5b',
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
        }
    }).then(res =>  res.json()).then(({word}) => {
        game.solution = word;
        console.log(word)
    });
}

function startGame(){
    getNewWord();
    boardSetup();
    registerInputEvents();
}

startGame();





