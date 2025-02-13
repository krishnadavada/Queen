const readline = require("readline-sync");

let arrOutR;
let placedRegions = new Set(); // Stores which regions have queens
let arrOut = Array.from({ length: 5 }, () => Array(5).fill(0)); // 5x5 array

// Function to check if a Queen can be placed
function isSafe(row, col) {
    // Check row and column
    for (let i = 0; i < 5; i++) {
        if (arrOutR[row][i] !== 0 || arrOutR[i][col] !== 0) return false;
    }

    // Check diagonals
    let directions = [
        [-1, -1], [-1,  1], // Top-left, Top-right
        [ 1, -1], [ 1,  1]  // Bottom-left, Bottom-right
    ];
    
    for (let [dx, dy] of directions) {
        let x = row + dx, y = col + dy; // Start at next diagonal position
        while (x >= 0 && x < 5 && y >= 0 && y < 5) {
            if (arrOutR[x][y] !== 0) return false;
            x += dx;
            y += dy;
        }
    }

    return true;
}

// Function to print the board
function printArr(arr) {
    arr.forEach(row => console.log("  " + JSON.stringify(row)));
}

// Fisher-Yates Shuffle to randomize array order
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Backtracking function to place 5 queens
function placeQueens(rowIndex = 0, queensPlaced = 0, rowOrder = [0, 1, 2, 3, 4], colors) {
    if (queensPlaced === 5) return true; // Successfully placed 5 queens

    for (let col = 0; col < 5; col++) {
        let row = rowOrder[rowIndex]; // Use randomized row order

        if (isSafe(row, col)) {
            arrOutR[row][col] = colors[queensPlaced];

            if (placeQueens(rowIndex + 1, queensPlaced + 1, rowOrder, colors)) return true; // Recursive call
            
            arrOutR[row][col] = 0; // Backtrack
        }
    }

    return false; // No valid position found
}

// Function to generate random regions
function generateRegions() {
    let directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1] // Up, Down, Left, Right
    ];

    let emptyCells = [];
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (arrOutR[i][j] === 0) emptyCells.push([i, j]);
        }
    }

    while (emptyCells.length > 0) {
        let [row, col] = emptyCells.pop();
        let neighborColors = new Set();

        for (let [dx, dy] of directions) {
            let x = row + dx, y = col + dy;
            if (x >= 0 && x < 5 && y >= 0 && y < 5 && arrOutR[x][y] !== 0) {
                neighborColors.add(arrOutR[x][y]);
            }
        }

        if (neighborColors.size > 0) {
            let colorArray = Array.from(neighborColors);
            arrOutR[row][col] = colorArray[Math.floor(Math.random() * colorArray.length)];
        } else {
            arrOutR[row][col] = 'gray'; // Default color if no neighbors are available
        }
    }
}

// Wrapper function to reset board and start placement
function generateBoard() {
    arrOutR = Array.from({ length: 5 }, () => Array(5).fill(0)); // Reset board

    let rowOrder = [0, 1, 2, 3, 4]; 
    shuffle(rowOrder); // Randomize row order

    let colors = ['red', 'green', 'blue', 'pink', 'black']; 
    shuffle(colors); // Randomize queen colors

    placeQueens(0, 0, rowOrder, colors);
    generateRegions(); // Fill in regions after queens are placed
}

// Run the function
generateBoard();
console.log("\nFinal Board with Queens and Regions:");
printArr(arrOutR);

// Queen placement loop
function isSafeQ(row, col) {
        let colorRegion = arrOutR[row][col];
    
        // Check if the region is already occupied by another queen by same region
        if (placedRegions.has(colorRegion)) return false;
    
        // Check same row & same column
        for (let i = 0; i < 5; i++) {
            if (arrOut[row][i] === 1 || arrOut[i][col] === 1) return false;
        }
    
        // Check edges
        let directions = [
            [-1, -1], // Top-left 
            [-1,  1], // Top-right 
            [ 1, -1], // Bottom-left 
            [ 1,  1]  // Bottom-right 
        ];
    
        for (let [dx, dy] of directions) {
            let x = row, y = col;
            while (x >= 0 && x < 5 && y >= 0 && y < 5) {
                if (arrOut[x][y] === 1) return false;
                x += dx; // Move in the row direction
                y += dy; // Move in the column direction
            }
        }
    
        return true;
    
    }
let q = 0;
while (q < 5) {
    
    console.log(`\nEnter position to add Queen ${q + 1} (row, column):`);
    let a = Number(readline.question());
    let b = Number(readline.question());

    if (a >= 0 && a < 5 && b >= 0 && b < 5) {
        if (arrOut[a][b] === 0 && isSafeQ(a, b)) {
            arrOut[a][b] = 1;
            placedRegions.add(arrOutR[a][b]); // Mark the region as occupied
            q++;
            console.log("Regions : ")
            printArr(arrOutR)
            console.log("\n")
            console.log("Board : ")
            printArr(arrOut);
           
        } else {
            console.log(" Cannot place a queen here! Blocked by another queen or region already occupied.");
            console.log("Regions : ")
            printArr(arrOutR)
            console.log("\n")
            console.log("Board : ")
            printArr(arrOut);       
         }
    } else {
        console.log(" Invalid input! Enter numbers between 0 and 4.");
    }
}

console.log("\n All 5 queens placed successfully!");
