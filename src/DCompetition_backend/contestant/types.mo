import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Blob "mo:base/Blob";
import Time "mo:base/Time";
module {
    public type Contestant = {
        contestant_id : Nat;
        principal_id : Text;
        competition_id : Nat;
        photo_url : Blob;
        upload_time : Time.Time;
    };
};
