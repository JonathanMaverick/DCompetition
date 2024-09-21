import RBTree "mo:base/RBTree";
import Contest "types";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Time "mo:base/Time";

actor Main {

    let tree = RBTree.RBTree<Nat, Contest.Contest>(Nat.compare);
    var currentId : Nat = 0;
    type Result<T, E> = { #ok : T; #err : E };

    public func getPrincipalContest(principal_id : Text) : async [Contest.Contest] {
        var contests : [Contest.Contest] = [];

        for (entry in RBTree.iter(tree.share(), #bwd)) {
            if (Text.equal(entry.1.principal_id, principal_id)) {
                contests := Array.append<Contest.Contest>(contests, [entry.1]);
            };
        };

        return contests;
    };

    public func getContestById(contest_id : Nat) : async ?Contest.Contest {

        var contest = tree.get(contest_id);

        return contest;
    };

    public func getAllContest() : async [Contest.Contest] {
        var contests : [Contest.Contest] = [];

        for (entry in RBTree.iter(tree.share(), #bwd)) {
            contests := Array.append<Contest.Contest>(contests, [entry.1]);
        };

        return contests;
    };

    public func addCompetition(
        principal_id : Text, 
        name : Text, 
        reward : Nat, 
        desc : Text, 
        category : Text, 
        startDate : Time.Time, 
        endDate : Time.Time, 
        votingEndDate : Time.Time
    ) : async Result<Null, Text> {
        currentId := currentId + 1;

        if (principal_id == "" or name == "" or desc == "" or category == "") {
            return #err("All Fields must been filled")
        };

        let newContest : Contest.Contest = {
            contest_id = currentId;
            principal_id = principal_id;
            name = name;
            reward = reward;
            desc = desc;
            category = category;
            startDate = startDate;
            endDate = endDate;
            votingEndDate = votingEndDate;
        };

        tree.put(currentId, newContest);
        return #ok(null);
    };

};
