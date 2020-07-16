import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

const UserError = new GraphQLObjectType({
  name: "UserError",
  fields: {
    message: { type: new GraphQLNonNull(GraphQLString) },
    field: { type: GraphQLString },
  },
});

export default UserError;
