import { Storage } from '@google-cloud/storage';
import { env } from '$env/dynamic/private';

let client: Storage;

if (env.GCS_CREDENTIALS) {
	const credentials = JSON.parse(env.GCS_CREDENTIALS);
	client = new Storage({ credentials });
} else {
	client = new Storage();
}

export default client;
