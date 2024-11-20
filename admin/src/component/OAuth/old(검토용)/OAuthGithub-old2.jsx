import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  GithubAuthProvider,
  signInWithPopup,
  getAuth,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { app } from '../../firebase';
import { loginGithub } from 'features/auth/authSlice';

export const OAuthGithub = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuthClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      const auth = getAuth(app);

      // 팝업을 통해 GitHub로 로그인 시도
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 서버와 통신하여 사용자 데이터 저장
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
      });

      if (!res.ok) {
        throw new Error('Failed to save user on server');
      }

      const data = await res.json();
      dispatch(loginGithub(data)); // Redux에 사용자 데이터 저장
      navigate('/');
    } 
    catch (error) {
      console.error('Could not login...', error);

      if (error.code === 'auth/account-exists-with-different-credential') {
        const { email } = error.customData;
        console.log('== email:', email);

        // 이미 등록된 이메일의 인증 제공자 확인
        const auth = getAuth(app);

        try {
          const signInMethods = await fetchSignInMethodsForEmail(auth, email);
          console.log('Registered providers:', signInMethods);

          // 서버에 계정 삭제 요청
          if (signInMethods.length > 0) {
            const deleteResponse = await fetch('/api/deleteUser', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email }),
            });

            if (deleteResponse.ok) {
              console.log('User account deleted. Please try again.');
            } else {
              console.error('Failed to delete user on the server.');
            }
          }
        } catch (fetchError) {
          console.error('Error fetching sign-in methods:', fetchError);
        }
      }
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



// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { 
//   GithubAuthProvider, 
//   signInWithPopup, 
//   getAuth, 
//   fetchSignInMethodsForEmail, 
//   deleteUser 
// } from 'firebase/auth';
// import { app } from '../../firebase';
// import { loginGithub } from 'features/auth/authSlice';

// export const OAuthGithub = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleAuthClick = async () => {
//     try {
//       const provider = new GithubAuthProvider();
//       provider.addScope('user:email'); // GitHub 이메일 스코프 추가
//       const auth = getAuth(app);

//       // GitHub로 로그인
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       // GitHub API로 이메일 가져오기 (필요 시)
//       if (!user.email) {
//         const githubAccessToken = GithubAuthProvider.credentialFromResult(result).accessToken;
//         const response = await fetch('https://api.github.com/user/emails', {
//           headers: {
//             Authorization: `token ${githubAccessToken}`,
//           },
//         });
//         const emails = await response.json();
//         user.email = emails.find(email => email.primary)?.email || emails[0]?.email;
//       }

//       console.log("GitHub Email:", user.email);

//       // 이미 등록된 이메일의 인증 제공자 확인
//       const signInMethods = await fetchSignInMethodsForEmail(auth, user.email);
//       console.log("Sign-in Methods:", signInMethods);

//       if (signInMethods.length > 0) {
//         // 기존 계정 삭제 또는 다른 작업 수행
//         const existingUser = await signInWithPopup(auth, new GithubAuthProvider());
//         await deleteUser(existingUser.user);
//         console.log('Existing account deleted.');
//         handleAuthClick(); // 계정 삭제 후 재로그인
//       } else {
//         // 서버와 통신하여 사용자 데이터 저장
//         const res = await fetch('/api/users/github', {
//           method: 'POST',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             name: user.displayName,
//             email: user.email,
//           }),
//         });

//         if (!res.ok) {
//           throw new Error('Failed to save user on server');
//         }

//         const data = await res.json();
//         dispatch(loginGithub(data)); // Redux에 사용자 데이터 저장
//         navigate('/');
//       }
//     } 
//     catch (error) {
//       console.error("Could not login...", error);
//     }
//   };

//   return (
//     <div>
//       <button
//         type="button"
//         onClick={() => handleAuthClick()}
//         className=""
//       >
//         Login with Github
//       </button>
//     </div>
//   );
// };



// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { 
//   GithubAuthProvider, 
//   signInWithPopup, 
//   getAuth, 
//   fetchSignInMethodsForEmail, 
//   deleteUser 
// } from 'firebase/auth';
// import { app } from '../../firebase';
// import { loginGithub } from 'features/auth/authSlice';

// export const OAuthGithub = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleAuthClick = async () => {
//     try {
//       const provider = new GithubAuthProvider();
//       const auth = getAuth(app);
      
//       // 팝업을 통해 GitHub로 로그인 시도
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       // 서버와 통신하여 사용자 데이터 저장
//       const res = await fetch('/api/users/github', {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: user.displayName,
//           email: user.email,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error('Failed to save user on server');
//       }

//       const data = await res.json();
//       dispatch(loginGithub(data)); // Redux에 사용자 데이터 저장
//       navigate('/');
//     } 
//     catch (error) {
//       console.error("Could not login...", error);
    
//       if (error.code === 'auth/account-exists-with-different-credential') {
//         const { email } = error.customData;
//         console.log("== email:", email);
    
//         // 이미 등록된 이메일의 인증 제공자 확인
//         const auth = getAuth(app);
    
//         try {
//           const user = await auth.fetchUser(email); // Firebase에 등록된 사용자 직접 조회
//           if (user.providerData.length > 0) {
//             console.log("User's registered providers:", user.providerData);
//           } else {
//             console.warn("No provider data found for this user.");
//           }
//         } catch (userError) {
//           console.error("Error fetching user data:", userError);
//         }
//       }
//     }
//   };

//   return (
//     <div>
//       <button
//         type="button"
//         onClick={() => handleAuthClick()}
//         className=""
//       >
//         Login with Github
//       </button>
//     </div>
//   );
// };


// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { 
//   GithubAuthProvider, 
//   signInWithPopup, 
//   getAuth, 
//   fetchSignInMethodsForEmail, 
//   deleteUser 
// } from 'firebase/auth';
// import { app } from '../../firebase';
// import { loginGithub } from 'features/auth/authSlice';

// export const OAuthGithub = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleAuthClick = async () => {
    
//     try {
//       const provider = new GithubAuthProvider();
//       const auth = getAuth(app);
      
//       // 팝업을 통해 GitHub로 로그인 시도
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       // 서버와 통신하여 사용자 데이터 저장
//       const res = await fetch('/api/users/github', {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: user.displayName,
//           email: user.email,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error('Failed to save user on server');
//       }

//       const data = await res.json();
//       dispatch(loginGithub(data)); // Redux에 사용자 데이터 저장
//       navigate('/');
//     } 
//     catch (error) {
//       console.error("Could not login...", error);

//       if (error.code === 'auth/account-exists-with-different-credential') {
//         const { email } = error.customData;
//         console.log("== email:",email);
        
//         // 이미 등록된 이메일의 인증 제공자 확인
//         const auth = getAuth(app);
//         console.log("== auth:",auth);
//         const signInMethods = await fetchSignInMethodsForEmail(auth, email);
//         console.log("== signInMethods:",signInMethods);

//         if (signInMethods.length > 0) {
//           try {
//             // 기존 계정을 삭제
//             const existingUser = await signInWithPopup(auth, new GithubAuthProvider());
//             await deleteUser(existingUser.user); // 사용자 계정 삭제

//             console.log('Existing account deleted. Retrying login...');
//             // 계정 삭제 후 다시 로그인 시도
//             handleAuthClick();
//           } catch (deleteError) {
//             console.error('Failed to delete existing account:', deleteError);
//           }
//         }
//       }
//     }
//   };

//   return (
//     <div>
//       <button
//         type="button"
//         onClick={() => handleAuthClick()}
//         className=""
//       >
//         Login with Github
//       </button>
//     </div>
//   );
// };



// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { 
//   GithubAuthProvider, 
//   GoogleAuthProvider, 
//   signInWithPopup, 
//   getAuth, 
//   fetchSignInMethodsForEmail, 
//   linkWithCredential 
// } from 'firebase/auth';
// import { app } from '../../firebase';
// import { loginGithub } from 'features/auth/authSlice';

// export const OAuthGithub = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const providerMap = {
//     'google.com': GoogleAuthProvider,
//     'github.com': GithubAuthProvider,
//   };

//   const handleAuthClick = async () => {
//     const auth = getAuth(app);
//     const provider = new GithubAuthProvider();

//     try {
//       // Popup으로 GitHub 인증 시도
//       const result = await signInWithPopup(auth, provider);
//       const credential = GithubAuthProvider.credentialFromResult(result);
//       const email = result.user.email;

//       // 이메일로 로그인 가능한 인증 방법 확인
//       const signInMethods = await fetchSignInMethodsForEmail(auth, email);

//       if (signInMethods.length > 0 && !signInMethods.includes(GithubAuthProvider.PROVIDER_ID)) {
//         // 이미 다른 제공자로 계정이 연결된 경우
//         throw { code: 'auth/account-exists-with-different-credential', email, credential };
//       }

//       // 서버와 연동하여 사용자 정보를 저장
//       const res = await fetch('/api/users/github', {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: result.user.displayName,
//           email: email,
//         }),
//       });

//       const data = await res.json();
//       dispatch(loginGithub(data)); // Redux에 사용자 데이터 저장
//       navigate('/');
//     } catch (error) {
//       if (error.code === 'auth/account-exists-with-different-credential') {
//         await handleAccountLink(auth, provider, error);
//       } else {
//         console.error('Could not login...', error);
//       }
//     }
//   };

//   const handleAccountLink = async (auth, provider, error) => {
//     try {
//       const { email, credential } = error;
  
//       if (!email) {
//         throw new Error("No email found in the error object");
//       }
  
//       // 이미 등록된 이메일에 대한 인증 방법 확인
//       const signInMethods = await fetchSignInMethodsForEmail(auth, email);
  
//       if (signInMethods.length > 0) {
//         // 기존 제공자를 사용하여 로그인
//         const existingProviderId = signInMethods[0];
//         const ExistingProvider = providerMap[existingProviderId];
  
//         if (!ExistingProvider) {
//           throw new Error(`Unsupported provider: ${existingProviderId}`);
//         }
  
//         const existingProvider = new ExistingProvider();
//         const existingUser = await signInWithPopup(auth, existingProvider);
  
//         // 기존 계정에 새 자격 증명 추가 (계정 병합)
//         await linkWithCredential(existingUser.user, credential);
  
//         console.log('Account successfully linked.');
//       }
//     } catch (linkError) {
//       console.error('Account linking failed:', linkError);
//     }
//   };

  

  // const handleAccountLink = async (auth, provider, error) => {
  //   try {
  //     const { email, credential } = error;
  //     const signInMethods = await fetchSignInMethodsForEmail(auth, email);

  //     if (signInMethods.length > 0) {
  //       // 기존 제공자 확인 및 연결
  //       const existingProvider = new providerMap[signInMethods[0]]();
  //       const existingUser = await signInWithPopup(auth, existingProvider);

  //       // 기존 계정에 새 자격 증명 연결
  //       await linkWithCredential(existingUser.user, credential);
  //       console.log('Account linked successfully.');
  //     }
  //   } catch (linkError) {
  //     console.error('Account linking failed:', linkError);
  //   }
  // };

//   return (
//     <div>
//       <button type="button" onClick={handleAuthClick} className="">
//         Login with Github
//       </button>
//     </div>
//   );
// };




// import { useEffect } from 'react';
// import { GithubAuthProvider, getAuth, getRedirectResult, signInWithRedirect } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { loginGoogle } from 'features/auth/authSlice';
// import { app } from '../../firebase';

