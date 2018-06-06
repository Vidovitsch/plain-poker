const PokerSolver = require('pokersolver').Hand;

// singleton support
let instance = null;

/**
 * [HandSolver description]
 * @constructor
 */
function HandSolver() { }

const H = HandSolver.prototype;

/**
 * [solve description]
 * @param  {Array} cardPool [description]
 * @return {Object}          [description]
 * @return {Error}          [description]
 */
H.solve = function solve(cardPool) {
  if (cardPool.length === 7) {
    const { name, rank, cards } = PokerSolver.solve(this.toWildValues(cardPool));
    const solvedCards = this.getSolvedCards(cards, cardPool);
    return {
      name,
      points: (rank * 100) + this.getCardScore(solvedCards),
      cards: solvedCards,
    };
  }
  return new Error('A score can only be calculated with a set of 7 cards');
};

/**
 * [convertToWildValues description]
 * @param  {Array} hand [description]
 * @return {Array}      [description]
 */
H.toWildValues = function toWildValues(cards) {
  return cards.map(cardWrapper => cardWrapper.card.wild);
};

/**
 * [getSolvedCards description]
 * @param  {Array} solvedCards [description]
 * @param  {Array} cardPool    [description]
 * @return {Array}             [description]
 */
H.getSolvedCards = function getSolvedCards(solvedCards, cardPool) {
  const cardWrappers = [];
  solvedCards.forEach((solvedCard) => {
    cardWrappers.push(cardPool.find(cardWrapper => cardWrapper.card.wild === solvedCard.value + solvedCard.suit));
  });
  return cardWrappers;
};

/**
 * [getCardScore description]
 * @param  {Array} cardWrappers [description]
 * @return {Number}              [description]
 */
H.getCardScore = function getCardScore(cardWrappers) {
  let sum = 0;
  cardWrappers.forEach(({ card }) => {
    sum += card.points;
  });
  return sum;
};

module.exports = {
  /**
   * [getInstance description]
   * @return {HandSolver} [description]
   */
  getInstance() {
    if (!instance) {
      instance = new HandSolver();
    }
    return instance;
  },
};
