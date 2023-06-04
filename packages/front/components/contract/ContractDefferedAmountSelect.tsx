import { Box, Button, Flex, FormControl, FormLabel, Text } from "@chakra-ui/react";
import { ErrorMessage, Field, FieldProps, useFormikContext } from "formik";
import { FC } from "react";
import LockIcon from "../icons/LockIcon";

interface ContractDefferedAmountSelectorProps {
    id: string;
    label: string;
    snapshotDone: boolean;
}

const options = [
    "0", "20", "40", "60", "80"
]

const ContractDefferedAmountSelector: FC<ContractDefferedAmountSelectorProps> = ({id, label, snapshotDone}) => {
    const { values, errors, setFieldValue, setFieldTouched} = useFormikContext();

    return (
    <FormControl id={id}>
        <Flex>
            <FormLabel mr={8} mt={2}><Text fontFamily="Montserrat" fontSize="16px" lineHeight="150%" fontWeight="400">{label}</Text></FormLabel>
                {!snapshotDone && <Box ml={12}><Button variant="secondary" leftIcon={<Box mt={-1} mr={2}><LockIcon/></Box>}>Verified funding</Button></Box>}
                {snapshotDone && <>
                    <Flex mx="auto">
                        <Field name={id} display="flex" flexDir="row">
                            {({ field, form }: FieldProps) => (
                                <>
                                    {options.map((o,k) => 
                                        <Box 
                                            key={k}
                                            py={2}
                                            px={4}
                                            cursor="pointer"
                                            bgColor={values[id] === o ? "brand.primary" : "neutral.lightGray"}
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
                    <Flex flexDir="column" ml="auto">
                        <Flex>
                            {values.globalAmount && values[id] && <Text fontSize="16px" fontFamily="Montserrat" fontWeight="700" lineHeight="150%">
                                {values.globalAmount * values[id] / 100}
                            </Text>}
                            {values.amountCurrency && values[id] && <Text ml={2} fontSize="16px" fontFamily="Montserrat" fontWeight="400" lineHeight="150%" textTransform="uppercase">
                                {values.amountCurrency}
                            </Text>}
                        </Flex>
                        {values.globalAmount && values[id] && <Text fontSize="12px" fontFamily="Montserrat" fontWeight="400" lineHeight="150%" color="neutral.dsGray">
                            $ {values.globalAmount * values[id] / 100}
                        </Text>}
                    </Flex>
                </>}
        </Flex>
        <ErrorMessage name={id}>
            {(msg) => <Text textStyle="errorMessage">{msg}</Text>}
        </ErrorMessage>
    </FormControl>
    );
};

export default ContractDefferedAmountSelector;