module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          components: './src/components',
          contexts: './src/contexts',
          screens: './src/screens',
          store: './src/store',
          hooks: './src/hooks',
          utils: './src/utils',
          services: './src/services',
          environment: './src/environment',
        },
        extensions: ['.ios.js', '.android.js', '.js', '.json', '.ts'],
      },
    ],
  ],
};
