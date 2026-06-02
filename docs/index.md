---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'openskill.js'
  text: 'Bayesian rating, faster than TrueSkill.'
  tagline: A lightweight, open-source, MIT-licensed implementation of Weng-Lin online rating for JavaScript & TypeScript.
  actions:
    - theme: brand
      text: Getting Started
      link: /guide/getting-started
    - theme: alt
      text: Choosing a Model
      link: /guide/models
    - theme: alt
      text: View on GitHub
      link: https://github.com/philihp/openskill.js

features:
  - title: Up to 20× faster than TrueSkill
    details: Weng-Lin rating avoids the expensive factor-graph message passing of TrueSkill while producing comparable results.
  - title: Teams, ties & free-for-alls
    details: Rate matches with any number of teams, asymmetric team sizes, tied ranks, and raw scores — not just 1-vs-1.
  - title: Pick your model
    details: Ships with Plackett-Luce, Bradley-Terry, and Thurstone-Mosteller models. Bring your own by implementing one function.
  - title: Typed & tree-shakeable
    details: First-class TypeScript types and no side effects, so bundlers only include what you import.
---

## Quick start

```bash
npm install --save openskill
```

```ts
import { rate, rating, ordinal } from 'openskill'

const a1 = rating()
const b1 = rating()

// team [a1] beat team [b1]
const [[a2], [b2]] = rate([[a1], [b1]])

ordinal(a2) // a single number you can sort a leaderboard by
```

Head to [Getting Started](/guide/getting-started) for the full tour.
