import MyPageContainer from '../../../features/member/MyPageContainer';
import {
    MyPageForm,
    BioBoard,
    ClipBoard,
    SettingBoard,
} from '../../../components';
import { Route, Routes } from 'react-router-dom';

const MyPage = () => {
    return (
        <Routes>
            <Route path="/" element={<MyPageForm />}>
                <Route index element={<BioBoard />} />
                <Route path="clip" element={<ClipBoard />} />
                <Route path="setting" element={<SettingBoard />} />
            </Route>
        </Routes>
    );
};
export default MyPage;
