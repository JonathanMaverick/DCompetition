import RBTree "mo:base/RBTree";
import Contest "types";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Float "mo:base/Float";
import UserActor "canister:DContest_backend_user";

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

    public func getReward(principal_id : Text, contest_id : Nat) : async Result<Null,Text>{
        var contest = tree.get(contest_id);
        switch (contest) {
            case (?ContestMotoko) {
                let feeFloat : Float = ContestMotoko.reward * 0.10;
                UserActor.addUserBalance(principal_id, ContestMotoko.reward - feeFloat);
                let updatedContest : Contest.Contest = {
                    contest_id = ContestMotoko.contest_id;
                    principal_id = ContestMotoko.principal_id;
                    name = ContestMotoko.name;
                    reward = ContestMotoko.reward;
                    desc = ContestMotoko.desc;
                    category = ContestMotoko.category;
                    startDate = ContestMotoko.startDate;
                    endDate = ContestMotoko.endDate;
                    votingEndDate = ContestMotoko.votingEndDate;
                    industry_name = ContestMotoko.industry_name;
                    additional_information = ContestMotoko.additional_information;
                    color = ContestMotoko.color;
                    file = ContestMotoko.file;
                    isReward = false;
                };
                tree.put(currentId, updatedContest);
                return #ok(null);
            };
            case (null) {
                return #err("Error Occured!")
            };
        };
    };

    public func getAllContest() : async [Contest.Contest] {
        var contests : [Contest.Contest] = [];

        for (entry in RBTree.iter(tree.share(), #bwd)) {
            contests := Array.append<Contest.Contest>(contests, [entry.1]);
        };

        return contests;
    };

    public func addContest(
        principal_id : Text,
        name : Text,
        reward : Float,
        desc : Text,
        category : Text,
        startDate : Time.Time,
        endDate : Time.Time,
        votingEndDate : Time.Time,
        industry_name : Text,
        additional_information : Text,
        color : [Text],
        file : [Blob],
    ) : async Result<Null, Text> {

        if (
            principal_id == "" or name == "" or desc == "" or category == "" or
            additional_information == "" or industry_name == ""
        ) {
            return #err("All Fields must been filled");
        };

        let now = Time.now();

        if (startDate < now) {
            return #err("Start date must be greater than or equal to the current date.");
        };

        if (endDate <= startDate) {
            return #err("End date must be greater than the start date.");
        };

        if (votingEndDate <= endDate) {
            return #err("Voting end date must be greater than the end date.");
        };

        if (Array.size(color) > 6) {
            return #err("Colors cannot be more than 6");
        };

        let result = await UserActor.reduceUserBalance(principal_id, reward);

        switch (result) {
            case (#ok(_)) {
                currentId := currentId + 1;
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
                    industry_name = industry_name;
                    additional_information = additional_information;
                    color = color;
                    file = file;
                    isReward = false;
                };
                tree.put(currentId, newContest);
            };
            case (#err(errorMessage)) {
                return #err(errorMessage);
            };
        };
        return #ok(null);
    };

    public func deleteContest(contest_id : Nat) : async () {
        tree.delete(contest_id);
    };

};
