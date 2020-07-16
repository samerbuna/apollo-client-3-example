import pg from "pg";
import DataLoader from "dataloader";

import { connectionString } from "../config";
import { randomString } from "../utils";
import sqls from "./sqls";

const pgPool = new pg.Pool({ connectionString });
const pgQuery = (text, params = []) => pgPool.query(text, params);

export default async () => {
  return {
    getCurrentUser: async (authToken) => {
      const pgResp = await pgQuery(sqls.userFromAuthToken, [
        authToken,
      ]);
      return pgResp.rows[0];
    },

    loaders: (currentUser) => {
      const currentUserId = currentUser ? currentUser.id : null;
      return {
        users: new DataLoader(async (userIds) => {
          const pgResp = await pgQuery(sqls.users, [userIds]);

          return userIds.map((userId) =>
            pgResp.rows.find((row) => userId === row.id)
          );
        }),

        tasks: new DataLoader(async (taskIds) => {
          const pgResp = await pgQuery(sqls.tasks, [
            taskIds,
            currentUserId,
          ]);

          return taskIds.map((id) =>
            pgResp.rows.find((row) => id == row.id)
          );
        }),

        tasksByTypes: new DataLoader(async (types) => {
          const results = types.map(async (type) => {
            const sqlQuery = sqls.tasksByTypes[type];
            if (!sqlQuery) {
              throw Error("Unsupported type");
            }
            const pgResp = await pgQuery(sqlQuery);
            return pgResp.rows;
          });
          return Promise.all(results);
        }),

        tasksForUsers: new DataLoader(async (userIds) => {
          const results = userIds.map(async (userId) => {
            if (currentUserId !== userId) {
              throw Error("Invaild request");
            }

            const pgResp = await pgQuery(sqls.tasksForUsers, [
              userId,
            ]);
            return pgResp.rows;
          });
          return Promise.all(results);
        }),

        approachesForTasks: new DataLoader(async (taskIds) => {
          const pgResp = await pgQuery(sqls.approachesForTasks, [
            taskIds,
          ]);
          return taskIds.map((taskId) =>
            pgResp.rows.filter((row) => taskId === row.taskId)
          );
        }),

        searchResults: new DataLoader(async (searchTerms) => {
          const results = searchTerms.map(async (searchTerm) => {
            const pgResp = await pgQuery(sqls.searchResults, [
              currentUserId, // can be null for public search
              searchTerm,
            ]);
            return pgResp.rows;
          });
          return Promise.all(results);
        }),
      };
    },

    mutators: (currentUser) => {
      const currentUserId = currentUser ? currentUser.id : null;
      return {
        loginUser: async ({ input }) => {
          const payload = { errors: [] };
          if (!input.username) {
            payload.errors.push({
              message: "Field cannot be empty",
              field: "username",
            });
          }
          if (!input.password) {
            payload.errors.push({
              message: "Field cannot be empty",
              field: "password",
            });
          }

          if (payload.errors.length === 0) {
            const pgResp = await pgQuery(sqls.userFromCredentials, [
              input.username.toLowerCase(),
              input.password,
            ]);
            const user = pgResp.rows[0];
            if (user) {
              const authToken = randomString();
              await pgQuery(sqls.updateUserAuthToken, [
                user.id,
                authToken,
              ]);
              payload.user = user;
              payload.authToken = authToken;
            } else {
              payload.errors.push({
                message: "Invalid username or password",
                field: "password",
              });
            }
          }
          return payload;
        },
        createUser: async ({ input }) => {
          const payload = { errors: [] };

          const authToken = randomString();
          const pgResp = await pgQuery(sqls.createUser, [
            input.username.toLowerCase(), // 1
            input.password, // 2
            input.firstName, // 3
            input.lastName, // 4
            authToken, // 5
          ]);
          if (pgResp.rows[0]) {
            payload.user = pgResp.rows[0];
            payload.authToken = authToken;
          }

          return payload;
        },
        createTask: async ({ input }) => {
          if (!currentUserId) {
            return {
              errors: [{ message: "Invaild user session" }],
            };
          }
          const payload = { errors: [] };
          if (input.content.length < 15) {
            payload.errors.push({
              message: "Text is too short",
              field: "content",
            });
          }

          if (payload.errors.length === 0) {
            const pgResp = await pgQuery(sqls.createTask, [
              currentUserId, // 1
              input.content, // 2
              input.tags.join(","), // 3
              input.isPrivate, // 4
            ]);

            if (pgResp.rows[0]) {
              payload.task = pgResp.rows[0];
            } else {
              payload.errors.push({
                message: "Invalid input",
              });
            }
          }

          return payload;
        },
        createApproach: async ({ taskId, input }) => {
          if (!currentUserId) {
            return {
              errors: [{ message: "Invaild user session" }],
            };
          }
          const payload = { errors: [] };
          if (input.content.length < 15) {
            payload.errors.push({
              message: "Text is too short",
              field: "content",
            });
          }

          if (payload.errors.length === 0) {
            const pgResp = await pgQuery(sqls.createApproach, [
              currentUserId, // 1
              input.content, // 2
              taskId, // 3
            ]);

            if (pgResp.rows[0]) {
              await pgQuery(sqls.incrementApproachCount, [taskId]);
              payload.approach = pgResp.rows[0];
            } else {
              payload.errors.push({
                message: "Invalid input",
              });
            }
          }

          return payload;
        },
        voteOnApproach: async ({ approachId, input }) => {
          const payload = { errors: [] };
          const pgResp = await pgQuery(sqls.voteOnApproach, [
            approachId, // 1
            input.up ? 1 : -1, // 2
          ]);

          if (pgResp.rows[0]) {
            payload.approach = pgResp.rows[0];
          } else {
            payload.errors.push({
              message: "Invalid input",
            });
          }

          return payload;
        },
      };
    },
  };
};
