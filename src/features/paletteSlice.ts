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
    paletteName: (state, action: PayloadAction<PALETTE>) => {
      state.name = action.payload.name;
    },
    paletteCreated: (state, action: PayloadAction<PALETTE>) => {
      state.createdAt = action.payload.createdAt;
    },
  },
});

export const { paletteName } = paletteSlice.actions;

export const selectPalette = (state: RootState) => state.palette;
