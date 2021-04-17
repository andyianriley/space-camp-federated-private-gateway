const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { getAstronaut, getAstronautByRef, getAstronauts} = require("./services/astronauts")

const port = 4001;

const typeDefs = gql`
  type Astronaut @key(fields: "id") {
    id: ID!
    name: String
  }

  extend type Query {
    astronaut(id: ID!): Astronaut
    astronauts: [Astronaut]
  }
`;

const resolvers = {
  Astronaut: {
    __resolveReference(ref) {
      return getAstronautByRef(ref);
    }
  },
  Query: {
    astronaut(_, { id }) {
      return getAstronaut(id);
    },
    astronauts() {
      return getAstronauts()
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then(({ url }) => {
  console.log(`Astronauts service ready at ${url}`);
});
