import { createGlobalStyle } from 'styled-components';

export const CustomToastStyles = createGlobalStyle`
  :root {
    --toastify-color-error: ${({ theme }) => theme.skin.error.main};
    --toastify-color-success: ${({ theme }) => theme.skin.success.main};
    --toastify-font-family: ${({ theme }) => theme.fontFamily};
    --toastify-z-index: 999999;
  }

  .Toastify__toast-icon  {
    /* width: auto; */
  }

  .Toastify__toast-container {
    margin-top: 3rem;
  }
`;
