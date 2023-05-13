import {Badge, Box, Button, Flex, FlexProps, Input, InputGroup, InputRightElement} from '@chakra-ui/react';
import {useLanding} from '@workagora/front-provider';
import {FC, useEffect, useState} from 'react';
import AddIcon from '../../../icons/AddIcon';
import {UserTypeEnum} from "@workagora/utils";

export interface SearchBarFilter {
  label: string;
  bgColor: string;
  color: string;
}

const CompanySearchBar: FC<FlexProps> = ({ ...props }: FlexProps) => {
  const { type } = useLanding();
  const [title, setTitle] = useState<string>('');
  const [filters, setFilters] = useState<SearchBarFilter[]>([]);
  const [curFilters, setCurFilters] = useState<string[]>([]);

  const selectFilter = (filter: SearchBarFilter) => {
    if (!curFilters.includes(filter.label)) {
      setCurFilters([...curFilters, filter.label]);
    } else {
      setCurFilters([...curFilters.filter((v) => v !== filter.label)]);
    }
  };

  useEffect(() => {
    if (type === UserTypeEnum.Freelancer) {
      setTitle('Find the perfect offer');
      setCurFilters([]);
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

    if (type === UserTypeEnum.Company) {
      setTitle('Find the perfect freelancer');
      setCurFilters([]);
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
  }, [type]);

  return (
    <Flex flexDir="column" {...props}>
      <InputGroup variant="searchBar" mt={2}>
        <Input py={6} px={8} placeholder="Add a filter to improve your research" />
        <InputRightElement width="auto" h='100%'>
          <Button
           h='100%'
            variant="primary"
            borderLeftRadius="0"
          >
            Add the filter
          </Button>
        </InputRightElement>
      </InputGroup>
      <Flex width="100%" mt={1} alignItems="center">
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
        <Button variant="link" size="xs" ml={2} px={0}   mt={0.5} onClick={() => setCurFilters([])}>
          Clear filters
        </Button>
      </Flex>
    </Flex>
  );
};

export default CompanySearchBar;
