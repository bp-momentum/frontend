export interface Route {
  route: string,
  method: "GET" | "POST";
  needsAuth: boolean;
  body?: Record<string, unknown>;
}

const Routes = {
  /**
   * Registers a new user with a given registerToken.
   * The user receives this token in their register email.
   */
  registerUser: (props: {
    password: string,
    registerToken: string,
    username: string,
  }): Route => {
    return {
      route: "/api/register",
      needsAuth: false,
      method: "POST",
      body: {
        password: props.password,
        new_user_token: props.registerToken,
        username: props.username,
      }
    };
  },

  /**
   * Login with a given username and password.
   */
  login: (props: {
    username: string,
    password: string,
  }) : Route => {
    return {
      route: "/api/login",
      needsAuth: false,
      method: "POST",
      body: {
        username: props.username,
        password: props.password,
      }
    };
  },

  /**
   * Create a new user by logging in with an admin or trainer account.
   * The given user's email will receive a registration link.
   */
  createUser: (props: {
    firstName: string,
    lastName: string,
    email: string,
  }) : Route => {
    return {
      route: "/api/createuser",
      needsAuth: true,
      method: "POST",
      body: {
        first_name: props.firstName,
        last_name: props.lastName,
        email_address: props.email,
      }
    };
  },

  /**
   * Fetch a new session token with a given refresh token.
   */
  auth: (props: {
    refreshToken: string,
  }) : Route => {
    return {
      route: "/api/auth",
      needsAuth: false,
      method: "POST",
      body: {
        refresh_token: props.refreshToken,
      }
    };
  },

  /**
   * Delete the user's account.
   */
  deleteAccount: () : Route => {
    return {
      route: "/api/deleteuser",
      needsAuth: true,
      method: "POST",
      body: { }
    };
  },

  /**
   * Fetch all training plans.
   */
  getTrainingPlans: (props: Record<string, never>) : Route => {
    return {
      route: "/api/getlistofplans",
      needsAuth: true,
      method: "GET"
    };
  },

  /**
   * Fetch a training plan by its id.
   */
  getTrainingPlan: (props: {
    planId: string,
  }) : Route => {
    return {
      route: "/api/getplan",
      needsAuth: true,
      method: "POST",
      body: {
        plan: props.planId,
      }
    };
  },

  /**
   * Fetches a list of all exercises.
   */
  getExercises: (props: Record<string, never>) : Route => {
    return {
      route: "/api/getexerciselist",
      needsAuth: true,
      method: "GET"
    };
  },

  /**
   * Save a new training plan.
   */
  saveTrainingPlan: (props: {
    id?: number,
    name: string,
    exercise: {id: number, sets: number, repeats_per_set: number, date: string}[],
  }) : Route => {
    return {
      route: "/api/createplan",
      needsAuth: true,
      method: "POST",
      body: {
        id: props.id,
        name: props.name,
        exercise: props.exercise,
      }
    };
  },

  /**
   * Delete a training plan.
   */
  deleteTrainingPlan: (props: {
    planId: string,
  }) : Route => {
    return {
      route: "/api/deleteplan",
      needsAuth: true,
      method: "POST",
      body: {
        id: props.planId,
      }
    };
  },

  /**
   * Fetch user-specific Leaderboard
   */
  getLeaderboard: () : Route => {
    return {
      route: "/api/listleaderboard",
      needsAuth: true,
      method: "GET",
      body: { }
    };
  },
};

export default Routes;
