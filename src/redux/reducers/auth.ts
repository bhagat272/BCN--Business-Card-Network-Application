import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  //Each slice file should define a type for its initial state value, so that createSlice can correctly infer the type of state in each case reducer.
  userData: null;
  rememberedData: null;
  isIntroFinished: boolean;
  isSplash: boolean;
}

// Define the initial state using that type
const initialState: AuthState = {
  userData: null,
  rememberedData: null,
  isIntroFinished: false,
  isSplash: true,
};

const authSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    saveUserData: (state, action: PayloadAction<any>) => {
      state.userData = action.payload;
    },
    saveRememberedData: (state, action: PayloadAction<any>) => {
      state.rememberedData = action.payload;
    },
    saveIntroScreenStatus: (state, action: PayloadAction<any>) => {
      state.isIntroFinished = action.payload;
    },
    saveSplashStatus: (state, action: PayloadAction<any>) => {
      state.isSplash = action.payload;
    },
  },
});

export const {
  saveUserData,
  saveIntroScreenStatus,
  saveRememberedData,
  saveSplashStatus,
} = authSlice.actions;

export default authSlice.reducer;
