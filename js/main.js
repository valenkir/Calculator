const numberBtnSection = document.querySelector(".number-buttons-section");
const operationBtnSection = document.querySelector(".math-buttons-section");
const controlBtnSection = document.querySelector(".control-buttons-section");
const inputField = document.querySelector(
  ".input-screen-section__input-screen"
);
let calcInput = "";

controlBtnSection.addEventListener("click", (event) => {
  const elemClassName = event.target.className;
  if (elemClassName.includes("control-btn")) {
    if (calcInput) {
      const controlBtn = event.target;
      const inputArr = calcInput.split(" ");
      switch (controlBtn.textContent.trim().toLowerCase()) {
        case "c":
          calcInput = "";
          inputField.value = "";
          break;
        case "ce":
          inputArr.splice(inputArr.length - 1, 1);
          calcInput = inputArr.join(" ");
          inputField.value = inputArr.join(" ");
          break;
        case "delete":
          let lastInputItem = inputArr[inputArr.length - 1];
          if (!isNaN(lastInputItem)) {
            lastInputItem = Math.trunc(+lastInputItem / 10);
            inputArr[inputArr.length - 1] = lastInputItem + "";
            if (inputArr.join(" ") === "0") {
              calcInput = "";
              inputField.value = "";
            } else {
              calcInput = inputArr.join(" ");
              inputField.value = inputArr.join(" ");
            }
          }
          break;
      }
    }
  }
});

numberBtnSection.addEventListener("click", (event) => {
  const elemClassName = event.target.className;
  if (elemClassName.includes("number-btn")) {
    const numberBtn = event.target;
    inputField.value += numberBtn.textContent.trim();
    calcInput = inputField.value;
  }
});
