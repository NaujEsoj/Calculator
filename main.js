const calculator = document.querySelector('.calculator')
const keys = calculator.querySelector('.calculator__keys')
const display = document.querySelector('.calculator__display')
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

//Another way to render buttons
/* keysData.forEach(e => {
    let buttonConstructor = document.createElement('button')
    let buttonData = `class="${ e.class }"
                       data-atribute="${ e.action }"
                        ${ e.text }`
    buttonConstructor.innerText = buttonData
    keys.appendChild(buttonConstructor)
    console.log(buttonConstructor.outerHTML)
  }) */

const calculate = (n1 = 0, operator = "", n2 = 0) => {
  const firstNum = parseFloat(n1)
  const secondNum = parseFloat(n2)
  if (operator === 'add') return firstNum + secondNum
  if (operator === 'divide') return result = firstNum / secondNum
  if (operator === 'multiply') return result = firstNum * secondNum
  if (operator === 'subtract') return firstNum - secondNum
}

keys.addEventListener('click', e => {   //agrega eventos a las keys para que hagan mach con el nombre de etiqueta "boton"
  if (e.target.matches('button')) {
    const displayedNum = display.textContent
    const key = e.target  //key es igual a evento target, evento fue creado en keys por lo que cada evento seria una tecla de la calculadora
    const keyContent = key.textContent
    const previousKeyType = calculator.dataset.previousKeyType
    const action = key.dataset.action // action es igual a el data set de cada key

    Array.from(key.parentNode.children)
      .forEach(elem => elem.classList.remove('is-depressed'))

    if (!action) {
      if (displayedNum === '0' ||
          previousKeyType === 'operator' ||
          previousKeyType === 'calculate'
      ) {
        display.textContent = keyContent
      } else {
        display.textContent = displayedNum + keyContent
      }
      calculator.dataset.previousKeyType  = 'number'
    }

    if (action === 'decimal') {
      if (!displayedNum.includes('.')) {
        display.textContent = displayedNum + '.'
      } else if (
        previousKeyType === 'operator'||
        previousKeyType === 'calculate') {
        display.textContent = '0'
      }
    calculator.dataset.previousKeyType = 'decimal'
    }

    if (
      action === 'add' ||
      action === 'subtract' ||
      action === 'multiply' ||
      action === 'divide'

      ){
        const firstValue = calculator.dataset.firstValue
        const operator = calculator.dataset.operator
        const secondValue = displayedNum

        if (
          firstValue &&
          operator &&
          previousKeyType !== 'operator'
        ) {
          const calcValue = calculate(firstValue, operator, secondValue)
          calculator.dataset.firstValue = calcValue
        } else {
            calculator.dataset.firstValue = displayedNum
        }

        calculator.dataset.firstValue = displayedNum
        calculator.dataset.operator = action
        calculator.dataset.previousKeyType = 'operator'
        key.classList.add('is-depressed')
    }

    if (action !== 'clear') {
      const clearButton = calculator.querySelector('[data-action=clear]')
      clearButton.textContent = 'CE'
    }

    if (action === 'clear') {
      if (key.textContent === 'AC') {
        calculator.dataset.firstValue = ''
        calculator.dataset.modValue = ''
        calculator.dataset.operator = ''
        calculator.dataset.secondValue = ''
      } else {
        key.textContent = 'AC'
      }
      display.textContent = '0'
      calculator.dataset.previousKeyType = 'clear'
    }

    if (action !== 'clear') {
      const clearButton = calculator.querySelector('[data-action=clear]')
      clearButton.textContent = 'CE'
    }

    if (action === 'calculate') {
      const operator = calculator.dataset.operator
      let firstValue = calculator.dataset.firstValue
      let secondValue = displayedNum

      if (firstValue) {
        if (previousKeyType === 'calculate') {
          firstValue = displayedNum
          secondValue = calculator.dataset.modValue
        }
        display.textContent = calculate(firstValue, operator, secondValue)
      }

      calculator.dataset.modValue = secondValue
      calculator.dataset.previousKeyType = 'calculate'
    }
  }
})
