let numLetters = 5;

const gameStatus = {IN_PROGRESS: 0, PAUSED: 1, WON: 2, LOST: 3};

const numTries = 6;

//Board
const board = document.getElementById('board');

//Key board
const keys = document.querySelectorAll('.keyboard-btn');

//Word Length input
const wordLengthInput = document.getElementsByName('word-length-input');

//root
const root = document.querySelector(':root');

//hard mode checkbox
const hardModeCB = document.getElementsByName('hard-mode');

//theme checkbox
const themeCB = document.getElementsByName('light-theme');

//alert message container
const container = document.querySelector('#messages')





function drawBoard(board){

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
    if(game.hardMode && game.offLimits.includes(letter)){        
        moveRow();
        showMessage(`In hard mode, letters that are not in the word can only be guessed once`, 5000);   

    } else {
        if(letter === 'Enter'){
            if(game.colIndex == numLetters){
                const word = getRowWord();      
                console.log(word)       
                fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}`,
                {   
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '3ff3ef9c4fmshccc55004f0a484cp15bd1ejsn315604227e5b',
                        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
                    }
                }).then(res =>  {
                    
                    if(res.status == 200){
                        revealWord(word);
                    } else {
                        throw Error();
                    }
                    
                }).catch( (e) => {
                    moveRow();
                    showMessage('Not in the word list', 1000)
                })
    
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

}

function registerInputEvents(){
    
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
    //Get all the tiles in the current row
    for(let i = 0; i < word.length; i++){

        const rowTile = document.getElementById(`tile${game.rowIndex}${i}`);
        
        const key = document.getElementsByName(`key-${word[i]}`)[0];
        

        //Adds classes and attributes to keys and tiles depending on secret word
        setTimeout(() => {
            rowTile.classList.add('turning');          

        }, (i * 500) / 2)

        setTimeout(() => {
            if(word[i] === game.solution[i]){
                //add correct class to
                rowTile.classList.add('correct');
            } else if(game.solution.includes(word[i])){
                rowTile.classList.add('present');
            } else {
                rowTile.classList.add('absent');
                game.offLimits.push(word[i]);    
            }
        }, ((i + 1 ) * 500) /2 )

        setTimeout(() => {            
            changekeyboardColors(key, word, i);
        }, (500) * (numLetters - 2));

    }

    if(word === game.solution){
        showWinMessage()
        game.gameStatus = gameStatus.WON;
    } else if(game.rowIndex === numTries - 1){
        showMessage('Better Luck Next Time!', 10000)
        game.gameStatus = gameStatus.LOST;
    }
    
    game.rowIndex++;
    game.colIndex = 0;

    disableHardModeControl();
    
}

function changekeyboardColors(key, word, i){
    if(word[i] === game.solution[i]){
        //add correct class to
        key.setAttribute('data-state', 'correct');
    } else if(game.solution.includes(word[i])){
        if(key.getAttribute('data-state') !== 'correct'){
            key.setAttribute('data-state', 'present');
        }
    } else {
        key.setAttribute('data-state', 'absent')
        game.offLimits.push(word[i]);    
    }
}

function showWinMessage(){
    switch(game.rowIndex){
        case 0:
            showMessage('Genius', 7000);
            break;
        case 1:
            showMessage('Magnificent', 7000);
            break;
        case 2:
            showMessage('Impressive', 7000);
            break;
        case 3:
            showMessage('Splendid', 7000);
            break;
        case 4:
            showMessage('Great', 7000);
            break;
        case 5:
            showMessage('Phew',7000);
            break;
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
    if(wordLengthInput[0].value > 1 && wordLengthInput[0].value < 8){
    
        root.style.setProperty('--num-of-letters',  wordLengthInput[0].value)
    
        numLetters = wordLengthInput[0].value;
    
        //Clear the keyboard
        resetGame();
    } else {
        showMessage('Number of char must be between 2 and 7', 2000)
    }
}

function boardSetup(){    
    game.boardState = Array(numTries).fill().map(() => Array(numLetters).fill(''));
    game.rowIndex = 0;
    game.colIndex = 0;
    drawBoard(board);
    mapBoardStateToGrid();
}

function resetKeyBoardDataStates(){
    //get all of the keys

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

function hardModeToggle(){
    //only allow toggl of hard mode if no rows have been submitted
    if(game.rowIndex == 0){

        hardModeCB[0].onclick = () => {
            game.hardMode = hardModeCB[0].checked;            
        }

    }
}

function disableHardModeControl(){
    hardModeCB[0].disabled = true;
}

function resetHardModeControl(){
    hardModeCB[0].disabled = false;
    hardModeCB[0].checked = false;
}

function themeToggle(){

    themeCB[0].onclick = () => {
        document.body.classList.toggle('light')
    }
}

function resetGame(){
    game = {
        boardState: Array(numTries).fill().map(() => Array(numLetters).fill('')),
        rowIndex: 0,
        colIndex: 0,
        solution: '', //Set during getNewWord()
        gameStatus: gameStatus.IN_PROGRESS,
        hardMode: false,
        offLimits: []
    };
    resetHardModeControl();
    getNewWord();
    resetKeyBoardDataStates();
    boardSetup();
}

function startGame(){
    game = {
        boardState: Array(numTries).fill().map(() => Array(numLetters).fill('')),
        rowIndex: 0,
        colIndex: 0,
        solution: '', //Set during getNewWord()
        gameStatus: gameStatus.IN_PROGRESS,
        hardMode: false,
        offLimits: []
    };
    getNewWord();
    themeToggle();
    hardModeToggle();
    boardSetup();
    registerInputEvents();
}

function moveRow(){
    //get row
    for(let col = 0; col < numLetters; col++){
        const tile = document.querySelector(`#tile${game.rowIndex}${col}`);        
        tile.classList.add('moving')
        tile.addEventListener('animationend' ,() => {
            tile.classList.remove('moving')
        })
    }
}

function showMessage(msg, duration){
    const message = document.createElement('div');
    message.textContent = msg;
    message.classList.add('message');

    container.prepend(message)

    setTimeout(() => {
        message.classList.add('hide');       
    }, duration)

    message.addEventListener('transitionend', () => {
        message.remove();
    });
    message.ontransitionend = () => {
        message.remove();
    }
}

startGame();
