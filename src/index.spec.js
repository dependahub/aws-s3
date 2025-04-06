import test from 'ava';
import {s3} from './index.js';

const bucket = 'test-bucket';

s3.configure({
	profile: 'my-profile',
	region: 'us-west-2',
});

test('S3Class#put', async t => {
	const response = await s3.put({
		bucket,
		key: '__tests__/sample.txt',
		file: new File(['sample'], 'sample.txt'),
	});

	t.true(response.$metadata.httpStatusCode === 200);
});

test('S3Class#index', async t => {
	const response = await s3.index({
		bucket,
		prefix: '__tests__/',
		limit: 1,
	});
	t.log(response);
	t.true(response.KeyCount === 1);
});

test('S3Class#exists', async t => {
	const response = await s3.exists({
		bucket,
		key: '__tests__/sample.txt',
	});

	t.true(response);
});

test('S3Class#get', async t => {
	const response = await s3.get({
		bucket,
		key: '__tests__/sample.txt',
	});

	t.true(response === 'sample');
});
