export function getPayload(tag) {
	const params = {
		headers: {
			'Content-Type': 'application/json'
		}, tags: tag
	};

	return { params };
}

export function postPayload(email, password, tag) {
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