import { Box, Flex } from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { FC } from 'react';
import { InView } from 'react-intersection-observer';
import ContactForm from '../../form/ContactForm';
import Newsletter from './Newsletter';

const Contact: FC = () => {
  const { handleViewChange } = useLanding();

  return (
    <InView
      as="div"
      id="contact"
      onChange={handleViewChange}
      threshold={[0.5, 0.6, 0.7, 0.8, 0.9, 1]}
    >
      <Flex flexDir="column" py={16}>
        <Flex mx="auto" width="80%" maxW="1280px" flexDir="column">
          <Box textStyle="h2" as="h2" mb={12}>
            Contact us
          </Box>
          <ContactForm />
        </Flex>
      </Flex>
      <Newsletter />
    </InView>
  );
};

export default Contact;
