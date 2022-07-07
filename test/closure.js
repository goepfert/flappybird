const createThing = () => {
  let value = 0;

  function getValue() {
    return value;
  }

  function setValue(_value) {
    value = _value;
  }

  function getCopy() {
    let newThing = createThing();
    newThing.setValue(this.getValue());
    return newThing;
  }

  return {
    getValue,
    setValue,
    getCopy,
  };
};

let thing_1 = createThing();
thing_1.setValue(100);

// let thing_2 = thing_1;
// console.log(thing_2.getValue());
// thing_1.setValue(200);
// console.log(thing_2.getValue());

let thing_2 = thing_1.getCopy();
console.log(thing_2.getValue());
thing_1.setValue(200);
console.log(thing_2.getValue());
