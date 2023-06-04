import React, { FC, useEffect, useState } from 'react';
import {
  Button,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  FormControl,
  FormLabel,
  Text,
  FlexProps,
  useDisclosure
} from '@chakra-ui/react';
import ChevronDownIcon from '@workagora/front/components/icons/ChevronDownIcon';
import { Field, useFormikContext } from 'formik';
import { useJobs } from '@workagora/front-provider';
import { FormData } from './ContractForm';

interface SelectorProps extends FlexProps {
  id: string;
  label: string;
  handleSelection: (
    value: string,
    fieldName: string,
    selectField: string,
    setter: (value: any) => void
  ) => void;
  error?: string;
  touched?: boolean;
}

const ContractRelatedJob: FC<SelectorProps> = ({
  id,
  label,
  handleSelection,
  error,
  touched,
  ...props
    }) => {
    const [selectedOption, setSelectedOption] = useState<string>();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const { jobs } = useJobs();
    const { values }: {values: FormData} = useFormikContext();

    useEffect(() => {
        if (values?.jobRelated) {
            setSelectedOption(values.jobRelated);
        }
    }, [])

    return (
    <FormControl id={id} isRequired {...props}>
        <FormLabel>{label}</FormLabel>
        <Menu onOpen={onOpen} onClose={onClose}>
        <MenuButton
            as={Button}
            variant="select"
            color={selectedOption ? 'neutral.black' : 'neutral.dsGray'}
            borderColor={isOpen ? 'brand.primary' : error && touched ? 'red' : 'brand.primary'}
            boxShadow={
            isOpen
                ? '0 0 0 1px var(--chakra-colors-brand-primary)'
                : error && touched
                ? '0 0 0 1px red'
                : 'none'
            }
            opacity={selectedOption ? 1 : 0.75}
            borderBottomLeftRadius={isOpen ? '0' : '6px'}
            rightIcon={
            <Box transform={isOpen ? 'rotate(180deg)' : 'none'} transition="all ease-in-out 250ms">
                <ChevronDownIcon />
            </Box>
            }
            w="100%"
        >
            {jobs && <>{jobs.find((j) => j.uuid === selectedOption)?.title}</>}
        </MenuButton>
        <MenuList
            mt={-2}
            borderColor="brand.primary"
            borderWidth="1px"
            fontFamily="Comfortaa"
            fontWeight="700"
            borderTopRadius={0}
            borderTopWidth={0}
            py={0}
            sx={{
            button: {
                transition: 'all ease-in-out 250ms',
                fontSize: '14px',
                fontWeight: '700',
                _hover: {
                bgColor: 'brand.primary',
                color: 'neutral.white'
                }
            }
            }}
        >
            {jobs && jobs.map((v, k) => (
            <MenuItem
                key={k}
                onClick={() => handleSelection(v.uuid, id, selectedOption, setSelectedOption)}
            >
                {v.title}
            </MenuItem>
            ))}
        </MenuList>
        <Field name={id} type="hidden" />
        </Menu>
        {error && touched && <Text textStyle="errorMessage">{error}</Text>}
    </FormControl>
    );
}

export default ContractRelatedJob;
