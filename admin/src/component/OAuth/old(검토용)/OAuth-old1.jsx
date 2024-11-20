
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../../firebase';
import { loginGoogle } from 'features/auth/authSlice'; // Redux action for handling login

export const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 공통 핸들러 함수
  const handleAuthClick = async (providerType) => {
    try {
      const provider = providerType === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log("== result: ", result)


      const res = await fetch(providerType === 'google' ? '/api/users/google' : '/api/users/github', {
        // const res = await fetch('/api/users/google', {
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
      console.error(`Could not login with ${providerType}`, error);
    }
  };
  
  return (
    <div>
      <button
        type="button"
        onClick={() => handleAuthClick('google')}
        className=""
      >
        Login with Google
      </button>
      <button
        type="button"
        onClick={() => handleAuthClick('github')}
        className=""
      >
        Login with GitHub
      </button>
    </div>
  );
};





// == Only for Google ==================================================
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
// import { app } from '../../firebase';
// import { loginGoogle } from 'features/auth/authSlice';    // import { signInSuccess } from '../redux/user/userSlice';

// export const OAuth = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleGoogleClick = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const auth = getAuth(app);
//       const result = await signInWithPopup(auth, provider);

//       const res = await fetch('/api/users/google', {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: result.user.displayName,
//           email: result.user.email,
//         }),
//       });
//       const data = await res.json();
//       dispatch(loginGoogle(data));
//       navigate('/');
//     } catch (error) {
//       console.log('could not login with google', error);
//     }
//   };

//   return (
//     <button
//       type='button'
//       onClick={handleGoogleClick}
//       className=''
//     >
//       Login with Google
//     </button>
//   );
// }
