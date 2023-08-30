/* eslint-disable no-console */
import http from 'k6/http';
import { check, group } from 'k6';
import { Counter, Rate } from 'k6/metrics';

/* Custom Metric */
export let httpNot200 = new Counter('http_not_200');
export let iterationSuccess = new Counter('iterations_success');
export let iterationFailed = new Counter('iterations_failed');
export let errorRate = new Rate('iterations_error_rate');

/* Global Variable */
const baseUrl = 'https://reqres.in';
const path = {
	getUsers: '/api/users?page=2',
	login: '/api/login'
};
const metricTags = {
	getUsers: { api: path.getUsers },
	login: { api: path.login }
};
const requestData = {
	email: 'eve.holt@reqres.in',
	password: 'cityslicka'
};

/* Test Configuration */
export const options = {
	// Concurrent
	scenarios: {
		testScenarioGet: {
			executor: 'ramping-arrival-rate',
			stages: [
				{ target: 10, duration: '10s' },
				{ target: 20, duration: '10s' },
				{ target: 30, duration: '10s' },
				{ target: 10, duration: '10s' }
			],
			startRate: 1,
			timeUnit: '1s',
			preAllocatedVUs: 1,
			maxVUs: 30,
			exec: 'groupGET'
		},
		testScenarioPost: {
			executor: 'ramping-arrival-rate',
			stages: [
				{ target: 10, duration: '5s' },
				{ target: 20, duration: '5s' },
				{ target: 30, duration: '5s' },
				{ target: 10, duration: '5s' }
			],
			startRate: 1,
			timeUnit: '1s',
			preAllocatedVUs: 1,
			maxVUs: 30,
			exec: 'groupPOST'
		}
	},

	// Acceptance Criteria
	thresholds: {
		[`http_req_duration${JSON.stringify(metricTags.getUsers)}`]: ['max<10000'],
		[`http_req_duration${JSON.stringify(metricTags.login)}`]: ['max<10000'],
		'iterations_error_rate': [{
			threshold: 'rate<0.1',
			abortOnFail: true
		}]
	},

	// Trend Report Format
	summaryTrendStats: ['avg', 'p(95)', 'p(99)', 'max']
};

/* Payload */
function getPayload(tag) {
	const params = {
		headers: {
			'Content-Type': 'application/json'
		}, tags: tag
	};

	return { params };
}

function postPayload(email, password, tag) {
	const params = {
		headers: {
			'Content-Type': 'application/json'
		}, tags: tag
	};

	const body = JSON.stringify({
		'email': email,
		'password': password
	});

	return { params, body };
}

/* Test Scenario */
export function groupGET() {
	group('Load Test - Method GET Request', function () {
		// http-request(1)
		const data = getPayload(metricTags.getUsers);
		const response = http.get(`${baseUrl}${path.getUsers}`, data.params);
		let parsedResponse;

		try {
			parsedResponse = JSON.parse(response.body);
		} catch (e) {
			if (parsedResponse == undefined) parsedResponse = { page: '' };
			console.error(`${path.getUsers} | Response is not a JSON`);
			console.error(JSON.stringify(response.body));
		}

		// validate-response
		const checkResponse = check(response, {
			[path.getUsers]: response.status === 200 && parsedResponse.page === 2
		});

		if (!checkResponse) {
			if (response.status != 200) {
				httpNot200.add(1, metricTags.getUsers);
				console.error((`${path.getUsers} | HTTP Response: ${response.status}`));
			}
			iterationFailed.add(1);
			errorRate.add(true);
			console.error(`${path.getUsers} | ${JSON.stringify(parsedResponse)}`);
		} else {
			iterationSuccess.add(1);
			errorRate.add(false);
		}
	});
}

export function groupPOST() {
	group('Load Test - Method POST Request', function () {
		// http-request(1)
		const data = postPayload(requestData.email, requestData.password, metricTags.login);
		const response = http.post(`${baseUrl}${path.login}`, data.body, data.params);
		let parsedResponse;

		try {
			parsedResponse = JSON.parse(response.body);
		} catch (e) {
			if (parsedResponse == undefined) parsedResponse = { token: '' };
			console.error(`${path.login} | Response is not a JSON`);
			console.error(JSON.stringify(response.body));
		}

		// validate-response
		const checkResponse = check(response, {
			[path.login]: response.status === 200 && parsedResponse.token === 'QpwL5tke4Pnpja7X4'
		});

		if (!checkResponse) {
			if (response.status != 200) {
				httpNot200.add(1, metricTags.login);
				console.error((`${path.login} | HTTP Response: ${response.status}`));
			}
			iterationFailed.add(1);
			errorRate.add(true);
			console.error(`${path.login} | ${JSON.stringify(parsedResponse)}`);
		} else {
			iterationSuccess.add(1);
			errorRate.add(false);
		}
	});
}