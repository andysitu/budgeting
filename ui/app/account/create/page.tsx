import { useState, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import UrlLibrary from '../../library/UrlLibrary';
import { sendRequest } from '@/network/util';

export default function CreateAccount() {
  const fieldStyle = {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '4px',
  } as const;

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await sendRequest('/api/register', 'POST', {
        body: JSON.stringify({ email, password }),
      });
      navigate(UrlLibrary.LOGIN);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Could not create account.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <h1>Create account</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div style={fieldStyle}>
          <label htmlFor="create-email">Email</label>
          <input
            id="create-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="create-password">Password</label>
          <input
            id="create-password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="confirm-password">Confirm password</label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>
        {error && (
          <p role="alert" style={{ color: 'red' }}>
            {error}
          </p>
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create account'}
        </button>
      </form>
    </main>
  );
}
