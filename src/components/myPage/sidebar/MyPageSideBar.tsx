import { ProfileWidget, NavigationMenuWidget } from '../../../widgets';

const MyPageSideBar: React.FC = () => {
    return (
        <div className="flex flex-col items-center w-full h-full p-8 bg-white">
            {/* 프로필 아이콘 영역 */}
            <ProfileWidget />

            {/* 구분선 */}
            <div className="w-full border-b border-gray-200 mb-6"></div>

            {/* 네비게이션 메뉴 */}
            <NavigationMenuWidget />
        </div>
    );
};

export default MyPageSideBar;
