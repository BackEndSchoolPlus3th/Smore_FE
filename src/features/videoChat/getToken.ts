
export async function getToken(): Promise<string> {
    const APPLICATION_SERVER_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:8090/api/v1/' 
        : `https://${window.location.hostname}:6443/`;
    const accessToken = localStorage.getItem('accessToken');
    // const cleanToken = accessToken.replace(/\s+/g, '');  // 공백 제거
    console.log('accessToken ', accessToken);
    try {
        const response = await fetch(APPLICATION_SERVER_URL + 'token', {
            method: 'POST',
            headers: {
                'Authorization': `${accessToken}`,
                'Content-Type': 'application/json'
            },
            
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to get token: ${error.errorMessage}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        throw new Error(`Error fetching token: ${(error as Error).message}`);
    }
}
