import React from 'react';
import {theme} from './ThemeContext/ThemeContext';
import {AuthContext} from './AuthContext/AuthContext';

const ThemeContext = React.createContext({theme});

export {AuthContext, ThemeContext, theme};
