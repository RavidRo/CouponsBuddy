import dotenv from 'dotenv';
import settings from '../settings';

const result = dotenv.config();
if (result.error) {
	throw result.error;
}

// Shorter name
const vars = process.env;

const PORT = settings.port;

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

// End result
export default {
	PORT,
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
