import React, { useState } from 'react';
import { DContest_backend_contestant } from "declarations/DContest_backend_contestant";

function Contestant() {
  const [contestantData, setContestantData] = useState({
    principal_id: '',
    competition_id: '',
    photo_url: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContestantData({
      ...contestantData,
      [name]: value,
    });
  };

  const handleFileChange = async(e) => {
    const file = e.target.files[0];
    const picture = new Uint8Array(await file.arrayBuffer())

    if (picture) {
      setContestantData({
        ...contestantData,
        photo_url: picture,
      });
    }

   


  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contestant Data:', contestantData);
    DContest_backend_contestant.addContestant(contestantData.principal_id,Number(contestantData.competition_id),contestantData.photo_url)

    console.log("success")

  };

  return (
    <div>
      <h2>Contestant Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Principal ID (Text): </label>
          <input
            type="text"
            name="principal_id"
            value={contestantData.principal_id}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Competition ID (Nat): </label>
          <input
            type="number"
            name="competition_id"
            value={contestantData.competition_id}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Photo (Blob): </label>
          <input type="file" onChange={handleFileChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Contestant;
