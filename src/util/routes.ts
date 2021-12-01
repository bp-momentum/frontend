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
  }
};

export default Routes;
