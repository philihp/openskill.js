module.exports = {
  all: true,
  exclude: ['{dist,coverage,media,test-d,test-tap}/**', '*.config.js'],
  reporter: ['html', 'lcov', 'text'],
}
