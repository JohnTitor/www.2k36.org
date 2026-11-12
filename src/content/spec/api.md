# RSS API

日本語の公開記事を [RSS フィード](/rss.xml)から取得できます。
認証やクエリパラメータは不要です。

```sh
curl --fail https://www.2k36.org/rss.xml
```

レスポンスは `application/xml` の RSS 2.0 形式で、記事を公開日の新しい順に返します。
各記事にはタイトル、URL、公開日、概要、HTML 形式の本文が含まれます。
フィードはサイトのビルドとデプロイに合わせて更新されます。

機械処理向けの定義は [OpenAPI 仕様](/api/openapi.json)にあります。
[API カタログ](/.well-known/api-catalog)には、フィードの URL と仕様、利用文書、稼働確認先へのリンクを掲載しています。

## 稼働確認

静的ファイルを取得できるか確認するには、[稼働確認エンドポイント](/api/status.json)を使用します。

```sh
curl --fail https://www.2k36.org/api/status.json
```

取得に成功すると HTTP 200 と次の JSON が返ります。

```json
{ "status": "ok" }
```

このレスポンスは静的な確認用ファイルです。
フィード自体の取得可否や記事の更新状況を監視する場合は、`/rss.xml` も取得して確認してください。

## コンテンツの利用方針

検索、AI 学習、AI 入力への利用方針は [robots.txt](/robots.txt) の `Content-Signal` を参照してください。
