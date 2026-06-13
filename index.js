/**
 * @format
 */

import { AppRegistry, Text, TextInput } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

const originalTextRender = Text?.render;
const originalTextInputRender = TextInput?.render;

Text.render = function (...args) {
  const origin = originalTextRender.apply(this, args);

  return React.cloneElement(origin, {
    allowFontScaling: false,
  });
};

TextInput.render = function (...args) {
  const origin = originalTextInputRender.apply(this, args);

  return React.cloneElement(origin, {
    allowFontScaling: false,
  });
};

AppRegistry.registerComponent(appName, () => App);
