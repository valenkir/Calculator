const inputField = document.querySelector(
  ".input-screen-section__input-screen"
);

let calcInput = "";
let isResultCalculated = false;
let keyboardBtnCode = "";
let keyPressed = {};
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
  } else if (calcInput.includes(".")) {
    inputField.value += btnText;
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

const inputOperation = (btnText) => {
  const singleOperations = ["root", "square"];
  const pairOperations = ["+", "-", "/", "x"];
  const operationType = singleOperations.includes(btnText)
    ? "single"
    : pairOperations.includes(btnText)
    ? "pair"
    : btnText;
  if (isZero(calcInput)) {
    if (operationType === "pair") {
      inputField.value += `0 ${btnText} `;
      isResultCalculated = false;
    }
  } else if (getNumberOfExpressionElems(calcInput) === 1) {
    switch (operationType) {
      case "pair":
        inputField.value += ` ${btnText} `;
        isResultCalculated = false;
        break;
      case "single":
        inputField.value = calculateExpression([calcInput, btnText]);
        isResultCalculated = true;
        break;
    }
  } else if (getNumberOfExpressionElems(calcInput) === 2) {
    if (operationType === "single") {
      const inputArr = calcInput.split(" ");
      inputField.value = calculateExpression([inputArr[0], btnText]);
      isResultCalculated = true;
    }
  } else if (getNumberOfExpressionElems(calcInput) === 3) {
    const inputArr = calcInput.split(" ");
    switch (operationType) {
      case "pair":
        inputField.value = `${calculateExpression(inputArr)} ${btnText} `;
        isResultCalculated = false;
        break;
      case "%":
        inputField.value = `${inputArr[0]} ${inputArr[1]} ${calculateExpression(
          inputArr,
          true
        )}`;
        isResultCalculated = false;
        break;
      case "single":
      case "=":
        inputField.value = calculateExpression(inputArr);
        isResultCalculated = true;
        break;
    }
  }
  calcInput = inputField.value;
};

const clearInputField = (btnText) => {
  const inputArr = calcInput.split(" ");
  let lastInputItem = inputArr[inputArr.length - 1];
  switch (btnText.toLowerCase()) {
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

const calculateExpression = (expressionArr, percentageOperation = false) => {
  const operation = percentageOperation ? "%" : expressionArr[1];
  if (isNaN(operation)) {
    switch (operation) {
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
      case "%":
        const result = (expressionArr[2] * expressionArr[0]) / 100;
        return result;
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

$(() => {
  //INPUT NUMBERS
  $(".number-buttons-section").on("click", (event) => {
    const btnText = $(event.target).text().trim();
    if (isResultCalculated) {
      calcInput = "";
      inputField.value = "";
      isResultCalculated = false;
    }
    if ($(event.target).hasClass("number-btn")) {
      setNumber(btnText);
    } else if ($(event.target).hasClass("dot-btn")) {
      setDecimalSeparator(btnText);
    } else if ($(event.target).hasClass("sign-btn")) {
      setMathSign();
    }
    calcInput = inputField.value;
  });

  //INPUT OPERATIONS
  $(".math-buttons-section").on("click", (event) => {
    const btnText = $(event.target).text().trim();
    if ($(event.target).hasClass("operation-btn")) {
      inputOperation(btnText);
    }
  });

  //CLEAR INPUT
  $(".control-buttons-section").on("click", (event) => {
    if ($(event.target).hasClass("control-btn")) {
      if (calcInput) {
        const btnText = $(event.target).text().trim();
        clearInputField(btnText);
        isResultCalculated = false;
      }
    }
  });
});

//KEYBOARD EVENTS
// document.addEventListener("keydown", (event) => {
//   keyboardBtnCode = event.code;
//   keyPressed[keyboardBtnCode] = true;
// });

// document.addEventListener("keyup", () => {
//   //WHEN 1 button is pressed (i.e. no special operations like shift+5 are used)
//   if (Object.keys(keyPressed).length === 1) {
//     const btnType = getPressedKeyboardBtnType(keyboardBtnCode);
//     switch (btnType) {
//       //INPUT NUMBERS
//       case "number":
//         const [numberKeyboardBtn] = keyboardNumberCodes.filter(
//           (keyboardCode) => keyboardCode.code === keyboardBtnCode
//         );
//         assembleNumberInField(
//           getNumberBtnType(numberKeyboardBtn.code),
//           numberKeyboardBtn.key
//         );
//         console.log(numberKeyboardBtn.code);
//         break;
//       //INPUT OPERATIONS
//       case "operation":
//         const [operationKeyboardBtn] = keyboardOperationCodes.filter(
//           (keyboardCode) => keyboardCode.code === keyboardBtnCode
//         );
//         inputOperation(operationKeyboardBtn.key);
//         console.log(operationKeyboardBtn.code);
//         break;
//       //CLEAR THE INPUT
//       case "clear":
//         if (calcInput) {
//           const [clearKeyboardBtn] = keyboardClearInputCodes.filter(
//             (keyboardCode) => keyboardCode.code === keyboardBtnCode
//           );
//           clearInputField(clearKeyboardBtn.key);
//           console.log(clearKeyboardBtn.code);
//           isResultCalculated = false;
//         }
//         break;
//     }
//   }
//   //FOR HANDLING MULTIPLE BUTTONS PRESSED AT THE SAME TIME
//   if (Object.keys(keyPressed).length > 1) {
//     const multipleBtnKey = Object.keys(keyPressed).join(" ");
//     console.log(multipleBtnKey);
//     const btnType = getPressedKeyboardBtnType(multipleBtnKey);
//     switch (btnType) {
//       //INPUT NUMBERS
//       case "number":
//         const [keyboardBtn] = keyboardNumberCodes.filter(
//           (keyboardCode) => keyboardCode.code === multipleBtnKey
//         );
//         assembleNumberInField(
//           getNumberBtnType(keyboardBtn.code),
//           keyboardBtn.key
//         );
//         break;
//       //INPUT OPERATIONS
//       case "operation":
//         const [operationKeyboardBtn] = keyboardOperationCodes.filter(
//           (keyboardCode) => keyboardCode.code === multipleBtnKey
//         );
//         inputOperation(operationKeyboardBtn.key);
//         break;
//     }
//   }
//   for (const property of Object.getOwnPropertyNames(keyPressed)) {
//     delete keyPressed[property];
//   }
// });
