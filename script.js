document.addEventListener('DOMContentLoaded', () => {
    // --- Game State Variables ---
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const restartButton = document.getElementById('restart-button');

    // Array to represent the board: 9 spots, initially empty strings
    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameActive = true;

    // All possible winning combinations (indices of the board array)
    const winningConditions = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal (top-left to bottom-right)
        [2, 4, 6]  // Diagonal (top-right to bottom-left)
    ];

    // --- Core Game Functions ---

    // 1. Handle a cell click
    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        // Get the index from the 'data-index' attribute on the HTML element
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        // Guard against invalid moves:
        // 1. If the spot is already occupied.
        // 2. If the game is not active (i.e., someone has already won).
        if (board[clickedCellIndex] !== "" || !gameActive) {
            return;
        }

        // Update the internal board array and the visual cell display
        board[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        clickedCell.classList.add('played'); // Add class to prevent hover/re-click

        // Check for a win or a draw
        handleResultValidation();
    }

    // 2. Check for Win/Draw
    function handleResultValidation() {
        let roundWon = false;

        // Loop through all winning conditions
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            
            // Get the values from the board array based on the win condition indices
            let a = board[winCondition[0]];
            let b = board[winCondition[1]];
            let c = board[winCondition[2]];

            // Check if any spot is empty, if so, this condition can't be a win yet
            if (a === '' || b === '' || c === '') {
                continue;
            }

            // Check if all three spots match (e.g., all 'X' or all 'O')
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            statusDisplay.innerHTML = `Player ${currentPlayer} has Won! 🎉`;
            gameActive = false;
            return; // Stop the function, no need to check for a draw
        }

        // Check for Draw (if there are no empty spots left)
        let roundDraw = !board.includes("");
        if (roundDraw) {
            statusDisplay.innerHTML = `It's a Draw! 🤝`;
            gameActive = false;
            return;
        }

        // If no win or draw, switch players
        handlePlayerChange();
    }

    // 3. Switch Players
    function handlePlayerChange() {
        // Ternary operator: if currentPlayer is 'X', set it to 'O', otherwise set it to 'X'
        currentPlayer = currentPlayer === "X" ? "O" : "X"; 
        statusDisplay.innerHTML = `Player ${currentPlayer}'s Turn`;
    }

    // 4. Restart Game
    function handleRestartGame() {
        gameActive = true;
        currentPlayer = "X";
        board = ["", "", "", "", "", "", "", "", ""]; // Reset board array
        statusDisplay.innerHTML = `Player ${currentPlayer}'s Turn`; // Update status

        // Clear the visual cells
        cells.forEach(cell => {
            cell.innerHTML = "";
            cell.classList.remove('x', 'o', 'played');
        });
    }

    // --- Event Listeners ---
    
    // Add click listeners to every cell
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    // Add click listener to the restart button
    restartButton.addEventListener('click', handleRestartGame);
});
