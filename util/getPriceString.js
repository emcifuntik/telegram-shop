function getEnding(number) {
  number = Math.floor(number);
  let strNumber = number.toString();
  let lastNumber = strNumber.charAt(strNumber.length - 1);
  if(strNumber.length >= 2) {
    let preLastNumber = strNumber.charAt(strNumber.length - 2);
    if(preLastNumber == '1') {
      switch(lastNumber) {
        case '1':
        case '2':
        case '3':
        case '4':
          return 'рублей';
      }
    }
  }
  switch(lastNumber) {
    case '0':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      return 'рублей';
    case '1':
      return 'рубль';
    case '2': 
    case '3':
    case '4':
      return 'рубля';
  }
}

function getUnit(unit) {
  switch(unit) {
    case 'piece':
      return 'штуку';
    case 'gram':
      return 'грамм';
    case 'kilogram':
      return 'килограмм';
    case 'ton':
      return 'тонну';
  }
}

module.exports = (price, unit) => {
  return price.toFixed(2) + ' ' + getEnding(price) + ' за ' + getUnit(unit);
}