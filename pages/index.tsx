import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
};

const Home = () => {
  return null;
};

export default Home;
