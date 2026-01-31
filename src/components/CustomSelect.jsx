import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';

export default function CustomSelect({ options, intialValue, width, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(intialValue);
    const ref = useRef(null);

    const handleSelect = (value, label) => {
        setSelectedOption(label);
        setIsOpen(false);

        if (onChange) {
            onChange(value);
        }
    };

    const handleReset = () => {
        setSelectedOption(intialValue);
        setIsOpen(false);

        if (onChange) {
            onChange('');
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);

    return (
        <div className='relative inline-block' ref={ref}>
            <button
                type='button'
                className={`inline-flex rounded-md justify-between items-center ${width} px-3 py-2 text-sm font-medium text-gray-700 bg-[#9CB6DA] border border-gray-300 shadow-sm hover:bg-blue-300 focus:outline-none transition ease-in duration-150`}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup={isOpen}
            >
                {selectedOption}
                {/* icon */}
                <Icon icon="bxs:down-arrow" width="16" height="16" />
            </button>

            {/* value options */}
            {isOpen && (
                <div
                    className={`origin-top-left absolute mt-2 ${width} rounded-md shadow-lg bg-white rig-1 ring-black ring-opacity-5 focus:outline-none z-10`}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    aria-hidden={!isOpen}
                    ref={ref}
                >
                    <div className='bg-gray-200 rounded-md' role="none">
                        <button
                            type='button'
                            className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 ${selectedOption === intialValue ? 'bg-[#6095DE]' : 'bg-[#9CB6DA]'} rounded-t-md`}
                            onClick={handleReset}
                            aria-expanded={isOpen}
                            aria-haspopup={isOpen}
                        >
                            {intialValue}
                        </button>

                        {options.map((option, index) => { 
                            const isLastOption = index === options.length - 1;
                            const isActive = selectedOption === option.label;

                            return (
                                <button
                                    key={option.value}
                                    type='button'
                                    className={`block w-full text-left px-4 py-2 text-sm ${isActive ? 'bg-[#6095DE]' : 'text-gray-700 hover:bg-blue-100'} ${isLastOption ? 'rounded-b-md' : ''} bg-[#9CB6DA]`}
                                    role="menuitem"
                                    onClick={() => handleSelect(option.value, option.label)}
                                >
                                    {option.label}
                                </button>
                            ); 
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}