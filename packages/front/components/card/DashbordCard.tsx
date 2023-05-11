import { Box, Flex, FlexProps, Text } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

interface DashboardCardProps extends FlexProps {
  title: string;
  subtitle?: string;
  button?: ReactNode;
  numberData?: number;
  theme: 'secondary' | 'primary' | 'outlined';
}

const DashboardCard: FC<DashboardCardProps> = ({
  title,
  subtitle,
  button,
  numberData,
  theme,
  ...props
}: DashboardCardProps) => {
  let bgColor = '';
  let titleColor = '';
  let subtitleColor = '';
  let borderColor = '';

  switch (theme) {
    case 'secondary':
      bgColor = 'brand.secondary';
      titleColor = 'brand.primary';
      subtitleColor = 'neutral.white';
      borderColor = 'brand.secondary';
      break;
    case 'primary':
      bgColor = 'brand.primary';
      titleColor = 'neutral.black';
      subtitleColor = 'neutral.dsDarkGray';
      borderColor = 'brand.primary';
      break;
    case 'outlined':
      bgColor = 'neutral.white';
      titleColor = 'neutral.black';
      subtitleColor = 'neutral.dsGray';
      borderColor = 'brand.primary';
      break;
  }

  return (
    <Flex
      p={4}
      borderRadius="24px"
      flexDir="column"
      bgColor={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      height="150px"
      w="100%"
      {...props}
    >
      <Box textStyle="h4" as="h4" color={titleColor} maxW="90%">
        {title}
      </Box>
      {subtitle && (
        <Box textStyle="h5" as="span" color={subtitleColor}>
          {subtitle}
        </Box>
      )}
      <Flex mt="auto" alignItems="center">
        {numberData !== undefined && (
          <Text
            as="span"
            fontFamily="Montserrat"
            fontSize="36px"
            fontWeight="400"
            lineHeight="150%"
            color={titleColor}
          >
            {numberData}
          </Text>
        )}
        <Box ml="auto">{button}</Box>
      </Flex>
    </Flex>
  );
};

export default DashboardCard;
