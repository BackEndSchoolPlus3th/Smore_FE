import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md text-center">
                <h1 className="text-6xl font-bold text-red-500 mb-4">Oops!</h1>
                <p className="text-xl text-gray-700 mb-8">
                    Something went wrong. We couldn't process your request.
                </p>
                <div className="flex space-x-4">
                    <button
                        onClick={handleGoBack}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={handleGoHome}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
