import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

interface PALETTE {
  createdAt: string;
  name: string;
  colors: string[];
}

export const paletteSlice = createSlice({
  name: "palette",
  initialState: {
    createdAt: "",
    name: "",
    colors: [
      "f000000",
      "f000000",
      "f000000",
      "f000000",
      "f000000",
      "f000000",
      "f000000",
      "f000000",
      "f000000",
    ],
  },
  reducers: {
    paletteSubmit: (state, action: PayloadAction<PALETTE>) => {
      state = action.payload;
    },
  },
});

export const { paletteSubmit } = paletteSlice.actions;

export const selectPalette = (state: RootState) => state.palette;

export default paletteSlice.reducer;
