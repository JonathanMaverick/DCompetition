import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Blob "mo:base/Blob";
module {
  public type User = {
    principal_id : Text;
    username : Text;
    email : Text;
    money : Nat;
    profilePic : Blob;
  };
};
