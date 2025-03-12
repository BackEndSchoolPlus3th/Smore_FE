import React from 'react';
import { apiClient } from '../../shared';

const MyPageContainer: React.FC<MyPageContainerProps> = ({ userId }) => {
  const [user, setUser] = React.useState<"" | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`api/v1/member/mypage`);

        setUser(response.data.MyPageDto);
        console.log(response.data.MyPageDto);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!user) {
    return <div>사용자 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <h2>마이 페이지</h2>
      <div>
        <strong>닉네임:</strong> {user.nickName}
      </div>
      <div>
        <strong>이메일:</strong> {user.email}
      </div>
      <div>
        <strong>생일:</strong> {user.birthdate}
      </div>
      <div>
        <strong>지역:</strong> {user.region}
      </div>
      <div>
        <strong>해시태그:</strong> {user.hashTags}
      </div>
      <div>
        <strong>프로필이미지:</strong> {user.profileImageUrl}
      </div>
      

    </div>
  );
}
interface MyPageContainerProps {
  userId: number;
}

export default MyPageContainer;