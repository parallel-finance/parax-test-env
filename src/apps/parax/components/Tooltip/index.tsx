import { memo, useMemo } from 'react';
import { TooltipProps, Tooltip as RawTooltip } from '@parallel-mono/components';

import { TipContent } from './TipContent';

export const Tooltip = memo(({ content, ...others }: TooltipProps) => {
  const wrappedContent = useMemo(
    () => (content ? <TipContent>{content}</TipContent> : null),
    [content]
  );
  return <RawTooltip content={wrappedContent} {...others} />;
});
