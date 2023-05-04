import { FC } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

interface BrandLogoProps {
  width?: string;
  height?: string;
  textSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const BrandLogo: FC<BrandLogoProps> = ({ width, height, textSize }: BrandLogoProps) => {
  const w = width ? width : 36;
  const h = height ? height : 28;
  return (
    <Flex>
      <Box display="flex" flexDir="column" alignItems="center">
        <svg width={w} height={h} viewBox="0 0 36 28" fill="none">
          <path
            d="M7.97835 26.482L0.5 1.5542H6.19297L9.46054 12.3675C9.68511 13.1086 9.89846 13.8946 10.1006 14.7255C10.3027 15.534 10.5048 16.5558 10.7069 17.791C10.5048 18.5994 10.909 16.5558 10.7069 17.791C10.4824 18.5545 10.909 16.9825 10.7069 17.791L14.6393 14.7255H20.7365L25.2931 17.791C25.091 16.96 25.4952 18.5545 25.2931 17.791C25.0685 16.6007 25.4952 18.6219 25.2931 17.791C25.5401 16.5333 25.7647 15.5115 25.9668 14.7255C26.1689 13.917 26.3823 13.1535 26.6068 12.4349L29.9418 1.5542H35.5L27.8869 26.482H22.5645L17.9753 18.409L13.3345 26.482H7.97835Z"
            fill="#FDB81E"
          />
          <path
            d="M12.9165 26.482H8.04248L15.6563 1.5542H20.2131L27.798 26.482H22.8375L21.3378 21.227H14.445L12.9165 26.482ZM17.329 11.3232L15.8005 16.6456H20.0112L18.4826 11.3232C18.3673 10.8965 18.2519 10.4586 18.1366 10.0094C18.0212 9.5603 17.9443 9.18975 17.9058 8.8978C17.8674 9.18975 17.7905 9.5603 17.6751 10.0094C17.579 10.4361 17.4636 10.8741 17.329 11.3232Z"
            fill="#FDB81E"
          />
          <path
            d="M14.4894 14.3366L11.2048 17.6682L11.0703 17.0068L14.4894 13.6753H21.3411L24.8315 17.1203L24.7196 17.794L21.3411 14.3366H14.4894Z"
            fill="#EDF2F7"
            stroke="#EDF2F7"
            strokeWidth="2"
          />
          <path
            d="M15.7227 1.49756L8.05396 26.43"
            stroke="#EDF2F7"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M20.1931 1.60669L27.7891 26.5026"
            stroke="#EDF2F7"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <Text as="span" fontSize={textSize ? textSize : 'sm'} fontFamily="Comfortaa" mt={0.25}>
          The future is bright
        </Text>
      </Box>
    </Flex>
  );
};

export default BrandLogo;
