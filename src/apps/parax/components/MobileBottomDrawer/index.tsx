import { Container, Popup, PopupProps } from '@parallel-mono/components';
import { throttle } from 'lodash';
import { FC, ReactNode, useCallback, useState, TouchEvent, useMemo } from 'react';
import styled from 'styled-components';

type DrawerProps = Omit<PopupProps, 'children' | 'onClose' | 'onClick'> & {
  isOpen: boolean;
  onClose: () => void;
  onClick: () => void;
  onTouchEnd: () => void;
  children: ReactNode;
};

const DrawerWrapper = styled(Container).attrs({
  background: 'sub1'
})<{ bottom: number }>`
  position: fixed;
  background-color: ${({ theme }) => theme.skin.background.main};
  width: 100%;
  ${({ bottom }) => {
    if (bottom > 0) {
      return `bottom: -${bottom}px !important;`;
    }
    return null;
  }}
  animation: slidein ease-out 0.2s forwards;

  @keyframes slidein {
    from {
      bottom: -100%;
    }
    to {
      bottom: 0;
    }
  }
`;

const SlideBar = styled.div`
  height: 3.25rem;
  position: relative;
  ::after {
    content: '';
    display: block;
    position: absolute;
    top: 1rem;
    left: 0;
    right: 0;
    margin: auto;
    width: 1.5rem;
    height: 4px;
    background-color: ${({ theme }) => theme.skin.grey[300]};
    border-radius: 1.375rem;
  }
`;

export const MobileBottomDrawer: FC<DrawerProps> = ({
  children,
  isOpen,
  onClose,
  onClick,
  onTouchEnd
}) => {
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchMoveY, setTouchMoveY] = useState(0);
  const [touchDirection, setDirection] = useState('' as 'up' | 'down');
  const [bottomDist, setBottomDist] = useState(0);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    setTouchStartY(e.touches[0].pageY);
  }, []);

  const touchMove = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      const curTouchMoveY = e.changedTouches[0].pageY;

      setDirection(curTouchMoveY > touchMoveY ? 'down' : 'up');
      setTouchMoveY(curTouchMoveY);

      const distance = curTouchMoveY - touchStartY;
      if (distance > 0) {
        setBottomDist(distance);
      } else {
        setBottomDist(0);
      }
    },
    [touchMoveY, touchStartY]
  );
  const handleTouchMove = useMemo(() => throttle(touchMove, 100), [touchMove]);

  const handleTouchEnd = useCallback(() => {
    if (touchDirection === 'down') {
      onTouchEnd();
    }
    setTimeout(() => {
      setBottomDist(0);
    }, 200);
  }, [onTouchEnd, touchDirection]);

  return (
    <Popup isOpen={isOpen} closeOnBackdropClick onClose={handleClose} onClick={handleClick}>
      <DrawerWrapper bottom={bottomDist}>
        <SlideBar
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        {children}
      </DrawerWrapper>
    </Popup>
  );
};
