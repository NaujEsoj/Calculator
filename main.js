const calculator = document.querySelector('.calculator')
const display = calculator.querySelector('.calculator__display')
const keys = calculator.querySelector('.calculator__keys')
const keysData = [
  {
    action: 'add',
    class: 'key--operator',
    text: '+'
  },
  {
    action: 'subtract',
    class: 'key--operator',
    text: '-'
  },
  {
    action: 'multiply',
    class: 'key--operator',
    text: '*'
  },
  {
    action: 'divide',
    class: 'key--operator',
    text: '/'
  },
  {
    action: null,
    class: null,
    text: '7'
  },
  {
    action: null,
    class: null,
    text: '8'
  },
  {
    action: null,
    class: null,
    text: '9'
  },
  {
    action: null,
    class: null,
    text: '4'
  },
  {
    action: null,
    class: null,
    text: '5'
  },
  {
    action: null,
    class: null,
    text: '6'
  },
  {
    action: null,
    class: null,
    text: '1'
  },
  {
    action: null,
    class: null,
    text: '2'
  },
  {
    action: null,
    class: null,
    text: '3'
  },
  {
    action: null,
    class: null,
    text: '0'
  },
  {
    action: 'decimal',
    class: null,
    text: '.'
  },
  {
    action: 'clear',
    class: null,
    text: 'AC'
  },
  {
    action: 'calculate',
    class: 'key--equal',
    text: '='
  }
]

const  createButtonKeys = () => {
  keysData.forEach(e => {
    let buttonConstructor = document.createElement('button')
    if (e.class) buttonConstructor.className= e.class
    if (e.action) buttonConstructor.setAttribute('data-action', e.action)
    if (e.text) buttonConstructor.textContent = e.text
    keys.appendChild(buttonConstructor)
  })
}

createButtonKeys()

//Another way to render buttons, not working yet.
/*  how to use template literals
const createButtons = (buttonsArray =[]) => {
  //  1. create empty string
  let buttonsText = ''
  buttonsArray.forEach(button => {
     // 2. update empty array with html(literal HTML !!! tagName, class, id etc)
    buttonsText += `
      <button
        class="${button.class ? button.class : ''} "
        data-action="${button.action ? button.action : ''}"
        id="${typeof button.text === 'number' ? 'numberKey' : ''}"
      >
        ${button.text ? button.text : ''}
      </button>
    `
  })
  console.log(buttonsText);
  // 3. add text inside parent element as HTML
  keys.innerHTML = buttonsTex  const number = document.querySelector('#numberKey');
  number.addEventListener('click', (e) => alert(e.target.innerText));
  console.log(number);
} */

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

  const actions = ['add', 'subtract', 'multiply', 'divide']
  if (actions.includes(action))
  return 'operator'
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