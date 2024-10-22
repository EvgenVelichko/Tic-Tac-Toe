const cells = document.querySelectorAll('[data-cell]');
const restartButton = document.getElementById('restartButton');
const aiToggle = document.getElementById('aiToggle');
const aiDifficultySelect = document.getElementById('aiDifficulty');
let isCircleTurn = false;
let isAiEnabled = false;
let aiDifficulty = 'easy';
let gameBoard = Array(9).fill(null);
const player = 'x';
const ai = 'circle';

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const startGame = () => {
    isCircleTurn = false;
    gameBoard.fill(null);
    cells.forEach(cell => {
        cell.classList.remove('x');
        cell.classList.remove('circle');
        cell.textContent = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
};

const handleClick = (e) => {
    const cell = e.target;
    const currentClass = isCircleTurn ? 'circle' : 'x';
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame();
    } else if (isDraw()) {
        endGame();
    } else {
        swapTurns();
        if (isAiEnabled) aiMove();
    }
};

const aiMove = () => {
    const availableCells = gameBoard.map((val, index) => val === null ? index : null).filter(val => val !== null);
    let aiChoice;

    if (aiDifficulty === 'easy') {
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        aiChoice = availableCells[randomIndex];
    } else if (aiDifficulty === 'medium') {
        aiChoice = findBestMove(player, ai);
    } else if (aiDifficulty === 'hard') {
        aiChoice = minimax(gameBoard, ai).index;
    }

    const cell = cells[aiChoice];
    placeMark(cell, ai);
    if (checkWin(ai)) {
        endGame();
    } else if (isDraw()) {
        endGame();
    } else {
        swapTurns();
    }
};

const findBestMove = (playerClass, aiClass) => {
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        const line = [gameBoard[a], gameBoard[b], gameBoard[c]];
        if (line.filter(mark => mark === playerClass).length === 2 && line.includes(null)) {
            return winningCombinations[i].find(index => gameBoard[index] === null);
        }
    }
    const availableCells = gameBoard.map((val, index) => val === null ? index : null).filter(val => val !== null);
    return availableCells[Math.floor(Math.random() * availableCells.length)];
};

const placeMark = (cell, currentClass) => {
    const cellIndex = Array.from(cells).indexOf(cell);
    gameBoard[cellIndex] = currentClass;
    cell.classList.add(currentClass);
    cell.textContent = currentClass === 'x' ? 'X' : 'O';
};

const swapTurns = () => {
    isCircleTurn = !isCircleTurn;
};

const checkWin = (currentClass) => {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return gameBoard[index] === currentClass;
        });
    });
};

const isDraw = () => {
    return gameBoard.every(cell => cell !== null);
};

const endGame = () => {
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
};

const minimax = (newBoard, currentClass) => {
    const availableSpots = newBoard.map((val, index) => val === null ? index : null).filter(val => val !== null);

    if (checkWinFor(currentClass === ai ? player : ai, newBoard)) {
        return { score: -10 };
    } else if (checkWinFor(currentClass, newBoard)) {
        return { score: 10 };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
        const move = {};
        move.index = availableSpots[i];
        newBoard[availableSpots[i]] = currentClass;

        if (currentClass === ai) {
            const result = minimax(newBoard, player);
            move.score = result.score;
        } else {
            const result = minimax(newBoard, ai);
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = null;
        moves.push(move);
    }

    let bestMove;
    if (currentClass === ai) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
};

const checkWinFor = (currentClass, board) => {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return board[index] === currentClass;
        });
    });
};

aiToggle.addEventListener('change', (e) => {
    isAiEnabled = e.target.checked;
    aiDifficultySelect.disabled = !isAiEnabled;
});

aiDifficultySelect.addEventListener('change', (e) => {
    aiDifficulty = e.target.value;
});

restartButton.addEventListener('click', startGame);

startGame();
