import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { typeLogin } from '../../types/auth.type'
import authAdminAPI from '../../api/admin/authAdmin.api'
import type { typeProfileAdmin, typeUpdateAdmin } from '../../types/admin/profileAdmin.type'

const initialState: { currentAdmin: typeProfileAdmin | null } = {
    currentAdmin: null
}

export const onLogin = createAsyncThunk(
    'admin/onLogin',
    async ({ email, password, deviceId }: typeLogin) => {
        const res = await authAdminAPI.onLogin({ email, password, deviceId })
        return res.data.data as typeProfileAdmin
    }
)

export const onUpdateProfileAdmin = createAsyncThunk(
    'admin/onUpdate',
    async (payload: typeUpdateAdmin) => {
        const res = await authAdminAPI.onUpdateProfileAdmin(payload)
        return res.data.data as typeProfileAdmin
    }
)

// export const onUpdateAvatar = createAsyncThunk(
//     'user/onUpdateAvatar',
//     async (payload: { fileName: string }) => {
//         const res = await userApi.onUpdateAvatar(payload)
//         return res.data.data as ProfileData
//     }
// )P

export const onGetProfileAdmin = createAsyncThunk(
    'admin/onGetProfileAdmin',
    async () => {
        const res = await authAdminAPI.onGetProfileAdmin();
        return res.data.data as typeProfileAdmin
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
        builder.addCase(onUpdateProfileAdmin.fulfilled, (state, action) => {
            state.currentAdmin = action.payload
        })
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
