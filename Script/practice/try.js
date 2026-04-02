const parent = {
  value: 2,
  method() {
    return this.value;
  },
};

console.log(parent.method());
const child = {
  __proto__: parent,
};
console.log(child.method());

child.value = 4;
console.log(child.method());

class second extends parent {
  constructor(value) {
    this._value = value;
  }
  get value() {
    return this._value;
  }
}

const secondchild = new second();
console.log(second);
