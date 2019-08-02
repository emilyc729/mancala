/*----- constants -----*/
var COLORS = {
    '1': ['Player A', 'blue'], // (player 1)
    '-1': ['Player B',  'red'] // (player 2)
};

/*----- app's state (variables) -----*/
let board, turn, winner;


/*----- cached element references -----*/
let msgEl = document.getElementById('msg');

/*----- event listeners -----*/
document.querySelector('section.board')
    .addEventListener('click', slotClick);
document.getElementById('reset')
    .addEventListener('click', init);
/*----- functions ------*/

init();

function init() {
    board = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];
    turn = 1;
    winner = null;

    render();
}

function render() {
    
    console.log(board);
    //console.log(board[0]);
    board.forEach(function (slotVal, slotIdx) {
        
        //get board values difference, append difference
        

        
        //console.log(slotVal);
        let div = document.getElementById(`slot${slotIdx}`);

        for (let i = 0; i < slotVal; i++) {
            let marble = document.createElement('div');
            marble.classList.add('marble');
            div.appendChild(marble);
        }

        

        if (winner === null) {
            msgEl.textContent = `${COLORS[turn][0]}'s turn`;
        } else {
            msgEl.textContent = `${COLORS[winner][0]}'s Won!`;
        }


    });
}

function slotClick(evt) {
    //console.log(evt);
    let slotId = 0;
    //console.log(typeof evt.target);
    if (evt.target.className === 'marble') {
        slotId = parseInt(evt.target.parentNode.id.replace('slot', ''));
        console.log(slotId);
    } else {
        slotId = parseInt(evt.target.id.replace('slot', ''));
    }
   // console.log(slotId);

    if (slotId === 6 || slotId === 13 || board[slotId] === 0) return;
    if(!sameSide(turn, slotId)) return alert('wrong side, choose again!');

    let numMarbles = board[slotId];
    let curPos = slotId;
    let nextPos = curPos + 1;
    for(let i = numMarbles; i > 0; i--) {
        console.log(
            'curPos' + ' ' + curPos + '\n' +
            'nextPos' + ' ' + nextPos + '\n' 
            
        );

        //console.log('turn =' + turn);
        
        if((nextPos === 13 && turn != -1) || (nextPos === 6 && turn != 1));
        if(nextPos === 13) {
            nextPos = 0;
        }
        //console.log(nextPos);
        board[nextPos] += 1;
        board[curPos] -= 1;
        /*
        if(nextPos === 13) {
            nextPos = 0;
            board[nextPos] += 1;
            
        }
        */
        
       // console.log('pos' + nextPos);
        
        
       numMarbles--;
        console.log('numMarbles' + ' ' + numMarbles);
      //  console.log('m' + board[nextPos]);
      //  console.log('marbles', numMarbles);
        
        if(numMarbles === 0) {
            let lastPos = nextPos;
            turn = checkLastMarblePos(turn, lastPos);
            console.log(lastPos);
        }
        nextPos++;
    }
    
    turn = 1;
    
    
    render();
    

    

}

function checkLastMarblePos(turn, lastPos) {
    if((turn === 1 && lasPos === 6) || (turn === -1 && lastPos === 13)) {
        return turn;
    } else if(sameSide(turn, lastPos) && board[lastPos] === 0) {
        if(turn === 1) {
            board[6] += ;
        } else {
            board[13] += ;
        }
    }
}

function sameSide(turn, position) {
    
    if((turn === 1 && (position >= 0 && position <= 6))
        || (turn === -1 && (position >= 7 && position <= 13))) {
        return true;

    }
    return false;


}

//Remove children
//document.querySelector('.marble').remove();

/*
var removeMarbles = document.querySelector('.slot');
var fc = removeMarbles.firstChild;
while(fc) {
    console.log(removeMarbles);
    removeMarbles.removeChild(fc);
    fc = removeMarbles.firstChild;
}
*/