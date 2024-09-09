import User "types";
import Array "mo:base/Array";
import RBTree "mo:base/RBTree";
import Text "mo:base/Text";

actor Main {

  let tree = RBTree.RBTree<Text, User.User>(Text.compare);

  public func register(principal_id : Text, username : Text, email : Text, password : Text) : async () {
    let newUser : User.User = {
      principal_id = principal_id;
      username = username;
      email = email;
      password = password;
    };
    tree.put(principal_id, newUser);
  };

  public func getAllUsers() : async [User.User] {
    var users : [User.User] = [];

    for (entry in RBTree.iter(tree.share(), #bwd)) {
      users := Array.append<User.User>(users, [entry.1]);
    };

    return users;
  };

  public func login(principal_id : Text) : async ?User.User {
      let user = tree.get(principal_id);
      return user;
  }

};
