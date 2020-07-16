import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";

import TaskType from "./task";
import UserErrorType from "./user-error";

const TaskPayloadType = new GraphQLObjectType({
  name: "TaskPayload",
  fields: {
    errors: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(UserErrorType))
      ),
    },
    task: { type: TaskType },
  },
});

export default TaskPayloadType;
