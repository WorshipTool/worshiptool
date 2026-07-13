Workflows exists to automate common tasks such as testing, building, and deploying the project.

Testing:

1. For every pull request or change, should be tested by basic **jest tests**
2. After every push to 'dev' branch, **e2e tests** (smoke → critical → full) run against the deployed dev version on dev.chvalotce.cz

Deployment:

1. Dev is deployed by Creator (outside GitHub Actions) on every push to 'dev' branch — the Dev E2E Tests workflow waits for the new build to go live and then tests it
2. On every push to 'master' branch, should be deployed to production
   - main (shared db)
     - chvalotce.cz
     - worship.cz
   - non-czech (different db)
     hallelujahhub.com
