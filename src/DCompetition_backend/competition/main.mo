import RBTree "mo:base/RBTree";
import Competition "types";
import Text "mo:base/Text";
import Array "mo:base/Array";

actor Main { 

    let tree = RBTree.RBTree<Text, Competition.Competition>(Text.compare);

    public func getPrincipalCompetition(principal_id : Text) : async [Competition.Competition] {
        var competitions : [Competition.Competition] = [];

        for (entry in RBTree.iter(tree.share(), #bwd)) {
            if(Text.equal(entry.1.principal_id, principal_id)){
                competitions := Array.append<Competition.Competition>(competitions, [entry.1]);
            }
        };

        return competitions;
    };

    public func getAllCompetition() : async [Competition.Competition] {
        var competitions : [Competition.Competition] = [];
        
        for (entry in RBTree.iter(tree.share(), #bwd)) {
            competitions := Array.append<Competition.Competition>(competitions, [entry.1])
        };

        return competitions;
    }


}
