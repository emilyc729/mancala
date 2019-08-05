/*----- constants -----*/
const PLAYER = {
    '1': ['Player A', 'lightblue'], // (player A)
    '-1': ['Player B', 'pink'], // (player B)
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
    clearMarbles();

    console.log(board);

    board.forEach(function (slotVal, slotIdx) {

        let slot = document.getElementById(`slot${slotIdx}`);
        let slotHeight = document.querySelector('.slot').scrollHeight;
        let slotWidth = document.querySelector('.slot').scrollWidth;

        for (let i = 0; i < slotVal; i++) {
            let marble = document.createElement('div');
            marble.classList.add('marble');
            marble.style.backgroundColor = getRandomColor();
            slot.appendChild(marble);
        }

        $('.marble').each(function (i) {
            let marbleLeft = Math.random() * (slotWidth - 20);
            let marbleTop = Math.random() * (slotHeight - 20);
            // console.log(marbleLeft);
            //console.log(this);
            $(this).css({
                left: marbleLeft,
                top: marbleTop
            });

        });

        if (winner === null) {
            msgEl.textContent = `${PLAYER[turn][0]}'s turn`;
            msgEl.style.color = PLAYER[turn][1];
        } else if (winner === 0) {
            msgEl.textContent = `${PLAYER[turn]}, play again!`;
        } else {
            //
            msgEl.textContent = `${PLAYER[winner][0]}'s Won!`;
            msgEl.style.color = PLAYER[turn][1];
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
    if (!sameSide(turn, slotId)) return alert('wrong side, choose again!');

    let numMarbles = board[slotId];
    let curPos = slotId;
    let nextPos = curPos;
    while (numMarbles > 0) {

        if ((nextPos === 13 && turn != -1) || (nextPos === 6 && turn != 1)) return;

        if (nextPos === 13) {
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

        if (numMarbles === 0) {
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
    if ((turn === 1 && (position >= 0 && position < potA))
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
    let totalA = board[potA];
    let totalB = board[potB];
    console.log(typeof sumA);
    if (sumA === 0 || sumB === 0) {
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
        if (totalA > totalB) {
            winner = 1;
        } else if (totalB > totalA) {
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
            document.getElementById(`slot${i}`).style.borderColor = PLAYER[turn][1];
        }
        for (let i = 7; i < potB; i++) {
            document.getElementById(`slot${i}`).style.borderColor = `rgba(214, 181, 120, 0.822)`;
        }
    } else {
        for (let i = 0; i < potA; i++) {
            document.getElementById(`slot${i}`).style.borderColor = `rgba(214, 181, 120, 0.822)`;
        }
        for (let i = 7; i < potB; i++) {

            document.getElementById(`slot${i}`).style.borderColor = PLAYER[turn][1];
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
//border: 38%
