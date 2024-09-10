import RBTree "mo:base/RBTree";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Competition "types";

actor Main { 

    let tree = RBTree.RBTree<Text, Competition.Competition>(Text.compare);

    // public func getCompetitionsByUser(userPrincipalId : Text): async [Competition.Competition] {
    //     let competitionArray : [(Text, Competition.Competition)] = RBTree.toArray(tree);

    //     let filteredCompetitions = Array.filter(competitionArray, func(pair : (Text, Competition.Competition)) : Bool {
    //         let (_, competition) = pair;
    //         competition.principal_id == userPrincipalId
    //     });

    //     // Extract the competition values
    //     return Array.map(filteredCompetitions, func(pair : (Text, Competition.Competition)) : Competition.Competition {
    //         let (_, competition) = pair;
    //         competition
    //     });
    // }

}