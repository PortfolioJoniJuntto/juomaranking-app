module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        cwd: 'babelrc',
        extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js'],
        alias: {
          '@Screens': './src/Screens',
          '@Components': './src/Components',
          '@Constants': './src/constants',
          '@Context': './context',
          '@Helpers': './src/helpers',
        },
      },
    ],
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes'],
      },
    ],
    'nativewind/babel',
  ],
};
