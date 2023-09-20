import {
  ColorMode,
  H6,
  Icon,
  IconProps,
  Inline,
  Toggle,
  useBreakpoints,
  useCallbackMerge,
  useThemeConfig
} from '@parallel-mono/components';
import { memo, useCallback } from 'react';
import styled from 'styled-components';

import { COLOR_MODE_STORAGE_KEY } from '@/apps/parax/config';

type ColorModeSwitchProps = Omit<IconProps, 'name'>;

const ColorModeSwitchIcon = styled(Icon)`
  cursor: pointer;
`;

const colorModalMapping = {
  [ColorMode.dark]: 'Dark Mode',
  [ColorMode.light]: 'Light Mode'
};

export const ColorModeSwitch = memo(({ onClick, ...others }: ColorModeSwitchProps) => {
  const { colorMode, changeColorMode } = useThemeConfig();
  const { mobile } = useBreakpoints();

  const handleSwitchColorMode = useCallback(() => {
    const colorModeToBe = colorMode === ColorMode.light ? ColorMode.dark : ColorMode.light;
    changeColorMode(colorModeToBe);
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, colorModeToBe);
  }, [colorMode, changeColorMode]);

  const handleIconClicked = useCallbackMerge(handleSwitchColorMode, onClick);

  return mobile ? (
    <Inline width="100%" justifyContent="space-between">
      <Inline gap="0.5rem" alignItems="center">
        <ColorModeSwitchIcon
          size="1.25rem"
          data-escape-transfer-assets
          name={colorMode === ColorMode.dark ? 'moon' : 'sun'}
          onClick={handleIconClicked}
          {...others}
        />
        <H6>{colorModalMapping[colorMode]}</H6>
      </Inline>
      <Toggle checked={colorMode === ColorMode.dark} onChange={handleSwitchColorMode} />
    </Inline>
  ) : (
    <ColorModeSwitchIcon
      data-escape-transfer-assets
      name={colorMode === ColorMode.dark ? 'moon' : 'sun'}
      onClick={handleIconClicked}
      {...others}
    />
  );
});
