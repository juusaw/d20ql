import { ApolloServer } from 'apollo-server'
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLFloat } from 'graphql'

type Dice = [number, number]

function parseDice(inputStr: string): Dice[] {
  const diceStrs = inputStr.match(/([+|-]?\d*d\d+)/g) || []
  const constStrs = (inputStr.match(/([\+|-]\d+)[+|-]/g) || []).map(x => x.slice(0, -1))
    .concat((inputStr.match(/([\+|-]\d+)$/) || []).slice(1))
  // TODO: Add starting constant without + or - case to consts
  const dice = diceStrs.map(ds => ds.split('d').map(d => parseInt(d, 10)) as Dice)
  const constDice = constStrs.map(cs => [parseInt(cs, 10), 1] as Dice)
  console.log(constDice)
  return dice.concat(constDice)
}

function countResult(dice: Dice[]) {
  return dice
    .map(([multiplier, sides]) => multiplier * Math.floor(Math.random() * sides + 1))
    .reduce((a, b) => a + b, 0)
}

function calculateMean(dice: Dice[]) {
  return dice
    .map(([multiplier, sides]) => multiplier * (sides + 1) / 2)
    .reduce((a, b) => a + b, 0)
}

// function calculateMax(multiplier: number, sides: number, constant: number) {
//   return multiplier * sides + constant
// }

// function calculateMin(multiplier: number, sides: number, constant: number) {
//   return multiplier + constant
// }

const RollStatsType =  new GraphQLObjectType({
  name: 'Statistics',
  fields: {
    average: { type: GraphQLFloat, resolve: (parent: {roll: Dice[]}) => calculateMean(parent.roll) },
    max: { type: GraphQLInt, resolve: (parent: {roll: Dice[]}) => calculateMean(parent.roll)},
    min: { type: GraphQLInt, resolve: (parent: {roll: Dice[]}) => calculateMean(parent.roll)}
  }
})

const RollResultType = new GraphQLObjectType({
  name: 'Roll',
  fields: {
    result: { type: GraphQLInt, resolve: (parent: {roll: Dice[]}) => countResult(parent.roll) },
    statistics: { type: RollStatsType, resolve: parent => parent }
  }
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      roll: {
        type: RollResultType,
        description: 'Roll a dice. Example argument: 2d12+5',
        args: {
          dice: {
            name: 'dice',
            type: new GraphQLNonNull(GraphQLString) 
          }
        },
        resolve: (_, args) => ({roll: parseDice(args.dice)})
      }
    }
  })
})

const server = new ApolloServer({ schema })

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
})


// (\d*d\d+)

// [\+|-]\d+

// ([\+|-]\d+)[\+|-]