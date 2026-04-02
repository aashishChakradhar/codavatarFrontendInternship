const Dog = (name, breed) => {
  let _name = name;
  let _breed = breed;

  return {
    get name() {
      return _name;
    },
    set name(name) {
      if (typeof name === "string") _name = name;
    },

    get breed() {
      return _breed;
    },
    set breed(breed) {
      if (typeof breed === "string") _breed = breed;
    },
  };
};

const pet = Dog("pp", "ss");
console.log(pet.name);
console.log(pet.breed);
