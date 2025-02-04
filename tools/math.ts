import { tool, type Tool } from 'ai'
import { z } from 'zod'

type CalculatorTools =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'
  | 'exponentiate'
  | 'factorial'
  | 'isPrime'
  | 'squareRoot'
  | 'sin'
  | 'cos'
  | 'tan'
  | 'sqrt'
  | 'log'
  | 'exp'

export const calculatorTools = (config?: {
  excludeTools?: CalculatorTools[]
}): Partial<Record<CalculatorTools, Tool>> => {
  const tools: Partial<Record<CalculatorTools, Tool>> = {
    add: tool({
      description: 'Add two numbers and return the result',
      parameters: z.object({
        a: z.number().describe('First number'),
        b: z.number().describe('Second number'),
      }),
      execute: async ({ a, b }) => {
        return add(a, b)
      },
    }),
    subtract: tool({
      description: 'Subtract second number from first and return the result',
      parameters: z.object({
        a: z.number().describe('First number'),
        b: z.number().describe('Second number'),
      }),
      execute: async ({ a, b }) => {
        return subtract(a, b)
      },
    }),
    multiply: tool({
      description: 'Multiply two numbers and return the result',
      parameters: z.object({
        a: z.number().describe('First number'),
        b: z.number().describe('Second number'),
      }),
      execute: async ({ a, b }) => {
        return multiply(a, b)
      },
    }),
    divide: tool({
      description: 'Divide first number by second and return the result',
      parameters: z.object({
        a: z.number().describe('Numerator'),
        b: z.number().describe('Denominator'),
      }),
      execute: async ({ a, b }) => {
        return divide(a, b)
      },
    }),
    exponentiate: tool({
      description: 'Raise first number to the power of the second number',
      parameters: z.object({
        a: z.number().describe('Base'),
        b: z.number().describe('Exponent'),
      }),
      execute: async ({ a, b }) => {
        return exponentiate(a, b)
      },
    }),
    factorial: tool({
      description: 'Calculate the factorial of a number',
      parameters: z.object({
        n: z.number().int().describe('Number to calculate the factorial of'),
      }),
      execute: async ({ n }) => {
        return factorial(n)
      },
    }),
    isPrime: tool({
      description: 'Check if a number is prime',
      parameters: z.object({
        n: z.number().int().describe('Number to check if prime'),
      }),
      execute: async ({ n }) => {
        return isPrime(n)
      },
    }),
    squareRoot: tool({
      description: 'Calculate the square root of a number',
      parameters: z.object({
        n: z.number().describe('Number to calculate the square root of'),
      }),
      execute: async ({ n }) => {
        return squareRoot(n)
      },
    }),
    sin: tool({
      description: 'Calculate the sine of an angle in radians',
      parameters: z.object({
        n: z.number().describe('Angle in radians'),
      }),
      execute: async ({ n }) => {
        return sin(n)
      },
    }),
    cos: tool({
      description: 'Calculate the cosine of an angle in radians',
      parameters: z.object({
        n: z.number().describe('Angle in radians'),
      }),
      execute: async ({ n }) => {
        return cos(n)
      },
    }),
    tan: tool({
      description: 'Calculate the tangent of an angle in radians',
      parameters: z.object({
        n: z.number().describe('Angle in radians'),
      }),
      execute: async ({ n }) => {
        return tan(n)
      },
    }),
    sqrt: tool({
      description: 'Calculate the square root of a number (alias for squareRoot)',
      parameters: z.object({
        n: z.number().describe('Number to calculate the square root of'),
      }),
      execute: async ({ n }) => {
        return squareRoot(n)
      },
    }),
    log: tool({
      description: 'Calculate the natural logarithm (base e) of a number',
      parameters: z.object({
        n: z.number().describe('Number to calculate the logarithm of'),
      }),
      execute: async ({ n }) => {
        return log(n)
      },
    }),
    exp: tool({
      description: 'Calculate e raised to the power of a number',
      parameters: z.object({
        n: z.number().describe('Power to raise e to'),
      }),
      execute: async ({ n }) => {
        return exp(n)
      },
    }),
  }

  for (const toolName in tools) {
    if (config?.excludeTools?.includes(toolName as CalculatorTools)) {
      delete tools[toolName as CalculatorTools]
    }
  }

  return tools
}

function add(a: number, b: number) {
  return { result: a + b }
}

function subtract(a: number, b: number) {
  return { result: a - b }
}

function multiply(a: number, b: number) {
  return { result: a * b }
}

function divide(a: number, b: number) {
  if (b === 0) {
    return { error: 'Cannot divide by zero' }
  }
  try {
    return { result: a / b }
  } catch (error) {
    return { error }
  }
}

function exponentiate(a: number, b: number) {
  return { result: a ** b }
}

function factorial(n: number) {
  if (n < 0) {
    return { error: 'Factorial is not defined for negative numbers' }
  }
  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }
  return { result }
}

function isPrime(n: number) {
  if (n <= 1) {
    return { result: false }
  }
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      return { result: false }
    }
  }
  return { result: true }
}

function squareRoot(n: number) {
  if (n < 0) {
    return { error: 'Square Root is not defined for negative numbers' }
  }
  return { result: Math.sqrt(n) }
}

function sin(n: number) {
  return { result: Math.sin(n) }
}

function cos(n: number) {
  return { result: Math.cos(n) }
}

function tan(n: number) {
  return { result: Math.tan(n) }
}

function log(n: number) {
  if (n <= 0) {
    return { error: 'Logarithm is not defined for non-positive numbers' }
  }
  return { result: Math.log(n) }
}

function exp(n: number) {
  return { result: Math.exp(n) }
}
