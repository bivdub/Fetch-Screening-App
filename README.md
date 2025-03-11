# Fetch Screening App

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```
## Next Steps to improve app

  - MOBILE RESPONSIVENESS - there was a lot of functionality to implement, will take some thinking to make mobile UX user friendly
  - fix multiselect styling
  - Fix flash of Nuxt error screen on redirecto login (may be easier to fix with proper sessions)
  - Add custom styling to make it look a little less utilitarian
  - Add tooltips / intro guide to the main page?
  - Implement Session management rather than using a hacky 401 redirect
  - Put in better error handling / toast service / typing
  - Put some fancy animation for the final dog selection - needs some flair
  - Implement a typeahead search for the City / State and make it a single field
  - Some kind of slider for the age range might work better
  - Fix bug of deleting dogs in sidebar not updating checkboxes on DogsTable
  - Add reset button
  - Add Logout
  - Split the DogsTable rows in to a DogRow component
  - Split the drawer contents in to a component
