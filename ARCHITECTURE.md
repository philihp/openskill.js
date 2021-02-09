### External functions

- `src/rating` - creates a rating.
- `src/rate` - takes in a list of teams, which is a list of ratings, perhaps a model (by default it uses Plackett-Luce), and runs ratings on them. **This is a good place to start**
- `src/ordinal` - converts a rating into something people can sort ratings by.

### Internal functions

- `src/constants` - these might be configurable constants, some day.
- `src/statistics` - generalized statistics-related functions used by models.
- `src/util` - other generalized methods.
- `src/models/*` - different models, enumerated in `index`.
