const cells = document.querySelectorAll('[data-cell]');
const statusMessage = document.querySelector('.status-message');
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
    updateStatusMessage();
};

const handleClick = (e) => {
    const cell = e.target;
    const currentClass = player;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        updateStatusMessage();
        if (isAiEnabled) aiMove(); // Ход ИИ, если он включен
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
        
        aiChoice = minimax(ai).index;
    }

    const cell = cells[aiChoice];
    placeMark(cell, ai);

    if (checkWin(ai)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        updateStatusMessage();
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
    // Если нет угрозы, выбираем случайную клетку
    const availableCells = gameBoard.map((val, index) => val === null ? index : null).filter(val => val !== null);
    return availableCells[Math.floor(Math.random() * availableCells.length)];
};

const placeMark = (cell, currentClass) => {
    const cellIndex = Array.from(cells).indexOf(cell);
    gameBoard[cellIndex] = currentClass;
    cell.classList.add(currentClass);
    cell.textContent = currentClass === 'x' ? 'X' : 'O'; // Добавляем символ в ячейку
};

const swapTurns = () => {
    isCircleTurn = !isCircleTurn;
};

const updateStatusMessage = () => {
    statusMessage.innerText = isCircleTurn ? "Хід нуликів" : "Хід хрестиків";
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

const endGame = (draw) => {
    if (draw) {
        statusMessage.innerText = "Нічия!";
    } else {
        statusMessage.innerText = isCircleTurn ? "Нулики перемогли!" : "Хрестики перемогли!";
    }
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
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
