# jackbox-clone (Truth Twisters)

## Project setup
```
npm install
```

## Compiles and hot-reloads for development
```
npm run serve
```

## Code Style and Conventions
https://v2.vuejs.org/v2/style-guide/?redirect=true
### UI Components
https://getbootstrap.com/docs/5.3/getting-started/introduction/

## Git Branching and PRs
### Main Branches
`main` (or `master`): This is the production branch that contains the released version of the game. All deployment-ready code is merged here.

`develop`: Serves as an integration branch for features. This is where all feature branches merge back into, and once it's stable, changes are merged into main.

### Supporting Branches
`feature`: Branches created from develop for new features or enhancements. Naming convention: feature/feature-name.

`bugfix/`: Branches for fixing bugs in the production version. These may be created from main and must be merged back into main and develop. Naming convention: bugfix/bug-name.

## Pull Request (PR) Process
### Creating a Pull Request:
Once a feature or fix is completed in a `feature/` or `bugfix/` branch you can create a pull request to merge the changes into the `develop` branch.

The PR title should clearly state the purpose of the change (e.g., "Add user profile management feature").
The description should provide context for the change, and link to the trello card you are working on.

You can read more about pull requests [here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)

### Code Review:
At least one other person should review the code for quality. You can leave comments and request changes. Once someone has reviewed it you can approve the PR.

### Merging:
Once approved and passing all checks, the PR can be merged into the `develop` branch.

### Deployment:
Changes that are merged into `develop` are tested and then merged into `main`.

