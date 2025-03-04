'use client';

import { Flex } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import Logo from './Logo';

interface Props {
  children?: React.ReactNode;
}
const NavBar = (props: Props) => {
  return (
    <NavBarContainer {...props}>
      <Logo
        w="100px"
        color={['white', 'white', 'primary.500', 'primary.500']}
      />
      {/* {isConnected && (
        <Box>
          <MenuToggle toggle={toggle} isOpen={isOpen} />
          <MenuLinks isOpen={isOpen} />
        </Box>
      )} */}
      <ConnectButton />
    </NavBarContainer>
  );
};

// const CloseIcon = () => (
//   <svg width="24" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
//     <title>Close</title>
//     <path
//       fill="white"
//       d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z"
//     />
//   </svg>
// );

// const MenuIcon = () => (
//   <svg
//     width="24px"
//     viewBox="0 0 20 20"
//     xmlns="http://www.w3.org/2000/svg"
//     fill="white"
//   >
//     <title>Menu</title>
//     <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
//   </svg>
// );

// const MenuToggle = ({
//   toggle,
//   isOpen,
// }: {
//   toggle: () => void;
//   isOpen: boolean;
// }) => {
//   return (
//     <Box display={{ base: 'block', md: 'none' }} onClick={toggle}>
//       {isOpen ? <CloseIcon /> : <MenuIcon />}
//     </Box>
//   );
// };

// const MenuItem = ({
//   children,
//   to = '/',
//   ...rest
// }: {
//   children: React.ReactNode;
//   to?: string;
//   [x: string]: unknown;
// }) => {
//   return (
//     <Link href={to}>
//       <Text display="block" {...rest}>
//         {children}
//       </Text>
//     </Link>
//   );
// };

// const MenuLinks = ({ isOpen }: { isOpen: boolean; }) => {
//   return (
//     <Box
//       display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
//       flexBasis={{ base: '100%', md: 'auto' }}
//     >
//       <Stack
//         align="center"
//         justify={['center', 'space-between', 'flex-end', 'flex-end']}
//         direction={['column', 'row', 'row', 'row']}
//         pt={[4, 4, 0, 0]}
//       >
//         <MenuItem to="/">Home</MenuItem>
//         <MenuItem to="/dashboard">Dashboard </MenuItem>
//         <MenuItem to="/send">Send Funds </MenuItem>
//         <MenuItem to="/receive">Receive Funds </MenuItem>
//       </Stack>
//     </Box>
//   );
// };

const NavBarContainer: React.FC<Props> = ({ children, ...props }) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={8}
      bg={['primary.500', 'primary.500', 'transparent', 'transparent']}
      color={['white', 'white', 'primary.700', 'primary.700']}
      {...props}
    >
      {children}
    </Flex>
  );
};

export default NavBar;
