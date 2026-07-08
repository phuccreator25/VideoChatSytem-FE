import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { contacts } from "../types/contact/contact.model.type";
import ContactApi from "../api/Contact.api";

type ContactState = {
  contacts: contacts[];
  isLoading: boolean;
};

const initialState: ContactState = {
  contacts: [],
  isLoading: false,
};

export const onGetDataContact = createAsyncThunk(
  "contact/onGetDataContact",
  async () => {
    const res = await ContactApi.onGetContact();

    return (res.data.data || []) as contacts[];
  },
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    updateContactBlockedStatus: (state, action) => {
      const { contactId, isBlocked } = action.payload;

      const contact = state.contacts.find((item) => item._id === contactId);

      if (contact) {
        contact.isBlocked = isBlocked;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(onGetDataContact.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(onGetDataContact.fulfilled, (state, action) => {
      state.contacts = action.payload;
      state.isLoading = false;
    });
    builder.addCase(onGetDataContact.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { updateContactBlockedStatus } = contactSlice.actions;

export const contactReducer = contactSlice.reducer;
