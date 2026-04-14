import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { contacts } from '../types/contact.type'
import ContactApi from '../api/Contact.api'

type ContactState = {
  contacts: contacts[]
}

const initialState: ContactState = {
  contacts: []
}

export const onGetDataContact = createAsyncThunk(
  'contact/onGetDataContact',
  async () => {
    const res = await ContactApi.onGetContact()
    return (res.data.data || []) as contacts[]
  }
)

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(onGetDataContact.fulfilled, (state, action) => {
      state.contacts = action.payload
    })
  }
})

export const contactReducer = contactSlice.reducer