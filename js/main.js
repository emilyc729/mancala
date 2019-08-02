/*----- constants -----*/
var COLORS = {
    '1': ['Player A', 'blue'], // (player 1)
    '-1': ['Player B', 'red'] // (player 2)
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
    board.forEach(function (slotVal, slotIdx) {
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
    console.log(evt);
    let slotId = 0;
    //console.log(typeof evt.target);
    if (evt.target.className === 'marble') {
        slotId = parseInt(evt.target.parentNode.id.replace('slot', ''));
        console.log(slotId);
    } else {
        slotId = parseInt(evt.target.id.replace('slot', ''));
    }
   // console.log(slotId);

    if (slotId === 6 || slotId === 13) return;

    let numMarbles = board[slotId];
    let curPos = slotId;
    let nextPos = curPos + 1;
    while (numMarbles >= 0) {
        console.log(numMarbles);
        board[nextPos] += 1;
        board[curPos] -= 1;
        nextPos++;
        numMarbles--;

    }

    /*
    if((turn === 1 && (slotId >= 0 && slotId < 6))
        || (turn === -1 && (slotId >= 7 && slotId < 13))) {
            let numMarbles = board[slotId];
            let curPos = slotId;
            let nextPos = curPos + 1;
            while(numMarbles >= 0) {
                board[nextPos] += 1;
                board[curPos] -= 1;
                nextPos++;
                numMarbles--;
            }

    }
    */

}

