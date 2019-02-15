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
import { Dice, parseDice, calculateMax, calculateMean, calculateMin, countResult, rollDice } from './dice'

const RollStatsType =  new GraphQLObjectType({
  name: 'Statistics',
  fields: {
    average: { type: GraphQLFloat, resolve: (parent: {roll: Dice[]}) => calculateMean(parent.roll) },
    max: { type: GraphQLInt, resolve: (parent: {roll: Dice[]}) => calculateMax(parent.roll)},
    min: { type: GraphQLInt, resolve: (parent: {roll: Dice[]}) => calculateMin(parent.roll)}
  }
})

const RollResultType = new GraphQLObjectType({
  name: 'Results',
  fields: {
    total: { type: GraphQLInt, resolve: parent => parent.rollResult.reduce((a, b) => a + b, 0)},
    details: { type: new GraphQLList(GraphQLInt), resolve: parent => parent.rollResult }
  }
})

const RollType = new GraphQLObjectType({
  name: 'Roll',
  fields: {
    result: { type: RollResultType, resolve: (parent: {roll: Dice[]}) => ({...parent, rollResult: rollDice(parent.roll)}) },
    statistics: { type: RollStatsType, resolve: parent => parent }
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
