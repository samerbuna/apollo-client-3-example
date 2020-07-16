import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";

import ApproachType from "./approach";
import UserErrorType from "./user-error";

const ApproachPayload = new GraphQLObjectType({
  name: "ApproachPayload",
  fields: {
    errors: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(UserErrorType))
      ),
    },
    approach: { type: ApproachType },
  },
});

export default ApproachPayload;
