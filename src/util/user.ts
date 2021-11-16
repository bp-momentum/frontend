
class User implements IUser {
  name : string;
  cockSize : number;
  constructor(u : IUser) {
    this.name = u.name;
    this.cockSize = u.cockSize;
  }
  getName() : string {
    return this.name;
  }
}

const getUser = () : User => {
  const userObj = {
    name: "Yannik",
    cockSize: 1
  };
  
  return new User(userObj);
};

export interface IUser {
  name : string;
  cockSize : number;
}

export default User;
