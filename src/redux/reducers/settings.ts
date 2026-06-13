import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface SettingsState {
  //Each slice file should define a type for its initial state value, so that createSlice can correctly infer the type of state in each case reducer.
  parishList: any[];
  otpAttemptData: object;
  isRefreshConnection: boolean;
  isCalledDeepLinking: boolean;
}

// Define the initial state using that type
const initialState: SettingsState = {
  parishList: [],
  otpAttemptData: {
    time: '',
    attempts: 0,
  },
  isRefreshConnection: false,
  isCalledDeepLinking: false,
};

const settingsSlice = createSlice({
  name: 'settingsData',
  initialState,
  reducers: {
    saveParishData: (state, action: PayloadAction<any>) => {
      state.parishList = action.payload;
    },
    saveOtpAttempts: (state, action: PayloadAction<any>) => {
      state.otpAttemptData = action.payload;
    },
    saveConnectionRefresh: (state, action: PayloadAction<any>) => {
      state.isRefreshConnection = action.payload;
    },
    updateDeepLinkingCalled: (state, action: PayloadAction<any>) => {
      state.isCalledDeepLinking = action.payload;
    },
  },
});

export const {
  saveParishData,
  saveOtpAttempts,
  saveConnectionRefresh,
  updateDeepLinkingCalled,
} = settingsSlice.actions;

export default settingsSlice.reducer;
