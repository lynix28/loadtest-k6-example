/* eslint-disable no-console */
import http from 'k6/http';
import { check, group } from 'k6';
import { httpNot200, iterationSuccess, iterationFailed, errorRate } from '../helpers/custom_metrics.js';
import { getPayload, postPayload } from '../helpers/payload.js';
import { baseURL, metricTags, path } from '../helpers/global_variable.js';
import { request } from '../data/request.js';

/* Test Scenario Configuration */
export const options = {
	// concurrent
	scenarios: {
		testScenarioGet: {
			executor: 'constant-arrival-rate',
			rate: 10,
			timeUnit: '1s',
			duration: '10s',
			preAllocatedVUs: 1,
			maxVUs: 10,
			exec: 'groupGET'
		},
		testScenarioPost: {
			executor: 'constant-arrival-rate',
			rate: 5,
			timeUnit: '1s',
			duration: '10s',
			preAllocatedVUs: 2,
			maxVUs: 5,
			exec: 'groupPOST'
		}
	},

	// acceptance criteria
	thresholds: {
		[`http_req_duration${JSON.stringify(metricTags.getUsers)}`]: ['max<10000'],
		[`http_req_duration${JSON.stringify(metricTags.login)}`]: ['max<10000'],
		'iterations_error_rate': [ { threshold: 'rate<0.1', abortOnFail: true } ]
	}
};

/* Test Scenario */
export function groupGET() {
	group('Load Test - Method GET Request', function () {
		// http-request(1)
		const data = getPayload(metricTags.getUsers);
		const response = http.get(`${baseURL}${path.getUsers}`, data.params);
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
		const data = postPayload(request.email, request.password, metricTags.login);
		const response = http.post(`${baseURL}${path.login}`, data.body, data.params);
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
			[path.login]: response.status === 201 && parsedResponse.token === 'QpwL5tke4Pnpja7X4'
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