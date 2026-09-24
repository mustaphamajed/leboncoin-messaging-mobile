# leboncoin messaging — mobile

A React Native messaging app for iOS and Android where a user can browse their conversations, read and send messages, and start new conversations. It keeps working when the network or the API does not.

Built with Expo, React Native, TypeScript, Expo Router, TanStack Query, Zod and axios. The interface is in French. It is the mobile counterpart of the leboncoin-messaging web app, and shares its architecture and API layer.

## Features

| Requirement                                | Status                                                              |
| ------------------------------------------ | ------------------------------------------------------------------- |
| List all conversations of the logged user  | ✅ Sorted by most recent message, pull to refresh                   |
| Select a conversation and see its messages | ✅ Chronological, grouped by day, opens on the latest message       |
| Send messages                              | ✅ Shown immediately, with retry and delete if sending fails        |
| Works on iOS and Android                   | ✅ Native stack navigation, safe areas, composer above the keyboard |
| Robust safety guards                       | ✅ See [Safety guards](#safety-guards)                              |
| **Bonus 1**: create conversations          | ✅ User search, no duplicate conversations                          |
| **Bonus 2**: shaky infrastructure          | ✅ Retries, automatic recovery, offline mode, clear messages        |
| Performance, accessibility, tests          | ✅ See the dedicated sections                                       |

## Getting started

**Requirements:** Node.js 24 (see [.nvmrc](.nvmrc)), the [technical test repository](https://github.com/leboncoin/frontend-technical-test), which provides the mock API, and Expo Go on a phone, an iOS simulator or an Android emulator.

```bash
# 1. Start the API (json-server on port 3005), from the technical test repository.
#    --host 0.0.0.0 lets phones and emulators reach it, not only this computer.
npm install
npm run start-server -- --host 0.0.0.0

# 2. Start the app, from this repository
cp .env.example .env
npm install
npm start
```

Then scan the QR code with Expo Go, or press `i` (iOS simulator) or `a` (Android emulator).

Set `EXPO_PUBLIC_API_URL` in `.env` to an address the device can reach:

| App running on           | `EXPO_PUBLIC_API_URL`                              |
| ------------------------ | -------------------------------------------------- |
| iOS simulator            | `http://localhost:3005`                            |
| Android emulator         | `http://10.0.2.2:3005`                             |
| Physical phone (Expo Go) | `http://<your computer's LAN IP>:3005`, same Wi-Fi |

`EXPO_PUBLIC_*` values are inlined into the bundle, so restart with `npx expo start -c` after changing them.

There is no authentication in the exercise: the logged user is hard-coded in [src/lib/getLoggedUserId.ts](src/lib/getLoggedUserId.ts).

### Scripts

| Command                | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `npm start`            | Start the Expo dev server                          |
| `npm run ios`          | Start and open on iOS                              |
| `npm run android`      | Start and open on Android                          |
| `npm run build`        | Bundle the app for iOS and Android (`expo export`) |
| `npm test`             | Run the test suite once                            |
| `npm run test:watch`   | Run tests in watch mode                            |
| `npm run typecheck`    | Type-check the project                             |
| `npm run lint`         | Lint the project                                   |
| `npm run format`       | Format the project with Prettier                   |
| `npm run format:check` | Check the formatting                               |

### Environment variables

| Variable                             | Default                 | Description                                                                              |
| ------------------------------------ | ----------------------- | ---------------------------------------------------------------------------------------- |
| `EXPO_PUBLIC_API_URL`                | `http://localhost:3005` | Base URL of the API                                                                      |
| `EXPO_PUBLIC_SIMULATED_FAILURE_RATE` | `0`                     | **Development only.** Share of requests (0 to 1) that fail with a simulated 503 response |

## Architecture

### Stack

| Concern      | Choice                                              | Why                                                                                                            |
| ------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Framework    | Expo SDK 57 + React Native + TypeScript (strict)    | One codebase for iOS and Android, runs in Expo Go, native folders are generated instead of maintained          |
| Server state | TanStack Query                                      | Caching, retries, polling, cancellation, offline pause and resume, and mutation state in one tool              |
| HTTP         | axios                                               | One configured instance (base URL, timeout, headers) with interceptors as extension points                     |
| Validation   | Zod                                                 | Every API response is validated at runtime. Types are inferred from the schemas, so they are defined only once |
| Routing      | Expo Router                                         | File-based native stack navigation, deep links and typed routes                                                |
| Styling      | StyleSheet + theme                                  | Native styles with no extra runtime, design tokens in [src/lib/theme.ts](src/lib/theme.ts)                     |
| Storage      | AsyncStorage                                        | Keeps locally created conversations across app restarts, included in Expo Go                                   |
| Network      | expo-network + AppState                             | Tell TanStack Query when the device goes offline and when the app comes back to the foreground                 |
| Tests        | Jest (jest-expo), React Native Testing Library, MSW | Tests go through the real screens, hooks and HTTP client. Only the network is mocked                           |

The React Compiler is enabled, so components and hooks are memoised automatically, without `useMemo` or `useCallback`.

### Folder structure

```
src/
├── app/            # Expo Router routes: root layout and thin screens
├── providers/      # App-wide providers: query client and logged user
├── navigation/     # Root stack navigator, safe area and connection banner
├── features/       # Business logic and UI, grouped by domain
│   ├── conversations/    # conversation list, single conversation, locally created conversations
│   ├── newConversation/  # user search and conversation creation
│   ├── messages/         # message list, composer, sending, keyboard handling
│   └── connection/       # offline and API health banner
├── services/       # API layer, no React code: HTTP client + one folder per resource (service + schema)
├── components/     # Generic UI: avatar, buttons, links, spinner, empty and error states, error boundary
├── context/        # Logged user
├── lib/            # Pure helpers: theme, dates, error messages, query client, React Query native setup
├── test/           # Test setup, fixtures, MSW handlers and in-memory database
└── __tests__/      # Test suites
```

Dependencies only go one way:

```
app (routes) → features (components → hooks) → services → httpClient → API
```

- Each folder exposes its public API through an `index.ts` (`@/services`, `@/features/messages`…). An ESLint rule forbids deep imports from other folders, so a folder's internals can change without breaking its users.
- Inside a folder, files import each other with relative paths, which avoids circular imports through the index.
- Every file in `app/` is a route, so it only holds screens and layouts. Helpers and tests live elsewhere, otherwise Expo Router would treat them as screens.
- Components never call services directly, and services know nothing about React. Each layer can be tested and replaced on its own.
- One component per file, and each component has a single `return`: loading, error, empty and loaded states are conditions inside it, so its whole output reads in one place.

### Routing

| Route                | Screen                                                 |
| -------------------- | ------------------------------------------------------ |
| `/`                  | Conversation list, with a "Nouvelle conversation" link |
| `/conversations/:id` | Conversation                                           |
| `/conversations/new` | New conversation                                       |
| `+not-found`         | Not found screen                                       |

Screens are stacked natively, with the platform's back gesture and Android's back button. The stack header is hidden: each screen draws its own header, and the safe area is handled once in the root navigator. Opening a conversation from the new conversation screen replaces it, so going back returns to the list.

## Key decisions

1. **Validate at the boundary.** The HTTP client validates every response with a Zod schema, and turns every failure into a typed `ApiError` (`http`, `network`, `timeout`, `invalid-response`). Malformed data shows an error state instead of crashing a component further down.
2. **Retry only what can succeed.** Queries retry up to 3 times, and only for 5xx responses, network errors and timeouts. Client errors and invalid responses are never retried. Mutations are never retried automatically, so a message is never sent twice without the user deciding.
3. **Outgoing messages live in the mutation cache.** Messages are polled every 5 seconds, and each poll replaces the query cache, which would erase messages that are not confirmed yet. Pending and failed messages are therefore read from TanStack Query's mutation cache (`useMutationState`). Each keeps its own status (sending, waiting for connection, failed) and survives navigating away and back.
4. **Guard against races.** Before a newly sent message or conversation is written into the cache, in-flight fetches are cancelled. Otherwise a fetch started before the request finished could overwrite the new item.
5. **Only open your own conversations.** A conversation is looked up in the user's own list, which is already cached. Its messages are only requested once it is found there. Changing the id in a deep link shows "Conversation introuvable" instead of loading someone else's messages.
6. **Teach TanStack Query about the device.** React Native has no browser online or focus events. Connectivity comes from `expo-network` and focus from `AppState`, so paused messages are sent when the connection comes back and data refreshes when the app returns to the foreground.
7. **An inverted list for messages.** The message list is an inverted `FlatList`: it opens on the latest message without measuring or scrolling after render, keeps the reading position when messages arrive while the user reads older ones, and follows new messages when the user is at the bottom. Sending always scrolls down.
8. **Handle the keyboard by hand.** Android does not resize edge-to-edge apps for the keyboard, so the conversation screen pads itself by the keyboard height from React Native's keyboard events. It works in Expo Go, with no extra native module.
9. **Polling instead of WebSockets.** The API has no real-time channel. Polling pauses automatically when the app is in the background. With a real backend, WebSockets or server-sent events would replace it.

## API quirks found and how they are handled

| Quirk                                                                                                                                         | Handling                                                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The conversations middleware loads `db.json` once with `require()`, so a created conversation may not be returned by `GET /conversations/:id` | Created conversations are stored in AsyncStorage for the current user, validated with Zod when read, and merged into every fetch until the server returns them |
| `POST` bodies in the specification lack fields other endpoints rely on (`authorId`, `conversationId`, nicknames)                              | The client sends complete objects, and only relies on the `{ id }` guaranteed by the specification in the response                                             |
| `GET /user/:id` is rewritten to `/users?id=:id` and returns an array instead of an object                                                     | The service accepts both shapes                                                                                                                                |
| Timestamps are Unix **seconds**. The specification types message timestamps as strings, the data uses numbers                                 | Both are accepted and turned into numbers in one schema                                                                                                        |
| A 404 means "no conversations" or "no messages"                                                                                               | Treated as an empty list                                                                                                                                       |
| The API returns every user's **token**                                                                                                        | Dropped by the user schema, so credentials never reach client state                                                                                            |
| The server does not prevent duplicate conversations                                                                                           | The app opens the existing conversation with that person instead of creating another one                                                                       |

## Resilience (Bonus 2)

- **Separate error states:** the conversation list, the conversation and the messages each fail on their own, with a message the user can understand and a "Réessayer" button.
- **API health banner:** as soon as a request fails with an error that may go away, a banner reassures the user while retries run in the background. Failed requests are tried again every 15 seconds, and the banner disappears once the API answers again. Client errors (4xx) do not show it.
- **Offline mode:** a banner appears when the device loses its connection. Messages written offline show "En attente de connexion…" and are sent automatically when the connection comes back.
- **Failed messages:** a message that could not be sent stays in the conversation with **Renvoyer** and **Supprimer** actions.
- **Error boundary:** an unexpected crash shows "Une erreur est survenue" with a "Réessayer" button that renders the screen again.

**Try it:** set `EXPO_PUBLIC_SIMULATED_FAILURE_RATE=0.3` in `.env` and restart with `npx expo start -c`. About 30% of requests will fail with a 503 before reaching the network. To test offline mode, turn on airplane mode. The simulation only exists in development builds, and tests always turn it off.

## Safety guards

- Every API response is validated at runtime, and so are route parameters: `/conversations/abc` shows a not found state without calling the API.
- Message text is trimmed, never empty, and limited to 1000 characters in the composer. The service validates it again before sending.
- Message text is rendered as plain text, so it cannot inject markup or scripts.
- Requests time out after 10 seconds, and are cancelled when the user leaves the screen.
- No duplicate sends: mutations are not retried automatically, and the composer is cleared on send. When creating a conversation, the options are disabled while the request runs, and an existing conversation is opened instead of creating a duplicate.
- Tokens returned by the API are removed from parsed data.
- Values read from AsyncStorage are validated, and every access is wrapped, so corrupted or unavailable storage cannot crash the app.
- The code avoids JavaScript APIs that not every Hermes version ships, such as `toSorted` and `toReversed`.

## Accessibility

- Every interactive element has a role and an accessible name: links ("Retour aux conversations", "Nouvelle conversation"), buttons ("Envoyer le message", "Réessayer") and inputs ("Message à Jeremie", "Rechercher un utilisateur").
- Screen titles use the `header` role, so screen reader users can jump between them.
- Each message is read as one element that starts with its author and ends with its time ("Vous : Bonjour, 06:04"). The retry and delete actions of a failed message stay outside it, so they remain reachable.
- Avatars are decorative and hidden from screen readers. The nickname next to them is read instead.
- Connection changes and the characters-left counter are announced with polite live regions.
- Pressed states give visual feedback on every touchable element, and small targets such as the back button have an extended touch area.

## Performance

- The React Compiler memoises components and hooks, so re-renders are limited to what changed.
- Conversation, user and message lists are virtualised `FlatList`s.
- Data is cached and shared between screens: opening a conversation from the list makes no extra request for its header.
- Polling pauses while the app is in the background. A poll that returns the same data keeps the same objects, so derived work such as grouping messages by day is not redone. Data stays fresh for 30 seconds before it is fetched again when the app comes back to the foreground.
- Date formatters are created once, and sorting is done in TanStack Query's `select`.

## Testing

Run the tests with `npm test`.

- **Service tests** cover the HTTP client (success, 4xx, 5xx, network error, timeout, invalid JSON, schema mismatch, cancellation) and each service.
- **Integration tests** render the real screens under the real navigator at a given route, and interact like a user does, by role, label and text. They cover the conversation list, the conversation view, sending (including failure, retry and sending offline), conversation creation, the not found screens and the connection banner.
- **MSW** mocks the network with an in-memory database that behaves like json-server and is reset after each test. A request without a handler fails the test.
- The route test helper renders Expo Router's root directly instead of using `renderRouter`, which switches to fake timers that would freeze MSW, axios and TanStack Query.
- Tests run in the UTC time zone, so date assertions pass on every machine.
- **CI** ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs type-check, lint, formatting check, tests and build on every pull request and on every push to `main`.

## Limitations and next steps

- **Authentication:** the logged user is hard-coded. With real authentication, the token would be added by an axios interceptor, and the user would come from a session endpoint.
- **Real-time:** replace polling with WebSockets or server-sent events, and push notifications for new messages.
- **Tablets:** the app uses the phone layout everywhere. A split view with the list and the conversation side by side would suit tablets, like the web app on desktop.
- **Sending with the keyboard:** on phones, the return key adds a new line and messages are sent with the button. A hardware keyboard shortcut would help on tablets.
- **Keyboard handling:** `react-native-keyboard-controller` would animate the composer with the keyboard, but it needs a development build instead of Expo Go.
- **Long histories:** paginate messages (`useInfiniteQuery`) as the user scrolls up.
- **Idempotency:** if a send times out after the server saved the message, retrying creates a duplicate. An idempotency key handled by the server would prevent it.
- **Last message timestamp:** the API does not update a conversation's `lastMessageTimestamp` when a message is sent, so the list order and the "Dernier message" date only change when the server does.
- **Duplicate conversations:** the duplicate check uses the cached conversation list. Checking against a fresh list just before creating would also catch conversations created on another device.
- **Typed routes in CI:** route types are generated by the dev server and are not committed, so CI type-checks links without them.
- **Internationalisation:** texts are written in French directly in the components. An i18n library would be the next step to support other languages.
- **Colour contrast:** the own-message bubble (`#2196f3` with white text) is below the WCAG AA contrast ratio and should be darkened.
- **Tests:** end-to-end tests on a device (Maestro or Detox) against the real API would complete the CI workflow.

## Time spent

_To be filled in._
