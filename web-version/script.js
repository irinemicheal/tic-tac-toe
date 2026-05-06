const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const popup = document.getElementById("namePopup");

const statusText = document.getElementById("status");

let scoreXText = document.getElementById("scoreX");
let scoreOText = document.getElementById("scoreO");
const scoreDrawText = document.getElementById("scoreDraw");

const labelX = document.getElementById("labelX");
const labelO = document.getElementById("labelO");

// SOUND
const clickSound = new Audio("assets/click.wav");
const winSound = new Audio("assets/win.wav");
const drawSound = new Audio("assets/draw.wav");

// STATE
let board = ["","","","","","","","",""];
let animations = {};
let mode = null;
let playerTurn = true;
let gameOver = false;

let winningCells = null;
let lineProgress = 0;

let scoreX = 0, scoreO = 0, scoreDraw = 0;

let player1 = "Player 1";
let player2 = "Player 2";
let selectedModeTemp = null;

// MENU → POPUP
function startGame(m){
    selectedModeTemp = m;
    popup.style.display = "flex";

    document.getElementById("player1Input").value = "";
    document.getElementById("player2Input").value = (m==="two") ? "" : "AI";
}

// CONFIRM
function confirmPlayers(){
    player1 = document.getElementById("player1Input").value || "Player 1";
    player2 = document.getElementById("player2Input").value || 
             (selectedModeTemp==="two" ? "Player 2" : "AI");

    mode = selectedModeTemp;

    popup.style.display = "none";
    menuScreen.style.display = "none";
    gameScreen.style.display = "block";

    resetGame();

    labelX.innerHTML = `❌ ${player1}: <span id="scoreX">${scoreX}</span>`;
    labelO.innerHTML = `⭕ ${player2}: <span id="scoreO">${scoreO}</span>`;

    scoreXText = document.getElementById("scoreX");
    scoreOText = document.getElementById("scoreO");

    statusText.innerText = player1 + "'s Turn";
}

// BACK
function goToMenu(){
    gameScreen.style.display = "none";
    menuScreen.style.display = "block";
}

// DRAW
function drawBoard(){
    ctx.clearRect(0,0,300,300);

    ctx.strokeStyle = "#00d4ff";
    ctx.lineWidth = 3;

    for(let i=1;i<3;i++){
        ctx.beginPath();
        ctx.moveTo(i*100,0);
        ctx.lineTo(i*100,300);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0,i*100);
        ctx.lineTo(300,i*100);
        ctx.stroke();
    }

    board.forEach((val,i)=>{
        if(val){
            if(!animations[i]) animations[i]=0;
            animations[i]=Math.min(animations[i]+0.08,1);
            drawMark(i,val,animations[i]);
        }
    });

    drawWinningLine();
}

function drawMark(i,val,p){
    let cx=(i%3)*100+50;
    let cy=Math.floor(i/3)*100+50;

    if(val==="X") drawX(cx,cy,p);
    else drawO(cx,cy,p);
}

function drawX(cx,cy,p){
    let s=30;
    ctx.strokeStyle="#ff4c4c";
    ctx.lineWidth=5;

    ctx.beginPath();
    ctx.moveTo(cx-s,cy-s);
    ctx.lineTo(cx-s+2*s*p,cy-s+2*s*p);
    ctx.stroke();

    if(p>0.5){
        let p2=(p-0.5)*2;
        ctx.beginPath();
        ctx.moveTo(cx+s,cy-s);
        ctx.lineTo(cx+s-2*s*p2,cy-s+2*s*p2);
        ctx.stroke();
    }
}

function drawO(cx,cy,p){
    ctx.strokeStyle="#00ffcc";
    ctx.lineWidth=5;
    ctx.beginPath();
    ctx.arc(cx,cy,30,0,p*Math.PI*2);
    ctx.stroke();
}

