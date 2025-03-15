import React from "react";
import { ReactComponent as Sun } from "./Sun.svg";
import { ReactComponent as Moon } from "./Moon.svg";
import "./DarkMode.css";
import useDarkMode from './useDarkMode'; // Import the custom hook

const DarkModeToggle = () => {
    const { isDarkMode, toggleTheme } = useDarkMode();

    return (
        <div className='dark_mode'>
            <input
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                checked={isDarkMode}
                onChange={toggleTheme}
            />
            <label className='dark_mode_label' htmlFor='darkmode-toggle'>
                <Sun className={isDarkMode ? "hidden" : ""} />
                <Moon className={isDarkMode ? "" : "hidden"} />
            </label>
        </div>
    );
};

export default DarkModeToggle;