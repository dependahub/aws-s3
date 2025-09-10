/**
 * S3クライアントのラッパークラスです。
 * - 複数リージョンをまたいで操作する場合は、複数のS3Clientを生成してください。
 */
export class S3Class {
    /**
     * S3Clientを再設定します。
     * @param {object} config
     * @param {string | undefined} [config.region]
     * @param {string | undefined} [config.profile] - AWS CLIのプロファイル名
     */
    configure(config?: {
        region?: string | undefined;
        profile?: string | undefined;
    }): void;
    /**
     * 新しいS3Classのインスタンスを生成します。
     * @param {object} config
     * @param {string | undefined} [config.region]
     * @param {string | undefined} [config.profile] - AWS CLIのプロファイル
     * @returns {S3Class}
     */
    createInstance(config?: {
        region?: string | undefined;
        profile?: string | undefined;
    }): S3Class;
    /**
     * 保管されているファイル名の一覧を取得します。
     * @param {object} options
     * @param {string} options.bucket
     * @param {string} options.prefix S3キーのの前方一致絞り込み
     * @param {number} options.limit 取得する最大数
     * @param {string} options.nextToken 続きの取得トークン
     * @returns {Promise<import('@aws-sdk/client-s3').ListObjectsV2CommandOutput>}
     */
    index({ bucket, prefix, limit, nextToken }: {
        bucket: string;
        prefix: string;
        limit: number;
        nextToken: string;
    }): Promise<import("@aws-sdk/client-s3").ListObjectsV2CommandOutput>;
    /**
     * 指定したファイルが存在するか確認します。
     * @param {object} input
     * @param {string} input.bucket
     * @param {string} input.key
     * @returns {Promise<boolean>}
     */
    exists({ bucket, key }: {
        bucket: string;
        key: string;
    }): Promise<boolean>;
    /**
     * 指定したファイルを取得します。
     * - 指定したファイルが無い場合は、nullを返します。
     * - ほとんどのファイルは文字列として取得できますが、zipファイルなどバイナリデータで取得しないと開けない場合は、```type: 'binary'```を指定してください。
     * @param {object} input
     * @param {string} input.bucket
     * @param {string} input.key
     * @param {'string' | 'binary'} [input.type='string'] 取得するデータ型（default=string）
     * @returns {Promise<null|string|Uint8Array>} ファイルの内容
     */
    get({ bucket, key, type }: {
        bucket: string;
        key: string;
        type?: "string" | "binary";
    }): Promise<null | string | Uint8Array>;
    /**
     * 指定したファイルを保存します。
     * @param {object} input
     * @param {string} input.bucket
     * @param {string} input.key
     * @param {Uint8Array|File} input.file
     * @param {Record<string, any>} input.metadata
     * @returns {Promise<import('@aws-sdk/client-s3').PutObjectOutput>}
     */
    put({ bucket, key, file, metadata }: {
        bucket: string;
        key: string;
        file: Uint8Array | File;
        metadata: Record<string, any>;
    }): Promise<import("@aws-sdk/client-s3").PutObjectOutput>;
    /**
     * 指定したファイルを削除します。
     * @param {object} input
     * @param {string} input.bucket
     * @param {string} input.key
     * @returns {Promise<import('@aws-sdk/client-s3').DeleteObjectOutput>}
     */
    delete({ bucket, key }: {
        bucket: string;
        key: string;
    }): Promise<import("@aws-sdk/client-s3").DeleteObjectOutput>;
    /**
     * 指定したファイルをコピーします。
     * @param {object} input
     * @param {string} input.fromBucket
     * @param {string} input.fromKey
     * @param {string} input.toBucket
     * @param {string} input.toKey
     * @returns {Promise<import('@aws-sdk/client-s3').CopyObjectOutput>}
     */
    copy({ fromBucket, fromKey, toBucket, toKey }: {
        fromBucket: string;
        fromKey: string;
        toBucket: string;
        toKey: string;
    }): Promise<import("@aws-sdk/client-s3").CopyObjectOutput>;
    #private;
}
/**
 * S3クライアントのインスタンスです。
 * - 複数リージョンをまたいで操作する場合は、S3Classから生成してください。
 */
export const s3: S3Class;
//# sourceMappingURL=index.d.ts.map