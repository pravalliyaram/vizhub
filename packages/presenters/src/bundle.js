import { rollup } from './rollup.browser';
import vizhubLibraries from 'vizhub-libraries';
import bubleJSXOnly from './bubleJSXOnly';
import svelte from './svelte';
import hypothetical from './hypothetical';
import { vizhubLibraries as userLibrariesSettings } from './packageJson';

const vizhubLibrariesNames = Object.keys(vizhubLibraries);

const transformFilesToObject = (files) =>
  files
    .filter(
      (file) => file.name.endsWith('.js') || file.name.endsWith('.svelte')
    )
    .reduce((accumulator, file) => {
      accumulator['./' + file.name] = file.text;
      return accumulator;
    }, {});

export const bundle = async (files) => {
  const _userLibrariesSettings = userLibrariesSettings(files);
  const userLibrariesNames = Object.keys(_userLibrariesSettings);

  const userLibraries = userLibrariesNames.reduce((globals, packageName) => {
    // in case if user created settings but not provide global, stub global with vizhub known global name
    const globalName = _userLibrariesSettings[packageName].global || vizhubLibraries[packageName];

    if(globalName) {
      globals[packageName] = globalName;
    } else {
      console.warn(
        `There is no global name for ${packageName}.\n Please add it to "vizhub.${packageName}.global" section in package.json.`
        )
    }

    return globals;
  }, {})

  const outputOptions = {
    format: 'iife',
    name: 'bundle',
    sourcemap: 'inline',
    globals: {...vizhubLibraries, ...userLibraries},
  };

  const inputOptions = {
    input: './index.js',
    plugins: [
      svelte(),
      hypothetical({
        files: transformFilesToObject(files),
      }),
      bubleJSXOnly({
        target: {
          chrome: 71,
        },
      }),
    ],
    external: Array.from(new Set([...vizhubLibrariesNames, userLibrariesNames])),
  };
  const rollupBundle = await rollup(inputOptions);
  const { output } = await rollupBundle.generate(outputOptions);

  // Monkey patch magic-string internals
  // to support characters outside of the Latin1 range, e.g. Cyrillic.
  //
  // Related reading:
  //  - https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa#Unicode_strings
  //  - https://github.com/Rich-Harris/magic-string/blob/3466b0230dddc95eb378ed3e0d199e36fbd1f572/src/SourceMap.js#L3
  //
  if (output.length !== 1) {
    throw new Error(
      'Expected Rollup output length to be 1. This Error is a VizHub bug if it happens.'
    );
  }
  const { code, map } = output[0];

  const toString = map.toString.bind(map);
  map.toString = () => unescape(encodeURIComponent(toString()));

  // Inspired by https://github.com/rollup/rollup/issues/121
  const codeWithSourceMap = code + '\n//# sourceMappingURL=' + map.toUrl();

  return [
    {
      name: 'bundle.js',
      text: codeWithSourceMap,
    },
  ];
};
