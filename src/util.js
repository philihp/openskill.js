// eslint-disable-next-line import/prefer-default-export
export const teamRating = (game) =>
  game.map((team, i) => [
    team.reduce((sum, { mu }) => sum + mu, 0),
    team.reduce((sum, { sigma }) => sum + sigma * sigma, 0),
    team,
    i + 1,
  ])
