module.exports = {
  all: true,
  exclude: ['{dist,coverage,test,benchmark}/**', '*.config.js'],
  reporter: ['html', 'lcov', 'text'],
}
