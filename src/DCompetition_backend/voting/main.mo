import Voting "types";
import RBTree "mo:base/RBTree";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Nat "mo:base/Nat";

actor Main {

    let tree = RBTree.RBTree<Nat, Voting.Voting>(Nat.compare);
    type Result<T, E> = { #ok : T; #err : E };

    var currentId : Nat = 0;

    public func addVoting(contestant_id : Nat, principal_id : Text) : async () {
        currentId := currentId + 1;
        var current_time = Time.now();

        let newVote : Voting.Voting = {
            vote_id = currentId;
            contestant_id = contestant_id;
            principal_id = principal_id;
            voteTime = current_time;
        };

        tree.put(currentId, newVote);
    };

    public func checkVoting(contestant_id : Nat, principal_id : Text) : async ?Time.Time {
        for (entry in RBTree.iter(tree.share(), #bwd)) {
            let vote = entry.1;
            if (vote.contestant_id == contestant_id and vote.principal_id == principal_id) {
                var checkedVote = vote;
                return ?checkedVote.voteTime;
            };
        };
        return null;
    }

};
