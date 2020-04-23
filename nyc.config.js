module.exports = {
  all: true,
  exclude: ['{dist,coverage,test}/**', '*.config.js'],
  reporter: ['html', 'lcov', 'text'],
}
