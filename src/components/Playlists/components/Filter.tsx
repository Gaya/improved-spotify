import React from 'react';

interface FilterProps {
  value: string;
  onChange(value: string): void;
}

const Filter: React.FC<FilterProps> = ({ value, onChange }) => {
  const test = 1;

  return (
    <div>Filter</div>
  );
};

export default Filter;
