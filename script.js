const levelMap = {
    easy: { boardSize: 8,  mineCount: 15   },
    medium: { boardSize: 9,  mineCount:  33  },
    hard: { boardSize: 10,  mineCount: 55  },
}

document.getElementById("level").addEventListener("change", startGame);

function startGame(){
    const level = document.getElementById("level");
    const flags = document.getElementById("count");
    const gameBoard = document.getElementById("board");


    let board = [];
    let mines = [];
    let revealedTiles = 0;
    let boardSize = levelMap[level.value].boardSize;
    let mineCount = levelMap[level.value].mineCount;
    let flagCount = mineCount;
    flags.innerText = flagCount;

    revealedTiles = 0

    while(mines.length < mineCount){
        let r = Math.floor(Math.random() * boardSize);
        let c = Math.floor(Math.random() * boardSize);
        let id = r + "-" + c;
        console.log(id);
        if(!mines.includes(id)){
            mines.push(id);
        }
    }
    console.log(mines);

    createBoard();

    function createBoard(){
        gameBoard.innerHTML = "";
        for(let i = 0; i < boardSize; i++){
            const rowEl = document.createElement("div");
            rowEl.classList.add("minesweeper-row", "row");
            let row = [];

            for(let j = 0; j < boardSize; j++){
                const tile = document.createElement("div");
                tile.id = `${i}-${j}`;
                tile.classList.add("tiles", "unrevealed");

                tile.addEventListener("click", revealTile);
                tile.addEventListener("contextmenu", putFlag);

                row.push(tile); // adding tile to row array
                rowEl.append(tile); // appending tile to row element
            }
            board.push(row); // adding the row to the board array
            gameBoard.append(rowEl); // appending row to the game board
        }

    }

    function putFlag(event){
        event.preventDefault();
        const box = event.currentTarget;
        if(box.classList.contains("revealed")){
            return;
        }
        if (box.classList.contains("flagged")) {
            box.classList.remove("flagged");
            flagCount++;
        } else {
            box.classList.add("flagged");
            flagCount--;
        }
        flags.textContent = flagCount;
    }

    function revealTile(event){
        const tile = event.currentTarget;

        if (tile.classList.contains("flagged") || tile.classList.contains("revealed")) return;
        
        tile.classList.add("revealed");
        revealedTiles++;
        
        const val = tile.id.split("-");
        const row = parseInt(val[0]);
        const col = parseInt(val[1]);
    
        if (mines.includes(tile.id)) {
            tile.classList.add("mine");
            tile.classList.add("revealed");
            revealAllMines();
            showResultScreen(false);
            // alert("Game Over");
            return;
        } 

        let mineCount = countAdjacentMines(row, col);
        if (mineCount > 0) {
            tile.textContent = mineCount;
        } 
        else {
            revealAdjacent(row, col);
        }

        checkWin();
    }

    function countAdjacentMines(row, col){
        let count = 0;
        for(let x = -1; x <= 1; x++){
            for(let y = -1; y <= 1; y++){
                const newRow = row + x;
                const newCol = col + y;

                if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize) {
                                continue;
                }

                if(newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize && mines.includes(newRow + "-" + newCol)){
                    count++;
                }
            }
        }
        return count;
    }

    function revealAdjacent(row, col){
        for(let x = -1; x <= 1; x++){
            for(let y = -1; y <= 1; y++){
                const newRow = row + x;
                const newCol = col + y;
                if(newRow >= 0 & newRow < boardSize && newCol >= 0 && newCol < boardSize){
                    const adjacentTile = board[newRow][newCol];
                    if (!adjacentTile.classList.contains("revealed")) {
                        adjacentTile.classList.add("revealed");
                        revealedTiles++;

                        const adjacentMineCount = countAdjacentMines(newRow, newCol);
                        if (adjacentMineCount > 0) {
                            adjacentTile.textContent = adjacentMineCount;
                        } 
                        else {
                            revealAdjacent(newRow, newCol); 
                        }
                    }
                }
            }
        }
    }

    function revealAllMines(){
        mines.forEach((coordinates) => {
            const val = coordinates.split("-");
            const r = parseInt(val[0]);
            const c = parseInt(val[1]);
            board[r][c].classList.add("revealed", "mine");
        });
    }

    function checkWin() {
        if (revealedTiles === boardSize * boardSize - mineCount) {
            // alert("You Win!");
            showResultScreen(true);
            revealAllMines();
        }
    }
    
}

function showResultScreen(isWin){
    const winScreen = document.getElementById("win-screen");
    const gameOverScreen = document.getElementById("game-over-screen");
    if (isWin) {
        winScreen.classList.remove("hide");
    } 
    else {;
        gameOverScreen.classList.remove("hide");
    }

    const winButton = document.getElementById("play-again-button");
    winButton.addEventListener("click", () => {
        winScreen.classList.add("hide");
        startGame(); 
    });

    const gameOverButton = document.getElementById("game-over-button");
    gameOverButton.addEventListener("click", () => {
        gameOverScreen.classList.add("hide");
        startGame();
    });

}

    const startScreen = document.getElementById("start-screen");
    const startBtn = document.getElementById("start-button");
    const resetButton = document.getElementById("exit");

    startBtn.addEventListener("click", () =>{
        // console.log("helll yeaaahhhhh");
        document.querySelector(".overlay-content").classList.add("hide");
        document.querySelector(".minesweeper").classList.remove("hide");
        startGame();
    });

    resetButton.addEventListener("click", () => {
        document.querySelector(".overlay-content").classList.remove("hide");
        document.querySelector(".minesweeper").classList.add("hide");
    });
