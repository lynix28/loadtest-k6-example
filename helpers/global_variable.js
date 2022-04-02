export const baseURL = 'https://reqres.in';
export const path = {
	getUsers: '/api/users?page=2',
	login: '/api/login'
};
export const metricTags = {
	getUsers: { api: path.getUsers },
	login: { api: path.login }
};