// export const OAuthGithub = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleRedirectResult = async () => {
//       const auth = getAuth(app);
//       try {
//         // 리디렉션 결과 확인
//         const result = await getRedirectResult(auth);
//         console.log('======== Redirect result:', result);

//         if (result) {
//           const user = result.user;

//           // Firebase Auth 결과를 서버로 전송
//           const res = await fetch('/api/users/github', {
//             method: 'POST',
//             credentials: 'include',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               name: user.displayName,
//               email: user.email,
//             }),
//           });

//           const data = await res.json();
//           dispatch(loginGoogle(data));
//           navigate('/'); // 로그인 후 메인 페이지로 이동
//         } else {
//           console.log('No redirect result found. User may not have completed the login process.');
//         }
//       } catch (error) {
//         console.error('Error processing GitHub redirect result:', error);
//       }
//     };

//     // 페이지가 로드되었을 때 리디렉션 결과 확인
//     handleRedirectResult();
//   }, [dispatch, navigate]);

//   const handleGithubLogin = () => {
//     const auth = getAuth(app);
//     const provider = new GithubAuthProvider();
//     signInWithRedirect(auth, provider); // 리디렉션으로 인증 시작
//   };

//   return (
//     <div>
//       <button type="button" onClick={handleGithubLogin}>
//         Login with GitHub
//       </button>
//     </div>
//   );
// };



// import { useEffect } from 'react';
// import { GithubAuthProvider, getAuth, getRedirectResult, signInWithRedirect } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { loginGoogle } from 'features/auth/authSlice';
// import { app } from '../../firebase';

// export const OAuthGithub = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleRedirectResult = async () => {
//       const auth = getAuth(app);
//       try {
//         const result = await getRedirectResult(auth);
//         console.log('======== Redirect result:', result);

//         if (result) {
//           const user = result.user;

//           // Firebase Auth 결과를 서버로 전송
//           const res = await fetch('/api/users/github', {
//             method: 'POST',
//             credentials: 'include',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               name: user.displayName,
//               email: user.email,
//             }),
//           });

//           const data = await res.json();
//           dispatch(loginGoogle(data));
//           navigate('/'); // 로그인 후 메인 페이지로 이동
//         } else {
//           console.log('No redirect result found. User may not have completed the login process.');
//         }
//       } catch (error) {
//         console.error('Error processing GitHub redirect result:', error);
//       }
//     };

//     handleRedirectResult();
//   }, [dispatch, navigate]);

//   const handleGithubLogin = () => {
//     const auth = getAuth(app);
//     const provider = new GithubAuthProvider();
//     signInWithRedirect(auth, provider); // 여기에 올바른 함수 사용
//   };

//   return (
//     <div>
//       <button type="button" onClick={handleGithubLogin}>
//         Login with GitHub
//       </button>
//     </div>
//   );
// };



// import { useEffect } from 'react';
// import {
//   GithubAuthProvider,
//   getAuth,
//   getRedirectResult,
//   signInWithRedirect,
// } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { loginGoogle } from 'features/auth/authSlice';
// import { app } from '../../firebase';

// export const OAuthGithub = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleRedirectResult = async () => {
//       const auth = getAuth(app);
//       console.log('======== auth:', auth);
//       try {
//         const result = await getRedirectResult(auth);
//         console.log('======== Redirect result:', result);
//         if (result) {
//           const user = result.user;

//           // Firebase Auth 결과를 서버로 전송
//           const res = await fetch('/api/users/github', {
//             method: 'POST',
//             credentials: 'include',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               name: user.displayName,
//               email: user.email,
//             }),
//           });

//           const data = await res.json();
//           dispatch(loginGoogle(data));
//           navigate('/'); // 로그인 후 메인 페이지로 이동
//         }
//       } catch (error) {
//         console.error('Error processing GitHub redirect result:', error);
//       }
//     };

