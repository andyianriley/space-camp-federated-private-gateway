const { get } = require('lodash');
const request = require('request-promise-native');

exports.getServiceListWithTypeDefs = async () => {
	// make this list dynamic to update version on-the-fly depending on containers
	const services = [
		{
			name: 'astronauts_service',
			version: 'v1', // use docker hash of the containers
		},

		{
			name: 'missions_service',
			version: 'v1',
		},
	];
	const serviceTypeDefinitions = await request({
		baseUrl: 'http://localhost:6001',
		method: 'POST',
		url: '/schema/compose',
		json: true,
		body: {
			services,
		},
	});

	return get(serviceTypeDefinitions, 'data', []).map((schema) => {
		const service = services.find(
			(service) => service.name === schema.name
		);

		if (!service) {
			console.warn(
				`Matching service not found for type definition "${schema.name}"`
			);
		} else {
			console.log(
				`Got ${schema.name} service schema with version ${schema.version}`
			);
		}

		return {
			name: schema.name,
			url: `dynamic://${schema.name}`,
			version: schema.version,
			typeDefs: schema.type_defs,
			typeDefsOriginal: schema.type_defs_original,
			...(service ? service : {}),
		};
	});
};
