const numberBtnSection = document.querySelector(".number-buttons-section");
const operationBtnSection = document.querySelector(".math-buttons-section");
const controlBtnSection = document.querySelector(".control-buttons-section");
const inputField = document.querySelector(
  ".input-screen-section__input-screen"
);
let calcInput = "";
let isResultCalculated = false;
let keyboardBtnCode = "";
let keyPressed = {};
const specialOperations = ["root", "square", "="];
const keyboardNumberCodes = [
  { code: "Digit1", key: "1" },
  { code: "Digit2", key: "2" },
  { code: "Digit3", key: "3" },
  { code: "Digit4", key: "4" },
  { code: "Digit5", key: "5" },
  { code: "Digit6", key: "6" },
  { code: "Digit7", key: "7" },
  { code: "Digit8", key: "8" },
  { code: "Digit9", key: "9" },
  { code: "Digit0", key: "0" },
  { code: "AltLeft Minus", key: "sign" },
  { code: "Period", key: "." },
];
const keyboardOperationCodes = [
  { code: "ShiftLeft Equal", key: "+" },
  { code: "Minus", key: "-" },
  { code: "Equal", key: "=" },
  { code: "Enter", key: "=" },
  { code: "ShiftLeft Digit8", key: "x" },
  { code: "Slash", key: "/" },
  { code: "ControlLeft BracketRight", key: "root" },
  { code: "ControlLeft BracketLeft", key: "square" },
  { code: "ShiftLeft Digit5", key: "%" },
];

const keyboardClearInputCodes = [
  { code: "Backspace", key: "delete" },
  { code: "Escape", key: "c" },
  { code: "Delete", key: "ce" },
];

const isZero = (number) => +number === 0;

const getNumberOfExpressionElems = (inputExpression) =>
  inputExpression.trim().split(" ").length;

const isLastExpressionElemNumber = (inputExpression) =>
  getNumberOfExpressionElems(inputExpression) === 1 ||
  getNumberOfExpressionElems(inputExpression) === 3
    ? true
    : false;

const isOperationPresentInExpression = (inputExpression) => {
  const arrExpression = inputExpression.split(" ");
  const operations = arrExpression.filter((item) => isNaN(item));
  return operations.length > 0;
};

const isSeparatorPresent = (inputExpression) => {
  const arrExpression = inputExpression.split(" ");
  return arrExpression[arrExpression.length - 1].includes(".");
};

const removeLastChar = (inputNumber) => {
  const arrNumber = inputNumber.split("");
  arrNumber[arrNumber.length - 2] === "."
    ? arrNumber.splice(arrNumber.length - 2, 2)
    : arrNumber.splice(arrNumber.length - 1, 1);
  return arrNumber.join("");
};

const getNumberBtnType = (btnTypeInfo) => {
  return btnTypeInfo.includes("number-btn") || btnTypeInfo.includes("Digit")
    ? "number"
    : btnTypeInfo.includes("dot-btn") || btnTypeInfo.includes("Period")
    ? "dot"
    : btnTypeInfo.includes("sign-btn") || btnTypeInfo.includes("AltLeft Minus")
    ? "sign"
    : -1;
};

const setNumber = (btnText) => {
  const inputArr = calcInput.split(" ");
  if (getNumberOfExpressionElems(calcInput) >= 1 && !isZero(inputField.value)) {
    if (getNumberOfExpressionElems(calcInput) === 3 && inputArr[2] === "0") {
      inputArr[2] = btnText;
      inputField.value = inputArr.join(" ");
      calcInput = inputField.value;
    } else {
      inputField.value += btnText;
    }
  } else {
    inputField.value = btnText;
  }
};

const setDecimalSeparator = (btnText) => {
  if (isLastExpressionElemNumber(calcInput) && !isSeparatorPresent(calcInput)) {
    inputField.value === ""
      ? (inputField.value += `0${btnText}`)
      : (inputField.value += btnText);
  }
};

const setMathSign = () => {
  if (isLastExpressionElemNumber(calcInput) && !isZero(calcInput)) {
    const inputArr = calcInput.split(" ");
    let lastInputItem = +inputArr[inputArr.length - 1];
    lastInputItem *= -1;
    inputArr[inputArr.length - 1] = lastInputItem + "";
    inputField.value = inputArr.join(" ");
  }
};

