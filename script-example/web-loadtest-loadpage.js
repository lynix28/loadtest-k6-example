/* eslint-disable no-console */
import { check, group } from 'k6';
import http from 'k6/http';
import { Counter, Rate } from 'k6/metrics';
import exec from 'k6/execution';

/* Custom Metric */
export let httpNot200 = new Counter('http_not_200');
export let iterationSuccess = new Counter('iterations_success');
export let iterationFailed = new Counter('iterations_failed');
export let errorRate = new Rate('iterations_error_rate');

/* Test Configuration */
export const options = {
	discardResponseBodies: true,

	// Concurrent
	scenarios: {
		webFrontEndLoadtest: {
			executor: 'shared-iterations',
			vus: 5,
			iterations: 10,
			maxDuration: '2m',
		}
	},

	// Acceptance Criteria
	thresholds: {
		'iterations_error_rate': [{
			threshold: 'rate<0.1',
			abortOnFail: true
		}]
	},

	// Trend Report Format
	summaryTrendStats: ['avg', 'p(95)', 'p(99)', 'max']
};

/* Custom Function */
function sendRequest(url, header) {
	const response = http.get(url, header);

	const checkResponse = check(response, {
		'http_200_ok': response.status === 200
	});

	if (!checkResponse) {
		httpNot200.add(1);
		iterationFailed.add(1);
		errorRate.add(true);
		console.error(`Iteration: ${exec.vu.iterationInScenario} - VU: ${exec.vu.idInTest} | ${JSON.stringify(response.request.url)} | HTTP Status: ${JSON.stringify(response.status_text)}`);
	} else {
		iterationSuccess.add(1);
		errorRate.add(false);
	}

	if (response.timings.duration > 5000) console.error(`Iteration: ${exec.vu.iterationInScenario} - VU: ${exec.vu.idInTest} | ${JSON.stringify(response.request.url)} | Load time: ${response.timings.duration} ms`);
}

