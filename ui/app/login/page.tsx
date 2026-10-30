import styles from './login.module.css';

import {
  checkLoginStatus,
  handleLogin,
} from '@/lib/features/userAccount/userAccountSlice';
import { useAppDispatch } from '@/lib/hooks';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import UrlLibrary from '../library/UrlLibrary';

function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const loginInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hasErrorLogin, setHaserrorLogin] = useState(false);

  useEffect(() => {
    if (loginInputRef.current) {
      loginInputRef.current.focus();
    }
  }, [loginInputRef]);

  return (
    <div>
      <div>Login</div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            const result = await dispatch(handleLogin({ username, password }));

            const success = result?.payload == true;

            if (success) {
              dispatch(checkLoginStatus());
              navigate(searchParams.get('ref') ?? UrlLibrary.HOME);
            } else {
              setHaserrorLogin(true);
            }
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="username-input" className={styles.label}>
            Username
          </label>
          <input
            type="text"
            id="username-input"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            ref={loginInputRef}
          />
        </div>
        <div>
          <label htmlFor="password-input" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password-input"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <div>
          <button type="submit">Login</button>
        </div>
      </form>
      {hasErrorLogin && (
        <div style={{ marginTop: '10px', color: 'red' }}>
          There was an error logging in. Please make sure the username and
          password are correct.
        </div>
      )}
    </div>
  );
}

export default Login;
