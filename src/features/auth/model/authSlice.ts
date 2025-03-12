// src/features/auth/model/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../../../shared';

export interface User {
    nickname: string;
    hashTags: string[];
    profileImageUrl: string | null;
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async (
        credentials: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.post(
                '/api/member/login',
                credentials
            );
            return { user: response.data };
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(
                    (error as { response?: { data: string } }).response?.data ||
                        '로그인 실패'
                );
            }
            return rejectWithValue('로그인 실패');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
        },
        updateUser(state, action: PayloadAction<Partial<User>>) {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                login.fulfilled,
                (state, action: PayloadAction<{ user: User }>) => {
                    state.loading = false;
                    state.user = action.payload.user;
                }
            )
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
export const authReducer = authSlice.reducer;
