module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        allowlist: [
          'API_URL_DEV',
          'API_IMAGE_URL_DEV',
          'API_URL_STAGE',
          'API_IMAGE_URL_STAGE',
          'API_URL_LIVE',
          'API_IMAGE_URL_LIVE',
          // 'VISION_API_KEY',
          // 'GOOGLE_GEMINI_KEY',
        ],
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
