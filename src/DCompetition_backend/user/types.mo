import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Float "mo:base/Float";
module {
  public type User = {
    principal_id : Text;
    username : Text;
    email : Text;
    money : Float;
    profilePic : Blob;
  };
};
