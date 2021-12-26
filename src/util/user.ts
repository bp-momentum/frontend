class User implements IUser {
  name: string;
  constructor(u: IUser) {
    this.name = u.name;
  }
  getName(): string {
    return this.name;
  }
}

// TODO(Laennart): Remove if unused
//const getUser = () : User => {
//  const userObj = {
//    name: "Yannik",
//  };
//  return new User(userObj);
//};

export interface IUser {
  name: string;
}

export default User;
