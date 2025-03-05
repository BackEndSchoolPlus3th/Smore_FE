import React from 'react';
import Select from 'react-select';

interface RegionSelectProps {
    region: string;
    setRegion: React.Dispatch<React.SetStateAction<string>>;
}

const regionOptions = [
    { value: '전국', label: '전국' },
    { value: '서울', label: '서울' },
    { value: '부산', label: '부산' },
    { value: '대구', label: '대구' },
    { value: '인천', label: '인천' },
    { value: '광주', label: '광주' },
    { value: '대전', label: '대전' },
    { value: '울산', label: '울산' },
    { value: '세종', label: '세종' },
    { value: '경기', label: '경기' },
    { value: '강원', label: '강원' },
    { value: '충북', label: '충청북도' },
    { value: '충남', label: '충청남도' },
    { value: '전북', label: '전라북도' },
    { value: '전남', label: '전라남도' },
    { value: '경북', label: '경상북도' },
    { value: '경남', label: '경상남도' },
    { value: '제주', label: '제주도' },
];

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
