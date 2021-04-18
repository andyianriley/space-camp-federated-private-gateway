# Apollo Federated and Non-federated demo

## Installation:

```sh
yarn install
```

## Running

Run fake webservice for data (used by apollo servers)

`yarn start:rest`

Run apollo servers

`yarn gql`

View the graphql at http://localhost:4003

## Running Federated:

Create a graph at https://studio.apollographql.com/

Run fake webservice for data (used by apollo servers)

`yarn start:rest`

Run federated apollo servers

`yarn start:federated`

To publish schema changes

```
npx apollo service:push \
 --endpoint=http://localhost:4001 \
 --graph=Apollo-Demo-qcjplg \
 --key=${APOLLO_KEY} \
 --variant=current \
 --serviceName=astronauts \
 --serviceURL=http://localhost:4001
```

```
npx apollo service:push \
 --endpoint=http://localhost:4002 \
 --graph=Apollo-Demo-qcjplg \
 --key=${APOLLO_KEY} \
 --variant=current \
 --serviceName=missions \
 --serviceURL=http://localhost:4002
```

Run gateway with the key set

`APOLLO_KEY=<the key> yarn start:apollo-gateway`

View the graphql at http://localhost:4000

Run private gateway

run private schema registry see 'graphql-schema-registry' at https://github.com/pipedrive/graphql-schema-registry

now run private gateway

`yarn start:private-gateway`

View the graphql at http://localhost:4005

sample query

```
query {
  missions {
    designation
    crew {
      name
    }
  }
}
```
