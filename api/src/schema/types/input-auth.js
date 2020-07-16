import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

const AuthInputType = new GraphQLInputObjectType({
  name: "AuthInput",
  fields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export default AuthInputType;
