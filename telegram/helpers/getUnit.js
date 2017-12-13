const measures = {
  piece: [
    'штук',
    'штук',
    'штука',
    'штуки'
  ],
  kilogram: [
    'килограмм',
    'килограмм',
    'килограмм',
    'килограмма'
  ],
  gram: [
    'грамм',
    'грамм',
    'грамм',
    'грамма'
  ],
  ton: [
    'тонн',
    'тонн',
    'тонна',
    'тонны'
  ]
};

function getUnit(unit, count) {
  let lastTwo = count % 100;
  let lastOne = count % 10;

  if (count > 10) {
    if (lastTwo >= 10 && lastTwo <= 20) {
      return count + ' ' + measures[unit][0];
    }
  }
  switch (lastOne) {
    case 0:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      return count + ' ' + measures[unit][1];
    case 1:
      return count + ' ' + measures[unit][2];
    case 2:
    case 3:
    case 4:
      return count + ' ' + measures[unit][3];
  }
}

module.exports = getUnit;