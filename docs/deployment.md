# Deployment

imghost is one Worker with three bindings: a D1 database (`DB`), an R2 bucket (`IMAGES`) and the Images transformations binding (`TRANSFORM`). There are three ways to deploy it.

## Deploy button

<p><a href="https://deploy.workers.cloudflare.com/?url=https://github.com/momardia54/imghost"><img src="https://deploy.workers.cloudflare.com/button" alt="Deploy to Cloudflare"></a></p>

The button copies the repository to your GitHub account, provisions the database and the bucket, asks for `ADMIN_USERNAME` and `ADMIN_PASSWORD`, and connects the Worker to your copy with Workers Builds: every push to its `main` branch deploys.

### The first build fails with "database not found"

`wrangler.jsonc` records the D1 database by its id. If the build fails with `D1 binding 'DB' references database '...' which was not found`, the id in your copy points to a database that does not exist in your account. Fix it once from a clone of your copy:

```bash
npm install
npx wrangler login
npm run deploy
```

`npm run deploy` runs `scripts/ensure-d1.mjs` first: it finds the `imghost-db` database by name, creates it if it is missing, and writes its id into `wrangler.jsonc`. Commit and push the updated `wrangler.jsonc`, and later builds use the right id.

## Command line

Requirements: Node.js 22 and a Cloudflare account.

```bash
git clone https://github.com/momardia54/imghost.git && cd imghost
npm install
npx wrangler login
npx wrangler r2 bucket create imghost-images
npm run deploy
```

`npm run deploy` resolves the database id (see above), builds the web app into `frontend-dist/`, and runs `wrangler deploy`. If your login has access to several accounts, set the account first:

```bash
export CLOUDFLARE_ACCOUNT_ID=<account-id>
```

Then add the credentials. For a Worker that already exists:

```bash
npx wrangler secret put ADMIN_USERNAME
npx wrangler secret put ADMIN_PASSWORD
```

`wrangler secret put` refuses to run before the Worker's first deploy. To set them in the same step as the first deploy:

```bash
printf 'ADMIN_USERNAME=me\nADMIN_PASSWORD=a-long-unique-password\n' > secrets.env
npx wrangler deploy --secrets-file secrets.env && rm secrets.env
```

## Dashboard, connected to a repository

1. *Workers & Pages*, *Create*, import your copy of the repository.
2. Build command: `npm run build`. Deploy command: `npx wrangler deploy`.
3. After the first deploy: your Worker, *Settings*, *Variables and Secrets*, add `ADMIN_USERNAME` and `ADMIN_PASSWORD` with the type *Secret*.

::: warning Build variables are not runtime secrets
Do not add the credentials under *Settings*, *Build*, *Variables and secrets*. Those exist only while the build runs; the Worker cannot read them, and the sign-in page keeps saying the instance is not configured.
:::

Builds started by a push always run the deploy command set in the dashboard. If the D1 database is ever recreated, either run `npm run deploy` locally once and push the updated `wrangler.jsonc`, or change the dashboard's deploy command to:

```bash
node scripts/ensure-d1.mjs && npx wrangler deploy
```

## Custom domain

*Workers & Pages*, your Worker, *Settings*, *Domains & Routes*, *Add*, *Custom domain*. The domain has to be on a zone in the same Cloudflare account. Image links use whichever address they were copied from, so set the domain up before sharing links you want to keep.

## After deploying

- Open the Worker's address and sign in.
- The database schema is created on the first request; there is nothing to migrate by hand.
- Check that resized variants work: open any image link with `?size=small` added. If the response is the original rather than a WebP, the `TRANSFORM` binding is missing; see [Image variants](/guide/variants#when-variants-are-not-generated).
