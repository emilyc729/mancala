/*----- constants -----*/
const PLAYER = {
    '1': ['Player A', 'blue'], // (player 1)
    '-1': ['Player B',  'red'], // (player 2)
    '0': ['Tie']
};

const potA = 6;
const potB = 13;

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
    var marbles = document.querySelectorAll('.marble');
    marbles.forEach(function(marble) {
        marble.remove();
    });

   
    
    console.log(board);

    board.forEach(function (slotVal, slotIdx) {
        
        //get board values difference, append difference
        

        
        //console.log(slotVal);
        let slot = document.getElementById(`slot${slotIdx}`);

        for (let i = 0; i < slotVal; i++) {
            let marble = document.createElement('div');
            marble.classList.add('marble');
            
            slot.appendChild(marble);
          
        }
        

        if (winner === null) {
            msgEl.textContent = `${PLAYER[turn][0]}'s turn`;
            msgEl.style.color = PLAYER[turn][1];
        } else if(winner === 0) {
            msgEl.textContent = `${PLAYER[turn]}, play again!`;
        } else {
            msgEl.textContent = `${PLAYER[winner][0]}'s Won!`;
            msgEl.style.color = PLAYER[turn][1];
        }


    });
    
    highlightSide();
    
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

    if (slotId === potA || slotId === 13 || board[slotId] === 0) return;
    if(!sameSide(turn, slotId)) return alert('wrong side, choose again!');

    let numMarbles = board[slotId];
    let curPos = slotId;
    let nextPos = curPos;
    while(numMarbles > 0) {

        if((nextPos === 13 && turn != -1) || (nextPos === 6 && turn != 1)) return;

        if(nextPos === 13) {
            nextPos = 0;
            board[nextPos] += 1;
        } else {
            nextPos++;
            board[nextPos] += 1;
        }
        console.log(
            'curPos' + ' ' + curPos + '\n' +
            'nextPos' + ' ' + nextPos + '\n' 
            
        );
        
        board[curPos] -= 1;
        
        numMarbles--;
      
        if(numMarbles === 0) {
            console.log('numMarbles' + ' ' + numMarbles);
            let lastPos = nextPos;
            turn = checkLastMarblePos(turn, lastPos);
            console.log('lastPos' + ' ' + lastPos);
        }
    }
    winner = isWinner();

    render();

}

function checkLastMarblePos(turn, lastPos) {
    console.log("-----------------------");
    console.log('check turn ' + turn);
    console.log('me marbles ' + (board[lastPos] - 1));
    console.log(sameSide(turn, lastPos));
    console.log("-----------------------");
    if((turn === 1 && lastPos === 6) || (turn === -1 && lastPos === 13)) {
        return turn;
    } else if(sameSide(turn, lastPos) && ((board[lastPos] - 1) === 0)) {
        if(turn === 1) {
            console.log(turn);
            board[6] += board[13-(lastPos + 1)];
            board[13-(lastPos + 1)] = 0;
            return turn *= -1;
        } else {
            board[13] += board[13-(lastPos + 1)];
            board[13-(lastPos + 1)] = 0;
            return turn *= -1;
        }
    } else {
        return turn *= -1;
    }
}

function sameSide(turn, position) {
    
    if((turn === 1 && (position >= 0 && position <= 6))
        || (turn === -1 && (position >= 7 && position <= 13))) {
        return true;

    }
    return false;


}

function isWinner() {
    let arrA = board.slice(0, potA);
    let arrB = board.slice(7, potb);
    let sumA = arrA.reduce((a,b) => a + b, 0);
    let sumB = arrB.reduce((a,b) => a + b, 0);
    let totalA = board[potA];
    let totalB = board[potB];
    console.log(typeof sumA);
    if(sumA === 0 || sumB === 0) {
        console.log('..................');
        console.log(sumA);
        console.log(sumB);
        console.log('...................');
        totalA += sumA;
        totalB += sumB;
        
        console.log('===================');
        console.log(totalA);
        console.log(totalB);
        console.log('===================');
        if(totalA > totalB) {
            winner = 1;
        } else if(totalB > totalA){
            winner = -1;
        } else {
            winner = 0;
        }
    }

    
    return winner;
}

function highlightSide() {
    if(turn === 1) {
        for(let i = 0; i < potA; i++) {
            document.getElementById(`slot${i}`).style.borderColor = PLAYER[turn][1];
        }
        for(let i = 7; i < potB; i++) {
            document.getElementById(`slot${i}`).style.borderColor = `rgba(214, 181, 120, 0.822)`;
        }
    } else {
        for(let i = 0; i < potA; i++) { 
            document.getElementById(`slot${i}`).style.borderColor = `rgba(214, 181, 120, 0.822)`;
        }
        for(let i = 7; i < potB; i++) {
            
            document.getElementById(`slot${i}`).style.borderColor = PLAYER[turn][1];
        }
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

//border: 38%
