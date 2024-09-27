import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Bool "mo:base/Bool";
import Float "mo:base/Float";
module {
  public type Contest = {
    contest_id : Nat;
    principal_id : Text;
    name : Text;
    reward : Float;
    desc : Text;
    category : Text;
    startDate : Time.Time;
    endDate : Time.Time;
    votingEndDate : Time.Time;
    industry_name : Text;
    additional_information : Text;
    color : [Text];
    file : [Blob];
    isReward : Bool;
  };
};
