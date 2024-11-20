import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GithubAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../../firebase';
import { loginGithub } from 'features/auth/authSlice';

export const OAuthGithub = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuthClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      // 위 문장에서 오류발생. 
      const res = await fetch('/api/users/github', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
        }),
      });
      const data = await res.json();
      dispatch(loginGithub(data)); // Redux에 사용자 데이터 저장
      navigate('/');
    } 
    catch (error) {
      console.error('Could not login...', error);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => handleAuthClick()}
        className=""
      >
        Login with Github
      </button>
    </div>
  );
};

