import { createTheme } from "@mui/material/styles";

import SourceCodePro from '../assets/SourceCodePro-VariableFont_wght.ttf'

export const theme = createTheme({
    typography: {
        "fontFamily": SourceCodePro,
    },
    palette: {
        primary: {
            main: '#a5ffaf',
        },
        // #dfdde5 #595861 #101014 #24232a  
        // #18171f 
        // #E32636 #ED760E #f3cb6f #00FF7F
    },
    components: {
        MuiInputBase: {
            styleOverrides: {
                input: {
                    // color: '#dfdde5',
                    fontSize: '1.2rem',
                },
            },
        },
    },
})