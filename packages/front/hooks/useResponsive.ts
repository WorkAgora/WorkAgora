import { useBreakpoint } from "@chakra-ui/react";

export const useResponsive = () => {
    const breakpoint = useBreakpoint();
    const desktopDisplay = breakpoint === 'lg' || breakpoint === 'xl';
    const mobileDisplay = breakpoint === 'base' || breakpoint === 'sm';
    const tabletDisplay = breakpoint === 'md';

    return {desktopDisplay, mobileDisplay, tabletDisplay};
};

