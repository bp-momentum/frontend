import { Avatar } from "@pages/profile/user/types";

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
   * @param {object} props  the username and password
   * @returns {Route} the route to login
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
      needsAuth: true,
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
   * Fetch a new session token with a given refresh token.
   * @param {object} props  the refresh token
   * @returns {Route} the route to fetch a new session token
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
   * @param {object} props  the user's token
   * @returns {Route} the route to delete the user's account
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
   * @returns {Route} the route to fetch all training plans
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
   * @param {object} props  the training plan's id
   * @returns {Route} the route to fetch a training plan
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
   * @param {object} props  the exercise's id
   * @returns {Route} the route to fetch more information about an exercise
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
   * @returns {Route} the route to fetch all exercises
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
   * @param {object} props  the training plan's id
   * @returns {Route} the route to delete a training plan
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
   * @param {object} props  the training plan's id and user's id
   * @returns {Route} the route to assign a training plan to a user
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
   * @returns {Route} the route to get assigned training plan and exercises
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
   * @param {object} props  the month and year
   * @returns {Route} the route to get all done exercises in a given month
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
   * @returns {Route} the route to get assigned training plans
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
   * @param {object} props  the user's id
   * @returns {Route} the route to get the assigned plan of a user
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
   * @returns {Route} the route to fetch user-specific Leaderboard
   * @param {object} props  the user's id
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
   * @returns {Route} the route to fetch users
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
   * @returns {Route} the route to fetch trainers
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
   * @param {object} props  the user's id
   * @returns {Route} the route to delete user
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
   * @param {object} props  the trainer's id
   * @returns {Route} the route to delete trainer
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
   * This can only be called by a user.
   * @returns {Route} the route to get user's profile information
   */
  getProfile: (): Route => {
    return {
      route: "/api/getprofile",
      method: "GET",
      needsAuth: true,
    };
  },

  /**
   * Get user's level information.
   * This can only be called by a user.
   * @param {object} props  the user's id
   * @returns {Route} the route to get user's level information
   */
  getUserLevel: (props: { username: string }): Route => {
    return {
      route: "/api/getuserlevel",
      method: "POST",
      needsAuth: true,
      body: {
        username: props.username,
      },
    };
  },

  /**
   * Get trainer's contact information.
   * This can only be called by a user or trainer.
   * @returns {Route} the route to get trainer's contact information
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
   * @param {object} props  the new username
   * @returns {Route} the route to change the username
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
   * @param {object} props  the new avatar
   * @returns {Route} the route to change the avatar
   */
  changeAvatar: (props: { avatar: Avatar }): Route => {
    return {
      route: "/api/changeavatar",
      method: "POST",
      needsAuth: true,
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
      needsAuth: true,
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
      needsAuth: true,
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
      needsAuth: true,
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
   * @param {object} props  the user's email
   * @returns {Route} the route to request a password reset
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
   * @param {object} props  the user's id and new password
   * @returns {Route} the route to reset password
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
   * @returns {Route} the route to log the user out of all other devices
   * @param {object} props  the user's id
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
   * @param {object} props  the user's id and new password
   * @returns {Route} the route to change the user's password
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

  /**
   * get Friends
   * @returns {Route} the route to get Friends
   */
  getFriends: (): Route => {
    return {
      route: "/api/getfriends",
      needsAuth: true,
      method: "GET",
    };
  },

  /**
   * get Friend Requests
   * @returns {Route} the route to get Friend Requests
   */
  getFriendRequests: (): Route => {
    return {
      route: "/api/getfriendrequests",
      needsAuth: true,
      method: "GET",
    };
  },

  /**
   * get Friend Requests
   * @returns {Route} the route to get Friend Requests
   */
  getSentFriendRequests: (): Route => {
    return {
      route: "/api/getpendingfriendrequests",
      needsAuth: true,
      method: "GET",
    };
  },

  /**
   * add Friend
   * @param {object} props  the user's id
   * @returns {Route} the route to add Friend
   */
  addFriend: (props: { friendId: string }): Route => {
    return {
      route: "/api/addfriend",
      needsAuth: true,
      method: "POST",
      body: {
        username: props.friendId,
      },
    };
  },

  /**
   * accept Friend Request
   * @param {object} props  the user's id
   * @returns {Route} the route to accept Friend Request
   */
  acceptFriendRequest: (props: { friendId: number }): Route => {
    return {
      route: "/api/acceptfriendrequest",
      needsAuth: true,
      method: "POST",
      body: {
        id: props.friendId,
      },
    };
  },

  /**
   * decline Friend Request
   * @param {object} props  the user's id
   * @returns {Route} the route to decline Friend Request
   */
  declineFriendRequest: (props: { friendId: number }): Route => {
    return {
      route: "/api/declinefriendrequest",
      needsAuth: true,
      method: "POST",
      body: {
        id: props.friendId,
      },
    };
  },

  /**
   * remove Friend
   * @param {object} props  the user's id
   * @returns {Route} the route to remove Friend
   */
  removeFriend: (props: { friendId: number }): Route => {
    return {
      route: "/api/removefriend",
      needsAuth: true,
      method: "POST",
      body: {
        id: props.friendId,
      },
    };
  },

  /**
   * Change the contact address of the logged in trainer.
   * @param {object} props  the user's id and new address
   * @returns {Route} the route to change the contact address of the logged in trainer.
   */
  changeLocation: (props: {
    street: string;
    postalCode: string;
    country: string;
    city: string;
    houseNr: string;
    addressAddition: string;
  }): Route => {
    return {
      route: "/api/changelocation",
      method: "POST",
      needsAuth: true,
      body: {
        street: props.street,
        postal_code: props.postalCode,
        country: props.country,
        city: props.city,
        house_nr: props.houseNr,
        address_add: props.addressAddition,
      },
    };
  },

  /**
   * Change the contact telephone number of the logged in trainer.
   * @param {object} props  the user's id and new telephone number
   * @returns {Route} the route to change the contact telephone number of the logged in trainer.
   */
  changeTelephone: (props: { telephone: string }): Route => {
    return {
      route: "/api/changetelephone",
      method: "POST",
      needsAuth: true,
      body: {
        telephone: props.telephone,
      },
    };
  },

  /**
   * Change the academic title of the logged in trainer.
   * @param {object} props  the user's id and new academic title
   * @returns {Route} the route to change the academic title of the logged in trainer.
   */
  changeAcademia: (props: { academia: string }): Route => {
    return {
      route: "/api/changeacademia",
      method: "POST",
      needsAuth: true,
      body: {
        academia: props.academia,
      },
    };
  },

  /**
   * Get the logged-in user's achievements.
   * @returns {Route} the route to get the logged-in user's achievements.
   */
  getAchievements: (): Route => {
    return {
      route: "/api/getachievements",
      needsAuth: true,
      method: "GET",
    };
  },

  /**
   * Get the logged-in user's medals.
   * @returns {Route} the route to get the logged-in user's medals.
   */
  getMedals: (): Route => {
    return {
      route: "/api/getmedals",
      needsAuth: true,
      method: "GET",
    };
  },

  /**
   * Checks it the logged-in user unlocked the friends achievement.
   * @returns {Route} the route to check it the logged-in user unlocked the friends achievement.
   */
  loadFriendAchievement: (): Route => {
    return {
      route: "/api/loadfriendachievements",
      needsAuth: true,
      method: "GET",
    };
  },

  /**
   * Checks it the logged-in user unlocked new achievements from exercises.
   * @returns {Route} the route to check it the logged-in user unlocked new achievements from exercises.
   */
  loadExerciseAchievements: (): Route => {
    return {
      route: "/api/loadexerciseachievements",
      needsAuth: true,
      method: "GET",
    };
  },

  /**
   * get the streak
   * @returns {Route} the route to get the streak
   */
  getStreak: (): Route => {
    return {
      route: "/api/getstreak",
      needsAuth: true,
      method: "GET",
    };
  },
};

export default Routes;
