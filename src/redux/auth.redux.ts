import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { ProfileData } from '../types/data.type'
import type { RootState } from './store'
import authApi from '../api/Auth.api'
import type { typeLogin } from '../types/auth.type'

const initialState: { currentUser: ProfileData | null } = {
  currentUser: null
}

export const onLogin = createAsyncThunk(
  'user/onLogin',
  async ({ email, password, deviceId }: typeLogin) => {
    const res = await authApi.onLogin({ email, password, deviceId })
    return res.data.data as ProfileData
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearCurrentUser: state => {
      state.currentUser = null
    }
  },
  extraReducers: builder => {
    builder.addCase(onLogin.fulfilled, (state, action) => {
      state.currentUser = action.payload
    })
  }
})

export const { clearCurrentUser } = userSlice.actions
export const SelectcurrentUser = (state: RootState) => state.user.currentUser
export const userReducer = userSlice.reducer