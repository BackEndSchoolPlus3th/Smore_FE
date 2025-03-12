const BioBoard: React.FC = () => {
    const profileData = {
        email: "aaa@email.com",
        nickname: "My_nickName",
        birthdate: "2000-01-01",
        region: "서울",
        hashtags: "#자바 #스프링부트"
      };

    return (
        <div className="flex flex-col items-center max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-2">마이페이지</h1>

      
            {/* <div className="w-full space-y-4">
                <div className="flex items-center">
                    <span className="w-24 text-right mr-4">이메일</span>
                    <div className="flex-1 p-2 border border-gray-300 rounded bg-gray-50">{profileData.email}</div>
                </div>
        
                <div className="flex items-center">
                    <span className="w-24 text-right mr-4">닉네임</span>
                    <div className="flex-1 p-2 border border-gray-300 rounded bg-gray-50">{profileData.nickname}</div>
                </div>
            
                <div className="flex items-center">
                    <span className="w-24 text-right mr-4">생일</span>
                    <div className="flex-1 p-2 border border-gray-300 rounded bg-gray-50">{profileData.birthdate}</div>
                </div>
            
                <div className="flex items-center">
                    <span className="w-24 text-right mr-4">지역</span>
                    <div className="flex-1 p-2 border border-gray-300 rounded bg-gray-50">{profileData.region}</div>
                </div>
            
                <div className="flex items-center">
                    <span className="w-24 text-right mr-4">해시태그</span>
                    <div className="flex-1 p-2 border border-gray-300 rounded bg-gray-50">{profileData.hashtags}</div>
                </div>
            </div> */}
    </div>
  );
};

export default BioBoard;
