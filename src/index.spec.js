import test from 'ava';
import {s3} from './index.js';

const bucket = 'dependahub-test-bucket';

test('put', async t => {
	const response = await s3.put({
		bucket,
		key: '__tests__/sample.txt',
		file: new File(['sample'], 'sample.txt'),
	});

	t.true(response.$metadata.httpStatusCode === 200);
});

test('index', async t => {
	const response = await s3.index({
		bucket,
		prefix: '__tests__/',
		limit: 1,
	});
	t.log(response);
	t.true(response.KeyCount === 1);
});

test('exists', async t => {
	const response = await s3.exists({
		bucket,
		key: '__tests__/sample.txt',
	});

	t.true(response);
});

test('get', async t => {
	const response = await s3.get({
		bucket,
		key: '__tests__/sample.txt',
	});

	t.true(response === 'sample');
});
