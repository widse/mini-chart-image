import React from 'react';
import { ChakraProvider, Box, VStack, Heading, Text } from '@chakra-ui/react';
import CoinList from './components/CoinList';

function App() {
  return (
    <ChakraProvider>
      <Box maxWidth="1200px" margin="auto" padding={4}>
        <VStack spacing={4} align="stretch">
          <Heading as="h1">Mini Chart Image</Heading>
          <Text fontSize="xl">Coin Market Cap</Text>
          <CoinList />
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;