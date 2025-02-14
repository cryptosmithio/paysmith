import { Spinner, Text, VStack } from '@chakra-ui/react';

export const Spinner = () => {
  return (
    <VStack colorPalette="teal" w={'vw'} h={'vh'} justifyContent={'center'}>
      <Spinner color="colorPalette.600" />
      <Text color="colorPalette.600">Loading...</Text>
    </VStack>
  );
};
