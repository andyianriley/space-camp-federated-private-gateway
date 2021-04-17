const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { getMissionByAstronaut, getCrew, getMissionById, getMissions} = require("./services/missions")

const port = 4002;

const typeDefs = gql`
  type Mission {
    id: ID!
    crew: [Astronaut]
    designation: String!
    startDate: String
    endDate: String
  }

  extend type Astronaut @key(fields: "id") {
    id: ID! @external
    missions: [Mission]
  }

  extend type Query {
    mission(id: ID!): Mission
    missions: [Mission]
  }
`;

const resolvers = {
  Astronaut: {
    async missions(astronaut) {
      return getMissionByAstronaut(astronaut);
    }
  },
  Mission: {
    crew(mission) {
      return getCrew(mission);
    }
  },
  Query: {
    mission(_, { id }) {
      return getMissionById(id);
    },
    missions() {
      return getMissions();
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then(({ url }) => {
  console.log(`Missions service ready at ${url}`);
});
