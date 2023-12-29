import axios from 'axios';

const baseURL = 'http://localhost:3001/api/persons';

const getAll = () => {
	return axios.get(baseURL).then(response => response.data);
};

const create = personToAdd => {
	return axios
		.post(baseURL, personToAdd)
		.then(response => response.data)
		.catch(error => {
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				return Promise.reject(error.response.data);
			} else if (error.request) {
				// The request was made but no response was received
				return Promise.reject('No response received');
			} else {
				// Something happened in setting up the request that triggered an Error
				return Promise.reject('Error setting up the request');
			}
		});
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
