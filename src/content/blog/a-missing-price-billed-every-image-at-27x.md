---
title: "A missing price billed every image at 27x"
description: "The cheapest model we served was absent from the pricing table, so it fell through to the fallback weight. Every image request in production landed on it."
date: 2026-08-04
topic: Metering and billing
---

A user asked one question about their screen. The app told them they had used
43 percent of their daily allowance. They asked a second one and got locked
out, with a message saying they had hit their plan limit.

They had not hit their plan limit. The meter was wrong, and it had been wrong
for every image request the product had ever served.

## What a unit is

MODUS bills against a daily ceiling measured in cost units rather than tokens.
A unit is a token scaled by how expensive the model is, so a subscriber gets a
fixed amount of money per day instead of a fixed amount of text. Cheap models
stretch further. Expensive ones drain faster. The scaling factor is a weight,
and weight 1 is defined as the price of the reference model.

The weight comes from a table:

```ts
const PRICES: Record<string, { in: number; out: number }> = {
  'claude-fable-5':     { in: 15,  out: 75  },
  'claude-opus-4.8':    { in: 5,   out: 25  },
  'meta/llama-3.3-70b': { in: 0.5, out: 1.2 },
  'gemini-3.5-flash':   { in: 0.3, out: 2.5 },
};
```

If a model is not in the table, `costWeight()` cannot compute anything, so it
falls back:

```ts
const UNKNOWN_WEIGHT = 27;
```

Twenty seven is not a random number. It was picked as a deliberately
pessimistic guess, roughly the weight of the most expensive model in the
catalog, on the theory that overcharging for something unrecognised is safer
than undercharging. That reasoning is fine. The theory just assumed the
fallback would only ever catch models nobody used.

## The two rows that were missing

`gpt-4o-mini` and `meta/llama-3.1-8b` were not in the table. They are the two
cheapest models in the entire system. Both were billing at 27x, the same weight
as Claude Fable 5, which genuinely costs about 66 times more.

Being absent from a pricing table is normally survivable, because a model
nobody selects gets no traffic. That is where this stops being a corner case.
Production's `resolveChatModel` forces every image request onto `gpt-4o-mini`.
Not as a fallback. As the rule. Screenshots, attached photos and anything
pasted into the composer all land there.

So the model with the wrong price was not an obscure one. It was the only model
an entire feature could reach.

Measured on a real account, one Screen Assist question came to 216,081 units
against a 500,000 per day allowance. Forty three percent of a day, for one
question about a screenshot. Two questions and the user was locked out and told
they had hit their limit.

## The guard that said everything was fine

There was already a check for exactly this. `verify-model-cost.ts` existed to
make sure no model was missing a price, and it passed. It reported that every
model was priced, on every run, the entire time this was broken.

It walked `PLATFORM_MODELS`, which is the catalog of models a user can pick in
the UI. The two missing models are in `INTERNAL_MODELS`, which is a different
list, because they are not selectable. Nobody chooses `gpt-4o-mini` in MODUS.
The router chooses it for them.

That is the part worth keeping:

> A guard that only checks the models a user can pick will miss every model a
> request can land on.

The check was not weak. It was pointed at the wrong set. It gave a green tick
for a question nobody had asked, and the green tick is what made it dangerous,
because it read as coverage.

It now walks both lists and fails on either.

## The second bug, found on the way to the first

The baseline was computed like this:

```ts
const BASELINE = Math.min(...Object.values(PRICES).map(blended));
```

Weight 1 was whatever the cheapest model in the table happened to cost. Which
means adding the two missing rows would have moved the baseline, because the
new rows were cheaper than everything already there.

The baseline would have gone from about $0.52 to $0.195. Every other weight in
the system scales off that number, so all of them would have multiplied by
roughly 2.7. A PILOT subscriber would have silently been cut to a third of what
they could previously use. No pricing decision, no changelog entry, no
deployment note. Just a quieter product.

Fixing a billing bug would have caused a worse billing bug, and the mechanism
was a single call to `Math.min`.

It is pinned to a named model now:

```ts
const BASELINE = blended(PRICES['gemini-3.5-flash']);
```

Adding a cheaper model can no longer re-scale everything else by accident.

## What I would take from this

The fallback was the reasonable part of the design. Charging 27x for something
unrecognised is a sane default when the alternative is charging nothing. What
made it expensive was that the fallback was silent. Nothing logged when a
request hit `UNKNOWN_WEIGHT`. A single warning line would have surfaced this on
the first image anyone ever sent.

A default that is chosen because it is safe is worth an alarm when it fires. If
it is genuinely rare then the alarm costs nothing, and if it is not rare then
you have just learned the more important thing.
