export type Dice = [number, number]

export function parseDice(inputStr: string): Dice[] {
  const diceStrs = inputStr.match(/([+|-]?\d*d\d+)/g) || []
  const constStrs = (inputStr.match(/([\+|-]\d+)[+|-]/g) || []).map(x => x.slice(0, -1))
    .concat((inputStr.match(/([\+|-]\d+)$/) || []).slice(1))
  // TODO: Add starting constant without + or - case to consts
  const dice = diceStrs.map(ds => ds.split('d').map(d => parseInt(d, 10)) as Dice)
  const constDice = constStrs.map(cs => [parseInt(cs, 10), 1] as Dice)
  return dice.concat(constDice)
}

const roll = (sides: number) => Math.floor(Math.random() * sides + 1)

export function rollDice(dice: Dice[]) {
  return dice.flatMap(([multiplier, sides]) => {
    return new Array(Math.abs(multiplier))
      .fill(undefined)
      .map(() => multiplier / Math.abs(multiplier) * roll(sides))
  })
}

export function countResult(dice: Dice[]) {
  return dice
    .map(([multiplier, sides]) => multiplier * Math.floor(Math.random() * sides + 1))
    .reduce((a, b) => a + b, 0)
}

export function calculateMean(dice: Dice[]) {
  return dice
    .map(([multiplier, sides]) => multiplier * (sides + 1) / 2)
    .reduce((a, b) => a + b, 0)
}

export function calculateMax(dice: Dice[]) {
  return dice
    .map(([multiplier, sides]) => multiplier * (multiplier > 0 ? sides : 1))
    .reduce((a, b) => a + b, 0)
}

export function calculateMin(dice: Dice[]) {
  return dice
    .map(([multiplier, sides]) => multiplier * (multiplier > 0 ? 1 : sides))
    .reduce((a, b) => a + b, 0)
}
