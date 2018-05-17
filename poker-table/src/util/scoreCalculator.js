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
  if (cards.length === rules.playerCardsNo + rules.communityCardsNo) {
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

S.checkOnePair = function checkOnePair(cards) {

};

S.checkTwoPairs = function checkTwoPairs(cards) {

};

S.checkThreeOfAKind = function checkThreeOfAKind(cards) {

};

S.checkStraight = function checkStraight(cards) {

};

S.checkFlush = function checkFlush(cards) {

};

S.checkFullHouse = function checkFullHouse(cards) {

};

S.checkFourOfAKind = function checkFourOfAKind(cards) {

};

S.checkStraightFlush = function checkStraightFlush(cards) {

};

S.checkRoyalFlush = function checkRoyalFlush(cards) {

};

module.exports = ScoreCalculator;
