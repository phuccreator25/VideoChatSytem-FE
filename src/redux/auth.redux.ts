import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { ProfileData } from '../types/profile/profile.model.type'
import type { RootState } from './store'
import authApi from '../api/Auth.api'
import type { typeLogin } from '../types/auth.type'
import userApi from '../api/User.api'

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

export const onUpdateProfile = createAsyncThunk(
  'user/onUpdate',
  async (payload: object) => {
    const res = await userApi.onUpdateUser(payload)
    return res.data.data as ProfileData
  }
)

export const onUpdateAvatar = createAsyncThunk(
  'user/onUpdateAvatar',
  async (payload: FormData) => {
    const res = await userApi.onUpdateAvatar(payload)
    return res.data.data as ProfileData
  }
)

export const onGetProfile = createAsyncThunk(
  'user/onGetProfile',
  async () => {
    const res = await userApi.onGetDataUser();
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
    builder.addCase(onUpdateProfile.fulfilled, (state, action) => {
      state.currentUser = action.payload
    })
    builder.addCase(onGetProfile.fulfilled, (state, action) => {
      state.currentUser = action.payload
    })
    builder.addCase(onUpdateAvatar.fulfilled, (state, action) => {
      state.currentUser = action.payload
    })
  }
})

export const { clearCurrentUser } = userSlice.actions
export const SelectcurrentUser = (state: RootState) => state.user.currentUser
export const userReducer = userSlice.reducer
