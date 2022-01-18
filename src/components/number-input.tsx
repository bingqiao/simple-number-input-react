
import './number-input.sass';
import React, { useRef, useEffect } from 'react';
import AngleButton from './angle-button';

interface NumberInputProps {
    size?: string;
    max?: number;
    min?: number;
    verticalAngles?: boolean;
    separator?: string;
    initValue?: number;
    handleChange?: (v: number) => void;
}

export const NumberInput: React.FC<NumberInputProps> = ({ size, max, min, verticalAngles, separator, initValue = 0, handleChange }) => {
    const inputEl = useRef<HTMLInputElement>(null);
    // this cannot be a state.
    // setting state is async so not quick enough
    // for pressing angle button for continuous
    // increment/decrement
    let value: number;

    const inputSize = size === 'large' ? 'is-medium' : '';

    let MAX = 99;
    let MIN = 0;

    let _max = max ? Math.min(max, MAX) : MAX;
    let _min = min ? Math.max(min, MIN) : MIN;

    useEffect(() => {
        if (inputEl && inputEl.current) {
            inputEl.current.value = getInitValue();
        }
    }, [initValue]);


    const validate = (v: string) => {
        if (!/[0-9]/.test(v)) {
            return false;
        }
        const newValue = parseInt(v);
        return newValue <= _max && newValue >= _min;
    };

    const handleOnAngleClick = (increment: number) => {
        if (!inputEl || !inputEl.current) {
            return;
        }

        let oldValue = parseInt(inputEl.current.value);
        let newValue: number;
        if (isNaN(oldValue)) {
            newValue = increment > 0 ? _min : _max;
        } else {
            newValue = oldValue + increment;
            if (newValue > _max) {
                newValue = _min;
            } else if (newValue < _min) {
                newValue = _max;
            }
        }

        inputEl.current.value = getFormatted(newValue)
        if (handleChange) {
            handleChange(newValue);
        }
    };

    const getFormatted = (v: number) => {
        return v.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        });
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!inputEl || !inputEl.current) {
            return;
        }

        let newValue = e.target.value;
        if (!validate(newValue)) {
            if (!isNaN(value)) {
                newValue = String(value);
            }
        } else if (handleChange) {
            handleChange(parseInt(newValue));
        }
        value = parseInt(newValue);
        inputEl.current.value = getFormatted(value);
    };

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        value = parseInt(e.target.value);
    }

    const getInitValue = () => {
        if (!isNaN(initValue)) {
            let value = initValue;
            if (value > _max || value < _min) {
                value = _min;
            }
            return getFormatted(value);
        }
        return "";
    };

    return (
        <>
            <div className='is-inline-block is-unselectable'>
                <div className='is-flex'>
                    <div className={`has-text-centered ${verticalAngles ? '' : 'is-flex'}`} style={{ alignItems: "center" }}>
                        <AngleButton direction={verticalAngles ? 'up' : 'left'} handleClick={handleOnAngleClick} size={size} />
                        <div>
                            <input
                                className={`input ${inputSize} p-0 number-input`}
                                type="text"
                                inputMode="numeric"
                                maxLength={2}
                                size={2}
                                placeholder="00"
                                onFocus={onFocus}
                                onBlur={onBlur}
                                ref={inputEl}
                            />
                        </div>
                        <AngleButton direction={verticalAngles ? 'down' : 'right'} handleClick={handleOnAngleClick} size={size} />
                    </div>
                    <div className='is-flex is-align-items-center'>
                        {separator && <div className='px-0'>{separator}</div>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default NumberInput;
