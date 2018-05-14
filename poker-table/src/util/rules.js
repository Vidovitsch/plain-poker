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
    onePair: 100,
    twoPairs: 200,
    threeOfAKind: 300,
    straight: 400,
    flush: 500,
    fullHouse: 600,
    fourOfAKind: 700,
    straightFlush: 800,
    royalFlush: 900,
  };
}

module.exports = Rules;
