/* eslint-disable no-console */
import grpc from 'k6/net/grpc';
import { check, group } from 'k6';
import { Counter, Rate } from 'k6/metrics';
import { sleep } from 'k6';

/* Custom Metric */
export let grpcNotOk = new Counter('grpc_not_OK');
export let iterationSuccess = new Counter('iterations_success');
export let iterationFailed = new Counter('iterations_failed');
export let errorRate = new Rate('iterations_error_rate');
export let getData = new Counter('grpc_reqs_getData_failed');

/* Global Variable */
const baseUrl = 'localhost:50051';
const path = {
	main: 'TestService',
	sub: {
		getData: '/GetAllData'
	}
};
const metricTags = {
	getData: { grpc: path.sub.getData }
};
const grpcClient = new grpc.Client();
grpcClient.load([''], './support-files/for-grpc/server/testing.proto');

/* Test Configuration */
export const options = {
	// Concurrent
	scenarios: {
		testScenarioGet: {
			executor: 'constant-arrival-rate',
			rate: 10,
			timeUnit: '1s',
			duration: '10s',
			preAllocatedVUs: 1,
			maxVUs: 10,
			exec: 'groupGET'
		}
	},

	// Acceptance Criteria
	thresholds: {
		[`grpc_req_duration${JSON.stringify(metricTags.getData)}`]: ['max < 10000'],
		[`grpc_not_OK${JSON.stringify(metricTags.getData)}`]: ['count < 1'],
		'iterations_error_rate': [{
			threshold: 'rate<0.1',
			abortOnFail: true
		}]
	},

	// Trend Report Format
	summaryTrendStats: ['avg', 'p(95)', 'p(99)', 'max']
};

/* Payload */
function getDataRequest(tag) {
	const params = {
		metadata: {
			'content-type': 'application/grpc'
		}, tags: tag
	};

	const message = {};

	return { params, message };
}

/* Custom Function */
function grpcInvoke(path, message, params) {
	let response;
	for (let retries = 10; retries > 0; retries--) {
		response = grpcClient.invoke(path, message, params);
		if (response.status != grpc.StatusUnavailable) return response;
		sleep(1);
	}
	return response;
}

/* Test Scenario */
export function groupGET() {
	group('Load Test - GRPC Example', function () {
		// GRPC Connect
		grpcClient.connect(baseUrl, {
			plaintext: true,
			timeout: '60s'
		});

		// GRPC Request(1)
		const payload = getDataRequest(metricTags.getData);
		const response = grpcInvoke(`${path.main}${path.sub.getData}`, payload.message, payload.params) ;

		// Validate Response
		const checkRes = check(response, {
			[path.sub.getData]: response.status === grpc.StatusOK && response.message.datas.length > 1
		});

		if (!checkRes) {
			if (response.status != grpc.StatusOK) {
				grpcNotOk.add(1, metricTags.getData);
				console.error(`${path.sub.getData} | GRPC Status Code: ${JSON.stringify(response.status)}`);
			}
			iterationFailed.add(1);
			iterationSuccess.add(0);
			errorRate.add(true);
		} else {
			iterationSuccess.add(1);
			iterationFailed.add(0);
			errorRate.add(false);
		}
	});
}

export function teardown() {
	grpcClient.close();
}