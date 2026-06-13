import * as auth from './auth';
import * as connections from './connections';
import * as home from './home';
import * as settings from './settings';

export default {
  ...auth,
  ...settings,
  ...home,
  ...connections,
};
