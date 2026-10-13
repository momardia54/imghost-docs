# Upgrading

## Versions

imghost follows semantic versioning. A patch version (1.0.x) fixes bugs. A minor version (1.x.0) adds features without breaking the HTTP API or existing links. A major version would be the only place for breaking changes, each listed in the [changelog](/project/changelog) with what to do.

Your installation's version is shown next to the logo in the sidebar and on the sign-in page.

## Before you upgrade

1. Read the [changelog](/project/changelog) entries between your version and the new one.
2. Export the database:

   ```bash
   npx wrangler d1 export imghost-db --remote --output imghost-backup.sql
   ```

   D1's Time Travel can also restore the database to any minute of the last 7 days (30 on the paid plan). Images in R2 are not touched by upgrades.

## Upgrading an installation made with the Deploy button

Releases are tagged `vX.Y.Z` in the imghost repository. The button copied imghost to a repository in your GitHub account, and Workers Builds deploys every push to it. Bring in the new version, then push:

```bash
git clone https://github.com/<you>/<your-copy>.git && cd <your-copy>
git remote add upstream https://github.com/momardia54/imghost.git
git fetch upstream --tags
git merge v1.0.1          # the version you upgrade to
git push
```

If the merge reports a conflict in `wrangler.jsonc`, keep your own `database_id`.

## Upgrading an installation made from the command line

```bash
git fetch --tags
git checkout v1.0.1
npm install
npm run deploy
```

## After the upgrade

- Schema changes are applied by the Worker on the first request.
- Reload the web app in your browser (Cmd+Shift+R or Ctrl+Shift+R) so it does not keep scripts from the previous version.
- Image links, API keys and sessions stay as they were.
