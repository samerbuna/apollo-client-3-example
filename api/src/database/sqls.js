export default {
  // 1: authToken
  userFromAuthToken: `
    SELECT id, username, first_name as "firstName", last_name as "lastName", $1 as "authToken"
    FROM users
    WHERE hashed_auth_token = crypt($1, hashed_auth_token)
  `,

  // 1: username
  // 2: password
  userFromCredentials: `
    SELECT id, username, first_name as "firstName", last_name as "lastName"
    FROM users
    WHERE username = $1
    AND hashed_password = crypt($2, hashed_password)
  `,

  // 1: userId
  users: `
    SELECT id, username, first_name as "firstName", last_name as "lastName"
    FROM users
    WHERE id = ANY ($1)
  `,

  // 1: taskId
  // 2: currentUserId
  tasks: `
    SELECT id, content, tags, user_id as "userId", approach_count as "approachCount", is_private as "isPrivate"
    FROM tasks
    WHERE id = ANY($1)
    AND (is_private = false OR user_id = $2)
  `,

  // Pick a sql query by type
  tasksByTypes: {
    public: `
      SELECT id, content, tags, user_id as "userId", approach_count as "approachCount", is_private as "isPrivate"
      FROM tasks
      WHERE is_private = false
      LIMIT 100
    `,
  },

  // 1: userId
  tasksForUsers: `
    SELECT id, content, tags, user_id as "userId", approach_count as "approachCount", is_private as "isPrivate"
    FROM tasks
    WHERE user_id = $1
  `,

  // 1: taskId
  approachesForTasks: `
    SELECT id, content, user_id as "userId", task_id as "taskId", vote_count as "voteCount"
    FROM approaches
    WHERE task_id = ANY ($1)
    ORDER BY vote_count desc
  `,

  // 1: userId (can be null)
  // 2: searchTerm
  searchResults: `
    WITH viewable_tasks AS (
      SELECT *
      FROM tasks n
      WHERE (is_private = false OR user_id = $1)
    )
    SELECT id, "taskId", content, tags, "approachCount", "voteCount", "userId", type,
           ts_rank(to_tsvector(content), websearch_to_tsquery($2)) as rank
    FROM (
      SELECT id, id as "taskId", content, tags, approach_count as "approachCount", null as "voteCount", user_id as "userId", 'task' as type
      FROM viewable_tasks
      UNION ALL
      SELECT a.id, n.id as "taskId", a.content, null as tags, null as "approachCount", vote_count as "voteCount", a.user_id as "userId", 'approach' as type
      FROM approaches a JOIN viewable_tasks n ON (n.id = a.task_id)
    ) search_view
    WHERE to_tsvector(content) @@ websearch_to_tsquery($2)
    ORDER BY rank DESC, type DESC
  `,

  // 1: username
  // 2: password
  // 3: firstName (can be null)
  // 4: lastName (can be null)
  // 5: authToken
  createUser: `
    INSERT INTO users (username, hashed_password, first_name, last_name, hashed_auth_token)
    VALUES ($1, crypt($2, gen_salt('bf')), $3, $4, crypt($5, gen_salt('bf')))
    RETURNING id, username, first_name as "firstName", last_name as "lastName"
  `,

  // 1: userId
  // 2: content
  // 3: tags
  // 4: true if private
  createTask: `
    INSERT INTO tasks (user_id, content, tags, is_private)
    VALUES ($1, $2, $3, $4)
    RETURNING id, content, tags, user_id as "userId", approach_count as "approachCount", is_private as "isPrivate";
  `,

  // 1: userId
  // 2: content
  // 3: taskId
  createApproach: `
    INSERT INTO approaches (user_id, content, task_id)
    VALUES ($1, $2, $3)
    RETURNING id, content, user_id as "userId", task_id as "taskId", vote_count as "voteCount";
  `,

  // ------
  // UPDATE

  // 1: userId
  // 2: new authToken
  updateUserAuthToken: `
    UPDATE users
    SET hashed_auth_token = crypt($2, gen_salt('bf'))
    WHERE id = $1;
  `,

  // 1: approachId
  // 2: voteIncrement
  voteOnApproach: `
    UPDATE approaches
    SET vote_count = vote_count + $2
    WHERE id = $1
    RETURNING id, content, user_id as "userId", task_id as "taskId", vote_count as "voteCount";
  `,

  incrementApproachCount: `
    UPDATE tasks
    SET approach_count = approach_count + 1
    WHERE id = $1
    RETURNING id, content, tags, user_id as "userId", approach_count as "approachCount", is_private as "isPrivate";;
  `,
};
