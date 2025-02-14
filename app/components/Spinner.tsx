import { Spinner as ChakraSpinner, Text, VStack } from '@chakra-ui/react';

export const Spinner = () => {
  return (
    <VStack colorPalette="teal" w={'vw'} h={'vh'} justifyContent={'center'}>
      <ChakraSpinner color="colorPalette.600" />
      <Text color="colorPalette.600">Loading...</Text>
    </VStack>
  );
};
