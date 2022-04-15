import {useEffect, useState} from "react";

//react hook taken from https://stackoverflow.com/questions/39435395/reactjs-how-to-determine-if-the-application-is-being-viewed-on-mobile-or-deskto
//user - https://stackoverflow.com/users/11043429/volobot-advanced-systems

const useCheckMobileScreen = () => {
    const [width, setWidth] = useState<number>(window.innerWidth);
    const handleWindowSizeChange = () => {
            setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    return (width <= 768);
}

export default useCheckMobileScreen