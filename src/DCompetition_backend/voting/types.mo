import Nat "mo:base/Nat";
import Time "mo:base/Time";

module {
  public type Voting = {
    vote_id : Nat;
    contestant_id : Nat;
    principal_id : Text;
    voteTime : Time.Time;
  };
};
