// src/Components/DarkMode/useDarkMode.js

import { useEffect, useState } from "react";

const useDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    return { isDarkMode, toggleTheme };
};

export default useDarkMode;