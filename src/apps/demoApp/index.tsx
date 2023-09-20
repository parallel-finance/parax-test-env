import { render } from 'react-dom';
import { AppRenderParams } from 'parax-sdk';

const menuList = [
  {
    title: 'Home',
    path: '/'
  }
];

export default {
  render: ({ container }: AppRenderParams) => {
    render((<div>Render your app content</div>) as any, container as any);
  },
  icon: 'design/PDS_V3/logo/paraspace',
  name: 'DemoApp',
  routing: {
    routes: menuList.map(v => ({
      path: v.path,
      name: v.title
    })),
    onSwitchRoute: () => {}
  }
};
