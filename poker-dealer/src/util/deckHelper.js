const cardEnumerations = require('./../util/cardEnumerations');
const card = require('./../models/card');
const cardWrapper = require('./../models/cardWrapper');
const uuidv4 = require('uuid/v4');

let instance = null;

function DeckHelper() { }

const D = DeckHelper.prototype;

D.wrapCards = function wrapCards(cards, dealerId, ownerId) {
  const cardWrappers = [];
  cards.forEach((c) => {
    cardWrappers.push(cardWrapper.createInstance({
      card: c,
      dealerId,
      ownerId,
    }));
  });
  return cardWrappers;
};

D.getRandomCards = function getRandomCards(deck, numberOfCards) {
  const cards = [];
  let counter = 0;
  while (numberOfCards > counter) {
    const randomIndex = Math.floor(Math.random() * deck);
    cards.push(deck[randomIndex]);
    deck.splice(randomIndex, 1);
    counter += 1;
  }
  return cards;
};

D.createSortedDeck = function createSortedDeck() {
  const deckId = uuidv4();
  const deck = [];
  cardEnumerations.suits.forEach((suit) => {
    cardEnumerations.values.forEach((value) => {
      deck.push(card.createInstance({
        deckId,
        value,
        suit,
      }));
    });
  });
  return deck;
};

D.shuffleDeck = function shuffleDeck(deck) {
  let counter = deck.length;
  while (counter > 0) {
    const randomIndex = Math.floor(Math.random() * counter);
    counter -= 1;
    this.swapEntries(deck, counter, randomIndex);
  }
  return deck;
};

D.swapEntries = function swapEnties(array, firstIndex, secondIndex) {
  const temp = array[firstIndex];
  /* eslint-disable no-param-reassign */
  array[firstIndex] = array[secondIndex];
  array[secondIndex] = temp;
  /* eslint-enable no-param-reassign */
};

module.exports = {
  getInstance() {
    if (instance === null) {
      instance = new DeckHelper();
    }
    return instance;
  },
};
