import { FC, useEffect, useRef, useState } from 'react';
import {
  Box,
  Flex,
  Badge,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useDisclosure,
  Text
} from '@chakra-ui/react';
import { useColoredBadges } from '@workagora/front/hooks/useColoredBadges';
import SearchIcon from '../../../icons/SearchIcon';
import ChevronDownIcon from '@workagora/front/components/icons/ChevronDownIcon';
import { useFormikContext, ErrorMessage } from 'formik';
import { skills } from '@workagora/utils';
import CloseIcon from '@workagora/front/components/icons/CloseIcon';

const CreateJobSkills: FC = () => {
  const { getCategoryColorForSkill, allSkills } = useColoredBadges();
  const { values, setFieldValue, errors, touched, setFieldTouched } = useFormikContext<{
    skills: string[];
  }>();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [curSkills, setCurSkills] = useState<string[]>(values.skills);
  const [subCategoryOpen, setSubCategoryOpen] = useState<{ [key: string]: boolean }>(
    allSkills.reduce<{ [key: string]: boolean }>((acc, skill) => {
      acc[skill] = false;
      return acc;
    }, {})
  );

  const openCategory = (category: string) => {
    setSubCategoryOpen((prevState) => ({ ...prevState, [category]: !prevState[category] }));
  };

  const searchSkills = (searchText: string) => {
    searchText = searchText.toLowerCase();
    if (searchText === '') {
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
      .filter((result) => !curSkills.includes(result));
    if (finalResult.length > 0) {
      setSearchResults(finalResult);
    } else {
      setSearchResults(['No result']);
    }
    if (!isOpen) onOpen();
    if (inputRef.current) inputRef.current.focus();
  };

  const handleItemClick = (skill: string) => {
    if (skill !== 'No result') {
      setSearchText('');
      setSearchResults([]);
      if (!curSkills.includes(skill)) {
        if (curSkills.length === 10) {
          return;
        }
        setCurSkills((prevSkills) => [...prevSkills, skill]);
      } else {
        setCurSkills((prevSkills) => prevSkills.filter((v) => v !== skill));
      }
    }
    setFieldTouched('skills', true);
    if (isOpen) onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    setFieldValue('skills', curSkills, true);
  }, [curSkills, setFieldTouched, setFieldValue]);

  return (
    <Flex flexDir="column" justifyContent="center" w="100%" gap={4}>
      <Flex alignItems="center">
        <Box textStyle="h6" as="span">
          Skills & Expertise
        </Box>
        <Box
          textStyle="h6"
          fontSize="14px"
          fontWeight="400"
          as="span"
          ml={4}
          mt={0.5}
          color="neutral.dsGray"
        >
          {curSkills.length} / 10
        </Box>
      </Flex>
      <Flex flexWrap="wrap" gap={2} flexDir={{base: 'column', lg: 'row'}}>
        <Flex flexDir="column">
          <Box position="relative">
            <InputGroup>
              <Input
                ref={inputRef}
                variant="searchBar"
                value={searchText}
                borderColor={errors['skills'] && touched['skills'] ? 'red' : 'brand.primary'}
                boxShadow={errors['skills'] && touched['skills'] ? '0 0 0 1px red' : 'none'}
                _focus={{
                  borderColor: 'brand.primary',
                  boxShadow: '0 0 0 1px var(--chakra-colors-brand-primary)'
                }}
                borderRadius="8px"
                placeholder="Search skills"
                onChange={(e) => {
                  setSearchText(e.target.value);
                  searchSkills(e.target.value);
                }}
              />
              <InputRightElement>
                <Box my="auto" color="rgba(0,0,0,.5)">
                  <SearchIcon />
                </Box>
              </InputRightElement>
            </InputGroup>
            <Box ref={menuRef}>
              <Menu isOpen={isOpen}>
                <MenuButton
                  as={Box}
                  position="absolute"
                  top="85%"
                  left="0"
                  zIndex={1}
                  width="100%"
                />
                <MenuList>
                  {searchResults.map((result, index) => (
                    <MenuItem
                      key={index}
                      onClick={(e: React.MouseEvent<HTMLElement>) =>
                        handleItemClick(e.target.textContent as string)
                      }
                    >
                      {result}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>
          </Box>
        </Flex>
        <Flex flexWrap="wrap" mt={2} w="100%" gap={2}>
          {errors['skills'] && touched['skills'] && (
            <Text textStyle="errorMessage">{errors['skills']}</Text>
          )}
          {curSkills.map((v, k) => {
            const colors = getCategoryColorForSkill(v);
            return (
              <Badge
                key={k}
                color={colors.color}
                bgColor={colors.bgColor}
                borderWidth="1px"
                borderColor={'none'}
                variant="filter"
                onClick={() => handleItemClick(v)}
                display="flex"
                alignItems="center"
              >
                {v}
                <Box
                  w="10px"
                  h="10px"
                  ml={2}
                  mt={0.5}
                  sx={{ svg: { width: '100% !important', height: '100% !important' } }}
                >
                  <CloseIcon />
                </Box>
              </Badge>
            );
          })}
        </Flex>
        <Flex
          flexDir="column"
          bgColor="neutral.lightGray"
          borderRadius="8px"
          p={4}
          gap={4}
          w="100%"
          mt={2}
        >
          {skills.map((v, k) => (
            <Flex flexDir="column" key={k}>
              <Flex alignItems="center">
                <Box textStyle="h6" as="span">
                  {v.category}
                </Box>
                <Box
                  textStyle="h6"
                  fontSize="14px"
                  fontWeight="400"
                  as="span"
                  ml={4}
                  mt={0.5}
                  color="neutral.dsGray"
                >
                  {v.list.length}
                </Box>
                <Box>
                  <Button variant="icon" onClick={() => openCategory(v.category)}>
                    <Box transform={subCategoryOpen[v.category] ? 'none' : 'rotate(-90deg)'}>
                      <ChevronDownIcon />
                    </Box>
                  </Button>
                </Box>
              </Flex>
              <Flex
                flexWrap="wrap"
                gap={2}
                mt={2}
                display={subCategoryOpen[v.category] ? 'flex' : 'none'}
              >
                {v.list.map((skill, key) => {
                  const colors = getCategoryColorForSkill(skill);
                  return (
                    <Badge
                      key={key}
                      color={!curSkills.includes(skill) ? 'neutral.black' : colors.color}
                      bgColor={!curSkills.includes(skill) ? 'none' : colors.bgColor}
                      borderWidth="1px"
                      borderColor={!curSkills.includes(skill) ? colors.bgColor : 'none'}
                      _hover={{
                        bgColor: !curSkills.includes(skill) ? colors.bgColor : 'rgba(0,0,0,0)',
                        color: !curSkills.includes(skill) ? colors.color : 'neutral.black',
                        borderColor: !curSkills.includes(skill) ? 'none' : colors.bgColor
                      }}
                      variant="filter"
                      onClick={() => handleItemClick(skill)}
                    >
                      {skill}
                    </Badge>
                  );
                })}
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CreateJobSkills;
