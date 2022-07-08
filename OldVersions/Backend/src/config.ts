import dotenv from 'dotenv';

const result = dotenv.config();
if (result.error) {
	throw result.error;
}

// Shorter name
const vars = process.env;

// Firebase variables
const firebase = {
	type: vars.type,
	project_id: vars.project_id,
	private_key_id: vars.private_key_id,
	private_key: vars.private_key,
	client_email: vars.client_email,
	client_id: vars.client_id,
	auth_uri: vars.auth_uri,
	token_uri: vars.token_uri,
	auth_provider_x509_cert_url: vars.auth_provider_x509_cert_url,
	client_x509_cert_url: vars.client_x509_cert_url,
};

for (const key in firebase) {
	if (!vars[key]) {
		throw new Error(`environment missing ${key} variable`);
	}
}

const {
	type,
	project_id,
	private_key_id,
	private_key,
	client_email,
	client_id,
	auth_uri,
	token_uri,
	auth_provider_x509_cert_url,
	client_x509_cert_url,
} = vars;
if (
	!type ||
	!project_id ||
	!private_key_id ||
	!private_key ||
	!client_email ||
	!client_id ||
	!auth_uri ||
	!token_uri ||
	!auth_provider_x509_cert_url ||
	!client_x509_cert_url
) {
	throw new Error('environment missing a firebase variable');
}

if (process.env.PORT === undefined) {
	throw new Error('environment missing a port variable');
}
const port = +process.env.PORT;
if (isNaN(port) || Number.isInteger(port)) {
	throw new Error('port must be an integer');
}

// End result
export default {
	TESTING: process.env.NODE_ENV === 'test',
	PORT: port,
	FIREBASE: {
		type,
		project_id,
		private_key_id,
		private_key,
		client_email,
		client_id,
		auth_uri,
		token_uri,
		auth_provider_x509_cert_url,
		client_x509_cert_url,
	},
	FIREBASE_SERVICE: {
		clientEmail: client_email,
		privateKey: private_key,
		projectId: project_id,
	},
};
