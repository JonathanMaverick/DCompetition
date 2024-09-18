import Text "mo:base/Text";
import Nat "mo:base/Nat";
module {
  public type User = {
    principal_id : Text;
    username : Text;
    email : Text;
    money : Nat;
  };
};
