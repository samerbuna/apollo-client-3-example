# React with GraphQL and Apollo Client 3.0

A GraphQL project with a backend component written with GraphQL-js and Apollo Server and a frontend component written in React. Branch "main" is the starting point that has a working version of the React app but without a GraphQL client. The "apollo" branch has an equivalent working version of the React app after converting all data communications to use Apollo Client, adding subscriptions operations, and doing the entire local app state management with Apollo.

## Install dependencies

```
npm install
```

## Start databases (with Docker)

You'll need [Docker Compose](https://docs.docker.com/compose/) (which is part of [Docker Desktop](https://www.docker.com/products/docker-desktop)).

Then run:

```
npm run db-server
```

This will download and start a PostgreSQL database container on part 5432 with the sample data loaded in.

## Start databases (without Docker)

If you already have a PostgreSQL database that you'd like to use, you'll need to create the database schema for the project using `db/template.sql` which has both the tables structure and some sample development data.

## Run for dev

In 2 different terminals:

```
npm run api-server
npm run web-server
```

## Defaults:

- API server: http://localhost:4321
- Web server: http://localhost:1234