const assembleNumberInField = (numberElement, strToInput) => {
  if (!isResultCalculated) {
    switch (numberElement) {
      case "number":
        setNumber(strToInput);
        break;
      case "dot":
        setDecimalSeparator(strToInput);
        break;
      case "sign":
        setMathSign();
        break;
    }
  } else if (isResultCalculated) {
    calcInput = "";
    inputField.value = "";
    switch (numberElement) {
      case "number":
        setNumber(strToInput);
        break;
      case "dot":
        setDecimalSeparator(strToInput);
        break;
      case "sign":
        setMathSign();
        break;
    }
    isResultCalculated = false;
  }
  calcInput = inputField.value;
};

const inputOperation = (btnText) => {
  if (
    !specialOperations.includes(btnText) &&
    !isOperationPresentInExpression(calcInput)
  ) {
    !isZero(calcInput)
      ? (inputField.value += ` ${btnText} `)
      : (inputField.value += `0 ${btnText} `);
    isResultCalculated = false;
  } else if (
    specialOperations.includes(btnText) &&
    btnText !== "=" &&
    !isOperationPresentInExpression(calcInput)
  ) {
    const specialExpression = `${calcInput} ${btnText}`;
    const inputArr = specialExpression.split(" ");
    inputField.value =
      btnText === "root" || btnText === "square"
        ? calculateExpression(inputArr)
        : calcInput;
    isResultCalculated = true;
  } else if (
    isOperationPresentInExpression(calcInput) &&
    getNumberOfExpressionElems(calcInput) === 2
  ) {
    const inputArr = calcInput.split(" ");
    if (btnText === "root" || btnText === "square") {
      inputArr.splice(inputArr.length - 2, 1, btnText);
      inputField.value = calculateExpression(inputArr);
      isResultCalculated = true;
    }
  } else if (isOperationPresentInExpression(calcInput)) {
    const inputArr = calcInput.split(" ");
    if (!specialOperations.includes(btnText)) {
      inputField.value = calculateExpression(inputArr) + ` ${btnText} `;
    } else {
      inputField.value = calculateExpression(inputArr);
      isResultCalculated = true;
    }
  }
  calcInput = inputField.value;
};

const clearInputField = (btnText) => {
  const inputArr = calcInput.split(" ");
  let lastInputItem = inputArr[inputArr.length - 1];
  switch (btnText) {
    case "c":
      calcInput = "";
      inputField.value = "";
      break;
    case "ce":
      if (!isNaN(lastInputItem) && !isZero(lastInputItem)) {
        inputArr.length > 2
          ? inputArr.splice(inputArr.length - 1, 1, 0)
          : inputArr.splice(inputArr.length - 1, 1);
        calcInput = inputArr.join(" ");
        inputField.value = inputArr.join(" ");
      }
      break;
    case "delete":
      if (!isNaN(lastInputItem) && lastInputItem) {
        lastInputItem = removeLastChar(lastInputItem);
        inputArr[inputArr.length - 1] = +lastInputItem + "";
        if (isZero(lastInputItem) && inputArr.length === 1) {
          calcInput = "";
          inputField.value = "";
        } else {
          calcInput = inputArr.join(" ");
          inputField.value = inputArr.join(" ");
        }
      } else if (isNaN(lastInputItem)) {
        calcInput = "";
        inputField.value = "";
      }
      break;
  }
};

const calculateExpression = (expressionArr) => {
  if (isNaN(expressionArr[1])) {
    switch (expressionArr[1]) {
      case "+":
        return +expressionArr[0] + +expressionArr[2];
      case "-":
        return expressionArr[0] - expressionArr[2];
      case "/":
        return +expressionArr[2] === 0
          ? 0
          : expressionArr[0] / expressionArr[2];
      case "x":
        return expressionArr[0] * expressionArr[2];
      case "root":
        return Math.sqrt(expressionArr[0]);
      case "square":
        return expressionArr[0] * expressionArr[0];
    }
  }
};

