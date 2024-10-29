const levelMap = {
    easy: { boardSize: 8,  mineCount: 15   },
    medium: { boardSize: 10,  mineCount:  33  },
    hard: { boardSize: 14,  mineCount: 55   },
    evil: { boardSize: 15,   mineCount: 111  }
}

document.getElementById("level").addEventListener("change", startGame);

function startGame(){
    const level = document.getElementById("level");
    const flags = document.getElementById("flag-count");
    const gameBoard = document.getElementById("board");


    let board = [];
    let boardSize = levelMap[level.value].boardSize;
    let mines = [];
    let mineCount = levelMap[level.value].mineCount;
    let flagCount = mineCount;

    // int temp = 0;
    // while(mines.length < mineCount){
    //     const randomRow = Math.floor(Math.random() *boardSize);
    //     const randomCol = Math.floor(Math.random()*boardSize);

        
    // }

    function createBoard(){
        gameBoard.innerHTML = "";
        for(let i = 0; i < boardSize; i++){
            const rowEl = document.createElement("div");
            rowEl.classList.add("minesweeper-row", "row");
            let row = [];

            for(let j = 0; j < boardSize; j++){
                const tile = document.createElement("div");
                tile.classList.add("tiles", "unrevealed");

                tile.addEventListener("click", revealBox);
                tile.addEventListener("contextmenu", putFlag);

                row.push(tile); // adding tile to row array
                rowEl.append(tile); // appending tile to row element
            }
            board.push(row); // adding the row to the board array
            gameBoard.append(rowEl); // appending row to the game board
        }

    }


    function revealBox(event){
        const box = event.currentTarget;
        box.classList.remove("unrevealed");
        box.classList.add("revealed");
    }

    function putFlag(event){
        event.preventDefault();
        const box = event.currentTarget;
        if(box.classList.contains("revealed")){
            return;
        }
        if(box.classList.contains("flagged")){
            box.classList.remove("flagged");
        }
        else{
            box.classList.add("flagged");
            flagCount--;
        }
        flags.textContent = flagCount;

    }
    createBoard();
}



const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-button");
const resetButton = document.getElementById("exit");

startBtn.addEventListener("click", () =>{
    document.querySelector(".overlay-content").classList.add("hide");
    document.querySelector(".minesweeper").classList.remove("hide");
    startGame();
});

resetButton.addEventListener("click", () => {
    document.querySelector(".overlay-content").classList.remove("hide");
    document.querySelector(".minesweeper").classList.add("hide");
});
