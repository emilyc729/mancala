/*----- constants -----*/
const PLAYER = {
    '1': {
        name: 'Player A',
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
    } // (Tie)
};

const potA = 6;
const potB = 13;

/*----- app's state (variables) -----*/
let board, turn, winner, positionsArray;

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
    positionsArray = [];
    render();
}

function render() {
    clearMarbles();
    document.getElementById('msg').classList.remove('animate1');
    let time = 0;

    //create & update board elements
    board.forEach(function (slotVal, slotIdx) {
        let slot = document.getElementById(`slot${slotIdx}`);
        
        //only apply 'showing steps' to slots that received marbles
        if(positionsArray.includes(slotIdx)) {
            time = showSteps();
        } else {
            slot.innerHTML = `<span class="value">${slotVal}</span>`;
        }
        //create marbles
        for (let i = 0; i < slotVal; i++) {
            let marble = document.createElement('div');
            marble.classList.add('marble');
            marble.style.background = `radial-gradient(circle at 6px 6px, ${getRandomColor()}, #292929)`;
            slot.appendChild(marble);
        }
        //place marbles within circular slot
        setMarblePlacements();
        
        //dont show selection for slots w/ zero marbles
        if (slotVal === 0) {
            slot.classList.add('disabled');
        } else {
            slot.classList.remove('disabled');
        }
    });
    //delay display of message and slot selections for next player
    setTimeout(function() {
        displayMessage();
        highlightSide();
        
    }, time);
    //enlarge winner message 
    setTimeout(function() {
        if(winner === 1 || winner === -1){
            document.getElementById('msg').classList.add('animate1');
        }
    }, time + 500);
    
}
function slotClick(evt) {
    let slotId = 0;
    //reset positions array
    positionsArray = [];

    //get slotId from click of marble/slot
    if (evt.target.className === 'marble') {
        slotId = parseInt(evt.target.parentNode.id.replace('slot', ''));
        console.log(slotId);
    } else {
        slotId = parseInt(evt.target.id.replace('slot', ''));
    }

    //disallow click for players' pots & when slots have no marbles
    if (slotId === potA || slotId === potB || board[slotId] === 0) return;
    //check if player clicked own side
    if (!sameSide(turn, slotId)) return;

    let numMarbles = board[slotId];
    let curPos = slotId;
    let nextPos = curPos + 1;
    positionsArray = [];
    //determine which slot each marble goes into
    while (numMarbles > 0) {
        
        //if player A
        if(turn === 1) {
            if(nextPos === potB) {
                //skip player B's pot, circle back to index 0
                nextPos = 0;
            }
            board[nextPos] += 1;
            //put nextPos in array to keep track of updated slots during turn
            positionsArray.push(nextPos);
            nextPos++;
            board[curPos] -= 1;
            numMarbles--;

        }
        //if player B
        if(turn === -1) {
            if(nextPos === potB) {
                //add marble into player B's pot
                board[nextPos] += 1;
                positionsArray.push(nextPos);
                board[curPos] -= 1;
                numMarbles--;
                //circle back to index 0
                nextPos = 0;
            } else if(nextPos === potA) {
                //skip player A's pot
                nextPos++;
            } else {
                board[nextPos] += 1;
                positionsArray.push(nextPos);
                nextPos++;
                board[curPos] -= 1;
                numMarbles--;
            }
            
        }
        //get last position of marble
        let lastPos = nextPos;
        if (numMarbles === 0) {
            if (lastPos === 0) {
                lastPos = 13;
            } else {
                lastPos -= 1;
            }
            //get turn
            turn = checkLastMarblePos(turn, lastPos);
        }
    }
    //check for a winner
    winner = isWinner();

    //clear slots except players' pots when winner found
    if (winner != null) {
        for (let i = 0; i < potB; i++) {
            if (i !== potA) {
                board[i] = 0;
            }
        }
    }
    render();
}

//check last marble's position to determine turn
function checkLastMarblePos(turn, lastPos) {

    //if last marble lands on player's own pot, player gets another turn
    if ((turn === 1 && lastPos === potA) || (turn === -1 && lastPos === potB)) {
        return turn;
    } else if (sameSide(turn, lastPos) && ((board[lastPos] - 1) === 0)) {
        //if last marble lands on player's own side and the slot was empty
        //player gets all marbles of the slot across from it, then switch turns
        if (turn === 1) {
            //slot across from last marble pos = last index(13) - (lastPos) + 1
            board[potA] += board[13 - (lastPos + 1)];
            //empty marbles in slot across from last po
            board[13 - (lastPos + 1)] = 0;
            return turn *= -1;
        } else {
            board[potB] += board[13- (lastPos + 1)];
            board[13 - (lastPos + 1)] = 0;
            return turn *= -1;
        }
    } else {
        //otherwise, switch turns;
        return turn *= -1;
    }
}

//check if marbles' position belong to each player's corresponding side
function sameSide(turn, position) {
    //player A (slots 0 - 6)
    //player B (slots 7 - 13)
    if ((turn === 1 && (position >= 0 && position <= potA))
        || (turn === -1 && (position >= 7 && position < potB))) {
        return true;
    }
    return false;
}

