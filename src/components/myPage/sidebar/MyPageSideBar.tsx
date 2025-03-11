import { Link } from 'react-router-dom';

const MyPageSideBar: React.FC = () => {
    return (
        <div>
            <h1>사이드바</h1>
            <ul>
                <li>
                    <Link to="/mypage">프로필</Link>
                </li>
                <li>
                    <Link to="/mypage/clip">좋아요 목록</Link>
                </li>
                <li>
                    <Link to="/mypage/setting">설정</Link>
                </li>
            </ul>
        </div>
    );
};

export default MyPageSideBar;
