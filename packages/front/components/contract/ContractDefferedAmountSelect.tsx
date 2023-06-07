import { Box, Button, Flex, FormControl, FormLabel, Text } from "@chakra-ui/react";
import { ErrorMessage, Field, FieldProps, useFormikContext } from "formik";
import { FC } from "react";
import LockIcon from "../icons/LockIcon";
import { usePriceFeed } from "@workagora/front/hooks/usePriceFeed";
import { MainnetTokens, TestnetTokens } from "@workagora/utils";
import { useBalance } from "wagmi";
import { useCurrentUser } from "@workagora/front-provider";
import { utils } from "ethers";

interface ContractDefferedAmountSelectorProps {
    id: string;
    label: string;
    snapshotDone: boolean;
    onSnapshot: (isGood: boolean) => void;
}

const options = [
    "0", "20", "40", "60", "80"
]

const ContractDefferedAmountSelector: FC<ContractDefferedAmountSelectorProps> = ({id, label, snapshotDone, onSnapshot}) => {
    const { values, errors, setFieldValue, setFieldTouched} = useFormikContext();
    const { user } = useCurrentUser();
    const { bigNumberPrice } = usePriceFeed(values?.amountCurrency ?? 0, values?.globalAmount.toString() ?? '0');

    let tokens = TestnetTokens;
    if (process.env.NEXT_PUBLIC_BC_ENV === 'production') {
        tokens = MainnetTokens;
    }

    const mainBalance = useBalance({
        address: user?.wallet as `0x${string}`,
      });

    const tokenBalance = useBalance({
        address: user?.wallet as `0x${string}`,
        token: tokens[values?.amountCurrency] as `0x${string}` ?? '',
      })

    const snapshotCurrency = async () => {
        if (values.amountCurrency && values.globalAmount && bigNumberPrice) {
            if (values.amountCurrency === 'avax' && mainBalance.data) {
                if (mainBalance.data.value.gte(bigNumberPrice)) {
                    onSnapshot(true);
                } else {
                    onSnapshot(false);
                }
            } else if (tokenBalance.data) {
                if (tokenBalance.data.value.gte(bigNumberPrice)) {
                    onSnapshot(true);
                } else {
                    onSnapshot(false);
                }
            }
        }
        onSnapshot(false);
    };

    return (
    <FormControl id={id}>
        <Flex alignItems={{base: 'center', lg: 'initial'}} flexDir={{base: 'column', lg: 'row'}}>
            <FormLabel mr={{base: 2, lg: 8}} mt={2}><Text fontFamily="Montserrat" fontSize="16px" lineHeight="150%" fontWeight="400">{label}</Text></FormLabel>
                {!snapshotDone && <Box ml={{base: 'auto', lg: 12}} mr={{base: 'auto', lg: 0}}><Button variant="secondary" leftIcon={<Box mt={-1} mr={2}><LockIcon/></Box>} onClick={() => snapshotCurrency()}>Verified funding</Button></Box>}
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
                    <Flex flexDir="column" ml="auto" mr={{base: 'auto', lg: 0}}>
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