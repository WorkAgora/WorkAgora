import { FC, useEffect, useRef, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Flex,
  FlexProps,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure
} from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { mostCommonSkill, UserTypeEnum } from '@workagora/utils';
import { useColoredBadges } from '../../../hooks/useColoredBadges';
import { useSearchFreelancer } from '../../../hooks/useSearchFreelancer';
import { useSearchJob } from '@workagora/front/hooks/useSearchJob';

const SearchBar: FC<FlexProps> = ({ ...props }: FlexProps) => {
  const { type } = useLanding();
  const [title, setTitle] = useState<string>('');
  const [filters, setFilters] = useState<string[]>([]);
  const [curFilters, setCurFilters] = useState<string[]>([]);
  const { getCategoryColorForSkill, allSkills } = useColoredBadges();
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const menuRef = useRef();
  const inputRef = useRef();
  const [searchText, setSearchText] = useState('');
  const searchFreelancer = useSearchFreelancer();
  const searchJobs = useSearchJob();

  const selectFilter = (filter: string) => {
    let newFilters: string[] = [];
    if (!curFilters.includes(filter)) {
      newFilters = [...curFilters, filter];
      setCurFilters(newFilters);
    } else {
      newFilters = [...curFilters.filter((v) => v !== filter)];
      setCurFilters(newFilters);
    }
    if (type === UserTypeEnum.Company) {
      searchFreelancer.setSearchFilters(newFilters);
    }
    if (type === UserTypeEnum.Freelancer) {
      searchJobs.setSearchFilters(newFilters);
    }
  };

  const handleItemClick = (filter: string) => {
    if (filter != 'No result') {
      setSearchText('');
      setSearchResults([]);
      if (!filters.includes(filter)) {
        setFilters([...filters, filter]);
      }
      selectFilter(filter);
    }
    if (isOpen) onClose();
    if (inputRef.current) inputRef.current.focus();
  };

  const searchSkills = (searchText: string) => {
    searchText = searchText.toLowerCase();
    if (searchText === '') {
      setSearchResults([]);
      onClose();
      return;
    }
    let searchResults = allSkills
      .filter((skill) => skill.toLowerCase().startsWith(searchText))
      .map((skill) => {
        let score = 0;
        if (skill.toLowerCase() === searchText) {
          score = 100;
        } else {
          score = 100 - skill.length;
        }
        return {
          skill,
          score
        };
      });

    searchResults.sort((a, b) => b.score - a.score);
    searchResults = searchResults.slice(0, 10);

    const finalResult = searchResults
      .map((result) => result.skill)
      .filter((result) => !filters.includes(result));
    if (finalResult.length > 0) {
      setSearchResults(finalResult);
    } else {
      setSearchResults(['No result']);
    }
    if (!isOpen) onOpen();
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    if (type === UserTypeEnum.Freelancer) {
      setTitle('Find the perfect offer');
      setCurFilters([]);
      setFilters([]);
    }

    if (type === UserTypeEnum.Company) {
      setTitle('Find the perfect freelancer');
      setCurFilters([]);
      setFilters(mostCommonSkill);
    }
  }, [type]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    // Component mounted
    // Perform any setup or side effects here

    return () => {
      if (type === UserTypeEnum.Company) {
        searchFreelancer.setSearchFilters([]);
      }
      if (type === UserTypeEnum.Freelancer) {
        searchJobs.setSearchFilters([]);
      }
    };
  }, []);

  return (
    <Flex flexDir="column" {...props} zIndex="10">
      <Box textStyle="h2" cursor="default">
        {title}
      </Box>
      <Box position="relative">
        <Input
          ref={inputRef}
          variant="searchBar"
          mt={2}
          value={searchText}
          placeholder="Add a filter to improve your research"
          onChange={(e) => {
            setSearchText(e.target.value);
            searchSkills(e.target.value);
          }}
        />
        <Box ref={menuRef}>
          <Menu isOpen={isOpen}>
            <MenuButton as={Box} position="absolute" top="85%" left="0" zIndex={1} width="100%" />
            <MenuList>
              {searchResults.map((result, index) => (
                <MenuItem key={index} onClick={(e) => handleItemClick(e.target.textContent)}>
                  {result}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
      </Box>
      <Flex width="100%" mt={3} alignItems="center">
        <Flex maxW="85%" flexWrap="wrap" gap={2}>
          {filters.map((v, k) => {
            const colors = getCategoryColorForSkill(v);
            return (
              <Badge
                key={k}
                color={!curFilters.includes(v) ? 'neutral.black' : colors.color}
                bgColor={!curFilters.includes(v) ? 'none' : colors.bgColor}
                borderWidth="1px"
                borderColor={!curFilters.includes(v) ? colors.bgColor : 'none'}
                _hover={{
                  bgColor: !curFilters.includes(v) ? colors.bgColor : 'rgba(0,0,0,0)',
                  color: !curFilters.includes(v) ? colors.color : 'neutral.black',
                  borderColor: !curFilters.includes(v) ? 'none' : colors.bgColor
                }}
                variant="filter"
                onClick={() => selectFilter(v)}
              >
                {v}
              </Badge>
            );
          })}
        </Flex>
        {filters.length > 0 && (
          <Button
            variant="link"
            size="xs"
            ml={4}
            mt={0.5}
            onClick={() => {
              setCurFilters([]);
              setFilters([]);
              if (type === UserTypeEnum.Company) {
                searchFreelancer.setSearchFilters([]);
              }
              if (type === UserTypeEnum.Freelancer) {
                searchJobs.setSearchFilters([]);
              }
            }}
          >
            Clear filters
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default SearchBar;
