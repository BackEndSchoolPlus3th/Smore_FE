// import './LoginPage.css';
import { LoginForm } from '../../../../features';

const LoginPage = () => {
    return (
        <div className="flex h-full w-full items-center justify-center text-center">
            <div className="w-md h-md">
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;
