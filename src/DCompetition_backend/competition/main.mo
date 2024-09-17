import RBTree "mo:base/RBTree";
import Competition "types";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Time "mo:base/Time";

actor Main { 

    let tree = RBTree.RBTree<Nat, Competition.Competition>(Nat.compare);
    var currentId : Nat = 0;

    public func getPrincipalCompetition(principal_id : Text) : async [Competition.Competition] {
        var competitions : [Competition.Competition] = [];

        for (entry in RBTree.iter(tree.share(), #bwd)) {
            if(Text.equal(entry.1.principal_id, principal_id)){
                competitions := Array.append<Competition.Competition>(competitions, [entry.1]);
            }
        };

        return competitions;
    };

    public func getCompetitionById(competition_id : Nat) : async ?Competition.Competition {

        var competition = tree.get(competition_id);

        return competition;
    };

    public func getAllCompetition() : async [Competition.Competition] {
        var competitions : [Competition.Competition] = [];
        
        for (entry in RBTree.iter(tree.share(), #bwd)) {
            competitions := Array.append<Competition.Competition>(competitions, [entry.1])
        };

        return competitions;
    };

    public func addCompetition(principal_id : Text, reward : Nat, name : Text, desc : Text, startDate: Time.Time, endDate:Time.Time) : async () {
        currentId := currentId + 1;

        let newCompetition : Competition.Competition = {
            competition_id = currentId;
            principal_id = principal_id;
            reward = reward;
            name = name;
            desc = desc;
            startDate = startDate;
            endDate = endDate;
        };

        tree.put(currentId, newCompetition);
    };


}
