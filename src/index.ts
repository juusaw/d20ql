import { ApolloServer } from 'apollo-server'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLList
} from 'graphql'
import { Dice, parseDice, calculateMax, calculateMean, calculateMin, rollDice, DieRoll } from './dice'

interface RollStatsParent extends RollParent {}
const RollStatsType =  new GraphQLObjectType({
  name: 'Statistics',
  fields: {
    average: { type: GraphQLFloat, resolve: (parent: RollStatsParent) => calculateMean(parent.roll) },
    max: { type: GraphQLInt, resolve: (parent: RollStatsParent) => calculateMax(parent.roll)},
    min: { type: GraphQLInt, resolve: (parent: RollStatsParent) => calculateMin(parent.roll)}
  }
})

interface RollResultParent extends RollParent { rollResult: DieRoll[] }
const RollResultType = new GraphQLObjectType({
  name: 'Results',
  fields: {
    total: { type: GraphQLInt, resolve: (parent: RollResultParent) => parent.rollResult.reduce((a, { result }) => a + result, 0)},
    details: { type: new GraphQLList(GraphQLInt), resolve: (parent: RollResultParent) => parent.rollResult.map(({result}) => result) }
  }
})

interface RollParent { roll: Dice[] }
const RollType = new GraphQLObjectType({
  name: 'Roll',
  fields: {
    result: { type: RollResultType, resolve: (parent: RollParent) => ({...parent, rollResult: rollDice(parent.roll)}) },
    statistics: { type: RollStatsType, resolve: (parent: RollParent) => parent }
  }
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      roll: {
        type: RollType,
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