export default function main() {

	group('Load page: www.linkaja.id', function () {
		sendRequest('https://www.linkaja.id/', {
			headers: {
				accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				cookie:
          '_ga=GA1.1.786804883.1693394980; _tt_enable_cookie=1; _ttp=pp651K9XQGWgOdb73326iq1jiZv; _ga_S2E17XFJ8M=GS1.1.1693394979.1.1.1693395052.0.0.0; _ga_GHZ926QB6E=GS1.1.1693394979.1.1.1693395052.59.0.0',
				dnt: '1',
				pragma: 'no-cache',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'document',
				'sec-fetch-mode': 'navigate',
				'sec-fetch-site': 'same-origin',
				'sec-fetch-user': '?1',
				'upgrade-insecure-requests': '1',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest('https://apis.google.com/js/client:platform.js?onload=start', {
			headers: {
				accept: '*/*',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				dnt: '1',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'script',
				'sec-fetch-mode': 'no-cors',
				'sec-fetch-site': 'cross-site',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest('https://livechat.linkaja.id/livechat.js', {
			headers: {
				Accept: '*/*',
				'Accept-Encoding': 'gzip, deflate, br',
				'Accept-Language': 'en-US,en;q=0.9',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive',
				Cookie:
          '_ga=GA1.1.786804883.1693394980; _tt_enable_cookie=1; _ttp=pp651K9XQGWgOdb73326iq1jiZv; _ga_S2E17XFJ8M=GS1.1.1693394979.1.1.1693395118.0.0.0; _ga_GHZ926QB6E=GS1.1.1693394979.1.1.1693395118.60.0.0',
				DNT: '1',
				Host: 'livechat.linkaja.id',
				Pragma: 'no-cache',
				Referer: 'https://www.linkaja.id/',
				'Sec-Fetch-Dest': 'script',
				'Sec-Fetch-Mode': 'no-cors',
				'Sec-Fetch-Site': 'same-site',
				'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
			},
		});

		sendRequest('https://cdn.linkaja.com/website/asset/linkaja.png', {
			headers: {
				accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				dnt: '1',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'image',
				'sec-fetch-mode': 'no-cors',
				'sec-fetch-site': 'cross-site',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest('https://www.linkaja.id/icon/download_playstore.png', {
			headers: {
				accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				cookie:
          '_ga=GA1.1.786804883.1693394980; _tt_enable_cookie=1; _ttp=pp651K9XQGWgOdb73326iq1jiZv; _ga_S2E17XFJ8M=GS1.1.1693394979.1.1.1693395118.0.0.0; _ga_GHZ926QB6E=GS1.1.1693394979.1.1.1693395118.60.0.0',
				dnt: '1',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'image',
				'sec-fetch-mode': 'no-cors',
				'sec-fetch-site': 'same-origin',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest('https://www.linkaja.id/icon/download_appstore.png', {
			headers: {
				accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				cookie:
          '_ga=GA1.1.786804883.1693394980; _tt_enable_cookie=1; _ttp=pp651K9XQGWgOdb73326iq1jiZv; _ga_S2E17XFJ8M=GS1.1.1693394979.1.1.1693395118.0.0.0; _ga_GHZ926QB6E=GS1.1.1693394979.1.1.1693395118.60.0.0',
				dnt: '1',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'image',
				'sec-fetch-mode': 'no-cors',
				'sec-fetch-site': 'same-origin',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest('https://cdn.linkaja.com/website/asset/footer_playstore.png', {
			headers: {
				accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				dnt: '1',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'image',
				'sec-fetch-mode': 'no-cors',
				'sec-fetch-site': 'cross-site',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest('https://cdn.linkaja.com/website/asset/footer_appstore.png', {
			headers: {
				accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				dnt: '1',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'image',
				'sec-fetch-mode': 'no-cors',
				'sec-fetch-site': 'cross-site',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest('https://cdn.linkaja.com/website/asset/socmed_twitter.png', {
			headers: {
				accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				dnt: '1',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'image',
				'sec-fetch-mode': 'no-cors',
				'sec-fetch-site': 'cross-site',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest('https://cdn.linkaja.com/website/asset/socmed_youtube.png', {
			headers: {
				accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				dnt: '1',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'image',
				'sec-fetch-mode': 'no-cors',
				'sec-fetch-site': 'cross-site',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest('https://cdn.linkaja.com/website/asset/socmed_instagram.png', {
			headers: {
				accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				dnt: '1',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'image',
				'sec-fetch-mode': 'no-cors',
				'sec-fetch-site': 'cross-site',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest('https://cdn.linkaja.com/website/asset/socmed_facebook.png', {
			headers: {
				accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				dnt: '1',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'image',
				'sec-fetch-mode': 'no-cors',
				'sec-fetch-site': 'cross-site',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest('https://cdn.linkaja.com/website/asset/socmed_linkedin.png', {
			headers: {
				accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				dnt: '1',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'image',
				'sec-fetch-mode': 'no-cors',
				'sec-fetch-site': 'cross-site',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest(
			'https://www.linkaja.id/_next/static/d2HUs89eqrYYqg4dwQqdG/_buildManifest.js',
			{
				headers: {
					accept: '*/*',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					cookie:
            '_ga=GA1.1.786804883.1693394980; _tt_enable_cookie=1; _ttp=pp651K9XQGWgOdb73326iq1jiZv; _ga_S2E17XFJ8M=GS1.1.1693394979.1.1.1693395118.0.0.0; _ga_GHZ926QB6E=GS1.1.1693394979.1.1.1693395118.60.0.0',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'script',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'same-origin',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest('https://www.googletagmanager.com/gtm.js?id=GTM-MRWH3RP', {
			headers: {
				accept: '*/*',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				dnt: '1',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'script',
				'sec-fetch-mode': 'no-cors',
				'sec-fetch-site': 'cross-site',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest(
			'https://crm.linkaja.id/svc/livechat/client?id=ee9ceabd-b92c-4f3a-94fd-15d46923f66c&isFull=false',
			{
				headers: {
					Accept: '*/*',
					'Accept-Encoding': 'gzip, deflate, br',
					'Accept-Language': 'en-US,en;q=0.9',
					'Cache-Control': 'no-cache',
					Connection: 'keep-alive',
					DNT: '1',
					Host: 'crm.linkaja.id',
					Origin: 'https://www.linkaja.id',
					Pragma: 'no-cache',
					Referer: 'https://www.linkaja.id/',
					'Sec-Fetch-Dest': 'empty',
					'Sec-Fetch-Mode': 'cors',
					'Sec-Fetch-Site': 'same-site',
					'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
				},
			}
		);

		sendRequest(
			'https://cdn.linkaja.com/website/components/July2021/1625713001PaB-01.png',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest('https://cdn.linkaja.com/website/asset/Assets_Image_Footer.png', {
			headers: {
				accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				dnt: '1',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'image',
				'sec-fetch-mode': 'no-cors',
				'sec-fetch-site': 'cross-site',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest('https://www.linkaja.id/font/Mulish-ExtraBold.ttf', {
			headers: {
				accept: '*/*',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				cookie:
          '_ga=GA1.1.786804883.1693394980; _tt_enable_cookie=1; _ttp=pp651K9XQGWgOdb73326iq1jiZv; _ga_S2E17XFJ8M=GS1.1.1693394979.1.1.1693395118.0.0.0; _ga_GHZ926QB6E=GS1.1.1693394979.1.1.1693395118.60.0.0',
				dnt: '1',
				origin: 'https://www.linkaja.id',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/_next/static/css/3face4c301b211950c4c.css',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'font',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest('https://www.linkaja.id/font/Mulish-Bold.ttf', {
			headers: {
				accept: '*/*',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				cookie:
          '_ga=GA1.1.786804883.1693394980; _tt_enable_cookie=1; _ttp=pp651K9XQGWgOdb73326iq1jiZv; _ga_S2E17XFJ8M=GS1.1.1693394979.1.1.1693395118.0.0.0; _ga_GHZ926QB6E=GS1.1.1693394979.1.1.1693395118.60.0.0',
				dnt: '1',
				origin: 'https://www.linkaja.id',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/_next/static/css/3face4c301b211950c4c.css',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'font',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest('https://www.linkaja.id/font/Mulish-Regular.ttf', {
			headers: {
				accept: '*/*',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				cookie:
          '_ga=GA1.1.786804883.1693394980; _tt_enable_cookie=1; _ttp=pp651K9XQGWgOdb73326iq1jiZv; _ga_S2E17XFJ8M=GS1.1.1693394979.1.1.1693395118.0.0.0; _ga_GHZ926QB6E=GS1.1.1693394979.1.1.1693395118.60.0.0',
				dnt: '1',
				origin: 'https://www.linkaja.id',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/_next/static/css/3face4c301b211950c4c.css',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'font',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest(
			'https://apis.google.com/_/scs/abc-static/_/js/k=gapi.lb.en.IoxrLNdlTyI.O/m=client/rt=j/sv=1/d=1/ed=1/rs=AHpOoo9N48n3oloz8UTxoCozKcpUKaADkg/cb=gapi.loaded_0?le=scs',
			{
				headers: {
					accept: '*/*',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'script',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest('https://connect.facebook.net/en_US/fbevents.js', {
			headers: {
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				Referer: 'https://www.linkaja.id/',
				DNT: '1',
				'sec-ch-ua-mobile': '?0',
				'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				'sec-ch-ua-platform': '"macOS"',
			},
		});

		sendRequest(
			'https://www.googletagmanager.com/gtag/js?id=G-S2E17XFJ8M&l=dataLayer&cx=c',
			{
				headers: {
					accept: '*/*',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'script',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://fonts.googleapis.com/css2?family=Mulish:wght@400;700&display=swap',
			{
				headers: {
					accept: 'text/css,*/*;q=0.1',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'style',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest('https://fonts.gstatic.com/s/mulish/v12/1Ptvg83HX_SGhgqk3wotYKNnBQ.woff2', {
			headers: {
				accept: '*/*',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				dnt: '1',
				origin: 'https://www.linkaja.id',
				pragma: 'no-cache',
				referer: 'https://fonts.googleapis.com/',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'font',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'cross-site',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest('https://api-web.linkaja.com/api/settings', {
			headers: {
				accept: 'application/json',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				dnt: '1',
				origin: 'https://www.linkaja.id',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'cross-site',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest('https://api-web.linkaja.com/api/pages', {
			headers: {
				accept: 'application/json',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				dnt: '1',
				origin: 'https://www.linkaja.id',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'cross-site',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest('https://api-web.linkaja.com/api/headers', {
			headers: {
				accept: 'application/json',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				dnt: '1',
				origin: 'https://www.linkaja.id',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'cross-site',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest(
			'https://api-web.linkaja.com/api/component/f5454f5c-6120-46a2-8e75-3c3088e6a582',
			{
				headers: {
					accept: 'application/json',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					origin: 'https://www.linkaja.id',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://api-web.linkaja.com/api/component/cb67d2e2-92f3-4c00-8f19-f7a18fb3c0ee',
			{
				headers: {
					accept: 'application/json',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					origin: 'https://www.linkaja.id',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://api-web.linkaja.com/api/component/305d07c1-3cb3-4b72-9daf-6a4b821e0593',
			{
				headers: {
					accept: 'application/json',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					origin: 'https://www.linkaja.id',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://api-web.linkaja.com/api/component/bb849859-13db-4e0d-a521-1141d57f1212',
			{
				headers: {
					accept: 'application/json',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					origin: 'https://www.linkaja.id',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://api-web.linkaja.com/api/component/80c7b16d-26b5-49ec-a748-cb9c93bd41d1',
			{
				headers: {
					accept: 'application/json',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					origin: 'https://www.linkaja.id',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://api-web.linkaja.com/api/component/0cc56da6-8a40-4a96-8d03-25c1fd5aa02d',
			{
				headers: {
					accept: 'application/json',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					origin: 'https://www.linkaja.id',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://api-web.linkaja.com/api/component/6d9c165f-5432-4cf9-96c7-f8519c8d5aff',
			{
				headers: {
					accept: 'application/json',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					origin: 'https://www.linkaja.id',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest('https://api-web.linkaja.com/api/footers', {
			headers: {
				accept: 'application/json',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				dnt: '1',
				origin: 'https://www.linkaja.id',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'cross-site',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest('https://api-web.linkaja.com/api/footer/items', {
			headers: {
				accept: 'application/json',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'no-cache',
				dnt: '1',
				origin: 'https://www.linkaja.id',
				pragma: 'no-cache',
				referer: 'https://www.linkaja.id/',
				'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'cross-site',
				'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
			},
		});

		sendRequest(
			'https://cdn.linkaja.com/website/component_items/February2022/1645079693-Dekstop%201440x600%20(2).jpg',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://cdn.linkaja.com/website/component_items/February2022/1645419032-Halaman%20Utama%20-%20Desktop%20(1).jpg',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://cdn.linkaja.com/website/component_items/July2021/1625713002JwI-01.png',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://cdn.linkaja.com/website/component_items/July2021/1625713002NPV-02.png',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://cdn.linkaja.com/website/component_items/July2021/1625713002FD2-03.png',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://cdn.linkaja.com/website/component_items/July2021/162571300280a-01.png',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://cdn.linkaja.com/website/component_items/July2021/1625713002vas-02.png',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://cdn.linkaja.com/website/component_items/July2021/1625713002FDO-03.png',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://cdn.linkaja.com/website/component_items/July2021/16257130024qx-playstore.png',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://cdn.linkaja.com/website/component_items/July2021/1625713002KLz-appstore.png',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://cdn.linkaja.com/website/component_items/January2023/1672630866-Section%201%20Desktop%201440x600%20px.jpg',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://cdn.linkaja.com/website/component_items/July2021/1625713002aWi-alfamart.png',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://cdn.linkaja.com/website/component_items/July2021/1625713002EE8-kfc.png',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://cdn.linkaja.com/website/component_items/July2021/1625713002irg-indomart.png',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://cdn.linkaja.com/website/component_items/July2021/16257130022VK-kimia.png',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://cdn.linkaja.com/website/component_items/July2021/1625713002GGS-mcd.png',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://cdn.linkaja.com/website/component_items/July2021/16257130023cM-pertamina.png',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://cdn.linkaja.com/website/component_items/July2021/16257130021Dv-my.png',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);

		sendRequest(
			'https://cdn.linkaja.com/website/component_items/July2021/1625713002nfS-pln.png',
			{
				headers: {
					accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
					'accept-encoding': 'gzip, deflate, br',
					'accept-language': 'en-US,en;q=0.9',
					'cache-control': 'no-cache',
					dnt: '1',
					pragma: 'no-cache',
					referer: 'https://www.linkaja.id/',
					'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'image',
					'sec-fetch-mode': 'no-cors',
					'sec-fetch-site': 'cross-site',
					'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.58',
				},
			}
		);
	});
}
