import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { ProfileData } from '../../types/profile/profile.model.type'
import type { typeLogin } from '../../types/auth.type'
import authAdminAPI from '../../api/admin/authAdmin.api'

const initialState: { currentAdmin: ProfileData | null } = {
    currentAdmin: null
}

export const onLogin = createAsyncThunk(
    'admin/onLogin',
    async ({ email, password, deviceId }: typeLogin) => {
        const res = await authAdminAPI.onLogin({ email, password, deviceId })
        return res.data.data as ProfileData
    }
)

// export const onUpdateProfile = createAsyncThunk(
//     'user/onUpdate',
//     async (payload: object) => {
//         const res = await userApi.onUpdateUser(payload)
//         return res.data.data as ProfileData
//     }
// )

// export const onUpdateAvatar = createAsyncThunk(
//     'user/onUpdateAvatar',
//     async (payload: { fileName: string }) => {
//         const res = await userApi.onUpdateAvatar(payload)
//         return res.data.data as ProfileData
//     }
// )

export const onGetProfileAdmin = createAsyncThunk(
    'admin/onGetProfileAdmin',
    async () => {
        const res = await authAdminAPI.onGetProfileAdmin();
        return res.data.data as ProfileData
    }
)

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearCurrentAdmin: state => {
            state.currentAdmin = null
        }
    },
    extraReducers: builder => {
        builder.addCase(onLogin.fulfilled, (state, action) => {
            state.currentAdmin = action.payload
        })
        // builder.addCase(onUpdateProfile.fulfilled, (state, action) => {
        //     state.currentUser = action.payload
        // })
        builder.addCase(onGetProfileAdmin.fulfilled, (state, action) => {
            state.currentAdmin = action.payload
        })
        // builder.addCase(onUpdateAvatar.fulfilled, (state, action) => {
        //     state.currentUser = action.payload
        // })
    }
})

export const { clearCurrentAdmin } = adminSlice.actions

export const adminReducer = adminSlice.reducer
