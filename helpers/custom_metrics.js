import { Counter, Rate } from 'k6/metrics';

export let httpNot200 = new Counter('http_not_200');
export let iterationSuccess = new Counter('iterations_success');
export let iterationFailed = new Counter('iterations_failed');
export let errorRate = new Rate('iterations_error_rate');