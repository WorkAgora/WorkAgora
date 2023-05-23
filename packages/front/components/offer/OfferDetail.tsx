import { Avatar, Badge, Box, Button, Flex, Text } from '@chakra-ui/react';
import { FC } from 'react';
import FreelanceCard from '../card/FreelanceCard';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import StarIcon from '../icons/StarIcon';
import { SearchBarFilter } from '../landing/product/SearchBar';


interface OfferDetailProps {
  badges: SearchBarFilter[];
}

const FreelanceBadges: SearchBarFilter[] = [
  {
    label: 'Product',
    bgColor: 'badge.yellow',
    color: 'neutral.black'
  },
  {
    label: 'Design',
    bgColor: 'badge.blue',
    color: 'neutral.white'
  },
  {
    label: 'UI/UX',
    bgColor: 'badge.red',
    color: 'neutral.white'
  },
  {
    label: 'Figma',
    bgColor: 'badge.purple',
    color: 'neutral.white'
  }
];

const OfferDetail: FC<OfferDetailProps> = ({badges}: OfferDetailProps) => {
  return (
    <Flex px={6} flexDir="column" w="100%" h="100%" minH='calc( 100vh - 80px )'>
      <Flex
        flexDir="column"
        w="100%"
        flexGrow='1'
        bgColor="neutral.white"
        px={8}
        py={6}
        gap={6}
        borderRadius="64px"
      >
          <Flex textStyle="h2" as="h1" color="neutral.dsGray">
          <Box color="neutral.dsGray">Find work ></Box> <Box ml={2} color="neutral.black">Job details</Box>
          </Flex>
          <Flex>
            <Avatar w="128px" h="128px" borderRadius="28px" />
            <Flex flexDir="column" ml={8} justifyContent="center">
              <Box textStyle="h3">API3</Box>
              <Box textStyle="h4" color="neutral.dsGray">Web3 Society</Box>
              <Flex alignItems="center" mt={2}>
                <Text
                  fontFamily="Montserrat"
                  fontWeight="700"
                  fontSize="20px"
                  lineHeight="150%"
                  color="neutral.black"
                >
                  4,9
                </Text>
                <Box color="brand.primary" ml={1}>
                  <StarIcon />
                </Box>
              </Flex>
            </Flex>
            <Button variant="secondary" ml="auto" minW="340px" rightIcon={<ArrowRightIcon/>}>Apply to this job</Button>
          </Flex>
          <Flex flexDir="column">
            <Flex alignItems="center">
              <Box textStyle="h4" color="neutral.black">Product designer for Move to earn App</Box>
              <Text fontWeight="700" fontFamily="Comfortaa" fontSize="16px" lineHeight="120%" color="neutral.dsGray" ml={2}>Rennes, France</Text>
            </Flex>
            <Flex mt={1}>
              {badges.map((v,k) =>
                <Badge
                  mr={2}
                  key={k}
                  color={v.color}
                  bgColor={v.bgColor}
                  borderWidth="1px"
                  borderColor={'none'}
                  variant="filter"
                >
                  {v.label}
                </Badge>
              )}
            </Flex>
          </Flex>
          <Flex columnGap={6}>
            <Flex flexDir="column" borderWidth="1px" borderColor="neutral.dsGray" borderRadius="32px" py={6} px={8} gap={4} flexBasis="55%">
                <Box textStyle="h4" color="neutral.black">Mission</Box>
                <Box textStyle="body2" color="neutral.dsGray">
                  We are a leading [industry/sector] company seeking a highly skilled and creative freelance graphic designer to join our team.
                  As a freelancer, you will have the flexibility to work remotely and collaborate with our dynamic team on exciting projects.
                </Box>
                <Box textStyle="h6" color="neutral.black">Responsibilities</Box>
                <Box textStyle="body2" color="neutral.dsGray" whiteSpace="pre-wrap">
                  {`- Develop visually appealing designs, including logos, marketing materials, and website graphics, that align with our brand guidelines.\n- Collaborate with cross-functional teams to understand project requirements and deliver high-quality design solutions within specified timelines.\n- Incorporate feedback and revisions to ensure client satisfaction and project success.\n- Stay updated with design trends, tools, and techniques to bring innovative ideas to the table.`}
                </Box>
                <Box textStyle="h6" color="neutral.black">Requirements</Box>
                <Box textStyle="body2" color="neutral.dsGray" whiteSpace="pre-wrap">
                  {`- Proven experience as a freelance graphic designer or in a similar role.\n- Proficient in Adobe Creative Suite (Photoshop, Illustrator, InDesign, etc.).\n- Strong portfolio showcasing a diverse range of design projects.\n- Excellent communication and collaboration skills.\n- Ability to work independently, manage multiple projects simultaneously, and meet deadlines.`}
                </Box>
                <Box textStyle="body2" color="neutral.dsGray">
                  If you are a passionate and talented graphic designer looking for exciting freelance opportunities, we'd love to hear from you.
                  Please submit your portfolio, resume, and hourly rate to [contact email]. Only shortlisted candidates will be contacted.
                </Box>
            </Flex>
            <Flex flexDir="column" borderWidth="1px" bgColor="neutral.lightGray" borderColor="neutral.lightGray" borderRadius="32px" py={6} px={8} gap={4} alignSelf="flex-start" flexBasis="45%">
              <Box textStyle="h4" color="neutral.black">The company</Box>
              <Box textStyle="body2" color="neutral.dsGray" whiteSpace="pre-wrap">
                {`API3 is a pioneering blockchain project at the forefront of the Web3 revolution. Our mission is to bridge the gap between traditional web applications and decentralized applications (dApps) by providing secure and decentralized APIs.
\n\nBy leveraging blockchain technology and smart contracts, API3 ensures data integrity, immutability, and trustlessness in API interactions. We empower developers to seamlessly integrate real-world data into their dApps, enabling a wide range of use cases across industries.
\n\nOur decentralized API infrastructure eliminates the need for intermediaries, putting control back in the hands of users and developers. With API3, data providers can securely monetize their APIs, while developers benefit from reliable and tamper-proof data sources.
                `}
              </Box>
              <Button variant="secondary" leftIcon={<ArrowRightIcon/>}>Website</Button>
            </Flex>
          </Flex>
      </Flex>

      <Flex mt={6}
        flexDir="column"
        w="100%"
        flexGrow='1'
        bgColor="neutral.white"
        px={8}
        py={6}
        gap={4}
        borderRadius="64px"
      >
        <Box textStyle="h4" color="neutral.black">Other jobs that match your interests</Box>
        <Flex columnGap={4}>
          <FreelanceCard badges={FreelanceBadges}/>
          <FreelanceCard badges={FreelanceBadges}/>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default OfferDetail;
