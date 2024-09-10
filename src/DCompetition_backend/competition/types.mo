import Text "mo:base/Text";
import Nat "mo:base/Nat";
module {
  public type Competition = {
    competition_id : Nat;
    principal_id : Text;
    reward : Nat;
    name : Text;
    desc : Text;
  };
};
