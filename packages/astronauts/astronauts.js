const fetch = require("node-fetch");
const apiUrl = "http://localhost:3000";

const getAstronauts = () => {
  return fetch(`${apiUrl}/astronauts`).then(res => res.json());
}
const getAstronaut = (id) => {
  return fetch(`${apiUrl}/astronauts/${id}`).then(res => res.json());
}
const getAstronautByRef = (ref) => {
  return fetch(`${apiUrl}/astronauts/${ref.id}`).then(res => res.json());
}

exports.getAstronauts = getAstronauts
exports.getAstronaut = getAstronaut
exports.getAstronautByRef = getAstronautByRef

