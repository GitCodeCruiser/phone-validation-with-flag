import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const external = ['react', 'vue'];
const plugins = [resolve(), terser()];

export default [
  // Core — ESM
  { input: 'src/index.js', external, plugins,
    output: { file: 'dist/index.esm.js', format: 'esm' } },
  // Core — CJS
  { input: 'src/index.js', external, plugins,
    output: { file: 'dist/index.cjs.js', format: 'cjs' } },
  // Core — UMD
  { input: 'src/index.js', external, plugins,
    output: { file: 'dist/index.umd.js', format: 'umd', name: 'PhoneValidationWithFlag' } },
  // React adapter
  { input: 'src/adapters/react.js', external, plugins,
    output: [
      { file: 'dist/react.esm.js', format: 'esm' },
      { file: 'dist/react.cjs.js', format: 'cjs' },
    ]},
  // Vue adapter
  { input: 'src/adapters/vue.js', external, plugins,
    output: [
      { file: 'dist/vue.esm.js', format: 'esm' },
      { file: 'dist/vue.cjs.js', format: 'cjs' },
    ]},
];
