const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let dealerHand = [];
let playerHand = [];

const dealerCards = document.getElementById('dealer-cards');
const playerCards = document.getElementById('player-cards');
const dealerScore = document.getElementById('dealer-score');
const playerScore = document.getElementById('player-score');
const result = document.getElementById('result');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const restartButton = document.getElementById('restart-button');

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function startGame() {
    dealerHand = [];
    playerHand = [];
    createDeck();
    shuffleDeck();
    playerHand.push(deck.pop());
    playerHand.push(deck.pop());
    dealerHand.push(deck.pop());
    dealerHand.push(deck.pop());
    updateScores();
    updateHands();
    result.textContent = '';
    hitButton.disabled = false;
    standButton.disabled = false;
}

function getHandValue(hand) {
    let value = 0;
    let aceCount = 0;
    for (let card of hand) {
        if (card.value === 'J' || card.value === 'Q' || card.value === 'K') {
            value += 10;
        } else if (card.value === 'A') {
            value += 11;
            aceCount++;
        } else {
            value += parseInt(card.value);
        }
    }
    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount--;
    }
    return value;
}

function updateScores() {
    dealerScore.textContent = `Score: ${getHandValue(dealerHand)}`;
    playerScore.textContent = `Score: ${getHandValue(playerHand)}`;
}

function updateHands() {
    dealerCards.innerHTML = '';
    playerCards.innerHTML = '';
    for (let card of dealerHand) {
        dealerCards.innerHTML += `<div>${card.value} of ${card.suit}</div>`;
    }
    for (let card of playerHand) {
        playerCards.innerHTML += `<div>${card.value} of ${card.suit}</div>`;
    }
}

function checkForEndOfGame() {
    const playerValue = getHandValue(playerHand);
    const dealerValue = getHandValue(dealerHand);

    if (playerValue > 21) {
        result.textContent = 'You busted! Dealer wins.';
        hitButton.disabled = true;
        standButton.disabled = true;
    } else if (dealerValue > 21) {
        result.textContent = 'Dealer busted! You win.';
        hitButton.disabled = true;
        standButton.disabled = true;
    } else if (dealerValue >= 17) {
        if (playerValue > dealerValue) {
            result.textContent = 'You win!';
        } else if (playerValue < dealerValue) {
            result.textContent = 'Dealer wins.';
        } else {
            result.textContent = 'It\'s a tie!';
        }
        hitButton.disabled = true;
        standButton.disabled = true;
    }
}

hitButton.addEventListener('click', () => {
    playerHand.push(deck.pop());
    updateScores();
    updateHands();
    checkForEndOfGame();
});

standButton.addEventListener('click', () => {
    while (getHandValue(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }
    updateScores();
    updateHands();
    checkForEndOfGame();
});

restartButton.addEventListener('click', startGame);

startGame();