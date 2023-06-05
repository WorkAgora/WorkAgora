import { deployAllContracts } from "../utils/contracts";

deployAllContracts().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
