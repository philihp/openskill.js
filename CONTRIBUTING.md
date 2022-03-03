# Porting

If you'd like to port this to your favorite language, you'll need:

* Something like `Math.sqrt` (there do exist languages without this!)
* Something like `Math.exp`, however different languages can have with different performance tradeoffs. There are de facto standards, but don't be alarmed by small variations. 
* A gaussian normal distribution library.

# Pull Requests are Open!

If there's a feature or enhancement you'd like to add, please feel free to create an issue or comment on an existing one that you'd like to work on. If you'd like to message me directly, you can get my email address from git logs. I check email at around 0200Z every day.

## Setup

```bash
git clone git@github.com:philihp/openskill.js.git
cd openskill.js
npm install
```

While working on changes, I like to leave jest running in a side window, watching for changes and running what it thinks the appropriate unit tests are.

```bash
npm run test -- --watch
```

Any supported version of Node [listed here](https://nodejs.org/en/about/releases/) is fine. You shouldn't need anything else.

## Submitting a PR

Just open a PR. I'll see it :) While you're waiting, please make sure status checks are green.

- Unit tests will run for all actively supported versions of Node
- Test coverage will run and go red if it dips below 100%.
- Prettier and ESLint will prevent ugly code. If those are green, I probably don't mind.
