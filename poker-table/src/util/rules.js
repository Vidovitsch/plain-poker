// suit
// color
// value
function Rules() {
  this.playerCardsNo = 2;
  this.communityCardsNo = 5;
  this.cardValues = {
    two: 0,
    three: 1,
    four: 2,
    five: 3,
    six: 4,
    seven: 5,
    eight: 6,
    nine: 7,
    ten: 8,
    jack: 9,
    queen: 10,
    king: 11,
    ace: 12,
  };
  this.handRanks = {
    onePair: 1,
    twoPairs: 2,
    threeOfAKind: 3,
    straight: 4,
    flush: 5,
    fullHouse: 6,
    fourOfAKind: 7,
    straightFlush: 8,
    royalFlush: 9,
  };
}

module.exports = Rules;
