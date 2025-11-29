export default {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false, // 🔥 THIS is the key to avoid CommonJS output
        targets: {
          node: 'current'
        }
      }
    ]
  ]
};