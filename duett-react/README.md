# Duett React Front-End

## Technologies

* React, version 17
* [Wouter](https://github.com/molefrog/wouter) Router
* [Zustand](https://zustand.surge.sh/) State Management
* [Material UI](https://material-ui.com)
* Sass (Node Sass)
* ESLint and Prettier: Linting and auto-formatting
* Husky: Git hook to lint on commit
* React and Redux Devtools
* npm

## Local Development

1. Clone the repo
1. `npm install`
1. `npm start`

### Additional Setup

* Install both the React and Redux developer tools in your browser

## Coding Standard

* Commits are pre-linted with Husky and Prettier

## Technical Details

### Routing

Choosing Wouter for routing was a decision made to utilize the newest React hooks APIs. Wouter is very convenient because it also uses the same API as React Router, which people are already used to using. It is much smaller and less cumbersome than the full React Router library.

The main routes are contained in the `App.js` file. We can have nested routes as needed.

### State Management

Zustand uses the latest React hooks API for simplified state management. It also works with Redux devtools which is available in all major browsers. 

Zustand works well with Asynchronous functions and we can namespace and organize our state as it grows.

### Styling

Material uses some JavaScript-based styling and we also have access to Sass. We have to decide which of these will control which styles. We should probably handle as much as possible with the built-in styles from the Material UI library and then use Sass where appropriate.

### Linting

Create-react-app uses ESLint under the hood to lint on builds. We have added prettier for autoformatting on Git commits according to [the recommended setup](https://create-react-app.dev/docs/setting-up-your-editor/#extending-or-replacing-the-default-eslint-config) on the Create React App website.

### Testing

This app uses Jest for testing. Tests can be found inside of the `__tests__` folder in the root directory. Run test suite with `npm test`.

### Folder Structure

* `src/`
    * `views`: All pages connected to the router should be in the views folder.
    * `components`: All other React components should go in this folder and it's subfolders
    * `store`: This is for Zustand state and methods.


### Deployment
1. Check out the branch you want to deploy 
2. Run either `npm run build:staging` or `npm run build:production` or `npm run build:qa` based on what you want to deploy
3. Upload the contents of `/build` directory to the S3 bucket (duett-client-staging or duett-client-production or duett-client-qa)
4. Go to CloudFront, open the related distribution, Click on the Invalications tab, create a new invalidation for `/*` and Save