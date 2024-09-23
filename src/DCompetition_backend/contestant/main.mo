import RBTree "mo:base/RBTree";
import Nat "mo:base/Nat";
import Blob "mo:base/Blob";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Contestant "types";

actor Main {

    let tree = RBTree.RBTree<Nat, Contestant.Contestant>(Nat.compare);

    var currentId : Nat = 0;

    public func addContestant(principal_id : Text, competition_id : Nat, photoUrl : Blob) : async () {
        currentId := currentId + 1;
        let now = Time.now();
        let newContestant : Contestant.Contestant = {
            contestant_id = currentId;
            principal_id = principal_id;
            competition_id = competition_id;
            photo_url = photoUrl;
            upload_time = now;
        };

        tree.put(currentId, newContestant);
    };

    public func getAllContestants() : async [Contestant.Contestant] {
        var contestants : [Contestant.Contestant] = [];

        for (entry in RBTree.iter(tree.share(), #bwd)) {
            contestants := Array.append<Contestant.Contestant>(contestants, [entry.1]);
        };

        return contestants;
    };

    public func getContestantsByCompetitionId(competition_id : Nat) : async [Contestant.Contestant] {
        var contestantsByCompetition : [Contestant.Contestant] = [];

        for (entry in RBTree.iter(tree.share(), #bwd)) {
            let contestant = entry.1;
            if (contestant.competition_id == competition_id) {
                contestantsByCompetition := Array.append<Contestant.Contestant>(contestantsByCompetition, [contestant]);
            };
        };

        return contestantsByCompetition;
    };

    public func deleteData(contestantId : Nat) : async () {
        tree.delete(contestantId);
    };

};
