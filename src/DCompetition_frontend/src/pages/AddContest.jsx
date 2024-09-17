import React, { useEffect, useState } from 'react';
import { useUserAuth } from '../context/UserContext';
import { DCompetition_backend_competition } from "declarations/DCompetition_backend_competition";

function AddContest() {

  const { getPrincipal } = useUserAuth();
  const [id, setID] = useState();

  const [contestData, setContestData] = useState({
    name: '',
    desc: '',
    category: '',
    reward: '',
    startDate: '',
    endDate: '',
    status: ''
  });

  const handleChange = (e) => {
    console.log(e.target.value)
    setContestData({
      ...contestData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    const fetchPrincipal = async () => {
      const principal = await getPrincipal();
      setID(principal);
    };

    fetchPrincipal();
  }, [getPrincipal]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Convert startDate and endDate to Unix timestamps in nanoseconds
  const startDateNanoseconds = new Date(contestData.startDate).getTime() * 1_000_000;
  const endDateNanoseconds = new Date(contestData.endDate).getTime() * 1_000_000;

  await DCompetition_backend_competition.addCompetition(
    id,
    contestData.name,
    Number(contestData.reward),
    contestData.desc,
    contestData.category,
    startDateNanoseconds,
    endDateNanoseconds,
    contestData.status
  );

  console.log(contestData);
};


  return (
    <div>
      <h1>{id}</h1>
      <h2>Add Contest</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={contestData.name} onChange={handleChange} />
        </div>
        <div>
          <label>Description:</label>
          <input type="text" name="desc" value={contestData.desc} onChange={handleChange} />
        </div>
        <div>
          <label>Category:</label>
          <input type="text" name="category" value={contestData.category} onChange={handleChange} />
        </div>
        <div>
          <label>Reward:</label>
          <input type="number" name="reward" value={contestData.reward} onChange={handleChange} />
        </div>
        <div>
          <label>Start Date:</label>
          <input type="datetime-local" name="startDate" value={contestData.startDate} onChange={handleChange} />
        </div>
        <div>
          <label>End Date:</label>
          <input type="datetime-local" name="endDate" value={contestData.endDate} onChange={handleChange} />
        </div>
        <div>
          <label>Status:</label>
          <input type="text" name="status" value={contestData.status} onChange={handleChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddContest;
