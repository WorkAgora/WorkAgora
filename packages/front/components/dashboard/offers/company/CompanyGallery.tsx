import { Button, Flex, SimpleGrid, Spinner, Text } from '@chakra-ui/react';
import { FC, MutableRefObject, useEffect, useState } from 'react';
import FreelanceCard from '@workagora/front/components/card/FreelanceCard';
import { useSearchFreelancer } from '@workagora/front/hooks/useSearchFreelancer';

interface CompanyGalleryProps {
  scrollbarRef: MutableRefObject<HTMLElement | null>;
}

const CompanyGallery: FC<CompanyGalleryProps> = ({ scrollbarRef }) => {
  const { freelancers, loading, maxPage, curPage, totalResult, callGet } = useSearchFreelancer();
  const elementByPage = 6;

  useEffect(() => {
    callGet(1, elementByPage);
  }, [callGet]);

  const handlePageChange = (newPage: number) => {
    callGet(newPage, elementByPage);
    const element = document.getElementById('total-result');
    if (element && scrollbarRef.current) {
      // Calculate the position of the target element relative to the PerfectScrollbar container
      const topPosition = element.getBoundingClientRect().top;
      scrollbarRef.current.scrollTop = topPosition + 500;
    }
  };

  const prevPage = () => {
    if (curPage > 1) {
      handlePageChange(curPage - 1);
    }
  };

  const nextPage = () => {
    if (curPage < maxPage) {
      handlePageChange(curPage + 1);
    }
  };

  return (
    <Flex flexDir="column">
      <Flex justifyContent="end">
        <Text
          id="total-result"
          fontSize="16px"
          fontWeight="700"
          lineHeight="120%"
          fontFamily="Comfortaa"
        >
          {totalResult} results
        </Text>
      </Flex>
      <Flex flexDir="column" mt={4}>
        <SimpleGrid columns={2} spacing={8} w="100%" position="relative">
          {loading && <Spinner />}
          {!loading && freelancers.map((v, k) => <FreelanceCard key={k} user={v} />)}
        </SimpleGrid>
      </Flex>
      {maxPage > 1 && (
        <Flex justifyContent="center" alignItems="center" mt={6}>
          <Button variant="icon" onClick={prevPage} disabled={curPage === 1}>
            {`<`}
          </Button>
          <Text mx={2}>{`${curPage} / ${maxPage}`}</Text>
          <Button variant="icon" onClick={nextPage} disabled={curPage === maxPage}>
            {`>`}
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default CompanyGallery;
