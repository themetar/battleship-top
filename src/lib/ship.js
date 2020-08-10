export default function ShipFactory(length) {
  const sectionHit = (new Array(length)).fill(false);

  return {
    get length() {
      return sectionHit.length;
    },
    hit: function(t) {
      if (t < 0 || t >= length) throw new RangeError();
      sectionHit[t] = true;
    },
    isSunk: function() {
      return sectionHit.every(s => s);
    },
  };
};
