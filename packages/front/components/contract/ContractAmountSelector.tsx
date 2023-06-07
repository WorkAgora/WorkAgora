/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Flex, FormControl, FormLabel, Text } from "@chakra-ui/react";
import { usePriceFeed } from "@workagora/front/hooks/usePriceFeed";
import { ErrorMessage, Field, FieldProps, useFormikContext } from "formik";
import { FC } from "react";
import { FormData } from "./ContractForm";

interface ContractAmountSelectorProps {
    id: string;
    label: string;
}

const options = [
    "0", "20", "40", "60", "80"
]

const ContractAmountSelector: FC<ContractAmountSelectorProps> = ({id, label}) => {
    const { values, errors, setFieldValue, setFieldTouched} = useFormikContext();
    const { cryptoPrice } = usePriceFeed((values as FormData).amountCurrency, (parseInt((values as FormData).globalAmount) * (values as any)[id] / 100).toString());

    return (
    <FormControl id={id}>
        <Flex alignItems={{base: 'center', lg: 'initial'}} flexDir={{base: 'column', lg: 'row'}}>
            <FormLabel mr={{base: 2, lg: 8}} mt={2}><Text fontFamily="Montserrat" fontSize="16px" lineHeight="150%" fontWeight="400">{label}</Text></FormLabel>
                <Flex mx="auto">
                    <Field name={id} display="flex" flexDir="row">
                        {({ field, form }: FieldProps) => (
                            <>
                                {options.map((o,k) => 
                                    <Box 
                                        key={k}
                                        py={2}
                                        px={{base: 2, lg: 4}}
                                        cursor="pointer"
                                        bgColor={(values as any)[id] === o ? "brand.primary" : "neutral.lightGray"}
                                        borderTopLeftRadius={k === 0 ? '8px' : '0'}
                                        borderBottomLeftRadius={k === 0 ? '8px' : '0'}
                                        borderTopRightRadius={k === options.length - 1 ? '8px' : '0'}
                                        borderBottomRightRadius={k === options.length - 1 ? '8px' : '0'}
                                        transition="all ease-in-out 250ms"
                                        _hover={{
                                            bgColor: "brand.primary"
                                        }}
                                        onClick={() => {setFieldValue(id,o, true); setFieldTouched(id, true)}}
                                    >
                                        <Text fontFamily="Montserrat" fontSize="16px" lineHeight="150%" fontWeight="400">{o}%</Text>
                                    </Box>
                                )}
                            </>
                        )}
                    </Field>
                </Flex>
            <Flex flexDir="column" ml="auto" mr={{base: 'auto', lg: 0}}>
                <Flex>
                    {(values as FormData).globalAmount && (values as any)[id] &&  (values as any)[id] !== '0' && cryptoPrice && <Text fontSize="16px" fontFamily="Montserrat" fontWeight="700" lineHeight="150%">
                        {cryptoPrice}
                    </Text>}
                    {(values as FormData).amountCurrency && (values as any)[id] &&  (values as any)[id] !== '0' && <Text ml={2} fontSize="16px" fontFamily="Montserrat" fontWeight="400" lineHeight="150%" textTransform="uppercase">
                        {(values as FormData).amountCurrency}
                    </Text>}
                </Flex>
                {(values as FormData).globalAmount && (values as any)[id] &&  (values as any)[id] !== '0' && <Text fontSize="12px" fontFamily="Montserrat" fontWeight="400" lineHeight="150%" color="neutral.dsGray">
                   $ {parseInt((values as FormData).globalAmount) * (values as any)[id] / 100}
                </Text>}
            </Flex>
        </Flex>
        <ErrorMessage name={id}>
            {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
        </ErrorMessage>
    </FormControl>
    );
};

export default ContractAmountSelector;