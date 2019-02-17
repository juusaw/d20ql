import { ApolloServer } from 'apollo-server-micro'
import { schema } from './graphql'

export const server = new ApolloServer({
  schema,
  introspection: true,
  playground: true
})

export default server.createHandler()
