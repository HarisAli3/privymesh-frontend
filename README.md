# PrivyMesh - Zitadel React Integration

Secure Network Management with Zitadel Authentication.

This project integrates a React application with [ZITADEL](https://zitadel.com) authentication. It uses the `@zitadel/react` SDK for OIDC authentication.

## Project Structure

This project uses React with Vite and integrates the ZITADEL React SDK (located in `/lib` folder) to handle OIDC authentication.

The application includes:
- Dashboard with network management interface
- Peer management (list, add, configure peers)
- Settings page
- Landing page
- Protected routes requiring authentication

All authentication is handled through Zitadel OIDC flow.

## Available scripts

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Setup Instructions

1. **Configure Environment Variables**

   Create a `.env.local` file in the root directory or set environment variables:
   ```bash
   ZITADEL_INSTANCE_URL=http://localhost:8080
   ZITADEL_CLIENT_ID=your_client_id_here
   ZITADEL_REDIRECT_URI=http://localhost:3000/pm-auth
   ZITADEL_SILENT_REDIRECT_URI=http://localhost:3000/pm-silent-auth
   ZITADEL_POST_LOGOUT_REDIRECT_URI=http://localhost:3000/
   ```

   Or use `AUTH_*` prefixed variables (compatible with NetBird-style configuration):
   ```bash
   AUTH_AUTHORITY=http://localhost:8080
   AUTH_CLIENT_ID=your_client_id_here
   AUTH_REDIRECT_URI=http://localhost:3000/pm-auth
   ```

2. **Setup Zitadel Application**

   - Log into the [Zitadel Customer Portal](https://zitadel.com/admin/dashboard)
   - Create an Instance and Project
   - Create a **User Agent** application with **PKCE**
   - Enable **Development Mode**
   - Configure Redirect URI: `http://localhost:3000/pm-auth`
   - Configure Silent Redirect URI: `http://localhost:3000/pm-silent-auth`
   - Configure Post Logout URI: `http://localhost:3000/`
   - Copy the **Client ID**
   - Enable **Refresh Token** if you want offline access

3. **Build and Install Dependencies**

   First, build the Zitadel React library:

   ```bash
   cd ./lib
   yarn install
   yarn build
   cd ..
   ```

   Then install project dependencies:

   ```bash
   yarn install
   ```

4. **Run the Application**

   ```bash
   yarn dev
   ```

   Or for production build:

   ```bash
   yarn build
   yarn preview
   ```

   The application will run on `http://localhost:3000`

## Available Scripts

- `yarn dev` or `yarn start` - Start the development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Fix ESLint errors
- `yarn format` - Format code with Prettier

## Enable Offline Access (Refresh Tokens)

The project is already configured with `offline_access` scope by default. To enable refresh tokens:

1. Enable refresh tokens in your Zitadel application settings
2. The application will automatically handle refresh token renewal

## Authentication Flow

- Unauthenticated users are redirected to `/login`
- After login, users are redirected to `/pm-auth` callback
- Authenticated users can access:
  - `/dashboard` - Main dashboard
  - `/peers` - Peer management
  - `/peers/add` - Add new peer
  - `/settings` - User settings
