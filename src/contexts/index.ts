import React from 'react';
import {theme} from './theme-context/theme-context';

const ThemeContext = React.createContext({theme});
export {ThemeContext, theme};