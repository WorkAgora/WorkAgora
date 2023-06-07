import { Box, Button, Flex, SimpleGrid, Spinner, Text } from '@chakra-ui/react';
import { FC, MutableRefObject } from 'react';
import { useRouter } from 'next/router';
import { useSearchJob } from '@workagora/front/hooks/useSearchJob';
import JobCard from '@workagora/front/components/card/JobCard';

interface CompanyGalleryProps {
  scrollbarRef: MutableRefObject<HTMLElement | null>;
}

const FreelanceGallery: FC<CompanyGalleryProps> = ({ scrollbarRef }) => {
  const {
    jobs,
    loading,
    maxPage,
    curPage,
    totalResult,
    handleSearch,
    elementByPage,
    searchFilters
  } = useSearchJob(6);
  const { push } = useRouter();

  const handlePageChange = (newPage: number) => {
    handleSearch(newPage, elementByPage, searchFilters);
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
      {loading && (
        <Flex flexDir="column" justifyContent="center" alignItems="center" my={16}>
          <Spinner color="brand.primary" size="xl" mx="auto" />
          <Box textStyle="h6" as="span" color="brand.secondary" mt={8}>
            Loading Offers
          </Box>
        </Flex>
      )}
      {!loading && (
        <>
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
            <SimpleGrid columns={{base: 1, lg: 2}} spacing={8} w="100%" position="relative">
              {jobs.length > 0 &&
                jobs.map((v, k) => (
                  <JobCard key={k} job={v} onClick={(id) => push(`/dashboard/offers/${id}`)} />
                ))}
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
        </>
      )}
    </Flex>
  );
};

export default FreelanceGallery;
