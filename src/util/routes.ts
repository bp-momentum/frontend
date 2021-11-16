export default class Routes {
  static registerUser : Route = {
    route: "/api/register",
    needsAuth: false,
    method: "POST",
    body: {
      first_name: {
        required: true,
      },
      last_name: {
        required: true,
      },
      username: {
        required: true,
      },
      password: {
        required: true,
      }
    }
  }
}

export interface Route {
  route: string,
  method: "GET" | "POST";
  needsAuth: boolean;
  body?: Record<string, ParameterOption>;
}

export interface ParameterOption {
  required: boolean,
}