//     handleRedirectResult();
//   }, [dispatch, navigate]);

//   const handleGithubLogin = () => {
//     const auth = getAuth(app);
//     const provider = new GithubAuthProvider();
//     signInWithRedirect(auth, provider); // 여기에 올바른 함수 사용
//   };

//   return (
//     <div>
//       <button type="button" onClick={handleGithubLogin}>
//         Login with GitHub
//       </button>
//     </div>
//   );
// };




// import { useEffect } from 'react';
// import {
//   signInWithPopup,
//   GoogleAuthProvider,
//   GithubAuthProvider,
//   signInWithRedirect,
//   getAuth,
//   getRedirectResult,
//   fetchSignInMethodsForEmail,
//   linkWithCredential,
//   EmailAuthProvider,
// } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { loginGoogle, loginGithub } from 'features/auth/authSlice';
// import { app } from '../../firebase';

// export const OAuthGithub = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleRedirectResult = async () => {
//       const auth = getAuth(app);
//       try {
//         // 리디렉션 후 인증 결과 확인
//         const result = await getRedirectResult(auth);
//         if (result) {
//           const user = result.user;

//           // Firebase Auth 결과를 서버로 전송
//           const res = await fetch('/api/users/github', {
//               method: 'POST',
//               credentials: 'include',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 name: user.displayName,
//                 email: user.email,
//               }),
//             }
//           );

//           const data = await res.json();
//           dispatch(loginGithub(data));
//           navigate('/');
//         }
//       } catch (error) {
//         // 계정 충돌(auth/account-exists-with-different-credential) 처리
//         if (error.code === 'auth/account-exists-with-different-credential') {
//           const email = error.customData.email;
//           const pendingCred = error.credential;

//           // 이미 이메일로 등록된 제공자 확인
//           const signInMethods = await fetchSignInMethodsForEmail(auth, email);
//           if (signInMethods.includes('password')) {
//             const password = prompt('Enter your password to link accounts:');
//             const credential = EmailAuthProvider.credential(email, password);
//             const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
//             await linkWithCredential(userCredential.user, credential);
//           } else {
//             const existingProvider = new GithubAuthProvider();
//             const existingResult = await signInWithPopup(auth, existingProvider);
//             await linkWithCredential(existingResult.user, pendingCred);
//           }
//         } else {
//           console.error('Error handling redirect result:', error);
//         }
//       }
//     };

//     handleRedirectResult();
//   }, [dispatch, navigate]);

//   const handleAuthClick = () => {
//     const auth = getAuth(app);
//     const provider = new GithubAuthProvider();

//     // 리디렉션 방식으로 인증
//     signInWithRedirect(auth, provider);
//   };

//   return (
//     <div>
//       <button type="button" onClick={() => handleAuthClick()}>
//         Login with GitHub
//       </button>
//     </div>
//   );
// };






//==================접속오류가 있는 코드 =========================================
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { GithubAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
// import { app } from '../../firebase';
// import { loginGithub } from 'features/auth/authSlice';

// export const OAuthGithub = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // 공통 핸들러 함수
//   const handleAuthClick = async () => {
//     try {
//       const provider = new GithubAuthProvider();
//       const auth = getAuth(app);
//       const result = await signInWithPopup(auth, provider);

//       const res = await fetch('/api/users/github', {
//           method: 'POST',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             name: result.user.displayName,
//             email: result.user.email,
//           }),
//         }
//       );
      
//       const data = await res.json();
//       dispatch(loginGithub(data)); // 로그인 성공 후 Redux에 사용자 데이터 저장
//       navigate('/');
//     } 
//     catch (error) {
//       console.error("Could not login...", error);
//     }
//   };
  
//   return (
//     <div>
//       <button
//         type="button"
//         onClick={() => handleAuthClick()}
//         className=""
//       >
//         Login with Github
//       </button>
//     </div>
//   );
// };