//if end of game, check for a winner/tie, return winner
function isWinner() {
    let arrA = board.slice(0, potA);
    let arrB = board.slice(7, potB);
    //get total# marbles of each side of board
    let sumA = arrA.reduce((a, b) => a + b, 0);
    let sumB = arrB.reduce((a, b) => a + b, 0);

    console.log(typeof sumA);
    //if either sides have no more marbles = game ends
    if (sumA === 0 || sumB === 0) {
        //add remainder of marbles of either side to corresponding player's pots
        board[potA] += sumA;
        board[potB] += sumB;
        //check whose pots have more marbles
        if (board[potA] > board[potB]) {
            //player A wins
            winner = 1;
        } else if (board[potA] < board[potB]) {
            //player B wins
            winner = -1;
        } else {
            //tie
            winner = 0;
        }
    }
    return winner;
}

//show slot selections available/player's side to corresponding player during his/her turn
function highlightSide() {
    if (turn === 1) {
        //slots available to player A
        for (let i = 0; i < potA; i++) {
            document.getElementById(`slot${i}`).style.borderColor = PLAYER[turn].color;
        }
        for (let i = 7; i < potB; i++) {
            document.getElementById(`slot${i}`).style.borderColor = `rgba(214, 181, 120, 0.822)`;
        }
    } else {
        //slots available to player B
        for (let i = 0; i < potA; i++) {
            document.getElementById(`slot${i}`).style.borderColor = `rgba(214, 181, 120, 0.822)`;
        }
        for (let i = 7; i < potB; i++) {
            document.getElementById(`slot${i}`).style.borderColor = PLAYER[turn].color;
        }
    }
}

//get random pastel colored marbles
function getRandomColor() {
    var color = "hsl(" + 360 * Math.random() + ',' +
        (25 + 70 * Math.random()) + '%,' +
        (85 + 10 * Math.random()) + '%)';
    return color;
}

//clear appended marbles, when # of marbles in slots are updated
function clearMarbles() {
    var marbles = document.querySelectorAll('.marble');
    marbles.forEach(function (marble) {
        marble.remove();
    });
}

//randomly place marbles within circular slots
function setMarblePlacements() {
    $('.marble').each(function (i) {
        //get heights & widths of slots & marble
        let slotHeight = document.querySelector('.slot').scrollHeight;
        let slotWidth = document.querySelector('.slot').scrollWidth;
        //get random positions within slot for marbles 
        let marbleLeft = Math.random() * ((slotWidth * 0.5) - (this.offsetWidth * 0.5));
        let marbleTop = Math.random() * ((slotHeight * 0.5) - (this.offsetHeight * 0.5));
        if (this.parentNode.id === 'slot6' || this.parentNode.id === 'slot13') {
            //get heights and widths of pots
            let potHeight = document.getElementById('slot6').scrollHeight;
            let potWidth = document.getElementById('slot6').scrollWidth;
            //get random positions within pots for marbles
            let marblePotLeft = Math.random() * ((potWidth * 0.5) - (this.offsetWidth * 0.5));
            let marblePotTop = Math.random() * ((potHeight * 0.5) - (this.offsetHeight * 0.5));
            //position marbles within player's pots (slot6 & slot13)
            $(this).css({
                left: marblePotLeft + this.offsetWidth * 0.5,
                top: marblePotTop + this.offsetHeight * 1.5
            });
        } else {
            //position marbles within player's slots
            $(this).css({
                left: marbleLeft + this.offsetWidth * 0.5,
                top: marbleTop + this.offsetHeight * 0.5
            });
        }
    });
}

//display appropriate msgs during different states of game
function displayMessage() {
    if (winner === null) {
        //if not end of game,continue to take turns
        msgEl.textContent = `${PLAYER[turn].name}'s turn`;
        msgEl.style.color = PLAYER[turn].color;
    } else if (winner === 0) {
        //if no winner and end of game = 'Tie'
        msgEl.textContent = `${PLAYER[winner].name}, play again!`;
        msgEl.style.color = PLAYER[winner].color;
    } else {
        //end of game, announce winner
        document.getElementById(`slot${PLAYER[winner].pot}`).style.border = `3px solid ${PLAYER[winner].color}`;
        msgEl.textContent = `${PLAYER[winner].name} Won!`;
        msgEl.style.color = PLAYER[winner].color;
    }
}

//show each slot the marble went to & return the total time of function
function showSteps() {
    let time = 1000;
    positionsArray.forEach(function(pos){
        //hide marble elements of slots
        setTimeout(function(){
            $(`#slot${pos} :not(:first-child)`).css('visibility', 'hidden');
        });
        //give glow and shows the slots that earned marbles
        setTimeout(function() {
            document.getElementById(`slot${pos}`).classList.add('steps');
            document.querySelector(`#slot${pos}`).firstChild.textContent = board[pos];
            $(`#slot${pos} :not(:first-child)`).css('visibility', 'visible');
        }, time);
        //remove glow on slots for next turn
        setTimeout(function(){
            document.getElementById(`slot${pos}`).classList.remove('steps');
        }, time + 1000);
        time += 1000;
    });
    return time;
}

//title effect
var i = 0;
var text = 'Mancala';
var speed = 150;

function titleEffect() {
    if(i < text.length) {
        document.querySelector('h1').innerHTML += text.charAt(i);
        i++;
        setTimeout(titleEffect, speed);
    }
}
titleEffect();