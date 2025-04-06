# aws-s3

AWS S3 操作モジュール

## Example

```javascript
import {s3} from '@dependahub/aws-s3';

// 初期設定 - profile と region を指定できます。
s3.configure({
  profile: 'my-profile',
  region: 'ap-northeast-1',
});

// ファイル名一覧取得
const files = await s3.index({
  bucket: 'some-bucket',
  prefix: 'path/to/dir',
});

// ファイルの存在確認
const isExist = await s3.exists({
  bucket: 'some-bucket',
  key: 'filePath',
});

// ファイル内容の取得
const file = await s3.get({
  bucket: 'some-bucket',
  key: 'filePath',
});

// ファイルの保存
await s3.put({
  bucket: 'some-bucket',
  key: 'filePath',
  file: file,
  metadata: {
    key: 'value',
  }
});

// ファイルの削除
await s3.delete({
  bucket: 'some-bucket',
  key: 'filePath',
});

// ファイルのコピー
await s3.copy({
  fromBucket: 'some-bucket',
  fromKey: 'filePath',
  toBucket: 'some-bucket',
  toKey: 'some-bucket-copy',
});
```
