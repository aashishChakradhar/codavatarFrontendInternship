function handleButtonPress(e) {
  let value = e.target.innerText;
  let stack = [];
  stack.push(value);
  console.log(`clicked ${value}`);
}

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", handleButtonPress);
});
