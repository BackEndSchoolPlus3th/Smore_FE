import { SignupFormValues } from '../../../shared/types/auth';
import { apiClient } from '../../../shared';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../model/authSlice';

// 회원가입 API
export const signup = async (formData: SignupFormValues) => {
    const response = await apiClient.post('/api/member/signup', formData);
    return response;
};

// 로그아웃 API
export const useLogout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await apiClient.post('/api/member/logout');
            localStorage.removeItem('accessToken');
            dispatch(logout());
            navigate('/login');
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    return handleLogout;
};
