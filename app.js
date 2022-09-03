let numLetters = 5;

const gameStatus = {IN_PROGRESS: 0, PAUSED: 1, WON: 2, LOST: 3};

const numTries = 6;

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
    if(game.hardMode && game.offLimits.includes(letter)){        
        alert(`In hard mode, letters that are not in the word can only be guessed once`);   
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
                    console.log(e)
                    alert('Not in the word list')
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
    //Get all the tiles in the current row
    for(let i = 0; i < word.length; i++){

        const rowTile = document.getElementById(`tile${game.rowIndex}${i}`);
        
        const key = document.getElementsByName(`key-${word[i]}`)[0];
        

        //Adds classes and attributes to keys and tiles depending on secret word
        if(word[i] === game.solution[i]){
            //add correct class to
            rowTile.classList.add('correct');
            key.setAttribute('data-state', 'correct');
        } else if(game.solution.includes(word[i])){
            rowTile.classList.add('present');
            if(key.getAttribute('data-state') !== 'correct'){
                key.setAttribute('data-state', 'present');
            }
        } else {
            rowTile.classList.add('absent');
            key.setAttribute('data-state', 'absent')
            
            game.offLimits.push(word[i]);

        }

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

    disableHardModeControl();
    
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
        resetGame();
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

function hardModeToggle(){
    //only allow toggl of hard mode if no rows have been submitted
    if(game.rowIndex == 0){
        const hardModeCB = document.getElementsByName('hard-mode');

        hardModeCB[0].onclick = () => {
            game.hardMode = hardModeCB[0].checked;            
        }

    }
}

function disableHardModeControl(){
    const hardModeCB = document.getElementsByName('hard-mode');
    hardModeCB[0].disabled = true;
}

function resetHardModeControl(){
    const hardModeCB = document.getElementsByName('hard-mode');
    hardModeCB[0].disabled = false;
    hardModeCB[0].checked = false;
}

function themeToggle(){
    const themeCB = document.getElementsByName('light-theme');

    console.log(themeCB)

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

startGame();





