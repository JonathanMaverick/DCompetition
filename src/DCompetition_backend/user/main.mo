import User "types";
import Array "mo:base/Array";

actor Main {
  stable var users : [User.User] = [];
  stable var nextUserID : Nat = 1;

  public func register(username : Text, email : Text, password : Text) : async () {
    let newUser : User.User = {
      userID = nextUserID;
      username = username;
      email = email;
      password = password;
    };
    users := Array.append<User.User>(users, [newUser]);
    nextUserID += 1;
  };

  public query func getUsers() : async [User.User] {
    return users;
  };
};
