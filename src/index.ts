import { ApolloServer } from 'apollo-server'
import { schema } from './graphql'

export const server = new ApolloServer({
  schema,
  introspection: true,
  playground: true
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
})
