# 2k36

This repo uses <https://github.com/saicaca/fuwari> as a template.

## Markdown responses

The build generates Markdown versions of HTML pages under `dist/markdown/`.
Vercel routes GET and HEAD requests with an explicit, nonzero `Accept: text/markdown` preference to these files at the original page URL.
Responses use `Content-Type: text/markdown; charset=utf-8` and `Vary: Accept`; browsers receive HTML by default.
Missing pages requested as Markdown use `public/markdown/404.md`, retaining HTTP 404 and including links to the API documentation and sitemap.

After deployment, check the negotiated response with:

```sh
curl -i -H 'Accept: text/markdown' https://www.2k36.org/
curl -sS -L -i -H 'Accept: text/markdown' https://www.2k36.org/some-path-that-does-not-exist
```

For the missing path, verify the final response has status `404`, `Content-Type: text/markdown; charset=utf-8`, and a Markdown body with at least 20 characters explaining the error and a working documentation or sitemap link.
Checking only the status does not verify the Markdown error response.

Astro's dev and preview servers do not apply Vercel routing rules.
After `pnpm build`, `pnpm preview` serves the generated files directly, such as `/markdown/index.md` and `/markdown/about/index.md`.
Token counts are not emitted because the build does not run a tokenizer.

## 📜 License

Licensed under the MIT License.
