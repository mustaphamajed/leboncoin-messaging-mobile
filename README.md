# leboncoin messaging — mobile

A React Native messaging app where a user can browse their conversations, read and send messages, and start new conversations.

Built with Expo, React Native, TypeScript, Expo Router, TanStack Query, Zod and axios.


## Getting started

**Requirements:** Node.js 24 (see [.nvmrc](.nvmrc)), and the [technical test repository](https://github.com/leboncoin/frontend-technical-test), which provides the mock API.

```bash
npm install
npm run start-server

cp .env.example .env
npm install
npm start
```

Then open the app in Expo Go, an iOS simulator (`i`) or an Android emulator (`a`).

### Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run ios` | Start and open on iOS |
| `npm run android` | Start and open on Android |
| `npm run build` | Bundle the app for iOS and Android (`expo export`) |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run typecheck` | Type-check the project |
| `npm run lint` | Lint the project |

### Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | `http://localhost:3005` | Base URL of the API |

`localhost` only works on the iOS simulator. On an Android emulator use `http://10.0.2.2:3005`, and on a physical device use your machine's LAN IP.

## Architecture

### Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | Expo + React Native + TypeScript (strict) | One codebase for iOS and Android, no native project to maintain (native folders are generated) |
| Server state | TanStack Query | Caching, retries, polling, cancellation and mutation state in one tool |
| HTTP | axios | One configured instance (base URL, timeout, headers) with interceptors as extension points |
| Validation | Zod | Every API response is validated at runtime. Types are inferred from the schemas, so they are defined only once |
| Routing | Expo Router | File-based native navigation with deep linking and typed routes |
| Styling | StyleSheet + theme | Native styles with no extra runtime, design tokens in `lib/theme.ts` |
| Tests | Jest (jest-expo), React Native Testing Library, MSW | Tests go through the real components, hooks and HTTP client. Only the network is mocked |

### Folder structure

```
src/
├── app/            # Expo Router routes: root layout (navigator) and thin screens
├── providers/      # App-wide providers: query client and logged user
├── features/       # Business logic and UI, grouped by domain
│   ├── conversations/    # conversation list and single conversation
│   ├── newConversation/  # user search and conversation creation
│   ├── messages/         # message list, composer, sending
│   └── connection/       # offline and API health banner
├── services/       # API layer, no React code: HTTP client + one folder per resource (service + schema)
├── components/     # Generic UI: avatar, spinner, empty and error states, error boundary
├── context/        # Logged user
├── lib/            # Pure helpers: theme, dates, error messages, query client
└── __tests__/      # Tests, setup, fixtures and MSW handlers
```

Dependencies only go one way:

```
app (routes) → features (components → hooks) → services → httpClient → API
```

- Each folder exposes its public API through an `index.ts` (`@/services`, `@/features/messages`…). An ESLint rule forbids deep imports from other folders, so a folder's internals can change without breaking its users.
- Inside a folder, files import each other with relative paths, which avoids circular imports through the index.
- `app/` has no index on purpose: every file in it is a route, so it only holds screens and layouts. Tests live in `__tests__/` for the same reason.
- Components never call services directly, and services know nothing about React. Each layer can be tested and replaced on its own.

## Quality

- TypeScript in strict mode, with `noUnusedLocals` and `noUnusedParameters`.
- **CI** ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs type-check, lint, tests and build on every pull request and on every push to `main`.
