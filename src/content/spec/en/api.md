# RSS API

Read published Japanese blog posts from the [RSS feed](/rss.xml).
No authentication or query parameters are required.

```sh
curl --fail https://www.2k36.org/rss.xml
```

The response is an RSS 2.0 document served as `application/xml`, with posts ordered by publication date, newest first.
Each post includes its title, URL, publication date, description, and HTML content.
The feed is updated when the site is built and deployed.

The [OpenAPI specification](/api/openapi.json) provides a machine-readable definition.
The [API catalog](/.well-known/api-catalog) lists the feed URL and links to its specification, documentation, and status endpoint.

## Availability check

Use the [status endpoint](/api/status.json) to check whether the static status file can be retrieved.

```sh
curl --fail https://www.2k36.org/api/status.json
```

A successful request returns HTTP 200 and this JSON body:

```json
{ "status": "ok" }
```

This response is a static availability marker.
To monitor feed availability or article updates, also fetch and inspect `/rss.xml`.

## Content usage preferences

See the `Content-Signal` directive in [robots.txt](/robots.txt) for preferences regarding search, AI training, and AI input.
