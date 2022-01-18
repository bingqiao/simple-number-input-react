import React, { useEffect, useRef, useState } from 'react';
import './angle-button.sass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleLeft, faAngleRight, faAngleUp } from '@fortawesome/free-solid-svg-icons';

interface AngleButtonProps {
    direction: 'left' | 'up' | 'right' | 'down';
    size?: string;
    handleClick: (increment: number) => void;
}

const AngleButton: React.FC<AngleButtonProps> = ({ direction, size, handleClick }) => {
    let icon = faAngleDown;
    if (direction === 'left') {
        icon = faAngleLeft;
    }
    if (direction === 'right') {
        icon = faAngleRight;
    }
    if (direction === 'up') {
        icon = faAngleUp;
    }
    const iconSize = size === 'large' ? 'fa-2x' : 'fa-lg';
    const increment = direction === 'up' || direction === 'right' ? 1 : -1;
    const horizontal = direction === 'left' || direction === 'right' ? 'horizontal px-2' : '';
    const onClick = (indrect?: boolean) => {
        handleClick(increment);
    };
    const [timeoutState, setTimeoutState] = useState<number>();
    const timeoutStateRef = useRef<number>();
    timeoutStateRef.current = timeoutState;
    const [intervalState, setIntervalState] = useState<number>();
    const intervalStateRef = useRef<number>();
    intervalStateRef.current = intervalState;

    const handleHold = () => {
        onClick(true);
        const interval = setTimeout(handleHold, 100);
        setIntervalState(interval);
    }

    const onMouseDown = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
        cleanUp();
        const timeout = setTimeout(() => {
            handleHold();
        }, 300);
        setTimeoutState(timeout);
    };
    const cleanUp = () => {
        if (timeoutStateRef.current) {
            clearTimeout(timeoutStateRef.current);
            setTimeoutState(0);
        }
        if (intervalStateRef.current) {
            clearInterval(intervalStateRef.current);
            setIntervalState(0);
        }
    };
    const handleMouseUp = () => {
        cleanUp();
    };
    const handleMouseLeave = () => {
        cleanUp();
    };

    // use global mouseup to cleanup?
    useEffect(() => {
        window.addEventListener("mouseup", cleanUp);
    }, []);

    return (
        <button
            className={`button is-ghost is-small is-fullwidth is-unselectable number-input-angle no-shadow ${horizontal}`}
            onClick={() => onClick()}
            onMouseDown={onMouseDown} // right click shows context menu and won't trigger mouseDown. Fixed by preventing context menu
            onTouchStart={onMouseDown}
            onMouseUp={handleMouseUp}
            onTouchEnd={cleanUp}
            //onMouseLeave={handleMouseLeave}
            onContextMenu={(e) => e.preventDefault()}
        >
            <span className="icon has-text-link">
                <FontAwesomeIcon icon={icon} className={`${iconSize}`} />
            </span>
        </button>
    );
}

export default AngleButton;
