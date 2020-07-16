import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import Approach from "./approach";
import SearchResultItem from "./search-result-item";
import User from "./user";

const Task = new GraphQLObjectType({
  name: "Task",
  interfaces: [SearchResultItem],
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    tags: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
      resolve: (source) => source.tags.split(","),
    },
    approachCount: { type: new GraphQLNonNull(GraphQLInt) },
    author: {
      type: new GraphQLNonNull(User),
      resolve: (source, args, { loaders }) =>
        loaders.users.load(source.userId),
    },
    approachList: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(Approach))
      ),
      resolve: (source, args, { loaders }) =>
        loaders.approachesForTasks.load(source.id),
    },
  },
});

export default Task;
