import fetch from "node-fetch";

export default class Api {
    static serverUrl = "http://78.46.150.116:8000/";

    static get = (route: string) : any => {
      return fetch(this.parseRoute(route)).then((r) => r.json().then((obj) => console.log));
    }

    static parseRoute = (route: string) : string => {
      if (route.startsWith("/")) {
        route = route.substr(1);
      }
      if (this.serverUrl.endsWith("/")) {
        return this.serverUrl + route;
      } else {
        return this.serverUrl + "/" + route;
      }
    }
}