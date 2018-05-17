const rules = require('./../util/rules');

/**
 * [ScoreCalculator description]
 * @constructor
 */
function ScoreCalculator() { }

const S = ScoreCalculator.prototype;

/**
 * [calculate description]
 * @param  {Array} cards [description]
 * @return {Number}       [description]
 */
S.calculate = function calculate(cards) {
  if (rules.playerCardsNo + rules.communityCardsNo === cards.length) {
    let maxScore = 0;
    const checks = this.getChecks(cards);
    Object.values(checks).forEach((check) => {
      const points = check(cards);
      if (points > maxScore) {
        maxScore = points;
      }
    });
  }
  return new Error('Number of given cards doesn\'t satisfy the rules');
};

S.sortCardsOnValue = function sortCardsOnValue(cards) {

};

S.checkOnePair = function checkOnePair(cards) {

};

S.checkTwoPairs = function checkTwoPairs(cards) {

};

S.checkThreeOfAKind = function checkThreeOfAKind(cards) {

};

S.checkStraight = function checkStraight(cards) {
  // TODO: Ace can be highest or lowest card
  cards.sort((a, b) => b.numericValue - a.numericValue);
  let consecutiveCards = [];
  let prevCard = cards[0];
  for (let i = 1; i < cards.length; i += 1) {
    if (Math.abs(cards[i].numericValue - prevCard.numericValue[1]) === 1) {
      consecutiveCards.push(prevCard);
      if (consecutiveCards.length === 4) {
        consecutiveCards.push(cards[i]);
        return {
          isSatisfied: true,
          cards: consecutiveCards,
          points: rules.handRanks.straight,
        };
      }
    } else {
      consecutiveCards = [];
    }
    prevCard = cards[i];
  }
  return {
    isSatisfied: false,
    points: 0,
  };
};

S.checkFlush = function checkFlush(cards) {
  const suits = {};
  cards.forEach((card) => {
    if (!(card.suit in suits)) {
      suits[card.suit] = [];
    }
    suits[card.suit].push(card);
    if (suits[card.suit].length === 5) {
      return {
        isSatisfied: true,
        cards: suits[card.suit],
        points: rules.handRanks.flush,
      };
    }
  });
};

S.checkFullHouse = function checkFullHouse(cards) {

};

S.checkFourOfAKind = function checkFourOfAKind(cards) {

};

S.checkStraightFlush = function checkStraightFlush(cards) {

};

S.checkRoyalFlush = function checkRoyalFlush(cards) {
  const isStraight = this.checkStraight(cards);
};

S.convertToNumericValues = function convertToNumericValues(cards) {

};

module.exports = ScoreCalculator;
