// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../../features';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

// 타입 추론을 위한 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
