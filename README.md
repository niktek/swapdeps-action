When you want to have detached repositories co-located in a monorepo like the following:

- monorepo/packages/mysharedlib   <- part of monorepo
- monorepo/sites/docsite          <- part of monorepo
- monorepo/sites/privatesite      <- from separate repo

When co-located as above, the package.json dependencies in privatesite will have a reference such as `"mysharedlib":"workspace:*"` which will resolve.  However, when privatesite is checked out in a non co-located situation such as a CI/CD or just external development, this reference will fail to resolve.

To make this resolvable, we take a similar approach to the publishConfig directive https://pnpm.io/package_json#publishconfig and declare the versions for `dependencies|devDependencies|peerDependencies` in a deployConfig block and this action will swap the workspace:* references with the explicit versions.

This `package.json` shows the state when co-located in a monorepo file structure. This action copies the explicit versions over the workspace:* references so that a subsequent `pnpm install` workflow step can install the properly published versions.  It is your responsibility to keep the versions up to date in the deployConfig sections and ensure that they reference actual published versions.

```
{
  "dependencies": {
    "foo": "workspace:*"
  },
  "devDependencies": {
    "bar": "workspace:*"
  },
  "peerDependencies": {
    "baz": "workspace:*"
  },
  "deployConfig": {
    "dependencies": {
      "foo": "1.0.0"
    },
    "devDependencies": {
      "bar": "1.1.0"
    },
    "peerDependencies": {
      "baz": "1.2.0"
    }
  }
}
```