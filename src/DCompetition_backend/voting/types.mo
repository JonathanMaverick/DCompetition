import Nat "mo:base/Nat";
import Text "mo:base/Text";

module {
  public type Voting = {
    competition_id : Nat;
    contestant_id : Nat;
    principal_id : [Text];
  };
};
