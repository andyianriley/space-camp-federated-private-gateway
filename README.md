# Apollo Federated and Non-federated demo

## Installation:

```sh
npm i
```

## Running Non-Federated:

Create a graph at https://studio.apollographql.com/

Run fake webservice for data (used by apollo servers)

`npm run server:rest`

Run apollo servers

`APOLLO_KEY=<the key> npm run graphql`

View the graphql at http://localhost:4003

## Running Federated:

Create a graph at https://studio.apollographql.com/

Run fake webservice for data (used by federated apollo servers)

`npm run server:rest`

Run seperate federated apollo servers

`npm run server:astronauts`

`npm run server:missions`

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

`APOLLO_KEY=<the key> npm run server:graphql`

View the graphql at http://localhost:4000
