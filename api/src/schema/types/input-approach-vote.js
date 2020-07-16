import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from "graphql";

const ApproachVoteInputType = new GraphQLInputObjectType({
  name: "ApproachVoteInput",
  fields: {
    up: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
});

export default ApproachVoteInputType;
