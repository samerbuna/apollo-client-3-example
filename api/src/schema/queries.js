import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import Task from "./types/task";
import SearchResultItem from "./types/search-result-item";
import { Me } from "./types/user";

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    taskList: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(Task))
      ),
      resolve: async (source, args, { loaders }) => {
        return loaders.tasksByTypes.load("public");
      },
    },
    search: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(SearchResultItem))
      ),
      args: {
        term: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (source, args, { loaders }) => {
        return loaders.searchResults.load(args.term);
      },
    },
    taskInfo: {
      type: Task,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (source, args, { loaders }) => {
        return loaders.tasks.load(args.id);
      },
    },
    me: {
      type: Me,
      resolve: async (source, args, { currentUser }) => {
        return currentUser;
      },
    },
  },
});

export default QueryType;
