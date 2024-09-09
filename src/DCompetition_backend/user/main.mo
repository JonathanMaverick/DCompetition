import User "types";
import Array "mo:base/Array";
import RBTree "mo:base/RBTree";
import Text "mo:base/Text";

actor Main {

  let tree = RBTree.RBTree<Text, User.User>(Text.compare);

  public func register(username : Text, email : Text, password : Text) : async () {
    let newUser : User.User = {
      username = username;
      email = email;
      password = password;
    };
    tree.put(newUser.username , newUser);
  };

  public func getAllUsers(): async [User.User] {
    var users: [User.User] = [];

    for(entry in RBTree.iter(tree.share(), #bwd)){
      users := Array.append<User.User>(users, [entry.1]);
    };
    
    return users;
  }

};
