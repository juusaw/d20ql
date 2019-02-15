import * as dice from '../src/dice'

test('Parser', () => {
  const cases = [
    { string: '2d6', result: [[2, 6]] },
    { string: '1d6+1', result: [[1, 6], [1, 1]] },
    { string: '0d6+1', result: [[0, 6], [1, 1]] },
    { string: '-2d20+5', result: [[-2, 20], [5, 1]] },
    { string: '3d8-10', result: [[3, 8], [-10, 1]] },
  ]
  cases.forEach(({ string, result }) =>
    expect(dice.parseDice(string)).toEqual(result))
})
