export interface Route {
  route: string;
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
    password: string;
    registerToken: string;
    username: string;
  }): Route => {
    return {
      route: "/api/register",
      needsAuth: false,
      method: "POST",
      body: {
        password: props.password,
        new_user_token: props.registerToken,
        username: props.username,
      },
    };
  },

  /**
   * Login with a given username and password.
   */
  login: (props: { username: string; password: string }): Route => {
    return {
      route: "/api/login",
      needsAuth: false,
      method: "POST",
      body: {
        username: props.username,
        password: props.password,
      },
    };
  },

  /**
   * Create a new user by logging in with an admin or trainer account.
   * The given user's email will receive a registration link.
   */
  createUser: (props: {
    firstName: string;
    lastName: string;
    email: string;
  }): Route => {
    return {
      route: "/api/createuser",
      needsAuth: true,
      method: "POST",
      body: {
        first_name: props.firstName,
        last_name: props.lastName,
        email_address: props.email,
      },
    };
  },

  /**
   * Fetch a new session token with a given refresh token.
   */
  auth: (props: { refreshToken: string }): Route => {
    return {
      route: "/api/auth",
      needsAuth: false,
      method: "POST",
      body: {
        refresh_token: props.refreshToken,
      },
    };
  },

  /**
   * Delete the user's account.
   */
  deleteAccount: (): Route => {
    return {
      route: "/api/deleteaccount",
      needsAuth: true,
      method: "POST",
      body: {},
    };
  },

  /**
   * Fetch all training plans.
   */
  getTrainingPlans: (): Route => {
    return {
      route: "/api/getlistofplans",
      needsAuth: true,
      method: "GET",
    };
  },

  /**
   * Fetch a training plan by its id.
   */
  getTrainingPlan: (props: { planId: string }): Route => {
    return {
      route: "/api/getplan",
      needsAuth: true,
      method: "POST",
      body: {
        plan: props.planId,
      },
    };
  },

  /**
   * Fetch more information about an exercise with a given id.
   */
  getExercise: (props: { id: number }): Route => {
    return {
      route: "/api/getexercise",
      method: "POST",
      needsAuth: true,
      body: {
        id: props.id,
      },
    };
  },

  /**
   * Fetches a list of all exercises.
   */
  getExercises: (): Route => {
    return {
      route: "/api/getexerciselist",
      needsAuth: true,
      method: "GET",
    };
  },

  /**
   * Save a new training plan.
   */
  saveTrainingPlan: (props: {
    id?: number;
    name: string;
    exercise: {
      id: number;
      sets: number;
      repeats_per_set: number;
      date: string;
    }[];
  }): Route => {
    return {
      route: "/api/createplan",
      needsAuth: true,
      method: "POST",
      body: {
        id: props.id,
        name: props.name,
        exercise: props.exercise,
      },
    };
  },

  /**
   * Delete a training plan.
   */
  deleteTrainingPlan: (props: { planId: string }): Route => {
    return {
      route: "/api/deleteplan",
      needsAuth: true,
      method: "POST",
      body: {
        id: props.planId,
      },
    };
  },

  /**
   * Assign a training plan to a user.
   */
  assignPlanToUser: (props: { planId: string; username: string }): Route => {
    return {
      route: "api/addplantouser",
      method: "POST",
      needsAuth: true,
      body: {
        plan: props.planId,
        user: props.username,
      },
    };
  },

  /**
   * Get assigned training plan and whether exercises are completed.
   * This can only be called by a user.
   */
  getDoneExercises: (): Route => {
    return {
      route: "/api/getdoneexercises",
      needsAuth: true,
      method: "GET",
    };
  },

  /**
   * Get all done exercises in a given month of a given year.
   * This can only be called by a user.
   */
  getDoneExercisesInMonth: (props: { month: number; year: number }): Route => {
    return {
      route: "/api/getdoneexercisesinmonth",
      method: "POST",
      needsAuth: true,
      body: {
        year: props.year,
        month: props.month,
      },
    };
  },

  /**
   * Get assigned training plans.
   * This can only be called by a user.
   */
  getAssignedPlans: (): Route => {
    return {
      route: "/api/requestplanofuser",
      needsAuth: true,
      method: "POST",
    };
  },

  /**
   * Get the assigned plan of a user.
   * This can only be called by a trainer.
   */
  getAssignedPlanOfUser: (props: { username: string }): Route => {
    return {
      route: "/api/requestplanofuser",
      needsAuth: true,
      method: "POST",
      body: {
        username: props.username,
      },
    };
  },

  /**
   * Fetch user-specific Leaderboard
   */
  getLeaderboard: (props: { count: number }): Route => {
    return {
      route: "/api/listleaderboard",
      needsAuth: true,
      method: "POST",
      body: {
        count: props.count,
      },
    };
  },

  /**
   * Fetch users
   */
  getTrainerUsers: (): Route => {
    return {
      route: "/api/gettrainersuser",
      needsAuth: true,
      method: "GET",
    };
  },

  /**
   * Fetch trainers
   */
  getTrainers: (): Route => {
    return {
      route: "/api/gettrainers",
      needsAuth: true,
      method: "GET",
    };
  },

  /**
   * delete user
   */
  deleteUser: (props: { userId: string }): Route => {
    return {
      route: "/api/deleteuser",
      needsAuth: true,
      method: "POST",
      body: {
        id: props.userId,
      },
    };
  },

  /**
   * delete trainer
   */
  deleteTrainer: (props: { trainerId: string }): Route => {
    return {
      route: "/api/deletetrainer",
      needsAuth: true,
      method: "POST",
      body: {
        id: props.trainerId,
      },
    };
  },

  /**
   * Get user's profile information.
   */
  getProfile: (): Route => {
    return {
      route: "/api/getprofile",
      method: "GET",
      needsAuth: true,
    };
  },

  /**
   * Get trainer's contact information.
   * This can only be called by an user.
   */
  getTrainerContact: (): Route => {
    return {
      route: "/api/gettrainercontact",
      method: "GET",
      needsAuth: true,
    };
  },

  /**
   * Changes the username of the current account.
   */
  changeUsername: (props: { username: string }): Route => {
    return {
      route: "/api/changeusername",
      method: "POST",
      needsAuth: true,
      body: {
        username: props.username,
      },
    };
  },

  /**
   * Changes the avatar of the current account.
   */
  changeAvatar: (props: { avatarId: number }): Route => {
    return {
      route: "/api/changeavatar",
      method: "POST",
      needsAuth: true,
      body: {
        avatar: props.avatarId,
      },
    };
  },

  /**
   * Changes the motivation status of the current account.
   */
  changeMotivation: (props: { motivation: string }): Route => {
    return {
      route: "/api/changemotivation",
      method: "POST",
      needsAuth: true,
      body: {
        motivation: props.motivation,
      },
    };
  },

  /**
   * Change user language
   */
  changeLanguage: (props: { language: string }): Route => {
    return {
      route: "/api/changelanguage",
      needsAuth: true,
      method: "POST",
      body: {
        language: props.language,
      },
    };
  },

  /**
   * fetch all invited
   */
  getInvited: (): Route => {
    return {
      route: "/api/getinvited",
      needsAuth: true,
      method: "GET",
    };
  },

  /**
   * invalidate an invitation
   */
  invalidateInvitation: (props: { invitationId: string }): Route => {
    return {
      route: "/api/invalidateinvite",
      needsAuth: true,
      method: "POST",
      body: {
        id: props.invitationId,
      },
    };
  },

  /**
   * request a password reset
   */
  requestPasswordReset: (props: { username: string; url: string }): Route => {
    return {
      route: "/api/getresetpasswordemail",
      needsAuth: false,
      method: "POST",
      body: {
        username: props.username,
        url: props.url,
      },
    };
  },

  /**
   * reset password
   */
  resetPassword: (props: { password: string; token: string }): Route => {
    return {
      route: "/api/resetpassword",
      needsAuth: false,
      method: "POST",
      body: {
        new_password: props.password,
        reset_token: props.token,
      },
    };
  },

  /**
   * Logs the user out of all other devices
   */
  logoutAllDevices: (): Route => {
    return {
      route: "/api/logoutdevices",
      needsAuth: true,
      method: "POST",
    };
  },

  /**
   * Change the user's password
   */
  changePassword: (props: { password: string; newPassword: string }): Route => {
    return {
      route: "/api/changepassword",
      needsAuth: true,
      method: "POST",
      body: {
        password: props.password,
        new_password: props.newPassword,
      },
    };
  },
};

export default Routes;
