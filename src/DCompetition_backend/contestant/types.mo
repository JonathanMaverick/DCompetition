import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Blob "mo:base/Blob";
module {
    public type Contestant = {
        contestant_id : Nat;
        principal_id : Text;
        competition_id : Nat;
        photo_url : Blob;
    };
};
