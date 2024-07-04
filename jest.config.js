export default () => ({
  modulePathIgnorePatterns: ["dist/"],
  transform: {
    "^.+\\.tsx?$": [
      "esbuild-jest",
      {
        sourcemap: true
      }
    ]
  }
})
