import { useEffect } from 'react';
import {
  signInWithPopup,
  GithubAuthProvider,
  signInWithRedirect,GoogleAuthProvider,
  getAuth,
  getRedirectResult,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  EmailAuthProvider, 
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginGithub } from 'features/auth/authSlice';
import { app } from '../../firebase';

export const OAuthGithub = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirectResult = async () => {
      const auth = getAuth(app);
      try {
        // 리디렉션 후 인증 결과 확인
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;

          // Firebase Auth 결과를 서버로 전송
          const res = await fetch('/api/users/github', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: user.displayName,
                email: user.email,
              }),
            }
          );

          const data = await res.json();
          dispatch(loginGithub(data));
          navigate('/');
        }
      } catch (error) {
        // 계정 충돌(auth/account-exists-with-different-credential) 처리
        if (error.code === 'auth/account-exists-with-different-credential') {
          const email = error.customData.email;
          const pendingCred = error.credential;

          // 이미 이메일로 등록된 제공자 확인
          const signInMethods = await fetchSignInMethodsForEmail(auth, email);
          if (signInMethods.includes('password')) {
            const password = prompt('Enter your password to link accounts:');
            const credential = EmailAuthProvider.credential(email, password);
            const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
            await linkWithCredential(userCredential.user, credential);
          } else {
            const existingProvider = new GithubAuthProvider();
            const existingResult = await signInWithPopup(auth, existingProvider);
            await linkWithCredential(existingResult.user, pendingCred);
          }
        } else {
          console.error('Error handling redirect result:', error);
        }
      }
    };

    handleRedirectResult();
  }, [dispatch, navigate]);

  const handleAuthClick = (providerType) => {
    const auth = getAuth(app);
    const provider = new GithubAuthProvider();
    // 리디렉션 방식으로 인증
    signInWithRedirect(auth, provider);
  };

  return (
    <div>
      <button type="button" onClick={() => handleAuthClick('github')}>
        Login with GitHub
      </button>
    </div>
  );
};
