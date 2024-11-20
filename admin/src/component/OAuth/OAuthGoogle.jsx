import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../../firebase';
import { loginGoogle } from 'features/auth/authSlice'; // Redux action for handling login


export const OAuthGoogle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuthClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/api/users/google', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
        }),
      }
      );
      const data = await res.json();
      dispatch(loginGoogle(data)); // 로그인 성공 후 Redux에 사용자 데이터 저장
      navigate('/');
    } 
    catch (error) {
      console.error("Could not login...", error);
    }
  };
  
  return (
    <div>
      <button
        type="button"
        onClick={() => handleAuthClick()}
        className=""
      >
        Login with Google
      </button>
    </div>
  );
};
