import { Box, Flex, Text } from '@chakra-ui/react';
import { FC } from 'react';

export interface TechnologyCardProps {
  Icon: FC;
  title: string;
  desc: string;
}

const TechnologyCard: FC<TechnologyCardProps> = ({ Icon, title, desc }: TechnologyCardProps) => {
  return (
    <Flex
      flexDir="column"
      p={8}
      borderWidth="3px"
      borderColor="brand.primary"
      borderRadius="64px"
      width="100%"
    >
      <Flex color="brand.primary" justifyContent="center">
        <Icon />
      </Flex>
      <Flex textStyle="h3" as="h3" justifyContent="center" mt={8} mb={4} cursor="default">
        {title}
      </Flex>
      <Flex my="auto">
        <Box
          cursor="default"
          as="p"
          px={2}
          textAlign="center"
          whiteSpace="pre-wrap"
          fontSize="18px"
          fontWeight="400"
          fontFamily="Montserrat"
          lineHeight="150%"
        >
          {desc}
        </Box>
      </Flex>
    </Flex>
  );
};

export default TechnologyCard;
