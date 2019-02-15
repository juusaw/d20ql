import * as dice from '../src/dice'

test('Parser', () => {
  const cases = [
    { string: '2d6', result: [{ amount: 2, sides: 6}] },
    { string: '1d6+1', result: [{ amount: 1, sides: 6}, { amount: 1, sides: 1 }] },
    { string: '0d6+1', result: [{ amount: 0, sides: 6}, { amount: 1, sides: 1 }] },
    { string: '-2d20+5', result: [{ amount: -2, sides: 20 }, { amount: 5, sides: 1 }] },
    { string: '3d8-10', result: [{ amount: 3, sides: 8}, { amount: -10, sides: 1 }] },
  ]
  cases.forEach(({ string, result }) =>
    expect(dice.parseDice(string)).toEqual(result))
})
