import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";

import { pubsub } from "../pubsub";

import ApproachPayloadType from "./types/payload-approach";
import TaskPayloadType from "./types/payload-task";
import UserPayloadType from "./types/payload-user";

import ApproachInputType from "./types/input-approach";
import ApproachVoteInputType from "./types/input-approach-vote";
import AuthInputType from "./types/input-auth";
import TaskInputType from "./types/input-task";
import UserInputType from "./types/input-user";

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    userCreate: {
      type: UserPayloadType,
      args: {
        input: { type: new GraphQLNonNull(UserInputType) },
      },
      resolve: async (source, { input }, { mutators }) => {
        return mutators.createUser({ input });
      },
    },
    userLogin: {
      type: UserPayloadType,
      args: {
        input: { type: new GraphQLNonNull(AuthInputType) },
      },
      resolve: async (source, { input }, { mutators }) => {
        return mutators.loginUser({ input });
      },
    },
    taskCreate: {
      type: TaskPayloadType,
      args: {
        input: { type: new GraphQLNonNull(TaskInputType) },
      },
      resolve: async (source, { input }, { mutators }) => {
        const { errors, task } = await mutators.createTask({ input });
        if (errors.length === 0 && !task.isPrivate) {
          pubsub.publish(`TASK_LIST_CHANGED`, {
            newTask: task,
          });
        }
        return { errors, task };
      },
    },
    approachCreate: {
      type: ApproachPayloadType,
      args: {
        taskId: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(ApproachInputType) },
      },
      resolve: async (source, { taskId, input }, { mutators }) => {
        return mutators.createApproach({
          input,
          taskId,
          mutators,
        });
      },
    },
    approachVote: {
      type: ApproachPayloadType,
      args: {
        approachId: { type: new GraphQLNonNull(GraphQLID) },
        input: {
          type: new GraphQLNonNull(ApproachVoteInputType),
        },
      },
      resolve: async (
        source,
        { approachId, input },
        { mutators }
      ) => {
        const { errors, approach } = await mutators.voteOnApproach({
          approachId,
          input,
        });
        if (errors.length === 0) {
          pubsub.publish(`VOTE_CHANGED_${approach.taskId}`, {
            updatedApproach: approach,
          });
        }
        return { errors, approach };
      },
    },
  },
});

export default MutationType;
