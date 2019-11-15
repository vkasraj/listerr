import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import grey from "@material-ui/core/colors/grey";
import red from "@material-ui/core/colors/red";

export const theme = createMuiTheme({
    palette: {
        primary: red,
        secondary: grey,
        background: {
            default: "#fff"
        }
    },
    typography: {
        fontFamily: [
            "Fira Code",
            "monospace",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(",")
    }
});
