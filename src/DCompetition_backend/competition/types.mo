import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
module {
  public type Competition = {
    competition_id : Nat;
    principal_id : Text;
    name : Text;
    reward : Nat;
    desc : Text;
    category : Text;
    startDate : Time.Time;
    endDate : Time.Time;
    status : Text;
  };
};
