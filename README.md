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

## Conversation ordering

`Conversation.lastMessageTimestamp` cannot be relied on, and cannot be corrected from the client:

- it is already inconsistent in the sample data — conversation 1 carries the timestamp of its _first_ message rather than its last;
- sending a message does not refresh it, and no endpoint exists to do so: `PATCH` and `PUT` on a conversation both answer `404`, and the swagger defines only `GET`, `POST` and `DELETE` for that resource.

Ordering the list on that field would therefore be wrong on first load, and would never reflect a message the user had just sent — leaving the app technically functional but not trustworthy.

The list instead loads each conversation's messages and derives last activity from them. This is an N+1: one request per conversation. It is a deliberate stopgap that makes the ordering correct today, but its cost grows linearly with the number of conversations, and it should be replaced as soon as the API can return the last message alongside each conversation.

It does pay for itself in the meantime: those requests populate the same React Query cache entries the thread view reads, so opening a conversation renders from cache rather than waiting on a request.
