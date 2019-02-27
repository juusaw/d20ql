import { ApolloServer } from 'apollo-server-micro'
import cors from 'micro-cors'
import { schema } from './graphql'

export const server = new ApolloServer({
  schema,
  introspection: true,
  playground: true
})

export default cors()(server.createHandler())
