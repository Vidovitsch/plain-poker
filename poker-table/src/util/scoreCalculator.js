function ScoreCalculator(rules) {
  this.rules = rules;
}

const S = ScoreCalculator.prototype;

S.getCountOfSameValues = function getCountOfSameValues(cards) {
  const counts = {};
  cards.forEach(({ value }) => { counts[value] = (counts[value] || 0) + 1; });

  return counts;
};

module.exports = ScoreCalculator;
