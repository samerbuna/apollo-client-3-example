import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import Task from "./task";

const fields = ({ meScope }) => {
  const userFields = {
    id: { type: new GraphQLNonNull(GraphQLID) },
    username: { type: GraphQLString },
    name: {
      type: GraphQLString,
      resolve: ({ firstName, lastName }) => `${firstName} ${lastName}`,
    },
  };

  if (meScope) {
    userFields.taskList = {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(Task))
      ),

      resolve: (source, args, { loaders }) => {
        if (!source.authToken) {
          return [];
        }
        return loaders.tasksForUsers.load(source.id);
      },
    };
  }

  return userFields;
};

const User = new GraphQLObjectType({
  name: "User",
  fields: () => fields({ meScope: false }),
});

export const Me = new GraphQLObjectType({
  name: "Me",
  fields: () => fields({ meScope: true }),
});

export default User;
