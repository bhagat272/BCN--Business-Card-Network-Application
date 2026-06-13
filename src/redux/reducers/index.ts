import {combineReducers} from '@reduxjs/toolkit';

import auth from './auth';
import settings from './settings';
import home from './home';

export default combineReducers({
  auth,
  settings,
  home,
});
