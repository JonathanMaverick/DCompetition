import RBTree "mo:base/RBTree";
import Nat "mo:base/Nat";
import Blob "mo:base/Blob";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Contestant "types";

actor Main {

    let tree = RBTree.RBTree<Nat, Contestant.Contestant>(Nat.compare);

    var currentId : Nat = 0;

    public func addContestant(principal_id : Text, competition_id : Nat, photoUrl : Blob) : async () {
        currentId := currentId + 1;

        let newContestant : Contestant.Contestant = {
            contestant_id = currentId;
            principal_id = principal_id;
            competition_id = competition_id;
            photo_url = photoUrl;
        };

        tree.put(currentId, newContestant);
    };

     

    public func getAllContestant() : async [Contestant.Contestant] {
        var contestant : [Contestant.Contestant] = [];

        for (entry in RBTree.iter(tree.share(), #bwd)) {
            contestant := Array.append<Contestant.Contestant>(contestant, [entry.1]);
        };

        return contestant;
    };

    public func deleteData(currentId : Nat) : async () {
        tree.delete(currentId);
    };

};
