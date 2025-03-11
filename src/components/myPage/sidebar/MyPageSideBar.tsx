import { Link } from 'react-router-dom';
import {Smile} from 'lucide-react';

const MyPageSideBar: React.FC = () => {
    return (
        <div>
            <h1>사이드바</h1>
            <ul>
                <li>
                    <Smile className="w-32 h-32 text-gray-500" />
                </li>
                <li className="text-lg font-bold">NickName</li>
                {/* 사이여백 */}
                <li className="h-4"></li>                 
                <li>
                    <Link to="/mypage">프로필</Link>
                </li>
                <li className="h-4"></li>
                <li>
                    <Link to="/mypage/clip">좋아요 목록</Link>
                </li>
                <li className="h-4"></li>
                <li>
                    <Link to="/mypage/setting">설정</Link>
                </li>
            </ul>
        </div>
    );
};

export default MyPageSideBar;
