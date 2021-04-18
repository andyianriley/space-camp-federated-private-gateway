const fetch = require("node-fetch");

const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { getMissionByAstronaut, getCrew, getMissionById, getMissions} = require("./missions")

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

typeDefs.toString = function () {
	return this.loc.source.body;
};

// register schema
(async () => {
	try {
		console.log('Registering schema', typeDefs.toString());

		await fetch('http://localhost:6001/schema/push', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body:JSON.stringify({
				name: 'missions_service', // service name
				version: 'v1', //service version, like docker container hash. Use 'latest' for dev env
				type_defs: typeDefs.toString(),
			}),
		});
		console.info('Schema registered successfully!');
	} catch (err) {
		console.error(`Schema registration failed: ${err.message}`);
	}
})();
