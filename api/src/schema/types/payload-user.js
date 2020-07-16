import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import UserType from "./user";
import UserErrorType from "./user-error";

const UserPayloadType = new GraphQLObjectType({
  name: "UserPayload",
  fields: {
    errors: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(UserErrorType))
      ),
    },
    user: { type: UserType },
    authToken: { type: GraphQLString },
  },
});

export default UserPayloadType;
