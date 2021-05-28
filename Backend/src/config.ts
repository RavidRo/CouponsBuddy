import dotenv from 'dotenv';

const result = dotenv.config();

if (result.error) {
	throw result.error;
}

const port = process.env.PORT;
if (!port) {
	throw new Error('environment missing PORT variable');
}

export default {
	PORT: parseInt(port),
};
