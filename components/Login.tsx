import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '../context/authContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authMethod, setAuthMethod] = useState<'register' | 'login'>('login');

  const { loginWithGoogle, registerWithEmailAndPassword, loginWithEmailAndPassword, authStatus } =
    useAuth();

  const handleSubmit = () => {
    if (authMethod == 'register') {
      registerWithEmailAndPassword(username, password);
    } else {
      loginWithEmailAndPassword(username, password);
    }
  };

  const handleEmailError = () => {
    if (authStatus === 'auth/email-already-in-use') {
      return <p className="text-sm text-red-500 text-center">Email already in use</p>;
    } else if (authStatus === 'auth/invalid-email') {
      return <p className="text-sm text-red-500 text-center">Invalid Email</p>;
    } else if (authStatus === 'auth/user-not-found') {
      return <p className="text-sm text-red-500 text-center">User not found</p>;
    } else {
      return null;
    }
  };

  const handlePasswordError = () => {
    if (authStatus === 'auth/wrong-password') {
      return <p className="text-sm text-red-500 text-center">Wrong password</p>;
    } else if (authStatus === 'auth/weak-password') {
      return <p className="text-sm text-red-500 text-center">Weak password</p>;
    } else {
      return null;
    }
  };

  return (
    <div className="bg-mainBg h-screen flex justify-center items-center">
      <div className="p-6 bg-white shadow-lg flex flex-col gap-5 w-2/6 rounded-xl justify-around items-center">
        <h2 className="text-center font-bold text-2xl">Welcome</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
            setUsername('');
            setPassword('');
          }}
          className="flex flex-col gap-2 w-full"
        >
          <input
            type="email"
            placeholder="Email"
            className="p-2 rounded border-[#cdcdcd] border-2 placeholder:text-center focus:border-primary focus:ring-primary w-full"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          />
          {handleEmailError()}
          <input
            type="password"
            placeholder="Password"
            className="p-2 rounded border-[#cdcdcd] border-2 placeholder:text-center focus:border-primary focus:ring-primary w-full"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          {handlePasswordError()}
          <button
            disabled={username === '' || password === ''}
            type="submit"
            className="p-2 bg-primary text-center rounded-lg text-white font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-auto w-full capitalize"
          >
            {authMethod}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">or continue with these social profile</p>
        <button
          className="p-2 outline outline-primary text-white rounded flex justify-center gap-5 items-center"
          onClick={() => loginWithGoogle()}
        >
          <Image src={'/google.svg'} alt="google logo" width="24px" height="24px" />
          <p className="text-black text-sm font-bold">Continue with Google</p>
        </button>
        {authMethod === 'register' ? (
          <p className="flex gap-2 text-gray-600">
            Already a member?
            <span className="text-sky-500 font-semibold">
              <button onClick={() => setAuthMethod('login')}>Login</button>
            </span>
          </p>
        ) : (
          <p className="flex gap-2 text-gray-600">
            Not a member?
            <span className="text-sky-500 font-semibold">
              <button onClick={() => setAuthMethod('register')}>Register</button>
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
export default Login;
