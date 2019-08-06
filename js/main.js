/*----- constants -----*/
const PLAYER = {
    '1': {
        name:'Player A',
        color: 'lightblue',
        pot: 6
    }, // (player A)
    '-1': {
        name: 'Player B',
        color: 'pink',
        pot: 13
    },  // (player B)
    '0': {
        name: 'Tie',
        color: 'lightyellow'
    }
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
    clearMarbles();

    console.log(board);
    board.forEach(function (slotVal, slotIdx) {
        
        let slot = document.getElementById(`slot${slotIdx}`);
        slot.innerHTML = `<span class="value">${slotVal}</span>`;

        for (let i = 0; i < slotVal; i++) {
            let marble = document.createElement('div');
            marble.classList.add('marble');
            marble.style.background = `radial-gradient(circle at 6px 6px, ${getRandomColor()}, #292929)`;
            slot.appendChild(marble);
        }

        setMarbleBoundaries();

        if (winner === null) {
            msgEl.textContent = `${PLAYER[turn].name}'s turn`;
            msgEl.style.color = PLAYER[turn].color;
        } else if (winner === 0) {
            msgEl.textContent = `${PLAYER[winner].name}, play again!`;
            msgEl.style.color = PLAYER[winner].color;
        } else {
            document.getElementById(`slot${PLAYER[winner].pot}`).style.border = `3px solid ${PLAYER[winner].color}`;
            msgEl.textContent = `${PLAYER[winner].name} Won!`;
            msgEl.style.color = PLAYER[winner].color;
        }

        if(slotVal === 0) {
            slot.classList.add('disabled');
        } else {
            slot.classList.remove('disabled');
        }

        

    });


    highlightSide();

}

function slotClick(evt) {
    let slotId = 0;

    if (evt.target.className === 'marble') {
        slotId = parseInt(evt.target.parentNode.id.replace('slot', ''));
        console.log(slotId);
    } else {
        slotId = parseInt(evt.target.id.replace('slot', ''));
    }

    if (slotId === potA || slotId === potB || board[slotId] === 0) return;
    if (!sameSide(turn, slotId)) return;

    let numMarbles = board[slotId];
    let curPos = slotId;
    let nextPos = curPos + 1;
    while (numMarbles > 0) {
        console.log(
            'curPos' + ' ' + curPos + '\n' +
            'nextPos' + ' ' + nextPos + '\n' +
            'turn' + ' ' + turn + '\n' +
            'marbles ' + numMarbles + '\n'
        );

        if(!((nextPos === 13 && turn === 1) || (nextPos === 6 && turn === -1))) {
            console.log('hi');
            board[nextPos] += 1;

            if (nextPos === 13) {
                nextPos = 0;
            } else {
                nextPos++;   
            }
            board[curPos] -= 1;
        } else {
            nextPos++;
            continue;
        }
        
        
        

        numMarbles--;
        
        console.log('lastPOSITION ' + nextPos);
        let lastPos = nextPos;
        if (numMarbles === 0) {
            if(lastPos === 0) {
                lastPos = 13;
            } else {
                lastPos -= 1;
            }
            console.log('numMarbles' + ' ' + numMarbles);
            turn = checkLastMarblePos(turn, lastPos);
            console.log('lastPos' + ' ' + lastPos);
        }

    }

    winner = isWinner();
    
    //clear slots except pots when winner found
    if(winner != null) {
        for (let i = 0; i < potB; i++) {
            if(i !== potA) {
                board[i] = 0;
            }
        }
    }
    render();

}

function checkLastMarblePos(turn, lastPos) {
    console.log("-----------------------");
    console.log('check turn ' + turn);
    console.log('me marbles ' + (board[lastPos] - 1));
    console.log(sameSide(turn, lastPos));
    console.log("-----------------------");
    if ((turn === 1 && lastPos === potA) || (turn === -1 && lastPos === potB)) {
        return turn;
    } else if (sameSide(turn, lastPos) && ((board[lastPos] - 1) === 0)) {
        if (turn === 1) {
            console.log(turn);
            board[potA] += board[potB - (lastPos + 1)];
            board[potB - (lastPos + 1)] = 0;
            return turn *= -1;
        } else {
            board[potB] += board[potB - (lastPos + 1)];
            board[potB - (lastPos + 1)] = 0;
            return turn *= -1;
        }
    } else {
        return turn *= -1;
    }
}

function sameSide(turn, position) {
    if ((turn === 1 && (position >= 0 && position <= potA))
        || (turn === -1 && (position >= 7 && position < potB))) {
        return true;

    }
    return false;
}

function isWinner() {
    let arrA = board.slice(0, potA);
    let arrB = board.slice(7, potB);
    let sumA = arrA.reduce((a, b) => a + b, 0);
    let sumB = arrB.reduce((a, b) => a + b, 0);

    console.log(typeof sumA);
    if (sumA === 0 || sumB === 0) {
        console.log('..................');
        console.log(sumA);
        console.log(sumB);
        console.log('...................');
        board[potA] += sumA;
        board[potB] += sumB;

        console.log('===================');
        console.log(board[potA]);
        console.log(board[potB]);
        console.log('===================');
        if (board[potA] > board[potB]) {
            winner = 1;
        } else if (board[potA] < board[potB]) {
            winner = -1;
        } else {
            winner = 0;
        }
    }
    return winner;
}

function highlightSide() {
    if (turn === 1) { 
        for (let i = 0; i < potA; i++) {
            document.getElementById(`slot${i}`).style.borderColor = PLAYER[turn].color;
        }
        for (let i = 7; i < potB; i++) {
            document.getElementById(`slot${i}`).style.borderColor = `rgba(214, 181, 120, 0.822)`;
        }
    } else { 
        for (let i = 0; i < potA; i++) {
            document.getElementById(`slot${i}`).style.borderColor = `rgba(214, 181, 120, 0.822)`;
        }
        for (let i = 7; i < potB; i++) {
            document.getElementById(`slot${i}`).style.borderColor = PLAYER[turn].color;
        }
    }
}

function getRandomColor() {
    var color = "hsl(" + 360 * Math.random() + ',' +
        (25 + 70 * Math.random()) + '%,' +
        (85 + 10 * Math.random()) + '%)';
    return color;
}

function clearMarbles() {
    var marbles = document.querySelectorAll('.marble');
    marbles.forEach(function (marble) {
        marble.remove();
    });
}

function setMarbleBoundaries() {
    $('.marble').each(function (i) {
        let slotHeight = document.querySelector('.slot').scrollHeight;
        let slotWidth = document.querySelector('.slot').scrollWidth;
        let marbleLeft = Math.random() * ((slotWidth * 0.5) - (this.offsetWidth * 0.5));
        let marbleTop = Math.random() * ((slotHeight * 0.5) - (this.offsetHeight * 0.5));
        if (this.parentNode.id === 'slot6' || this.parentNode.id === 'slot13') {
            let potHeight = document.getElementById('slot6').scrollHeight;
            let potWidth = document.getElementById('slot6').scrollWidth;
            let marblePotLeft = Math.random() * ((potWidth * 0.5) - (this.offsetWidth * 0.5));
            let marblePotTop = Math.random() * ((potHeight * 0.5) - (this.offsetHeight * 0.5));
            $(this).css({
                left: marblePotLeft + this.offsetWidth * 0.5,
                top: marblePotTop + this.offsetHeight
            });
        } else {
            $(this).css({
                left: marbleLeft + this.offsetWidth * 0.5,
                top: marbleTop + this.offsetHeight * 0.5
            });
        }

    });
}