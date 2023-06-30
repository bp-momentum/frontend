import { Avatar } from "@pages/profile/user/types";

export interface Route {
  route: string;
  method: "GET" | "POST";
  body?: Record<string, unknown>;
}

const ApiRoutes = {
  /**
   * Registers a new user with a given registerToken.
   * The user receives this token in their register email.
   * @param {object} props  the token received in the register email
   * @returns {Route} the route to register a new user
   */
  registerUser: (props: {
    password: string;
    registerToken: string;
    username: string;
  }): Route => {
    return {
      route: "/api/register",
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
   * @param {object} props  the username and password
   * @returns {Route} the route to login
   */
  login: (props: { username: string; password: string }): Route => {
    return {
      route: "/api/login",
      method: "POST",
      body: {
        username: props.username,
        password: props.password,
      },
    };
  },

  /**
   * Check if the user is logged in.
   * @returns {Route} the route to check if the user is logged in
   */
  checkLogin: (): Route => {
    return {
      route: "/api/checklogin",
      method: "GET",
    };
  },

  /**
   * Logout the user.
   * @returns {Route} the route to logout the user
   */
  logout: (): Route => {
    return {
      route: "/api/logout",
      method: "GET",
    };
  },

  /**
   * Create a new user by logging in with an admin or trainer account.
   * The given user's email will receive a registration link.
   * @param {object} props  the username and email
   * @returns {Route} the route to create a new user
   */
  createUser: (props: {
    firstName: string;
    lastName: string;
    email: string;
    url: string;
  }): Route => {
    return {
      route: "/api/createuser",
      method: "POST",
      body: {
        first_name: props.firstName,
        last_name: props.lastName,
        email_address: props.email,
        url: props.url,
      },
    };
  },

  /**
   * Delete the user's account.
   * @param {object} props  the user's token
   * @returns {Route} the route to delete the user's account
   */
  deleteAccount: (): Route => {
    return {
      route: "/api/deleteaccount",
      method: "POST",
      body: {},
    };
  },

  /**
   * Fetch all training plans.
   * @returns {Route} the route to fetch all training plans
   */
  getTrainingPlans: (): Route => {
    return {
      route: "/api/getlistofplans",
      method: "GET",
    };
  },

  /**
   * Fetch a training plan by its id.
   * @param {object} props  the training plan's id
   * @returns {Route} the route to fetch a training plan
   */
  getTrainingPlan: (props: { planId: string }): Route => {
    return {
      route: `/api/getplan/${props.planId}/`,
      method: "GET",
    };
  },

  /**
   * Fetch more information about an exercise with a given id.
   * @param {object} props  the exercise's id
   * @returns {Route} the route to fetch more information about an exercise
   */
  getExercise: (props: { id: number }): Route => {
    return {
      route: `/api/getexercise/${props.id}/`,
      method: "GET",
    };
  },

  /**
   * Set the visibility of an exercise's instructions.
   * @param {object} props  the exercise's id and visibility
   * @returns {Route} the route to set the visibility of an exercise's instructions
   */
  setExercisePreferences: (props: {
    id: number;
    visible?: boolean;
    speed?: number;
  }): Route => {
    const body: {
      visible?: boolean;
      speed?: number;
    } = {};

    if (props.visible !== undefined) {
      body["visible"] = props.visible;
    }

    if (props.speed !== undefined) {
      body["speed"] = props.speed;
    }

    return {
      route: `/api/setexercisepreferences/${props.id}/`,
      method: "POST",
      body: body,
    };
  },

  /**
   * Get the visibility of an exercise's instructions.
   * @param {object} props  the exercise's id
   * @returns {Route} the route to get the visibility of an exercise's instructions
   */
  getExercisePreferences: (props: { id: number }): Route => {
    return {
      route: `/api/getexercisepreferences/${props.id}/`,
      method: "GET",
    };
  },

  /**
   * Fetches a list of all exercises.
   * @returns {Route} the route to fetch all exercises
   */
  getExercises: (): Route => {
    return {
      route: "/api/getexerciselist",
      method: "GET",
    };
  },

  /**
   * Save a new training plan.
   * @param {object} props  the training plan's data
   * @returns {Route} the route to save a new training plan
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
   * @param {object} props  the training plan's id
   * @returns {Route} the route to delete a training plan
   */
  deleteTrainingPlan: (props: { planId: string }): Route => {
    return {
      route: `/api/deleteplan/${props.planId}/`,
      method: "GET",
    };
  },

  /**
   * Assign a training plan to a user.
   * @param {object} props  the training plan's id and user's id
   * @returns {Route} the route to assign a training plan to a user
   */
  assignPlanToUser: (props: { planId: string; username: string }): Route => {
    return {
      route: "api/addplantouser",
      method: "POST",
      body: {
        plan: props.planId,
        user: props.username,
      },
    };
  },

  /**
   * Get assigned training plan and whether exercises are completed.
   * This can only be called by a user.
   * @returns {Route} the route to get assigned training plan and exercises
   */
  getDoneExercises: (): Route => {
    return {
      route: "/api/getdoneexercises",
      method: "GET",
    };
  },

  /**
   * Get all done exercises in a given month of a given year.
   * This can only be called by a user.
   * @param {object} props  the month and year
   * @returns {Route} the route to get all done exercises in a given month
   */
  getDoneExercisesInMonth: (props: { month: number; year: number }): Route => {
    return {
      route: "/api/getdoneexercisesinmonth",
      method: "POST",
      body: {
        year: props.year,
        month: props.month,
      },
    };
  },

  /**
   * Get assigned training plans.
   * This can only be called by a user.
   * @returns {Route} the route to get assigned training plans
   */
  getAssignedPlans: (): Route => {
    return {
      route: "/api/requestplanofuser",
      method: "POST",
    };
  },

  /**
   * Get the assigned plan of a user.
   * This can only be called by a trainer.
   * @param {object} props  the user's id
   * @returns {Route} the route to get the assigned plan of a user
   */
  getAssignedPlanOfUser: (props: { username: string }): Route => {
    return {
      route: "/api/requestplanofuser",
      method: "POST",
      body: {
        username: props.username,
      },
    };
  },

  /**
   * Fetch users
   * @returns {Route} the route to fetch users
   */
  getTrainerUsers: (): Route => {
    return {
      route: "/api/gettrainersuser",
      method: "GET",
    };
  },

  /**
   * Fetch trainers
   * @returns {Route} the route to fetch trainers
   */
  getTrainers: (): Route => {
    return {
      route: "/api/gettrainers",
      method: "GET",
    };
  },

  /**
   * delete user
   * @param {object} props  the user's id
   * @returns {Route} the route to delete user
   */
  deleteUser: (props: { userId: string }): Route => {
    return {
      route: "/api/deleteuser",
      method: "POST",
      body: {
        id: props.userId,
      },
    };
  },

  /**
   * delete trainer
   * @param {object} props  the trainer's id
   * @returns {Route} the route to delete trainer
   */
  deleteTrainer: (props: { trainerId: string }): Route => {
    return {
      route: "/api/deletetrainer",
      method: "POST",
      body: {
        id: props.trainerId,
      },
    };
  },

  /**
   * Get user's profile information.
   * This can only be called by a user.
   * @returns {Route} the route to get user's profile information
   */
  getProfile: (): Route => {
    return {
      route: "/api/getprofile",
      method: "GET",
    };
  },

  /**
   * Changes the username of the current account.
   * @param {object} props  the new username
   * @returns {Route} the route to change the username
   */
  changeUsername: (props: { username: string }): Route => {
    return {
      route: "/api/changeusername",
      method: "POST",
      body: {
        username: props.username,
      },
    };
  },

  /**
   * Changes the avatar of the current account.
   * @param {object} props  the new avatar
   * @returns {Route} the route to change the avatar
   */
  changeAvatar: (props: { avatar: Avatar }): Route => {
    return {
      route: "/api/changeavatar",
      method: "POST",
      body: {
        avatar: props.avatar,
      },
    };
  },

  /**
   * Changes the motivation status of the current account.
   * @param {object} props  the new motivation status
   * @returns {Route} the route to change the motivation status
   */
  changeMotivation: (props: { motivation: string }): Route => {
    return {
      route: "/api/changemotivation",
      method: "POST",
      body: {
        motivation: props.motivation,
      },
    };
  },

  /**
   * Change user language
   * @param {object} props  the new language
   * @returns {Route} the route to change the language
   */
  changeLanguage: (props: { language: string }): Route => {
    return {
      route: "/api/changelanguage",
      method: "POST",
      body: {
        language: props.language,
      },
    };
  },

  /**
   * fetch all invited
   * @returns {Route} the route to fetch all invited
   * @param {object} props  the user's id
   */
  getInvited: (): Route => {
    return {
      route: "/api/getinvited",
      method: "GET",
    };
  },

  /**
   * invalidate an invitation
   * @param {object} props  the invitation's id
   * @returns {Route} the route to invalidate an invitation
   */
  invalidateInvitation: (props: { invitationId: string }): Route => {
    return {
      route: "/api/cancelinvite",
      method: "POST",
      body: {
        id: props.invitationId,
      },
    };
  },

  /**
   * request a password reset
   * @param {object} props  the user's email
   * @returns {Route} the route to request a password reset
   */
  requestPasswordReset: (props: { username: string; url: string }): Route => {
    return {
      route: "/api/getresetpasswordemail",
      method: "POST",
      body: {
        username: props.username,
        url: props.url,
      },
    };
  },

  /**
   * reset password
   * @param {object} props  the user's id and new password
   * @returns {Route} the route to reset password
   */
  resetPassword: (props: {
    password: string;
    token: string;
    username: string;
  }): Route => {
    return {
      route: "/api/resetpassword",
      method: "POST",
      body: {
        new_password: props.password,
        reset_token: props.token,
        username: props.username,
      },
    };
  },

  /**
   * Change the user's password
   * @param {object} props  the user's id and new password
   * @returns {Route} the route to change the user's password
   */
  changePassword: (props: { password: string; newPassword: string }): Route => {
    return {
      route: "/api/changepassword",
      method: "POST",
      body: {
        password: props.password,
        new_password: props.newPassword,
      },
    };
  },
};

export default ApiRoutes;
