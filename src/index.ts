import { ApolloServer } from 'apollo-server'
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLFloat } from 'graphql'

type Dice = [number, number, number]

function parseDice(dice: string): Dice {
  const [multiplier, sides, constant] = dice
    .match(/(\d*)d(\d+)([\+|-]\d+)?/)
    .slice(1)
    .map(str => parseInt(str, 10))
  return [
    multiplier || 1,
    sides,
    constant || 0
  ]
}

function countResult(multiplier: number, sides: number, constant: number) {
  return multiplier * Math.floor(Math.random() * sides + 1) + constant
}

function calculateMean(multiplier: number, sides: number, constant: number) {
  return multiplier * (sides + 1) / 2 + constant
}

const RollResultType = new GraphQLObjectType({
  name: 'Roll',
  fields: {
    result: { type: GraphQLInt, resolve: (parent: {dice: Dice}) => countResult(...parent.dice) },
    statistics: { type: GraphQLFloat, resolve: (parent: {dice: Dice}) => calculateMean(...parent.dice) }
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
        resolve: (_, args) => ({dice: parseDice(args.dice)})
      }
    }
  })
})

const server = new ApolloServer({ schema })

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
})
