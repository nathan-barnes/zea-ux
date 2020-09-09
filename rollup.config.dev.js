import pkg from './package.json'

const external = ['@zeainc/zea-engine']

export default [
  // Browser-friendly UMD build.
  {
    input: 'src/index.js',
    external,
    output: {
      name: 'zeaUx',
      file: pkg.browser,
      format: 'umd',
      globals: {
        '@zeainc/zea-engine': 'zeaEngine',
      },
      sourcemap: true,
    },
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.js',
    external,
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true },
    ],
  },
]
