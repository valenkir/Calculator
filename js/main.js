const inputField = document.querySelector(
  ".input-screen-section__input-screen"
);

let calcInput = "";
let isResultCalculated = false;
let keyPressed = {};
const keyboardSingleCodes = [
  {
    code: "49",
    key: "1",
    type: "number",
  },
  { code: "50", key: "2", type: "number" },
  { code: "51", key: "3", type: "number" },
  { code: "52", key: "4", type: "number" },
  { code: "53", key: "5", type: "number" },
  { code: "54", key: "6", type: "number" },
  { code: "55", key: "7", type: "number" },
  { code: "56", key: "8", type: "number" },
  { code: "57", key: "9", type: "number" },
  { code: "48", key: "0", type: "number" },
  { code: "190", key: ".", type: "number_separator" },
  { code: "189", key: "-", type: "operation" },
  { code: "187", key: "=", type: "operation" },
  { code: "13", key: "=", type: "operation" },
  { code: "191", key: "/", type: "operation" },
  { code: "8", key: "delete", type: "clear" },
  { code: "27", key: "c", type: "clear" },
  { code: "46", key: "ce", type: "clear" },
];
const keyboardMultipleCodes = [
  { firstCode: "18", secondCode: "189", key: "sign", type: "number_sign" },
  { firstCode: "16", secondCode: "187", key: "+", type: "operation" },
  { firstCode: "16", secondCode: "56", key: "x", type: "operation" },
  { firstCode: "17", secondCode: "221", key: "square", type: "operation" },
  { firstCode: "17", secondCode: "219", key: "root", type: "operation" },
  { firstCode: "16", secondCode: "53", key: "%", type: "operation" },
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
  if (isZero(calcInput) && operationType === "pair") {
    calcInput !== "0"
      ? (inputField.value += `0 ${btnText} `)
      : (inputField.value += ` ${btnText} `);

    isResultCalculated = false;
  } else if (getNumberOfExpressionElems(calcInput) === 1) {
    switch (operationType) {
      case "pair":
        inputField.value += ` ${btnText} `;
        isResultCalculated = false;
        break;
      case "single":
        const result = calculateExpression([calcInput, btnText]);
        inputField.value = !isNaN(result) ? result : "0";
        isResultCalculated = true;
        break;
    }
  } else if (getNumberOfExpressionElems(calcInput) === 2) {
    if (operationType === "single") {
      const inputArr = calcInput.split(" ");
      const result = calculateExpression([inputArr[0], btnText]);
      inputField.value = !isNaN(result) ? result : "0";
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

  //KEYBOARD EVENTS
  $(document).keydown((event) => {
    let keyCode = event.which;
    keyPressed[keyCode] = true;
    const keys = Object.keys(keyPressed);
    const [btnsPressed] = keyboardMultipleCodes.filter(
      (item) => item.firstCode === keys[0] && item.secondCode === keys[1]
    );
    if (btnsPressed) {
      const btnText = btnsPressed.key;
      const btnType = btnsPressed.type;
      if (btnType.includes("number")) {
        if (isResultCalculated) {
          calcInput = "";
          inputField.value = "";
          isResultCalculated = false;
        }
        setMathSign();
        calcInput = inputField.value;
      } else if (btnType === "operation") {
        inputOperation(btnText);
      }
    } else {
      keyCode += "";
      const btnPressed = keyboardSingleCodes.find(
        (item) => item.code === keyCode
      );
      if (btnPressed) {
        const btnText = btnPressed.key;
        const btnType = btnPressed.type;
        if (btnType.includes("number")) {
          if (isResultCalculated) {
            calcInput = "";
            inputField.value = "";
            isResultCalculated = false;
          }
          switch (btnType) {
            case "number":
              setNumber(btnText);
              break;
            case "number_separator":
              setDecimalSeparator(btnText);
              break;
          }
          calcInput = inputField.value;
        } else if (btnType === "operation") {
          inputOperation(btnText);
        } else if (btnType === "clear") {
          clearInputField(btnText);
          isResultCalculated = false;
        }
      }
    }
  });

  $(document).keyup((event) => {
    delete keyPressed[event.which];
  });
});
