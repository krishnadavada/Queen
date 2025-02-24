let arrOutR;

let N;//default

//start the game
function start(){
    let inp=document.getElementById('inp')
    let N=parseInt(inp.value);
    div.innerHTML=''
    board(N)
}

 // array for user
let arrOut = Array.from({ length: N }, () => Array(N).fill(0)); // NxN array

//array generator
function arr(N){
    let a=[]
    for(i=0;i<N;i++){
       a.push(i)
    }
    return a;
}

//random color generator
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
//isSafe for queen generator
function isSafe(row, col,N) {
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
        while (x >= 0 && x < N && y >= 0 && y < N) {
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
function placeQueens(rowIndex = 0, queensPlaced = 0, rowOrder = arr(N), colors,N) {
    if (queensPlaced === N) return true;//place N queen successfully

    for (let col = 0; col < N; col++) {
        let row = rowOrder[rowIndex]; 

        if (isSafe(row, col,N)) {
            arrOutR[row][col] = colors[queensPlaced]; //place queen

            if (placeQueens(rowIndex + 1, queensPlaced + 1, rowOrder, colors,N)) return true; //recursion

            arrOutR[row][col] = 0; //backtrack
        }
    }

    return false;
}

//emptycell function
function emptyCell(arrOutR,N){
    let emptyCells = [];
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                if (arrOutR[i][j] === 0) emptyCells.push([i, j]);
            }
        }
    return emptyCells;
}

//pick random empty cell
function pickRandomCell(emptyCells) {
    return emptyCells.splice(Math.floor(Math.random() * emptyCells.length), 1)[0];
}

//get the color from nearer cell
function getNearColor(arrOutR,row,col,N){
    let nearByClr=new Set()
    let directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1] // Up, Down, Left, Right
    ];
    for (let [dx, dy] of directions) {
        let x = row + dx, y = col + dy;
        if (x >= 0 && x < N && y >= 0 && y < N && arrOutR[x][y] !== 0) {
            nearByClr.add(arrOutR[x][y]);
        }
    }
    return nearByClr;
}

//assign color to selected cell
function assignClr(arrOutR,row,col,nearByClr){
    if(nearByClr.size>0){
        let colorArray = Array.from(nearByClr);
        arrOutR[row][col] = colorArray[Math.floor(Math.random() * colorArray.length)];
    }
}

//fill the remaining cell with color
function fillBoardClr(arrOutR,N){
    let emptyCells = emptyCell(arrOutR,N);
    while(emptyCells.length>0){
        let [row,col] = pickRandomCell(emptyCells);
        let nearByClr = getNearColor(arrOutR,row,col,N)
        if(nearByClr.size===0){
            emptyCells.push([row,col])
            continue;
        }
        assignClr(arrOutR,row,col,nearByClr)
    }
 
   return arrOutR;
}
    
//generate board
function generateBoard(N) {
    arrOutR = Array.from({ length: N }, () => Array(N).fill(0)); 

    let rowOrder = arr(N); 
    //random rowOrder aaray 
    shuffle(rowOrder); 

    let colors = colorGenerator(N); 
    //random color array
    shuffle(colors); 

    placeQueens(0, 0, rowOrder, colors,N);

    fillBoardClr(arrOutR,N)

}

//-------------------------------------------------------------------------------------------------------
//Now aarOutR in frontEnd

let body = document.body;


let div=document.createElement('div')
div.style.display='flex'
div.style.flexDirection='column'
div.style.alignItems='center'
div.style.justifyContent='center'
div.style.marginTop='90px'
body.appendChild(div)

let placedRegion=new Set()
let q=0

//safeQueen for user 
function safeQueen(row,col,N){
    
    //for same row and col
    for(let i=0;i<N;i++){
        let cell1=document.querySelector(`.row-${row}.col-${i}`)
        let v1=cell1.textContent.trim()
        if(cell1){
            if(v1==='👑'){
                alert('😔 Wrong Move - Queen in same row!!!')
                return false
            }
        }
        let cell2=document.querySelector(`.row-${i}.col-${col}`)
        let v2=cell2.textContent.trim()
        if(cell2){
            if(v2==='👑'){
                alert('😔 Wrong Move - Queen in same column!!!')
                return false
            }
        }
    }

    //for imidiate edges
    let direction=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]

    for(let[dx,dy] of direction){
        let newR=row+dx
        let newC=col+dy
        if(newR>=0 && newR<N && newC>=0 && newC<N){
            let cell=document.querySelector(`.row-${newR}.col-${newC}`)
            let v=cell.textContent.trim()
            if(cell){
                if(v==='👑'){
                    alert('😔 Wrong Move - Queen in edge of other queen!!!')
                    return false
                }
             }
        }
    }

     //for same region
     let color=arrOutR[row][col]
     if(placedRegion.has(color)){
         alert('😔 Wrong Move - Queen in same region !!!')
         return false
     }

    return true

}

//generate NXN board for user to play
function board(N){

    generateBoard(N);

    let table = document.createElement('table')
    div.append(table)
    
    let q=0
    for (let i = 0; i < N; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < N; j++) {
            let td = document.createElement('td');
            td.classList.add(`row-${i}`)
            td.classList.add(`col-${j}`)
            td.style.backgroundColor = arrOutR[i][j]
            td.textContent=''
            tr.appendChild(td)
            let qp=1
            td.addEventListener('click',function(e){
                let cell=e.target.closest('td')
                let row = cell.parentNode.rowIndex
                let col = cell.cellIndex
                let val=cell.textContent
                if(qp){
                    if(val==='' && safeQueen(row,col,N)){
                         cell.textContent='👑'
                         placedRegion.add(arrOutR[row][col])
                         q++
                         if(q===N){
                            showCongrats()
                        }
                    }
                    qp=0
                }
                else{
                    if(val==='👑'){
                         cell.textContent=''
                         placedRegion.delete(arrOutR[row][col])
                         q--
                    }
                    qp=1
                }
               
            })
        }
        table.appendChild(tr)
    }

}

//if 5 queen is placed then call below function
function showCongrats(){

    let div1=document.getElementById('congrats')
    div1.style.display='flex'

}

//to start the game
function play(){
    let button=document.getElementsByTagName('button')
    let div1=document.getElementById('congrats')
    q=0
    let inp=document.getElementById('inp')
    let N=parseInt(inp.value);
    div.innerHTML=" "
    document.querySelectorAll('td').forEach(cell=>cell.textContent='')
    div1.style.display='none'
    board(N)
}
