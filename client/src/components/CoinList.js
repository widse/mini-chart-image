import React, { useState, useEffect } from 'react';
import { Center, VStack, HStack, Text, Image, Box, Spinner, IconButton, Flex } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import axios from 'axios';

function CoinList() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const response = await axios.get('/market-cap-coins');

      setCoins(response.data);
      setLastUpdated(now);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coin data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const handleRefresh = () => {
    fetchCoins();
  };

  if (loading) {
    return (
      <Center height={300}>
        <Spinner size="xl" />
      </Center>
    )
  }

  return (
    <VStack spacing={4} align="stretch">
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="sm">
          {lastUpdated && lastUpdated.toLocaleString()}
        </Text>
        <IconButton
          icon={<RepeatIcon />}
          onClick={handleRefresh}
          aria-label="Refresh data"
          size="sm"
        />
      </Flex>
      {coins.map((coin) => (
        <HStack key={coin.symbol} spacing={4} p={4} borderWidth={1} borderRadius="md">
          <Image width={100} height={50} src={coin.miniChartImage} alt={coin.symbol} />
          <Box flex={1}>
            <Text fontWeight="bold">{coin.symbol}</Text>
            <Text fontSize="sm" color={coin.priceChangePercent >= 0 ? "green.500" : "red.500"}>
              {coin.priceChangePercent >= 0 ? "+" : ""}{coin.priceChangePercent.toFixed(2)}%
            </Text>
          </Box>
          <Box minWidth={150}>
            <Text fontWeight="bold">${coin.lastPrice.toLocaleString()}</Text>
            <Text fontSize="sm">Volume: {coin.volume.toLocaleString()}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Market Cap</Text>
            <Text fontSize="sm">${(coin.approximateMarketCap / 1e9).toFixed(2)}B</Text>
          </Box>
        </HStack>
      ))}
    </VStack>
  );
}

export default CoinList;