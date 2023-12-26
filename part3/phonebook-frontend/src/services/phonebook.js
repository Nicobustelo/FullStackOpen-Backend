import axios from 'axios';

const baseURL = 'http://localhost:3001/api/persons';

const getAll = () => {
	return axios.get(baseURL).then(response => response.data);
};

const create = personToAdd => {
	return axios.post(baseURL, personToAdd).then(response => response.data);
};

const deletePerson = id => {
	return axios.delete(`${baseURL}/${id}`).then(response => response.data);
};

const update = (id, updatedPerson) => {
	return axios
		.put(`${baseURL}/${id}`, updatedPerson)
		.then(response => response.data);
};

export default { getAll, create, deletePerson, update };
