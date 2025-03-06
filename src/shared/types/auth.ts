// 회원가입 폼에서 사용하는 타입 정의
export interface SignupFormValues {
    email: string;
    password: string;
    passwordConfirm: string;
    nickname: string;
}

export interface SignupError {
    email?: string;
    password?: string;
    passwordConfirm?: string;
    nickname?: string;
}
