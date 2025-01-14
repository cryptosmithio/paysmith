import Dashboard from '@/components/Dashboard';
import Footer from '@/components/Footer';
import NavBar from '@/components/Navbar';
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
