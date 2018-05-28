const cardEnums = require('./../util/cardEnums');
const card = require('./../models/card');
const cardWrapper = require('./../models/cardWrapper');
const uuidv4 = require('uuid/v4');

// singleton support
let instance = null;

function DeckHelper() { }

const D = DeckHelper.prototype;

/**
 * [wrapCards description]
 * @param  {Array} cards    [description]
 * @param  {String} dealerId [description]
 * @param  {String} ownerId  [description]
 * @return {Array}          [description]
 */
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

/**
 * [getRandomCards description]
 * @param  {Array} deck          [description]
 * @param  {Number} numberOfCards [description]
 * @return {Array}               [description]
 */
D.getRandomCards = function getRandomCards(deck, numberOfCards) {
  const cards = [];
  let counter = 0;
  while (numberOfCards > counter) {
    const randomIndex = Math.floor(Math.random() * deck.length);
    cards.push(deck[randomIndex]);
    deck.splice(randomIndex, 1);
    counter += 1;
  }
  return cards;
};

/**
 * [createSortedDeck description]
 * @return {Array} [description]
 */
D.createSortedDeck = function createSortedDeck() {
  const deckId = uuidv4();
  const deck = [];
  Object.keys(cardEnums.suits).forEach((suit) => {
    Object.keys(cardEnums.values).forEach((value) => {
      deck.push(card.createInstance({
        deckId,
        value,
        suit,
      }));
    });
  });
  return deck;
};

/**
 * [shuffleDeck description]
 * @param  {Array} deck [description]
 * @return {Array}      [description]
 */
D.shuffleDeck = function shuffleDeck(deck) {
  let counter = deck.length;
  while (counter > 0) {
    const randomIndex = Math.floor(Math.random() * counter);
    counter -= 1;
    this.swapEntries(deck, counter, randomIndex);
  }
  return deck;
};

/**
 * [swapEnties description]
 * @param  {Array} array       [description]
 * @param  {Number} firstIndex  [description]
 * @param  {Number} secondIndex [description]
 */
D.swapEntries = function swapEnties(array, firstIndex, secondIndex) {
  const temp = array[firstIndex];
  /* eslint-disable no-param-reassign */
  array[firstIndex] = array[secondIndex];
  array[secondIndex] = temp;
  /* eslint-enable no-param-reassign */
};

module.exports = {
  /**
   * [getInstance description]
   * @return {DeckHelper} [description]
   */
  getInstance() {
    if (!instance) {
      instance = new DeckHelper();
    }
    return instance;
  },
};
