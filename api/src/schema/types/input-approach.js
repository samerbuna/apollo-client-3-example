import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

const ApproachInputType = new GraphQLInputObjectType({
  name: "ApproachInput",
  fields: {
    content: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export default ApproachInputType;
