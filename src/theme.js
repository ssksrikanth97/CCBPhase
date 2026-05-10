import { createTheme } from '@material-ui/core/styles';
import { retroTheme } from './styles/themes';

const theme = createTheme({
  palette: {
    primary: { main: retroTheme.colors.accentPrimary },
    secondary: { main: retroTheme.colors.accentSecondary },
    background: { default: retroTheme.colors.bgPrimary, paper: retroTheme.colors.bgSurface },
    text: { primary: retroTheme.colors.textPrimary, secondary: retroTheme.colors.textSecondary },
  },
  typography: {
    fontFamily: retroTheme.fonts.heading,
    body1: { fontFamily: retroTheme.fonts.body, fontSize: '0.875rem' },
    body2: { fontFamily: retroTheme.fonts.body, fontSize: '0.8125rem' },
  },
  overrides: {
    MuiCssBaseline: { '@global': { body: { backgroundColor: retroTheme.colors.bgPrimary } } },
  },
});

export default theme;
