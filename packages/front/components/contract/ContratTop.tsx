import { Avatar, Box, Divider, Flex, Text } from "@chakra-ui/react";
import { CreateCompany, User, shortHash } from "@workagora/utils";
import { FC } from "react";
import FileIcon from "../icons/FileIcon";

interface ContractTopProps {
    sender?: CreateCompany;
    receiver?: User;
}

const ContractTop: FC<ContractTopProps> = ({sender, receiver}) => {
    return <Flex
    flexDir="column"
    borderRadius="16px"
    border="1px solid"
    borderColor="brand.primary"
    px={{base: 2, lg: 6}}
    py={{base: 3, lg: 6}}
  >
    <Flex alignItems="center">
        <Text fontFamily="Comfortaa" fontSize="14px" fontWeight="700" lineHeight="120%" textDecoration="underline">
            {shortHash(sender?.companyWallet, { padLeft: 5, padRight: 3, separator: '...' })}
        </Text>
        <Flex ml={{base:2,lg: 4}} w="32px" h="32px" border="solid 2px" borderColor="brand.primary" borderRadius="8px" justifyContent="center" alignItems="center">
            <Avatar w="29px" h="29px" borderRadius="8px"/>
        </Flex>
        <Divider borderColor="brand.primary" borderWidth="2px" w="40%" />
        <Flex bgColor="brand.primary" w="42px" h="32px" border="solid 2px" borderColor="brand.primary" borderRadius="8px" justifyContent="center" alignItems="center">
            <Box ><FileIcon/></Box>
        </Flex>
        <Divider borderColor="brand.primary" borderWidth="2px" w="40%" />
        <Flex w="32px" h="32px" border="solid 2px" borderColor="brand.primary" borderRadius="50%" justifyContent="center" alignItems="center">
            <Avatar w="29px" h="29px" borderRadius="50%"/>
        </Flex>
        <Text ml={{base:2,lg: 4}} fontFamily="Comfortaa" fontSize="14px" fontWeight="700" lineHeight="120%" textDecoration="underline">
            {shortHash(receiver?.wallet, { padLeft: 5, padRight: 3, separator: '...' })}
        </Text>
    </Flex>
  </Flex>
};

export default ContractTop;