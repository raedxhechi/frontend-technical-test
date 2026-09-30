# Context :

At leboncoin, our users can share messages about a transaction, or ask for informations about any products.

Your job is to create the interface to consult those messages.
The interface needs to work on both desktop & mobile devices.

In addition to your code, a README explaining your thought process and your choices would be appreciated.

# Exercise :

- Display a list of all the conversations
- Allow the user to select a conversation
  - Inside the conversation, there is a list of all the messages between these two users.
  - As a user, you can type and send new messages in this conversation

**As your application can be used by millions of users, make sure to provide some robust safety guards.**

### Sketches :

Obvisouly, it is up to you to make something nice and pretty, you are free to design it the way you like. The sketches are here to give you an idea on how it should look.

<details>
  <summary>Click to see the sketches</summary>
  
Mobile list :

![](./sketches/list-mobile.jpg)

Desktop list :

![](./sketches/list-desktop.jpg)

Mobile conversation :

![](./sketches/conv-mobile.jpg)

Desktop conversation :

![](./sketches/conv-desktop.jpg)

</details>

### API :

You can find the API swagger file in `docs/api-swagger.yaml`.

For a better readibility, you can view it on [https://leboncoin.tech/frontend-technical-test/](https://leboncoin.tech/frontend-technical-test/).

---

## Bonus 1 :

We provide some conversation samples, but can you improve the app so the user can now create new conversations ?

## Bonus 2 :

Our infrastructure is a bit shaky.. Sometimes the servers are crashing. “It’s not you, it’s me”, but maybe you can display something nice to warn the user and handle it gracefully.

## Do you want to make the app even better ?

Feel free to make as many improvements as you like.
We love creativity and technical challenges.

If you are out of ideas, here are some thoughts :

- As we want to reach our users anywhere, we need to make sure the app is performing well. What can you do to make it really fast ?

- Our goal is to support everybody in the country, including people with disabilities. As a good citizen and a good developer, can you make sure the app is accessible for everyone ?

- We all love to relax after a hard day’s work. It would be a shame if we didn’t feel confident enough about the upcoming automatic deployment. Are you sure everything has been tested thoroughly ?

---

# Implementation notes

## Running it

```bash
npm install
npm run start-server   # mock API on :3005
npm run dev            # app on :3000
```

`npm test`, `npm run lint` and `npm run build` all run in CI on every pull request.

## Stack

Next.js and React came with the exercise. The two additions are **React Query** and **CSS Modules**.

React Query because the brief asks for robust behaviour against an unreliable API, and caching, de-duplication, cancellation and optimistic updates are what it exists for — the interesting work here is the resilience *policy*, not the fetch mechanics. CSS Modules because the project had just removed styled-components; adding runtime CSS-in-JS back would have argued with that decision.

## Structure

Data flows in one direction: `services` (HTTP) → `hooks` (React Query) → `utils` (convert raw API shapes into display shapes) → components. Components receive data that is already resolved and formatted, so none of them compare user ids or format dates.

That conversion step exists because of a detail in the API: a conversation carries both participants, and the logged user can be **either** of them. Reading `recipientNickname` directly would label some rows with the user's own name.

## Layout

Both breakpoints render the same markup. Which pane is visible on mobile is decided in CSS from a data attribute reflecting the URL — no `useMediaQuery`, no breakpoint read in JavaScript. A JS check cannot run during server rendering, so the server would emit one layout and the client would correct it after hydration: a visible flash plus a hydration mismatch. CSS resolves before first paint and costs no JavaScript.

## Two API constraints worked around

**Conversation ordering.** `lastMessageTimestamp` is already inconsistent in the sample data (conversation 1 carries the timestamp of its *first* message), sending a message does not refresh it, and no endpoint can correct it — `PATCH` and `PUT` on a conversation both answer `404`.

The list therefore derives last activity from each conversation's messages. This is an N+1, taken deliberately so the ordering is correct today; it should be dropped as soon as the API can return the last message alongside each conversation. It pays for itself in the meantime, because those requests fill the same cache the thread view reads, so opening a conversation renders without waiting on a request.

**Reading back a created conversation.** `src/server/middleware/conversations.js` is the only file outside the app that has been modified. It loaded the database with `require` at module scope, which Node parses once and caches for the life of the process, and it answers every conversation `GET` from that frozen snapshot without falling through to json-server. A conversation could be created — `201`, correctly written to `db.json` — and then never read back without restarting the mock server by hand. It now reads the file per request; the filter logic is unchanged.

Persisting new conversations client-side would have avoided touching it, at the cost of a second source of truth and dedupe logic that no real API would ever need. Unlike the ordering N+1, which works around a limitation a production backend plausibly has, this was an artefact of the fixture.

## Safety guards

- Sending is optimistic and reversible: the message appears immediately, and on failure it stays visible, greyed out, with a retry — rather than disappearing along with what the user typed.
- Mutations never retry automatically. `POST /messages` is not idempotent, so a retry risks posting twice; the user decides instead.
- Sending is blocked on empty input and the field clears on submit, so an impatient double-click cannot send twice.
- The app survives the API being down. The middleware fails open rather than throwing — it cannot verify the user, so it lets them through and lets the UI report the outage, instead of claiming the account does not exist. An error boundary catches render-time crashes, and every failed load offers a retry.

## Accessibility

Native elements do the work: a `<dialog>` with `showModal()` for the user picker (focus trapping, `Escape`, backdrop), a real `<form>` for the composer, `<ul>`/`<li>` for both lists, and one `<section>` per day so a screen reader announces "7 juillet, list, 3 items" rather than reading a date as a message.

Selected state is styled from `[aria-current="page"]` rather than a second class, so the visual and announced states cannot drift apart. Every animation respects `prefers-reduced-motion` — including the JavaScript one, which needs its own check since CSS rules do not reach it.
