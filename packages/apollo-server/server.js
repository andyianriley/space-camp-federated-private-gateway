const { ApolloServer, gql } = require("apollo-server");
const { getMissionByAstronaut, getCrew, getMissionById, getMissions} = require("@ridley/missions/missions")
const { getAstronaut, getAstronautByRef, getAstronauts} = require("@ridley/astronauts/astronauts")


const port = 4003;

const typeDefs = gql`
type Mission {
  id: ID!
  crew: [Astronaut]
  designation: String!
  startDate: String
  endDate: String
}

type Astronaut {
    id: ID!
    name: String
    country: String
    age: Int
    missions: [Mission]
  }


  type Query {
    astronaut(id: ID!): Astronaut
    astronauts: [Astronaut]
    mission(id: ID!): Mission
    missions: [Mission]
  }
`;

const resolvers = {
  Astronaut: {
    __resolveReference(ref) {
      return getAstronautByRef(ref);
    },
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
    astronaut(_, { id }) {
      return getAstronaut(id);
    },
    astronauts() {
      return getAstronauts()
    },
    mission(_, { id }) {
      return getMissionById(id);
    },
    missions() {
      return getMissions();
    }
  }
};

const server = new ApolloServer({
  typeDefs, resolvers,
  subscriptions: false
});

server.listen({ port }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
