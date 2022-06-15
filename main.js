const calculator = document.querySelector('.calculator')
const display = calculator.querySelector('.calculator__display')
const keys = calculator.querySelector('.calculator__keys')
const keysData = [  {
  class: "key--operator",
  action:"add",
  text: "+"
},
{
  class: "key--operator",
  action:"subtract",
  text: "-"
},
{
  class: "key--operator",
  action:"multiply",
  text: "*"
},
{
  class: "key--operator",
  action:"divide",
  text: "/"
},
{
  text: "7"
},
{
  text: "8"
},
{
  text: "9"
},
{
  text: "4"
},
{
  text: "5"
},
{
  text: "6"
},
{
  text: "1"
},
{
  text: "2"
},
{
  text: "3"
},
{
  text: "0"
},
{
  action: "decimal",
  text: "."
},
{
  action: "clear",
  text: "AC"
},
{
  class: "key--equal",
  action: "calculate",
  text: "="
}
]

const  buttonKeyRender = () => {
  keysData.forEach(e => {
    let buttonConstructor = document.createElement('button')
    buttonConstructor.classList.add(e.class)
    buttonConstructor.setAttribute("data-action", e.action)
    buttonConstructor.textContent = e.text
    if (buttonConstructor.classList.contains("undefined") && buttonConstructor.matches('[data-action="undefined"]')) {
      buttonConstructor.classList.remove("undefined")
      buttonConstructor.removeAttribute('data-action')
    }
    keys.appendChild(buttonConstructor)
  })
}

buttonKeyRender()

//Another way to render buttons, not working yet.
/* keysData.forEach(e => {
  let buttonConstructor = document.createElement('button')
  let buttonData = `class="${ e.class }"
                     data-atribute="${ e.action }"
                      ${ e.text }`
  buttonConstructor.innerText = buttonData
  keys.appendChild(buttonConstructor)
  console.log(buttonConstructor.outerHTML)
}) */

function calculate(n1, operator, n2) {
  const firstNum = parseFloat(n1)
  const secondNum = parseFloat(n2)
  if (operator === 'add') return firstNum + secondNum
  if (operator === 'subtract') return firstNum - secondNum
  if (operator === 'multiply') return firstNum * secondNum
  if (operator === 'divide') return firstNum / secondNum
}

const getKeyType = key => {
  const { action } = key.dataset
  if (!action) return 'number'


  //if (action.includes('add', 'subtract', 'multiply', 'divide'))
  if (
    action === 'add' ||
    action === 'subtract' ||
    action === 'multiply' ||
    action === 'divide'
  ) return 'operator'
  console.log(key, action, typeof action);
  return action
}

const createResultString = (key, displayedNum, state) => {
  const keyContent = key.textContent
  const keyType = getKeyType(key)
  const {
    firstValue,
    operator,
    modValue,
    previousKeyType
  } = state

  if (keyType === 'number') {
    return displayedNum === '0' ||
      previousKeyType === 'operator' ||
      previousKeyType === 'calculate'
      ? keyContent
      : displayedNum + keyContent
  }

  if (keyType === 'decimal') {
    if (!displayedNum.includes('.')) return displayedNum + '.'
    if (previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.'
    return displayedNum
  }

  if (keyType === 'operator') {
    return firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
      ? calculate(firstValue, operator, displayedNum)
      : displayedNum
  }

  if (keyType === 'clear') return 0
  if (keyType === 'calculate') {
    return firstValue
      ? previousKeyType === 'calculate'
        ? calculate(displayedNum, operator, modValue)
        : calculate(firstValue, operator, displayedNum)
      : displayedNum
  }
}

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
  const keyType = getKeyType(key)
  const {
    firstValue,
    operator,
    modValue,
    previousKeyType
  } = calculator.dataset
  calculator.dataset.previousKeyType = keyType
  if (keyType === 'operator') {
    calculator.dataset.operator = key.dataset.action
    calculator.dataset.firstValue = firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
      ? calculatedValue
      : displayedNum
  }

  if (keyType === 'calculate') {
    calculator.dataset.modValue = firstValue && previousKeyType === 'calculate'
      ? modValue
      : displayedNum
  }

  if (keyType === 'clear' && key.textContent === 'AC') {
    calculator.dataset.firstValue = ''
    calculator.dataset.modValue = ''
    calculator.dataset.operator = ''
    calculator.dataset.previousKeyType = ''
  }
}

const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key)
  Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))
  if (keyType === 'operator') key.classList.add('is-depressed')
  if (keyType === 'clear' && key.textContent !== 'AC') key.textContent = 'AC'
  if (keyType !== 'clear') {
    const clearButton = calculator.querySelector('[data-action=clear]')
    clearButton.textContent = 'CE'
  }
}

keys.addEventListener('click', e => {
  if (!e.target.matches('button')) return
  const key = e.target
  const displayedNum = display.textContent
  const resultString = createResultString(key, displayedNum, calculator.dataset)
  display.textContent = resultString
  updateCalculatorState(key, calculator, resultString, displayedNum)
  updateVisualState(key, calculator)
})