import type { NextPage } from 'next';
import Homepage from '../components/Homepage';
import { AuthProvider } from '../context/authContext';

const Home: NextPage = () => {
  return (
    <AuthProvider>
      <Homepage />
    </AuthProvider>
  );
};

export default Home;
