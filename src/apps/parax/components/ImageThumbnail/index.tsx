import { Stack, StackProps, Image, ImageProps } from '@parallel-mono/components';
import { ReactNode } from 'react';
import styled from 'styled-components';
import cx from 'classnames';

type ImageThumbnailClassNames = Partial<{
  imageThumbnail: string;
  floatingTag: string;
}>;
export interface ImageThumbnailProps extends Omit<StackProps, 'children' | 'placeholder'> {
  floatingTag?: ReactNode;
  description?: ReactNode;
  src: ImageProps['src'];
  classNames?: ImageThumbnailClassNames;
  fallback?: ImageProps['fallback'];
  placeholder?: ImageProps['placeholder'];
}

const ImageBox = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  line-height: 0;
`;

const Thumbnail = styled(Image)`
  position: absolute;
  border-radius: 1rem;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const FloatingTagBox = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0.5rem;
  margin: auto;
  white-space: nowrap;
`;

export const ImageThumbnail = ({
  floatingTag,
  description,
  src,
  gap = '0.75rem',
  fallback,
  classNames,
  placeholder,
  ...others
}: ImageThumbnailProps) => {
  return (
    <Stack gap={gap} {...others} justifyContent="center">
      <ImageBox>
        <Thumbnail
          src={src}
          className={cx(classNames?.imageThumbnail)}
          fallback={fallback}
          placeholder={placeholder}
        />

        {floatingTag && (
          <FloatingTagBox className={cx(classNames?.floatingTag)}>{floatingTag}</FloatingTagBox>
        )}
      </ImageBox>
      {description}
    </Stack>
  );
};