// WIN LINE
function drawWinningLine(){
    if(!winningCells) return;

    let [a,,c]=winningCells;

    let sx=(a%3)*100+50;
    let sy=Math.floor(a/3)*100+50;
    let ex=(c%3)*100+50;
    let ey=Math.floor(c/3)*100+50;

    lineProgress=Math.min(lineProgress+0.05,1);

    let cx=sx+(ex-sx)*lineProgress;
    let cy=sy+(ey-sy)*lineProgress;

    ctx.strokeStyle="#ffd700";
    ctx.lineWidth=6;
    ctx.beginPath();
    ctx.moveTo(sx,sy);
    ctx.lineTo(cx,cy);
    ctx.stroke();
}

// CLICK
canvas.addEventListener("click",(e)=>{
    if(gameOver||!mode) return;

    let rect=canvas.getBoundingClientRect();
    let x=e.clientX-rect.left;
    let y=e.clientY-rect.top;

    let i=Math.floor(y/100)*3+Math.floor(x/100);

    if(board[i]===""){
        if(mode==="two"){
            board[i]=playerTurn?"X":"O";
            playerTurn=!playerTurn;
            statusText.innerText = playerTurn ? player1+"'s Turn" : player2+"'s Turn";
        }else{
            if(playerTurn){
                board[i]="X";
                playerTurn=false;
                statusText.innerText="AI thinking...";
                setTimeout(aiMove,300);
            }
        }
        clickSound.play();
    }

    checkGame();
});

// AI
function aiMove(){
    if(gameOver) return;

    let best=-Infinity,move;
    for(let i=0;i<9;i++){
        if(board[i]===""){
            board[i]="O";
            let score=minimax(board,0,false);
            board[i]="";
            if(score>best){best=score;move=i;}
        }
    }

    if(move!=undefined) board[move]="O";

    clickSound.play();
    playerTurn=true;
    statusText.innerText = player1 + "'s Turn";
    checkGame();
}

// MINIMAX
function minimax(b,d,isMax){
    let r=checkWinner();
    if(r){
        if(r.winner==="O") return 10-d;
        if(r.winner==="X") return d-10;
        return 0;
    }

    if(isMax){
        let best=-Infinity;
        for(let i=0;i<9;i++){
            if(b[i]===""){
                b[i]="O";
                best=Math.max(best,minimax(b,d+1,false));
                b[i]="";
            }
        }
        return best;
    }else{
        let best=Infinity;
        for(let i=0;i<9;i++){
            if(b[i]===""){
                b[i]="X";
                best=Math.min(best,minimax(b,d+1,true));
                b[i]="";
            }
        }
        return best;
    }
}

// CHECK
function checkWinner(){
    const w=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for(let c of w){
        let[a,b,d]=c;
        if(board[a]&&board[a]===board[b]&&board[a]===board[d])
            return {winner:board[a],cells:c};
    }
    if(!board.includes("")) return {winner:"draw"};
    return null;
}

// STATUS
function checkGame(){
    if(gameOver) return;

    let r=checkWinner();
    if(!r) return;

    if(r.winner==="X"){
        scoreX++; scoreXText.innerText=scoreX;
        statusText.innerText=player1+" Wins!";
        winSound.play();
        winningCells=r.cells;
        gameOver=true;
    }
    else if(r.winner==="O"){
        scoreO++; scoreOText.innerText=scoreO;
        statusText.innerText=player2+" Wins!";
        winSound.play();
        winningCells=r.cells;
        gameOver=true;
    }
    else{
        scoreDraw++; scoreDrawText.innerText=scoreDraw;
        statusText.innerText="Draw!";
        drawSound.play();
        gameOver=true;
    }
}

// RESET
function resetGame(){
    board=["","","","","","","","",""];
    animations={};
    gameOver=false;
    playerTurn=true;
    winningCells=null;
    lineProgress=0;
}

// LOOP
function animate(){
    drawBoard();
    requestAnimationFrame(animate);
}
animate();