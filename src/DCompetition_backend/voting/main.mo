import Voting "types";
import RBTree "mo:base/RBTree";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Array "mo:base/Array";

actor Main {
    func compareTuples(t1 : (Nat, Nat), t2 : (Nat, Nat)) : {
        #less;
        #equal;
        #greater;
    } {
        if (t1.0 < t2.0) {
            return #less;
        } else if (t1.0 > t2.0) {
            return #greater;
        } else if (t1.1 < t2.1) {
            return #less;
        } else if (t1.1 > t2.1) {
            return #greater;
        } else {
            return #equal;
        };
    };

    let tree = RBTree.RBTree<(Nat, Nat), Voting.Voting>(compareTuples);

    type Result<T, E> = { #ok : T; #err : E };

    public func addVoting(competition_id : Nat, contestant_id : Nat, new_principal_id : Text) : async () {

        let currentId = (competition_id, contestant_id);

        switch (tree.get(currentId)) {
            case (?existingVote) {
                let updatedPrincipalIds = Array.append(existingVote.principal_id, [new_principal_id]);

                let updatedVote : Voting.Voting = {
                    competition_id = existingVote.competition_id;
                    contestant_id = existingVote.contestant_id;
                    principal_id = updatedPrincipalIds;
                };

                tree.put(currentId, updatedVote);
            };
            case null {
                let newVote : Voting.Voting = {
                    competition_id = competition_id;
                    contestant_id = contestant_id;
                    principal_id = [new_principal_id];
                };

                tree.put(currentId, newVote);
            };
        };
    };

    public func removeVoting(competition_id : Nat, contestant_id : Nat, principal_id : Text) : async () {
        let currentId = (competition_id, contestant_id);

        switch (tree.get(currentId)) {
            case (?existingVote) {
                let updatedPrincipalIds = Array.filter<Text>(existingVote.principal_id, func(p) { p != principal_id });

                if (Array.size(updatedPrincipalIds) == 0) {
                    tree.delete(currentId);
                } else {
                    let updatedVote : Voting.Voting = {
                        competition_id = existingVote.competition_id;
                        contestant_id = existingVote.contestant_id;
                        principal_id = updatedPrincipalIds;
                    };

                    tree.put(currentId, updatedVote);
                };
            };
            case null {
                return;
            };
        };
    };

    public func getVotes(competition_id : Nat, contestant_id : Nat) : async [Voting.Voting] {
        var results : [Voting.Voting] = [];

        for ((currentId, vote) in tree.entries()) {
            if (currentId.0 == competition_id and currentId.1 == contestant_id) {
                results := Array.append<Voting.Voting>(results, [vote]);
            };
        };

        return results;
    };

    public func getVotesByCompetitionId(competition_id : Nat) : async [Voting.Voting] {
        var results : [Voting.Voting] = [];

        for ((currentId, vote) in tree.entries()) {
            if (currentId.0 == competition_id) {
                results := Array.append<Voting.Voting>(results, [vote]);
            };
        };

        return results;
    };

};
