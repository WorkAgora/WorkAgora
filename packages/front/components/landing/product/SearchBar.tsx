import {
  Badge,
  Box,
  Button,
  Flex,
  FlexProps,
  Input,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { useLanding } from '@workagora/front-provider';
import { FC, useEffect, useState } from 'react';
import AddIcon from '../../icons/AddIcon';

interface SearchBarFilter {
  label: string;
  bgColor: string;
  color: string;
}

const SearchBar: FC<FlexProps> = ({ ...props }: FlexProps) => {
  const { type, possibleType } = useLanding();
  const [title, setTitle] = useState<string>('');
  const [filters, setFilters] = useState<SearchBarFilter[]>([]);
  const [curFilters, setCurFilters] = useState<string[]>([]);

  const selectFilter = (filter: SearchBarFilter) => {
    const index = curFilters.findIndex((v) => v === filter.label);
    if (index === -1) {
      setCurFilters([...curFilters, filter.label]);
    } else {
      if (curFilters.length === 1) {
        setCurFilters([]);
      } else {
        setCurFilters([...curFilters.splice(index, 1)]);
      }
    }
  };

  useEffect(() => {
    if (type === possibleType[0]) {
      setTitle('Find the perfect offer');
      setFilters([
        {
          label: 'Badge1',
          bgColor: 'badge.yellow',
          color: 'neutral.black'
        },
        {
          label: 'Badge2',
          bgColor: 'badge.purple',
          color: 'neutral.white'
        },
        {
          label: 'Badge3',
          bgColor: 'badge.red',
          color: 'neutral.white'
        },
        {
          label: 'Badge4',
          bgColor: 'badge.yellow',
          color: 'neutral.black'
        }
      ]);
    }

    if (type === possibleType[1]) {
      setTitle('Find the perfect freelancer');
      setFilters([
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
      ]);
    }
  }, [possibleType, type]);

  return (
    <Flex flexDir="column" {...props}>
      <Box textStyle="h2">{title}</Box>
      <InputGroup variant="searchBar" mt={2}>
        <Input placeholder="Add a filter to improve your research" />
        <InputRightElement width="auto">
          <Button
            variant="primary"
            rightIcon={
              <Box w="14px" h="14px" ml={2}>
                <AddIcon />
              </Box>
            }
            borderLeftRadius="0"
          >
            Add the filter
          </Button>
        </InputRightElement>
      </InputGroup>
      <Flex width="100%" mt={3} alignItems="center">
        <Flex maxW="85%" columnGap={2}>
          {filters.map((v, k) => (
            <Badge
              key={k}
              color={!curFilters.includes(v.label) ? 'neutral.black' : v.color}
              bgColor={!curFilters.includes(v.label) ? 'none' : v.bgColor}
              borderWidth="1px"
              borderColor={!curFilters.includes(v.label) ? v.bgColor : 'none'}
              _hover={{
                bgColor: !curFilters.includes(v.label) ? v.bgColor : 'rgba(0,0,0,0)',
                color: !curFilters.includes(v.label) ? v.color : 'neutral.black',
                borderColor: !curFilters.includes(v.label) ? 'none' : v.bgColor
              }}
              variant="filter"
              onClick={() => selectFilter(v)}
            >
              {v.label}
            </Badge>
          ))}
        </Flex>
        <Button variant="link" size="xs" ml={4} mt={0.5} onClick={() => setCurFilters([])}>
          Clear filters
        </Button>
      </Flex>
    </Flex>
  );
};

export default SearchBar;
