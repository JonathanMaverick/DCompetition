import { useParams } from "react-router-dom";

function ContestDetail() {

     const { competitionID } = useParams();
     return ( 
          <div>{competitionID}</div>
     )
}

export default ContestDetail;