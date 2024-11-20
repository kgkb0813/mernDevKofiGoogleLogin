import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../../firebase';
import { loginGoogle, loginGithub } from 'features/auth/authSlice'; 
import Swal from 'sweetalert2';

export const OAuthGoogleGithub = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuthClick = async (providerType) => {
    try {
      const provider = providerType==='google' ? new GoogleAuthProvider() : new GithubAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const type = providerType;
      
      const dataToSubmit = {
        name: providerType==='google' ?  result.user.displayName: result._tokenResponse.screenName, 
        email: result.user.email,
        loginType: type,
      };
      providerType==='google' ? dispatch(loginGoogle(dataToSubmit)) : dispatch(loginGithub(dataToSubmit));
      navigate('/');
    } 
    catch (error) {     
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const providerData = user.providerData; // 사용자의 provider 정보 배열
        providerData.forEach((provider) => {
            console.log('Provider ID:', provider.providerId); // google.com, github.com 등
            console.log('Provider ID:', provider.email); // google.com, github.com 등
            let comt1 = "Login Failed!";
            let comt2 = "Google is already registered"; 
            let comt3 = `with the same email account:`; 
            let comt4 = `${provider.email}`; 
            let comt5 = "When you want to log in with Github,";
            let comt6 = "delete your google account first.";
            Swal.fire({
              title: `${comt1}`,
              html: `${comt2}<br>${comt3}<br>${comt4}<br>${comt5}<br>${comt6}`,
              imageUrl: 'https://cdn.pixabay.com/photo/2016/09/01/08/25/smiley-1635454_1280.png',
              imageWidth: 100,
              imageHeight: 100,
              imageAlt: 'Custom image',
            })
          });
          
                    
      } else {
        console.log('No user is currently logged in.');
      }
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
