import { ApolloServer } from 'apollo-server-micro'
import { schema } from './graphql'

const withCors: any = (handler: any) => (req: any, res: any, ...args: any) => {
  if (req.method === 'OPTIONS')
    res.end()
  else {
    return handler(req, res, ...args)
  }
}

export const server = new ApolloServer({
  schema,
  introspection: true,
  playground: true
})

export default withCors((server.createHandler()))
