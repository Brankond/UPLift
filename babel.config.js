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
          navigators: './src/navigators',
          features: './src/features',
        },
        extensions: ['.ios.js', '.android.js', '.js', '.json', '.ts'],
      },
    ],
    [
      'react-native-reanimated/plugin',
      {
        relativeSourceLocation: true,
      },
    ],
  ],
};