const getPressedKeyboardBtnType = (btnCode) => {
  let btnType = "";
  keyboardNumberCodes.forEach((numberCode) => {
    if (numberCode.code === btnCode) {
      btnType = "number";
    }
  });

  if (btnType === "") {
    keyboardOperationCodes.forEach((numberCode) => {
      if (numberCode.code === btnCode) {
        btnType = "operation";
      }
    });
    if (btnType === "") {
      keyboardClearInputCodes.forEach((numberCode) => {
        if (numberCode.code === btnCode) {
          btnType = "clear";
        }
      });
    }
  }

  return btnType;
};

//CLEAR THE CALCULATIONS
controlBtnSection.addEventListener("click", (event) => {
  const elemClassName = event.target.className;
  if (elemClassName.includes("control-btn")) {
    if (calcInput) {
      const controlBtn = event.target;
      const btnText = controlBtn.textContent.trim().toLowerCase();
      clearInputField(btnText);
      isResultCalculated = false;
    }
  }
});

//INPUT NUMBERS
numberBtnSection.addEventListener("click", (event) => {
  const btnClass = getNumberBtnType(event.target.className);
  const numberBtn = event.target;
  const btnText = numberBtn.textContent.trim();
  assembleNumberInField(btnClass, btnText);
});

//INPUT OPERATIONS
operationBtnSection.addEventListener("click", (event) => {
  const btnClassName = event.target.className;
  const operationBtn = event.target;
  const btnText = operationBtn.textContent.trim();
  if (btnClassName.includes("operation-btn")) {
    inputOperation(btnText);
  }
});

//KEYBOARD EVENTS
document.addEventListener("keydown", (event) => {
  keyboardBtnCode = event.code;
  keyPressed[keyboardBtnCode] = true;
});

document.addEventListener("keyup", () => {
  //WHEN 1 button is pressed (i.e. no special operations like shift+5 are used)
  if (Object.keys(keyPressed).length === 1) {
    const btnType = getPressedKeyboardBtnType(keyboardBtnCode);
    switch (btnType) {
      //INPUT NUMBERS
      case "number":
        const [numberKeyboardBtn] = keyboardNumberCodes.filter(
          (keyboardCode) => keyboardCode.code === keyboardBtnCode
        );
        assembleNumberInField(
          getNumberBtnType(numberKeyboardBtn.code),
          numberKeyboardBtn.key
        );
        console.log(numberKeyboardBtn.code);
        break;
      //INPUT OPERATIONS
      case "operation":
        const [operationKeyboardBtn] = keyboardOperationCodes.filter(
          (keyboardCode) => keyboardCode.code === keyboardBtnCode
        );
        inputOperation(operationKeyboardBtn.key);
        console.log(operationKeyboardBtn.code);
        break;
      //CLEAR THE INPUT
      case "clear":
        if (calcInput) {
          const [clearKeyboardBtn] = keyboardClearInputCodes.filter(
            (keyboardCode) => keyboardCode.code === keyboardBtnCode
          );
          clearInputField(clearKeyboardBtn.key);
          console.log(clearKeyboardBtn.code);
          isResultCalculated = false;
        }
        break;
    }
  }
  //FOR HANDLING MULTIPLE BUTTONS PRESSED AT THE SAME TIME
  if (Object.keys(keyPressed).length > 1) {
    const multipleBtnKey = Object.keys(keyPressed).join(" ");
    console.log(multipleBtnKey);
    const btnType = getPressedKeyboardBtnType(multipleBtnKey);
    switch (btnType) {
      //INPUT NUMBERS
      case "number":
        const [keyboardBtn] = keyboardNumberCodes.filter(
          (keyboardCode) => keyboardCode.code === multipleBtnKey
        );
        assembleNumberInField(
          getNumberBtnType(keyboardBtn.code),
          keyboardBtn.key
        );
        break;
      //INPUT OPERATIONS
      case "operation":
        const [operationKeyboardBtn] = keyboardOperationCodes.filter(
          (keyboardCode) => keyboardCode.code === multipleBtnKey
        );
        inputOperation(operationKeyboardBtn.key);
        break;
    }
  }
  for (const property of Object.getOwnPropertyNames(keyPressed)) {
    delete keyPressed[property];
  }
});
