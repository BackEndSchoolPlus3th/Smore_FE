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
                <Route path="heart" element={<ClipBoard />} />
                <Route path="setting" element={<SettingBoard />} />
            </Route>
        </Routes>
    );
};
export default MyPage;
