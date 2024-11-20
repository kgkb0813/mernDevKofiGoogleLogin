import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { app } from '../../firebase';
import { loginGoogle, loginGithub } from 'features/auth/authSlice'; 
import CustomAlert from "./AlertBox"

export const OAuthGoogleGithub = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuthClick = async (providerType) => {
    try {
      const provider = providerType==='google' ? new GoogleAuthProvider() : new GithubAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch(providerType === 'google' ? '/api/users/google' : '/api/users/github', {
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

      if (!res.ok) {
        throw new Error('Failed to save user on server...');
      }

      const existingEmail = 'kgkb0813@gmail.com';
      const signInMethods = await fetchSignInMethodsForEmail(auth, existingEmail);
      console.log('Sign-in methods for existing email:', signInMethods);
      
      const data = await res.json();
      providerType === 'google' ? dispatch(loginGoogle(data)) : dispatch(loginGithub(data)); // 로그인 성공 후 Redux에 사용자 데이터 저장
      navigate('/');
    } 
    catch (error) {
      console.log("====1234===================")
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        <CustomAlert message="Could not login\n\n Google and Github cannot login with the same email account.\n When you want to login with Github, delete your Google account first." />
        const providerData = user.providerData; // 사용자의 provider 정보 배열
        // alert("Could not login\n\n Google and Github can not login with the same email accoun.\n When you want to login with Github, delete your google account first.")
        providerData.forEach((provider) => {
          console.log('Provider ID:', provider.providerId); // google.com, github.com 등
          console.log('Provider ID:', provider.email); // google.com, github.com 등
        });
      } else {
        console.log('No user is currently logged in.');
      }

      // Ref admin/src/component/OAuth/old(검토용)/OAuthGithub-old2.jsx
      // Firebase 의 Authentication > Settings > User Actions > Email enumeration protection (recommended)  
      // 부분을 disable하며  signInMethods.length=1을 회신한다.
      // 이 경우 보안 문제 발생. 가능한 disable하지 않아여 한다.
      // 관련하여 Firebase 문의결과 보고 추가 코딩 예정
          // if (error.code === 'auth/account-exists-with-different-credential') {
          //   const { email } = error.customData;
          //   const auth = getAuth(app);
          //   try {
          //     console.log('===== email:', email);
          //     console.log('===== auth:', auth);
          //     const signInMethods = await fetchSignInMethodsForEmail(auth, email);
          //     console.log('===== Registered providers:', signInMethods.length); 

          //   }
          //   catch {

          //   }
          // }    
    }
  };
  
  return (
    <div>
      <button type="button" onClick={() => handleAuthClick('google')}>
        Login with Google
      </button>
      <button type="button" onClick={() => handleAuthClick('github')}>
        Login with GitHub
      </button>
    </div>
  );
};
