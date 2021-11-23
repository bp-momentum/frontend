export interface Route {
  route: string,
  method: "GET" | "POST";
  needsAuth: boolean;
  body?: Record<string, unknown>;
}

const Routes = {
  registerUser: (props: {
    first_name: string,
    last_name:  string,
    username:   string,
    password:   string,
  }): Route => {
    return {
      route: "/api/register",
      needsAuth: false,
      method: "POST",
      body: {
        first_name: props.first_name,
        last_name:  props.last_name,
        username:   props.username,
        password:   props.password
      }
    };
  },
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
  }
};

export default Routes;
