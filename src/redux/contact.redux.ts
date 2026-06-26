import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { contacts } from "../types/contact/contact.model.type";
import ContactApi from "../api/Contact.api";

type ContactState = {
  contacts: contacts[];
};

const initialState: ContactState = {
  contacts: [],
};

export const onGetDataContact = createAsyncThunk(
  "contact/onGetDataContact",
  async () => {
    const res = await ContactApi.onGetContact();
    console.log(res.data.data);
    
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
    builder.addCase(onGetDataContact.fulfilled, (state, action) => {
      state.contacts = action.payload;
    });
  },
});

export const {
  updateContactBlockedStatus
} = contactSlice.actions

export const contactReducer = contactSlice.reducer;
