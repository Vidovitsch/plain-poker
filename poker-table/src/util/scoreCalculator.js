function ScoreCalculator(rules) {
  this.rules = rules;
}

const S = ScoreCalculator.prototype;

S.calculateScore = function calculateScore(cards) {
  if (cards.length === this.rules.playerCardsNo + this.rules.communityCardsNo) {
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

S.getChecks = function getChecks() {
  return {
    royalFlush: this.checkRoyalFlush,
    straightFlush: this.checkStraightFlush,
    fourOfAKind: this.checkFourOfAKind,
    fullHouse: this.checkFullHouse,
    flush: this.checkFlush,
    straight: this.checkStraight,
    threeOfAKind: this.checkThreePairs,
    twoPairs: this.checkTwoPairs,
    onePair: this.checkOnePair,
  };
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
