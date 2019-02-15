import { rangeTo, cartesian } from './utils'

// A singular dice yet to be rolled
// Sides must be a positive integer
export interface Die {
  sides: number
}

// Multiple dice with a shared geometry
// Amount can be negative to represent rolls to be subtracted
export interface Dice extends Die {
  amount: number
}

// A rolled die
// The result is an integer
export interface DieRoll extends Die {
  result: number
}

function validateDiceString(input: string): boolean {
  return /^([+|-]?\d*d?\d+)([+|-]\d*d?\d+)*$/.test(input)
}

function diceToDieArr({ amount, sides }: Dice): Die[] {
  if (amount === 0) return []
  return new Array(Math.abs(amount)).fill(amount / Math.abs(amount) * sides)
}

export function parseDice(inputStr: string): Dice[] | null {
  if (!validateDiceString(inputStr)) return null
  const diceStrs = inputStr.match(/([+|-]?\d*d\d+)/g) || []
  const constStrs = (inputStr.match(/([\+|-]\d+)[+|-]/g) || []).map(x => x.slice(0, -1))
    .concat((inputStr.match(/([\+|-]\d+)$/) || []).slice(1)) // trailing
    .concat((inputStr.match(/(^\d+)[+|-]/) || []).slice(1)) // leading
  const dice = diceStrs.map(ds => {
    const [amount, sides] = ds.split('d').map(d => parseInt(d, 10))
    return { amount, sides }
  })    
  const constDice = constStrs.map(cs => ({amount: parseInt(cs, 10), sides: 1}))
  return dice.concat(constDice)
}

const roll = (sides: number) => Math.floor(Math.random() * sides + 1)

export function rollDice(dice: Dice[]): DieRoll[] {
  return dice.flatMap(({amount, sides}) => {
    return new Array(Math.abs(amount))
      .fill(undefined)
      .map(() => ({ sides, result: amount / Math.abs(amount) * roll(sides) }))
  })
}

export function countResult(dice: DieRoll[]) {
  return dice.reduce((a, { result }) => a + result, 0)
}

export function calculateMean(dice: Dice[]) {
  return dice
    .map(({amount, sides}) => amount * (sides + 1) / 2)
    .reduce((a, b) => a + b, 0)
}

export function calculateMax(dice: Dice[]) {
  return dice
    .map(({amount, sides}) => amount * (amount > 0 ? sides : 1))
    .reduce((a, b) => a + b, 0)
}

export function calculateMin(dice: Dice[]) {
  return dice
    .map(({amount, sides}) => amount * (amount > 0 ? 1 : sides))
    .reduce((a, b) => a + b, 0)
}

export function getDistribution(dice: Dice[]) {
  const diceRanges = dice.flatMap(diceToDieArr).map(rangeTo)
  const possibleResults = cartesian(diceRanges)
  return possibleResults.map(resultArr => resultArr.reduce((a, b) => a + b, 0)).sort((a, b) => a - b)
}
