// src/app/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/model/authSlice'; // default import 사용
import storage from 'redux-persist/lib/storage'; // localStorage 사용
import { persistStore, persistReducer } from 'redux-persist';

// 루트 리듀서 설정
const rootReducer = combineReducers({
    auth: authReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'], // auth 슬라이스만 영속화
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);

// 타입 추론을 위한 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
