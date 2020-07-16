import { ApolloServer } from "apollo-server";

import { schema } from "./schema/index";
import * as config from "./config";
import pgApiWrapper from "./database/index";

const startGraphQLWebServer = async () => {
  const pgApi = await pgApiWrapper();
  const server = new ApolloServer({
    schema,
    formatError: (err) => {
      console.error(err);
      return { message: "Oops! Something went wrong! :(" };
    },
    context: async ({ req }) => {
      const currentUser =
        req && req.headers && req.headers.authorization
          ? await pgApi.getCurrentUser(
              req.headers.authorization.slice(7) // "Bearer "
            )
          : null;
      return {
        loaders: pgApi.loaders(currentUser),
        mutators: pgApi.mutators(currentUser),
        currentUser,
      };
    },
  });

  server
    .listen({ port: config.port })
    .then(({ url, subscriptionsUrl }) => {
      console.log(`Server URL: ${url}`);
      console.log(`Subscriptions URL: ${subscriptionsUrl}`);
    });
};

startGraphQLWebServer();
