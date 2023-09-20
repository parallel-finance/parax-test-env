import { ToastContentProps } from 'react-toastify';

export const PromiseToastRender = (props: ToastContentProps<{ message?: string }>) => {
  const {
    toastProps: { isLoading },
    data
  } = props;
  if (isLoading) {
    return 'processing';
  }
  return data?.message;
};
