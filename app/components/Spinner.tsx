import {
  Spinner as ChakraSpinner,
  Text,
  VStack,
  type StackProps,
} from '@chakra-ui/react';
import type { JSX, RefAttributes } from 'react';

export const Spinner = (
  props: JSX.IntrinsicAttributes & StackProps & RefAttributes<HTMLDivElement>
) => {
  return (
    <VStack
      colorPalette="teal"
      justifyContent={'center'}
      {...props}
    >
      <ChakraSpinner color="colorPalette.600" />
      <Text color="colorPalette.600">Loading...</Text>
    </VStack>
  );
};
