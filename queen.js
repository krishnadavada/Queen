const readline = require("readline-sync");

// 5x5 array with regions (5 different colors)
const regions = [
    [1, 1, 1, 1, 2],
    [3, 1, 1, 2, 2],
    [3, 3, 4, 2, 5],
    [3, 4, 4, 5, 5],
    [3, 4, 4, 5, 5]
];

console.log(" 1 - Queen ")
console.log(" 0 - Empty ")

let arrOut = Array.from({ length: 5 }, () => Array(5).fill(0)); // 5x5 array
let placedRegions = new Set(); // Stores which regions have queens

// Function to check if a Queen can be placed
function isSafe(row, col) {
    let colorRegion = regions[row][col];

    // Check if the region is already occupied by another queen by same region
    if (placedRegions.has(colorRegion)) return false;

    // Check same row & same column
    for (let i = 0; i < 5; i++) {
        if (arrOut[row][i] === 1 || arrOut[i][col] === 1) return false;
    }

    // Check edges
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (arrOut[i][j] === 1 && Math.abs(i - row) === Math.abs(j - col)) {
                return false;
            }
        }
    }

    return true;
}

// Function to print the board
function printArr() {
    console.log("\nBoard:");
    arrOut.forEach(row => console.log("  " + JSON.stringify(row)));
}

// Queen placement loop
let q = 0;
while (q < 5) {
    
    console.log(`\nEnter position to add Queen ${q + 1} (row, column):`);
    let a = Number(readline.question());
    let b = Number(readline.question());

    if (a >= 0 && a < 5 && b >= 0 && b < 5) {
        if (arrOut[a][b] === 0 && isSafe(a, b)) {
            arrOut[a][b] = 1;
            placedRegions.add(regions[a][b]); // Mark the region as occupied
            q++;
            printArr();
        } else {
            console.log(" Cannot place a queen here! Blocked by another queen or region already occupied.");
            printArr();
        }
    } else {
        console.log(" Invalid input! Enter numbers between 0 and 4.");
    }
}

console.log("\n All 5 queens placed successfully!");
