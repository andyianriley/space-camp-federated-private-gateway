const { fetch, Request, Headers } = require('apollo-server-env');

class RemoteGraphQLDataSource {
	constructor(apolloServer, config) {
		this.gateway = apolloServer.gateway;

		if (config) {
			return Object.assign(this, config);
		}
	}

	async process({ request, context = {} }) {
		// use service discovery (etcd, consul) to dynamically update addresses of services
		let url;
		switch (this.name) {
			case 'astronauts_service':
				url = `http://localhost:4001/graphql`;
				break;
			case 'missions_service':
				url = `http://localhost:4002/graphql`;
				break;
		}

		const headers = (request.http && request.http.headers) || new Headers();
		headers.set('Content-Type', 'application/json');
		request.http = {
			method: 'POST',
			url,
			headers,
		};
		const { http, ...graphqlRequest } = request;
		const options = {
			...http,
			body: JSON.stringify(graphqlRequest),
		};

		const httpRequest = new Request(request.http.url, options);
		const httpResponse = await fetch(httpRequest);
		const body = await httpResponse.json();
		return {
			...body,
			http: httpResponse,
		};
	}
}

module.exports = RemoteGraphQLDataSource;
