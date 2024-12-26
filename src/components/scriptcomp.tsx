import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { ButtonGroup } from 'primereact/buttongroup';
import '../styles/scriptcomp.css';

type Option = {
  label: string;
  value: string;
};

export const ACScriptComp: React.FC = () => {
  const options: Option[] = [
    { label: 'Сценарій 1', value: '1' },
    { label: 'Сценарій 2', value: '2' },
  ];

  const [selectedOption, setSelectedOption] = useState<string>(options[0].value);

  const handleNext = () => {
    const currentIndex = options.findIndex((option) => option.value === selectedOption);
    const nextIndex = (currentIndex + 1) % options.length;
    setSelectedOption(options[nextIndex].value);
  };

  const handlePrev = () => {
    const currentIndex = options.findIndex((option) => option.value === selectedOption);
    const prevIndex = (currentIndex - 1 + options.length) % options.length;
    setSelectedOption(options[prevIndex].value);
  };

  const selectedLabel = options.find((option) => option.value === selectedOption)?.label;

  return (
    <div>
      <ButtonGroup>
          <Button icon="pi pi-chevron-left button-arrow" onClick={handlePrev} rounded text className='button-arrow button-group'/>
          <Button label={selectedLabel} className='button-group button-script'/>
          <Button icon="pi pi-chevron-right button-arrow" onClick={handleNext} rounded text className='button-arrow button-group'/>
      </ButtonGroup>
    </div>
  );
};
