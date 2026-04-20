const inputEl = document.getElementById("input");
const outputEl = document.getElementById("output");
const keypadEl = document.getElementById("keypad");

let currentInput = "0";
let previousValue = null;
let currentOperator = null;
let shouldResetInput = false;

inputEl.readOnly = true;
render();

keypadEl.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) {
    return;
  }

  const buttonText = button.innerText.trim();

  if (!buttonText) {
    return;
  }

  if (/^[0-9]$/.test(buttonText)) {
    appendDigit(buttonText);
    render();
    return;
  }

  switch (buttonText) {
    case ".":
      appendDot();
      break;
    case "+":
    case "-":
    case "*":
    case "/":
      setOperator(buttonText);
      break;
    case "%":
      applyPercent();
      break;
    case "=":
      evaluate();
      break;
    case "C":
      clearAll();
      break;
    case "backspace":
      backspace();
      break;
    default:
      break;
  }

  render();
});

function appendDigit(digit) {
  if (shouldResetInput) {
    currentInput = digit;
    shouldResetInput = false;
    return;
  }

  if (currentInput === "0") {
    currentInput = digit;
    return;
  }

  currentInput += digit;
}

function appendDot() {
  if (shouldResetInput) {
    currentInput = "0.";
    shouldResetInput = false;
    return;
  }

  if (!currentInput.includes(".")) {
    currentInput += ".";
  }
}

function setOperator(nextOperator) {
  if (currentOperator && !shouldResetInput) {
    evaluate();
  }

  previousValue = Number(currentInput);
  currentOperator = nextOperator;
  shouldResetInput = true;
}

function applyPercent() {
  const numeric = Number(currentInput);
  currentInput = String(numeric / 100);
}

function evaluate() {
  if (currentOperator === null || previousValue === null) {
    return;
  }

  const currentValue = Number(currentInput);
  let result = 0;

  switch (currentOperator) {
    case "+":
      result = previousValue + currentValue;
      break;
    case "-":
      result = previousValue - currentValue;
      break;
    case "*":
      result = previousValue * currentValue;
      break;
    case "/":
      if (currentValue === 0) {
        currentInput = "Error";
        previousValue = null;
        currentOperator = null;
        shouldResetInput = true;
        return;
      }
      result = previousValue / currentValue;
      break;
    default:
      return;
  }

  currentInput = formatNumber(result);
  previousValue = null;
  currentOperator = null;
  shouldResetInput = true;
}

function backspace() {
  if (shouldResetInput) {
    return;
  }

  if (currentInput.length <= 1 || currentInput === "Error") {
    currentInput = "0";
    return;
  }

  currentInput = currentInput.slice(0, -1);
}

function clearAll() {
  currentInput = "0";
  previousValue = null;
  currentOperator = null;
  shouldResetInput = false;
}

function render() {
  inputEl.value = currentInput;

  if (previousValue !== null && currentOperator) {
    outputEl.innerText = `${formatNumber(previousValue)} ${currentOperator}`;
  } else {
    outputEl.innerText = "";
  }
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  // Keep long decimals readable while preserving integer values.
  const rounded = Math.round(value * 1e12) / 1e12;
  return String(rounded);
}
