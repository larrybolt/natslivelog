module.exports.binaryToHexDisplay = function (input) {
  return input
    .reduce(function (p,c){
      var n = c.toString(16);
      if (n.length === 1) n = '0'+n;
      return p+n;
    }, '').split('').reduce(function(p,c,i){ return p+(i%2===0 && i!==0 ?' ': '')+c; }, '');
};