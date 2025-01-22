import Dashboard from '@/app/components/Dashboard';
import Footer from '@/app/components/Footer';
import NavBar from '@/app/components/Navbar';
import { VStack } from '@chakra-ui/react';

export default function Home() {
  return (
    <VStack>
      <NavBar />
      <Dashboard />
      <Footer />
    </VStack>
  );
}
