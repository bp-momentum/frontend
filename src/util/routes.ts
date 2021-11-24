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
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    password: string,
    registerToken: string,
  }): Route => {
    return {
      route: "/api/register",
      needsAuth: false,
      method: "POST",
      body: {
        first_name: props.first_name,
        last_name:  props.last_name,
        username:   props.username,
        password:   props.password,
        email_address: props.email,
        new_user_token: props.registerToken,
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
    username: string,
    email: string,
  }) : Route => {
    return {
      route: "/api/createuser",
      needsAuth: true,
      method: "POST",
      body: {
        first_name: props.firstName,
        last_name: props.lastName,
        username: props.username,
        email_address: props.email,
      }
    };
  },
};

export default Routes;
