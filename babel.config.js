module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver', {
        root: ['./src'],
        alias: {
          components: './src/components',
          contexts: './src/contexts',
          screens: './src/screens',
          data: './src/data'
        },
        extensions: [".ios.js", ".android.js", ".js", ".json"]
      }
    ]
  ]
};
