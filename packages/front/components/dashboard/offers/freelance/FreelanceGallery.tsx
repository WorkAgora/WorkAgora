import { Button, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { FC, useState } from "react";
import { SearchBarFilter } from "./FreelanceSearchBar";
import FreelanceCard from "@workagora/front/components/card/FreelanceCard";

const CompanyGallery: FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const elementByPage = 6;
    const [curResult, setCurResult] = useState<number[]>(Array.from({length: elementByPage}).map((_, k) => k + ((currentPage - 1 ) *6) ));
    const totalPages = 5; // Set this to the total number of pages
   
  
    const badges: SearchBarFilter[] = [
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
    
    const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
      setCurResult(Array.from({length: elementByPage}).map((_, k) => k + ((currentPage - 1 ) *6) ));
    };
  
    const prevPage = () => {
      if (currentPage > 1) {
        handlePageChange(currentPage - 1);
      }
    };
  
    const nextPage = () => {
      if (currentPage < totalPages) {
        handlePageChange(currentPage + 1);
      }
    };
  
    return (
        <Flex flexDir='column'>
            <Flex justifyContent="end">
                <Text fontSize='16px' fontWeight='700' lineHeight='120%' fontFamily='Comfortaa'>
                    X results
                </Text>
            </Flex>
            <Flex flexDir="column" mt={4}>
                <SimpleGrid 
                columns={2}
                spacing={8}
                w="100%"
                position="relative">
                  {curResult.map((v, k) => <FreelanceCard key={k} badges={badges} />)}
                </SimpleGrid>
            </Flex>
            <Flex justifyContent="center" alignItems="center" mt={6}>
                <Button variant="icon" onClick={prevPage} disabled={currentPage === 1}>
                 {`<`}
                </Button>
                <Text mx={2}>{`${currentPage} / ${totalPages}`}</Text>
                <Button variant="icon"  onClick={nextPage} disabled={currentPage === totalPages}>
                {`>`}
                </Button>
            </Flex>
        </Flex>
    );
}

export default CompanyGallery;