import {
    useState,
    ChangeEvent,
    FormEvent,
    useEffect,
    KeyboardEvent,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../model/authSlice';
import type { AppDispatch, RootState } from '../../../shared';
import { useNavigate } from 'react-router-dom';
import { SubmitButton } from '../../../shared';

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        dispatch(login({ email, password }));
    };

    const handleSignup = () => {
        navigate('/signup');
    };

    useEffect(() => {
        if (auth.user) {
            navigate('/');
        }
    }, [auth.user, navigate]);

    // 엔터 키 이벤트 핸들러 추가
    const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 기본 폼 제출 방지
            handleLogin(); // 로그인 실행
        }
    };

    return (
        <div className="space-y-6 col-start-5 col-end-9 h-full flex flex-col justify-center">
            <div className="p-6 space-y-6 bg-white rounded-xl shadow-md border border-gray-200">
                <h1 className="text-2xl font-bold text-center text-gray-900">
                    로그인
                </h1>
                <div className="space-y-6">
                    <div className="space-y-1">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            이메일 :
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setEmail(e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="space-y-1">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            비밀번호 :
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setPassword(e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex justify-center flex-col space-y-4">
                        {auth.loading ? (
                            <p className="text-center text-gray-500">
                                로그인 중...
                            </p>
                        ) : (
                            <SubmitButton
                                onClick={handleLogin}
                                label="로그인"
                                clickColor="hover:bg-blue-50 active:bg-blue-100"
                            />
                        )}
                        {auth.error && (
                            <p className="text-center text-red-500">
                                {auth.error}
                            </p>
                        )}
                        <SubmitButton
                            onClick={handleSignup}
                            label="회원가입"
                            clickColor="hover:bg-green-50 active:bg-green-100"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
