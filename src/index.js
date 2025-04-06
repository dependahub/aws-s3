import {
	S3Client,
	ListObjectsV2Command,
	GetObjectCommand,
	PutObjectCommand,
	CopyObjectCommand,
	DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import {fromIni} from '@aws-sdk/credential-providers';

/**
 * S3クライアントのラッパークラスです。
 * - 複数リージョンをまたいで操作する場合は、複数のS3Clientを生成してください。
 */
export class S3Class {
	#client = new S3Client();

	/**
	 * S3Clientを再設定します。
	 * @param {object} config
	 * @param {string} config.region
	 * @param {string} [config.profile='default'] - AWS CLIのプロファイル名
	 */
	configure(config = {}) {
		const {region, profile = 'default'} = config;
		this.#client = new S3Client({
			region,
			credentials: fromIni({profile}),
		});
	}

	/**
	 * 保管されているファイル名の一覧を取得します。
	 * @param {object} options
	 * @param {string} options.bucket
	 * @param {string} options.prefix S3キーのの前方一致絞り込み
	 * @param {number} options.limit 取得する最大数
	 * @param {string} options.nextToken 続きの取得トークン
	 * @returns {Promise<import('@aws-sdk/client-s3').ListObjectsV2CommandOutput>}
	 */
	async index({bucket, prefix = '', limit = 100, nextToken = ''}) {
		if (!bucket) {
			throw new Error('bucket is required');
		}

		const response = await this.#client.send(new ListObjectsV2Command({
			Bucket: bucket,
			Prefix: prefix,
			MaxKeys: limit,
			ContinuationToken: nextToken || undefined,
		}));

		return response;
	}

	/**
	 * 指定したファイルが存在するか確認します。
	 * @param {object} input
	 * @param {string} input.bucket
	 * @param {string} input.key
	 * @returns {Promise<boolean>}
	 */
	async exists({bucket, key}) {
		if (!bucket) {
			throw new Error('bucket is required');
		}

		if (!key) {
			throw new Error('key is required');
		}

		const response = await this.index({
			bucket,
			prefix: key,
			limit: 1,
		});

		return response.KeyCount > 0;
	}

	/**
	 * 指定したファイルを取得します。
	 * @param {object} input
	 * @param {string} input.bucket
	 * @param {string} input.key
	 * @returns {Promise<import('@aws-sdk/client-s3').GetObjectCommandOutput>}
	 */
	async get({bucket, key}) {
		if (!bucket) {
			throw new Error('bucket is required');
		}

		if (!key) {
			throw new Error('key is required');
		}

		const response = await this.#client.send(new GetObjectCommand({
			Bucket: bucket,
			Key: key,
		}));

		const string = await response.Body?.transformToString();

		return string;
	}

	/**
	 * 指定したファイルを保存します。
	 * @param {object} input
	 * @param {string} input.bucket
	 * @param {string} input.key
	 * @param {File} input.file
	 * @param {Record<string, any>} input.metadata
	 * @returns {Promise<import('@aws-sdk/client-s3').PutObjectOutput>}
	 */
	async put({bucket, key, file, metadata = {}}) {
		if (!bucket) {
			throw new Error('bucket is required');
		}

		if (!key) {
			throw new Error('key is required');
		}

		if (!file) {
			throw new Error('file is required');
		}

		const response = await this.#client.send(new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: await file.arrayBuffer(),
			Metadata: metadata,
		}));

		return response;
	}

	/**
	 * 指定したファイルを削除します。
	 * @param {object} input
	 * @param {string} input.bucket
	 * @param {string} input.key
	 * @returns {Promise<import('@aws-sdk/client-s3').DeleteObjectOutput>}
	 */
	async delete({bucket, key}) {
		if (!bucket) {
			throw new Error('bucket is required');
		}

		if (!key) {
			throw new Error('key is required');
		}

		const response = await this.#client.send(new DeleteObjectCommand({
			Bucket: bucket,
			Key: key,
		}));

		return response;
	}

	/**
	 * 指定したファイルをコピーします。
	 * @param {object} input
	 * @param {string} input.fromBucket
	 * @param {string} input.fromKey
	 * @param {string} input.toBucket
	 * @param {string} input.toKey
	 * @returns {Promise<import('@aws-sdk/client-s3').CopyObjectOutput>}
	 */
	async copy({fromBucket, fromKey, toBucket, toKey}) {
		if (!fromBucket) {
			throw new Error('fromBucket is required');
		}

		if (!fromKey) {
			throw new Error('fromKey is required');
		}

		if (!toBucket) {
			throw new Error('toBucket is required');
		}

		if (!toKey) {
			throw new Error('toKey is required');
		}

		const response = await this.#client.send(new CopyObjectCommand({
			CopySource: `${fromBucket}/${fromKey}`,
			Bucket: toBucket,
			Key: toKey,
		}));

		return response;
	}
}

/**
 * S3クライアントのインスタンスです。
 * - 複数リージョンをまたいで操作する場合は、S3Classから生成してください。
 */
export const s3 = new S3Class();
export default s3;
