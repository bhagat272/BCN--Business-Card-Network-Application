// homeSlice.js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ContactCard {
  // Define the type for your contact card data
  // This should match the structure of the data you receive from the API
  uuid: string;
  name: string;
  designation: string;
  company_name: string;
  card_tag: string; // Or string[] if it's an array of tags
  // ... other properties
}

interface HomeState {
  cardData: ContactCard[]; // cardData is now an array of ContactCard objects
  isLoading: boolean; // Add a loading state
  isHomeRefresh: boolean;
  error: string | null; // Add an error state
}

const initialState: HomeState = {
  cardData: [],
  isLoading: false,
  isHomeRefresh: false,
  error: null,
};

const homeSlice = createSlice({
  name: 'contactCardData',
  initialState,
  reducers: {
    setCardDataStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setCardDataSuccess: (state, action: PayloadAction<ContactCard[]>) => {
      state.cardData = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCardDataFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setRefreshHome: (state, action: PayloadAction<boolean>) => {
      state.isHomeRefresh = action.payload;
    },
  },
});

export const { setCardDataStart, setCardDataSuccess, setCardDataFailure, setRefreshHome } =
  homeSlice.actions;

export default homeSlice.reducer;