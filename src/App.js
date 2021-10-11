import './App.css';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import initializeAuthentication from './firebase/firebase.init';
import { useState } from 'react';


initializeAuthentication();
const GoogleProvider = new GoogleAuthProvider();


function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(false);


  const auth = getAuth();

  const handleGoogelSignIn = () => {
    signInWithPopup(auth, GoogleProvider)
      .then((result) => {
        const user = result.user;
        console.log(user);

      }).catch((error) => {
        // Handle Errors here.

        const errorMessage = error.message;
        console.log(errorMessage);
      });
  }

  const handleToggleLogin = e => {
    setIsLogin(e.target.checked)
  }

  const handleNameChange = e => {
    setName(e.target.value);
  }

  const handleEmailChange = e => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  }

  const handleRegistration = e => {
    e.preventDefault();
    console.log(email, password);

    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError("Password must contain 2 uppercase")
      return;
    }
    if (isLogin) {
      processLogin(email, password)
    } else {
      registerNewUser(email, password)
    }
  }

  const processLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('')
      }).catch(error => {
        setError(error.message)
      })
  }
  const registerNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user
        console.log(user);
        setError('');
        veryfyEmail();
        setUserName();
      }).catch(error => {
        setError(error.message);
        console.log(error);
      });
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: "https://example.com/jane-q-user/profile.jpg"
    }).then(() => {
      // Profile updated!
    }).catch((error) => {
      // An error occurred
    });
  }

  const veryfyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        setError("Verification link sent your email!")
        // Email verification sent!
      }).catch((error) => {
        setError(error.message)
      });
  }

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setError("Password reset link sent your email!")
      })
      .catch((error) => {
        setError(error.message)
      });
  }
  return (

    <div className="m-5 w-50">

      <form onSubmit={handleRegistration}>
        <h3 className="text-primary">Please {isLogin ? 'Login' : 'Register'}</h3>
        {!isLogin && <div className="row mb-3">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input onBlur={handleNameChange} type="text" className="form-control" id="name" />
          </div>
        </div>}
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label"  >Password</label>
          <div className="col-sm-10">
            <input onBlur={handlePasswordChange} type="password" className="form-control" id="inputPassword3" />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input onChange={handleToggleLogin} className="form-check-input" type="checkbox" id="gridCheck1" />
              <label className="form-check-label" htmlFor="gridCheck1">
                Already Registered?
              </label>
            </div>
          </div>
        </div>
        <div className="text-danger">
          <p>{error}</p>
        </div>
        <button type="submit" className="btn btn-primary">{isLogin ? 'Login' : 'Register'}</button>

        <button onClick={handleResetPassword} type="button" class="btn btn-secondary btn-sm ms-3">Reset Password</button>
      </form>
      <br /><br /><br />
      <div>------------------------</div>
      <br /><br /><br />
      <button onClick={handleGoogelSignIn} className="btn btn-primary">Google Sign In</button>
    </div>
  );
}

export default App;
