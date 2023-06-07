import {
  Box,
  Flex,
  Input,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  InputRightElement,
  InputGroup,
  Button
} from '@chakra-ui/react';
import { useCurrentUser } from '@workagora/front-provider';
import { FC, useEffect, useRef, useState } from 'react';
import PencilIcon from '../../../icons/PencilIcon';
import { useUpdateProfile } from '@workagora/front/hooks/useUpdateProfile';
import { useColoredBadges } from '@workagora/front/hooks/useColoredBadges';
import SearchIcon from '../../../icons/SearchIcon';
import { skills, User } from '@workagora/utils';
import CheckIcon from '../../../icons/CheckIcon';
import CloseIcon from '../../../icons/CloseIcon';

const FreelanceSkills: FC = () => {
  const { user } = useCurrentUser();
  const [edit, setEdit] = useState(false);
  const { loading, updateProfile } = useUpdateProfile();
  const { getCategoryColorForSkill, allSkills } = useColoredBadges();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const menuRef = useRef();
  const inputRef = useRef();
  const [curSkills, setCurSkills] = useState<string[]>();

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
      .filter((result) => !curSkills?.includes(result));
    if (finalResult.length > 0) {
      setSearchResults(finalResult);
    } else {
      setSearchResults(['No result']);
    }
    if (!isOpen) onOpen();
    if (inputRef.current) inputRef.current.focus();
  };

  const onSubmit = async () => {
    if (user) {
      const updatedValues: Partial<User> = {};

      if (user.freelanceProfile?.skills?.length !== curSkills?.length) {
        updatedValues.freelanceProfile = { skills: curSkills };
      }

      await updateProfile({
        wallet: user.wallet,
        email: user.email,
        currentUserType: user.currentUserType,
        ...updatedValues
      });
      setEdit(false);
    }
  };

  const handleItemClick = (skill: string) => {
    if (skill != 'No result') {
      setSearchText('');
      setSearchResults([]);
      if (!curSkills?.includes(skill)) {
        setCurSkills((prevSkills) => (prevSkills ? [...prevSkills, skill] : [skill]));
      } else {
        setCurSkills((prevSkills) => prevSkills?.filter((v) => v !== skill));
      }
    }
    if (isOpen) onClose();
  };

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
    if (user?.freelanceProfile?.skills) {
      setCurSkills(user?.freelanceProfile?.skills);
    }
  }, [user?.freelanceProfile?.skills]);

  return (
    <>
      {user && (
        <Flex
          flexDir="column"
          justifyContent="center"
          p={6}
          borderRadius="32px"
          borderWidth="1px"
          borderColor="neutral.gray"
          w="100%"
          gap={4}
        >
          <Flex alignItems="center" flexDir={{base: 'column', lg: 'row'}}>
            <Box textStyle="h4" as="span">
              Skills & Expertise
            </Box>
            {!edit && (
              <Box
                color="neutral.dsGray"
                p={2}
                ml="auto"
                cursor="pointer"
                borderRadius="8px"
                _hover={{ bgColor: 'neutral.lightGray', color: 'neutral.black' }}
                onClick={() => setEdit(true)}
              >
                <PencilIcon />
              </Box>
            )}
            {edit && (
              <Flex ml="auto" mr={{base: 'auto', lg: 0}} mt={{base: 4, lg: 0}} alignItems="center">
                <Box>
                  <Button
                    variant={
                      curSkills?.length === user.freelanceProfile?.skills?.length
                        ? 'outline'
                        : 'primary'
                    }
                    type="submit"
                    width="100%"
                    isDisabled={curSkills?.length === user.freelanceProfile?.skills?.length}
                    isLoading={loading}
                    loadingText="Updating profile"
                    spinnerPlacement="end"
                    rightIcon={<CheckIcon />}
                    onClick={() => onSubmit()}
                  >
                    Save changes
                  </Button>
                </Box>
                <Box
                  color="red.500"
                  p={2}
                  ml={2}
                  cursor="pointer"
                  borderRadius="8px"
                  transition="all ease-in-out 250ms"
                  _hover={{ bgColor: 'neutral.lightGray', color: 'red.700' }}
                  onClick={() => setEdit(false)}
                >
                  <CloseIcon />
                </Box>
              </Flex>
            )}
          </Flex>
          <Flex flexWrap="wrap" flexDir={{base: edit ? 'column' : 'row', lg: 'row'}} gap={2}>
            {edit && (
              <>
                <Flex flexDir="column">
                  <Box position="relative">
                    <InputGroup>
                      <Input
                        ref={inputRef}
                        variant="searchBar"
                        value={searchText}
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
                                handleItemClick(e.target.textContent)
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
                  {curSkills &&
                    curSkills.map((v, k) => {
                      const colors = getCategoryColorForSkill(v);
                      return (
                        <Badge
                          key={k}
                          color={colors.color}
                          bgColor={colors.bgColor}
                          borderWidth="1px"
                          borderColor={'none'}
                          variant="filter"
                          display="flex"
                          alignItems="center"
                          onClick={() => handleItemClick(v)}
                        >
                          {v}
                          {edit && (
                            <Box
                              w="10px"
                              h="10px"
                              ml={2}
                              mt={0.5}
                              sx={{ svg: { width: '100% !important', height: '100% !important' } }}
                            >
                              <CloseIcon />
                            </Box>
                          )}
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
                      </Flex>
                      <Flex flexWrap="wrap" gap={2} mt={2}>
                        {v.list.map((skill, key) => {
                          const colors = getCategoryColorForSkill(skill);
                          return (
                            <Badge
                              key={key}
                              color={!curSkills?.includes(skill) ? 'neutral.black' : colors.color}
                              bgColor={!curSkills?.includes(skill) ? 'none' : colors.bgColor}
                              borderWidth="1px"
                              borderColor={!curSkills?.includes(skill) ? colors.bgColor : 'none'}
                              _hover={{
                                bgColor: !curSkills?.includes(skill)
                                  ? colors.bgColor
                                  : 'rgba(0,0,0,0)',
                                color: !curSkills?.includes(skill) ? colors.color : 'neutral.black',
                                borderColor: !curSkills?.includes(skill) ? 'none' : colors.bgColor
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
              </>
            )}
            {!edit &&
              user.freelanceProfile &&
              user.freelanceProfile.skills &&
              user.freelanceProfile.skills.map((v, k) => {
                const colors = getCategoryColorForSkill(v);
                return (
                  <Badge
                    key={k}
                    color={colors.color}
                    bgColor={colors.bgColor}
                    borderWidth="1px"
                    borderColor={'none'}
                    variant="filter"
                  >
                    {v}
                  </Badge>
                );
              })}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default FreelanceSkills;
