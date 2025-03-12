import { Route, Routes } from 'react-router-dom';
import {
    ChatPageForm,
    ChatBoard,
    // VideoChatBoard
} from '../../components';

const ChatPage = () => {
    return (
        <Routes>
            <Route path="/" element={<ChatPageForm />}>
                <Route index element={<ChatBoard />} />
                {/* <Route path="/videochat" element={<VideoChatBoard />} /> */}
            </Route>
        </Routes>
    );
};
export default ChatPage;