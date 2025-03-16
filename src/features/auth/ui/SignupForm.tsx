import React from 'react';
import {
    SignupFormValues,
    SignupError,
    Input,
    SubmitButton,
} from '../../../shared';

interface SignupFormProps {
    form: SignupFormValues;
    error: SignupError;
    isSubmitting: boolean;
    isSuccess: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
    form,
    error,
    isSubmitting,
    isSuccess,
    onChange,
    onSubmit,
}) => {
    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-screen w-[75rem] flex justify-center items-center grid grid-cols-12 gap-6 ">
            <div className="space-y-6 col-start-5 col-end-9 h-full flex flex-col justify-center">
                <div className="p-6 space-y-6 bg-white rounded-xl shadow-md border border-gray-200">
                    <h1 className="text-2xl font-bold text-center text-gray-900">
                        회원가입
                    </h1>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <Input
                            type="email"
                            name="email"
                            value={form.email}
                            placeholder="이메일"
                            onChange={onChange}
                            error={error.email}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:ring-purple-500 focus:border-purple-500"
                        />
                        <Input
                            type="password"
                            name="password"
                            value={form.password}
                            placeholder="비밀번호"
                            onChange={onChange}
                            error={error.password}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:ring-purple-500 focus:border-purple-500"
                        />
                        <Input
                            type="password"
                            name="passwordConfirm"
                            value={form.passwordConfirm}
                            placeholder="비밀번호 확인"
                            onChange={onChange}
                            error={error.passwordConfirm}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:ring-purple-500 focus:border-purple-500"
                        />
                        <Input
                            type="text"
                            name="nickname"
                            value={form.nickname}
                            placeholder="닉네임"
                            onChange={onChange}
                            error={error.nickname}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:ring-purple-500 focus:border-purple-500"
                        />

                        <SubmitButton
                            isSubmit={true}
                            label={isSubmitting ? '가입 중...' : '가입하기'}
                            disabled={isSubmitting}
                            color="bg-green-400 text-white"
                            clickColor="hover:bg-green-500 active:bg-green-600"
                            isFit={false}
                        />
                        {isSuccess && (
                            <p className="text-center text-green-500">
                                회원가입이 완료되었습니다!
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
