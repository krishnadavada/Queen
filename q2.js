const readline = require("readline-sync");

//empty array for region generation
let arrOutR;
let N=5
 // array for user
let arrOut = Array.from({ length: N }, () => Array(N).fill(0)); // 5x5 array

function arr(N){
    let a=[]
    for(i=0;i<N;i++){
       a.push(i)
    }
    return a;
}

function colorGenerator(N){
    let colors = [];
      for(i=0;i<N;i++){
        r=Math.floor(Math.random()*256)
        g=Math.floor(Math.random()*256)
        b=Math.floor(Math.random()*256)
        clr=`rgb(${r},${g},${b})`
        colors.push(clr)
      }
      return colors;
}

//check whether queen is in same row ,same column or imidiate edges
function isSafe(row, col) {
    // Check for same row and column
    for (let i = 0; i < N; i++) {
        if (arrOutR[row][i] !== 0 || arrOutR[i][col] !== 0) {
            return false;
        }
    }

    //check for imidiate edges
    let directions=[
        [-1,-1],[-1,0],[-1,1],
        [0,-1],[0,1],
        [1,-1],[1,0],[1,1]
    ]

    for (let [dx, dy] of directions) {
        let x = row, y = col;
        while (x >= 0 && x < 5 && y >= 0 && y < 5) {
            if (arrOutR[x][y] !== 0) return false;
            x += dx; 
            y += dy; 
        }
    }


    return true;
}

//print array
function printArr(arr) {
    arr.forEach(row => console.log("  " + JSON.stringify(row)));
}

//random array
function shuffle(array){
    let i=array.length;
    while(i!=0){
       let j=Math.floor(Math.random()*i)
       i--
       [array[i],array[j]]=[array[j],array[i]]
    }
}


//queen generator
function placeQueens(rowIndex = 0, queensPlaced = 0, rowOrder = arr(N), colors) {
    if (queensPlaced === N) return true;//place 5 queen successfully

    for (let col = 0; col < N; col++) {
        let row = rowOrder[rowIndex]; 

        if (isSafe(row, col)) {
            arrOutR[row][col] = colors[queensPlaced]; //place queen

            if (placeQueens(rowIndex + 1, queensPlaced + 1, rowOrder, colors)) return true; //recursion
            
            arrOutR[row][col] = 0; //backtrack
        }
    }

    return false;
}



// random region generator
function generateRegions() {
    let directions = [
        [-1, -1], [-1,  0], [-1,  1], 
        [ 0, -1],[ 0,  1],  
        [ 1, -1], [ 1,  0], [ 1,  1]  
    ];

    let empty=[]
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            if (arrOutR[i][j] === 0) {
                empty.push([i, j]);
            }
        }
    }

    let queen=[]
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            if (arrOutR[i][j] !== 0) {
                queen.push([i, j]);
            }
        }
    }

    shuffle(queen)

    while(queen.length>0){
        let [qr,qc]=queen.pop()
            for (let [dx, dy] of directions) {
                let x = qr + dx, y = qc + dy;
                if (x >= 0 && x < N && y >= 0 && y < N && arrOutR[x][y] === 0) {
                    arrOutR[x][y] = arrOutR[qr][qc]
                }   
            }
        }
       
        for(let x=0;x<N;x++){
            for(let y=0;y<N;y++){
                if(arrOutR[x][y]==0){
                    if(x==0 && y==0){
                        arrOutR[x][y]=arrOutR[x+1][y]
                    }
                    else if(x==4 && y==0){
                        arrOutR[x][y]=arrOutR[x-1][y]
                    }
                    else if(x==0 && y==4){
                        arrOutR[x][y]=arrOutR[x+1][y]
                    }
                    else if(x==4 && y==4){
                        arrOutR[x][y]=arrOutR[x-1][y]
                    }
                }
            }
        }
        
      
   
}  


//generate board
function generateBoard() {
    arrOutR = Array.from({ length: N }, () => Array(N).fill(0)); 

    let rowOrder = arr(N); 
    //random rowOrder aaray 
    shuffle(rowOrder); 
 
    let colors = colorGenerator(N); 
    //random color array
    shuffle(colors); 

    placeQueens(0, 0, rowOrder, colors);

    printArr(arrOutR)
    generateRegions();
}

generateBoard();
console.log("\nFinal Board with Queens and Regions:");
printArr(arrOutR);
let placedRegion=new Set()

function safeQueen(row,col){

    //for same region
    let color=arrOutR[row][col]
    if(placedRegion.has(color)){
        return false
    }

    for(let i=0;i<N;i++){
        if(arrOut[row][i]===1 || arrOut[i][col]===1){
          return false
        }
    }

    //check imidiate edges
    let directions=[
        [-1,-1],[-1,0],[-1,1],
        [0,-1],[0,1],
        [1,-1],[1,0],[1,1]
    ]

    for(let [dx,dy] of directions){
        let x=row
        let y=col
        while(x>=0 && x<N && y>=0 && y<N){
            if(arrOut[x][y]===1){
                return false
            }
            x+=dx
            y+=dy
        }
    }

    return true

}

let q = 0;
while (q < N) {
    
    console.log(`\nEnter position to add Queen ${q + 1} (row, column):`);
    let a = Number(readline.question());
    let b = Number(readline.question());

    if (a >= 0 && a < N && b >= 0 && b < N) {
        if (arrOut[a][b] === 0 && safeQueen(a, b)) {
            arrOut[a][b] = 1;
            //add color in placed region
            placedRegion.add(arrOutR[a][b]);
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

