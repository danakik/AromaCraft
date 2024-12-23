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
    <div /* className="flex align-items-center" */>
      {/* <div className="flex align-items-center">
        <Button
          icon="pi pi-chevron-left button-arrow"
          onClick={handlePrev}
          style={{ width: '25px', height: '25px', marginRight: '-15px' }}
        />
        <p className="mx-2 span-script">{selectedLabel}</p>
        <Button
          icon="pi pi-chevron-right button-arrow"
          onClick={handleNext}
          style={{ width: '25px', height: '25px', marginLeft: '-15px' }}
        />
      </div> */}
      {/* <Toolbar 
        start={<Button
          icon="pi pi-chevron-left button-arrow"
          onClick={handlePrev}
          style={{ width: '25px', height: '25px' }}
          rounded
        />} 

        center={<p className="mx-2 span-script">{selectedLabel}</p>}

        end={<Button
          icon="pi pi-chevron-right button-arrow"
          onClick={handleNext}
          style={{ width: '25px', height: '25px'}}
          rounded
        />} /> */}

      <ButtonGroup>
          <Button icon="pi pi-chevron-left button-arrow" onClick={handlePrev} rounded text className='button-arrow button-group'/>
          <Button label={selectedLabel} className='button-group'/>
          <Button icon="pi pi-chevron-right button-arrow" onClick={handleNext} rounded text className='button-arrow button-group'/>
      </ButtonGroup>
    </div>
  );
};
