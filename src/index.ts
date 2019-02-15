import { ApolloServer } from 'apollo-server-micro'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLList
} from 'graphql'
import {
  Dice,
  DieRoll,
  parseDice,
  calculateMax,
  calculateMean,
  calculateMin,
  rollDice,
  countResult,
  getDistribution
} from './dice'


interface RollStatsParent extends RollParent {}
const RollStatsType =  new GraphQLObjectType({
  name: 'Statistics',
  fields: {
    average: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: (parent: RollStatsParent) => calculateMean(parent.roll)
    },
    max: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (parent: RollStatsParent) => calculateMax(parent.roll)
    },
    min: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (parent: RollStatsParent) => calculateMin(parent.roll)
    },
    distribution: {
      type: new GraphQLList(GraphQLInt),
      resolve: (parent: RollStatsParent) => getDistribution(parent.roll)
    }
  }
})

interface RollResultParent extends RollParent { rollResult: DieRoll[] }
const RollResultType = new GraphQLObjectType({
  name: 'Results',
  fields: {
    total: {
      type: new  GraphQLNonNull(GraphQLInt),
      resolve: (parent: RollResultParent) => countResult(parent.rollResult)
    },
    details: {
      type: new GraphQLList(GraphQLInt),
      resolve: (parent: RollResultParent) => parent.rollResult.map(({result}) => result)
    }
  }
})

interface RollParent { roll: Dice[] }
const RollType = new GraphQLObjectType({
  name: 'Roll',
  fields: {
    result: {
      type: new GraphQLNonNull(RollResultType),
      resolve: (parent: RollParent) => ({...parent, rollResult: rollDice(parent.roll)})
    },
    statistics: {
      type: new GraphQLNonNull(RollStatsType),
      resolve: (parent: RollParent) => parent
    }
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
        resolve: (_, args) => {
          const roll = parseDice(args.dice)
          if (!roll) return null
          else return { roll }
        }
      }
    }
  })
})

const server = new ApolloServer({
  schema,
  introspection: true,
  playground: true
})

export default server.createHandler()
