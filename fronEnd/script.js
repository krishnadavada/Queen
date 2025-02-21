let arrOutR;
let N=5
 // array for user
let arrOut = Array.from({ length: N }, () => Array(N).fill(0)); // 5x5 array

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
        [-1, -1], [-1,  1], 
        [ 1, -1], [ 1,  1]  
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


    while(queen.length>0){
        let [qr,qc]=queen.pop()
        while(empty.length>0){
            let [row,col]=empty.pop()
            for (let [dx, dy] of directions) {
                let clr=arrOutR[qr][qc]
                let x = row + dx, y = col + dy;
                if (x >= 0 && x < N && y >= 0 && y < N && arrOutR[x][y] === 0) {
                    arrOutR[x][y] = clr;
                }
                else if(x >= 0 && x < N && y >= 0 && y < N && arrOutR[x][y] !== 0){
                    let newcolor=arrOutR[x][y]
                    i=Math.floor(Math.random()*2)
                    if(i==1){
                       arrOutR[row][col]=clr
                    }
                    else{
                       arrOutR[row][col]=newcolor
                    }
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

    generateRegions();
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

function safeQueen(row,col,val){
    
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

function board(){

    generateBoard();

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
                    if(val==='' && safeQueen(row,col,val)){
                         cell.textContent='👑'
                         placedRegion.add(arrOutR[row][col])
                         q++
                         if(q===5){
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
    let div1=document.createElement('div')
    div1.style.background='rgba(0, 0, 0, 0.5)'
    div1.style.position='fixed'
    div1.style.top='0'
    div1.style.left='0'
    div1.style.width='100%'
    div1.style.height='100%'
    div1.style.display='flex'
    div1.style.alignItems='center'
    div1.style.justifyContent='center'
    body.appendChild(div1)

    let div2=document.createElement('div')
    div2.style.backgroundColor='white'
    div2.style.borderRadius='10px'
    div2.style.padding='20px'
    div2.style.textAlign='center'
    div1.appendChild(div2)

    let h2=document.createElement('h2')
    h2.textContent='🎉 Congratulations! 🎉'
    div2.appendChild(h2)

    let p=document.createElement('p')
    p.textContent='You have placed all queens on the board!'
    div2.appendChild(p)

    let button=document.createElement('button')
    button.textContent='Play Again'
    button.style.padding='10px'
    button.style.borderRadius='10px'
    button.style.backgroundColor='green'
    button.style.fontSize='20px'
    div2.appendChild(button)
    button.addEventListener('click',function(){
        q=0
        div1.style.display='none'
        div.innerHTML=" "
        board()
    })
}


board()
