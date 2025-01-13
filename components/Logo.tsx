import { Box, Text } from '@chakra-ui/react';
interface Props {
  children?: React.ReactNode;
  w?: string;
  color?: string[];
}
export default function Logo(props: Props) {
  return (
    <Box {...props}>
      <Text fontSize="lg" fontWeight="bold">
        Logo
      </Text>
    </Box>
  );
}
