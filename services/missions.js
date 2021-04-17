const fetch = require("node-fetch");
const apiUrl = "http://localhost:3000";

const getMissionByAstronaut = async (astronaut) => {
  const res = await fetch(`${apiUrl}/missions`);
  const missions = await res.json();

  return missions.filter(({ crew }) =>
    crew.includes(parseInt(astronaut.id))
  );
}


const getCrew = (mission) => {
  return mission.crew.map(id => ({ __typename: "Astronaut", id }));
}

const getMissionById = (id) => {
  return fetch(`${apiUrl}/missions/${id}`).then(res => res.json());
}


const getMissions = () => {
  return fetch(`${apiUrl}/missions`).then(res => res.json());
}


exports.getMissions = getMissions
exports.getMissionById = getMissionById
exports.getCrew = getCrew
exports.getMissionByAstronaut = getMissionByAstronaut
