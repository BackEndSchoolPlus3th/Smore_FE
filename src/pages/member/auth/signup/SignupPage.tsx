import React, { useState } from 'react';
import { SignupForm, signup } from '../../../../features';
import { SignupFormValues, SignupError } from '../../../../shared';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<SignupFormValues>({
        email: '',
        password: '',
        passwordConfirm: '',
        nickname: '',
    });
    const [error, setError] = useState<SignupError>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError({});

        // 간단한 클라이언트 유효성 검사
        if (form.password !== form.passwordConfirm) {
            setError((prev) => ({
                ...prev,
                passwordConfirm: '비밀번호가 일치하지 않습니다.',
            }));
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await signup(form);
            console.log('response::::', response);
            if (response.status == 409) {
                setError({ email: '이미 가입된 이메일입니다.' });
                setIsSubmitting(false);
                return;
            }
            setIsSuccess(true);
            alert('회원가입이 완료되었습니다.');
            navigate('/');
        } catch (err: unknown) {
            if (
                err instanceof Error &&
                (err as { response?: { data?: SignupError } }).response &&
                (err as { response?: { data?: SignupError } }).response?.data
            ) {
                setError(
                    (err as unknown as { response: { data: SignupError } })
                        .response.data
                );
            } else {
                setError({ email: '회원가입 중 에러가 발생했습니다.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SignupForm
            form={form}
            error={error}
            isSubmitting={isSubmitting}
            isSuccess={isSuccess}
            onChange={handleChange}
            onSubmit={handleSubmit}
        />
    );
};

export default SignupPage;
