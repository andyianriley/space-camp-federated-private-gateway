const fetch = require("node-fetch");

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
				name: 'astronauts_service', // service name
				version: 'v1', //service version, like docker container hash. Use 'latest' for dev env
				type_defs: typeDefs.toString(),
			}),
		});
		console.info('Schema registered successfully!');
	} catch (err) {
		console.error(`Schema registration failed: ${err.message}`);
	}
})();
