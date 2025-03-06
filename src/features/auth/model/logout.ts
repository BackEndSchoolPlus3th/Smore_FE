// src/features/auth/hooks/useLogout.ts
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../shared';
import { logout } from '../model/authSlice';

export const useLogout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await apiClient.post('/member/logout');
            localStorage.removeItem('accessToken');
            dispatch(logout());
            navigate('/login');
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    return handleLogout;
};
