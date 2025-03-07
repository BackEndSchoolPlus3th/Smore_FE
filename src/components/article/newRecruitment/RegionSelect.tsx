import React from 'react';
import Select from 'react-select';
import { regionOptions } from '../../../shared';

interface RegionSelectProps {
    region: string;
    setRegion: React.Dispatch<React.SetStateAction<string>>;
}

const RegionSelect: React.FC<RegionSelectProps> = ({ region, setRegion }) => {
    return (
        <>
            <label className="block text-gray-700 text-sm font-medium mb-2">
                지역
            </label>
            <Select
                options={regionOptions}
                value={
                    region
                        ? regionOptions.find(
                              (option) => option.value === region
                          )
                        : null
                }
                onChange={(selectedOption) =>
                    setRegion(selectedOption?.value || '')
                }
                placeholder="지역을 선택하세요"
                styles={{
                    control: (styles) => ({
                        ...styles,
                        border: '1px solid gray-300',
                        borderRadius: '0.375rem',
                        padding: '0.1rem',
                        cursor: 'pointer',
                    }),
                    option: (styles, { isSelected }) => ({
                        ...styles,
                        backgroundColor: isSelected ? '#c5baff' : 'white',
                        color: isSelected ? 'white' : 'black',
                        cursor: 'pointer',
                    }),
                    placeholder: (styles) => ({
                        ...styles,
                        color: '#7743db',
                    }),
                }}
            />
        </>
    );
};

export default RegionSelect;
