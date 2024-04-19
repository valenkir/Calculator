FE course challenge - calculator built with grid.

The logic is mostly implemented as in the Windows app "Calculator".
Current restrictions: the MCR buttons don't work yet.
Also, there is no limitation for the max number length. It may be added in the future.

---

FEATURES

- The chain of operations is supported, i.e. an operation entered after a math expression (e.g. 5 + 5) will trigger the calculation and the output will include the calculation result and the last entered operation (if it wasn't "=");

  Example:
  Initial input: 9 + 1
  You enter "/"
  Output: "10 /"
  After that you can input another number and get the result of the division.

- The calculation result is the final step of the calculation chain unless you add an operation or click "Delete". If you add an operation or
  remove a digit from the result, the chain continues and you can add digits to the result.

  Example 1:
  Calculation result: 18.
  You enter "-", then "2".
  The output becomes "18 - 2" and can be successfully calculated.

  Example 2:
  Calculation result: 18.
  You enter "." and the value is reset to "0.". If you continue inputting numbers, you will get a decimal number (e.g. 0.2).

  Example 3:
  Calculation result: 18.
  You try to change the sign of the value and the value is reset to 0.

- Clearing the input
  The "Delete" button removes digits but not operations.

  Example 1:
  Initial input: 2.
  You click "Delete".
  Output: 0.

  Example 2:
  Initial input: 2.025.
  You click "Delete".
  Output: 2.02.
  You click "Delete" again.
  Output: 2.

  Example 3:
  Initial input: 14 x 2.
  You click "Delete".
  Output: 14 x 0.
  You click "Delete" and nothing happens.

  When the expression is "<number> <operation> 0", it can only be edited in 2 ways: either add numbers to the second operand or click C.

  The "CE" button removes operands but not operations.

  Example:
  Initial input: "10 - 2.5"
  You click "CE".
  Output: "10 - 0".

  The "C" button removes everything from the input field.

- The "root" and "square" operations are performed on 1 operand. If the expression consists of 1 operand and 1 operation, square/root can still be applied. If the expression consists of 2 operands and an operation, clicking square/root will trigger the calculation of the expression.
  Example 1:
  Initial input: 2.
  You click "square".
  Output: 4.

  Example 2:
  Initial input: "4 -".
  You click "root".
  Output: 2.

  Example 3:
  Initial input: "4 x 7".
  You click "square".
  Output: 28 ("square" is not applied).

- Using the keyboard
  The keyboard is supported but there is one limitation: if the buttons are pressed too fast, the calculator will ignore the input.

  HOTKEYS

- Left Alt + Minus - change the sign of the number
- Left Shift + Equal - "+" operation
- Left Shift + 8 - "x" operation (multiplying)
- Left Control + Right Bracket ("]") - square
- Left Control + Left Bracket ("[") - root
- Left Shift + 5 - "%" operation (NOT IMPLEMENTED)
- Backspace - delete
- Delete - "CE"
- Esc - "C"
