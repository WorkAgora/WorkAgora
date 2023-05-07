import { Box, Flex, FlexProps } from '@chakra-ui/react';
import { Autoplay } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FC } from 'react';

const Partners: FC<FlexProps> = ({ ...props }: FlexProps) => {
  const partnersLogo = [1, 2, 4, 6, 1, 2, 4, 6, 1, 2, 4, 6];

  return (
    <Flex flexDir="column" alignItems="center" {...props}>
      <Box maxW="1280px" w="100%" textStyle="h2">
        Partners who trusted us
      </Box>
      <Box
        mt={6}
        display="flex"
        flexDirection="column"
        position="relative"
        background="brand.primary"
        w="120%"
        ml="-10%"
        h="190px"
        sx={{
          '.swiper': { width: '100%', cursor: 'pointer', height: '190px' },
          '.swiper-slide': {
            maxHeight: '112px',
            marginTop: 'auto',
            marginBottom: 'auto',
            height: '100%',
            width: `400px`,
            zIndex: '3'
          }
        }}
      >
        <Swiper
          spaceBetween={64}
          slidesPerView={6}
          loopedSlides={6}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false
          }}
          speed={1200}
          loop={true}
          modules={[Autoplay]}
        >
          {partnersLogo.map((v, k) => (
            <SwiperSlide key={k}>
              <Box
                height="100%"
                width="auto"
                background={`url(/images/logoipsum-${v}.svg)`}
                backgroundSize="100% 100%"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Flex>
  );
};

export default Partners;
