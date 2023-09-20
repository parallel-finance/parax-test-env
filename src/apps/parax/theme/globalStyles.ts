import { createGlobalStyle, CSSObject } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
html, body, #root {
  height: 100%;
}

body {
  ${({ theme }) => theme.typography.body as CSSObject};
  overflow: hidden;
  font-family: ${({ theme }) => theme.fontFamily};
  background: ${({ theme }) => theme.skin.background.main};
  color: ${({ theme }) => theme.skin.text.main};
}

input {
  color: inherit;
}

ol,ul {
  list-style: none;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --clr-blue: #0C3EE3;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --border-radius: 16px;
  --header-height-pc: 4.5rem;
  --max-app-width-pc: 1280px;
  --header-height-mobile: 9rem;
}

// TODO: temp fix for wallet connect modal z-index issue
w3m-modal, wcm-modal {
  z-index: 99999!important;
  position: relative!important;
}
`;
