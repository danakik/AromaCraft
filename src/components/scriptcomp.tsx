import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { ButtonGroup } from 'primereact/buttongroup';
import '../styles/scriptcomp.css';

type ACScriptCompProps = {
  options: string[];
  onChange?: (label: string, value: string) => void;
};

export const ACScriptComp: React.FC<ACScriptCompProps> = ({ options, onChange }) => {
  const formattedOptions = options.map((label, index) => ({
    label,
    value: index.toString(),
  }));

  const [selectedOption, setSelectedOption] = useState<string>('');

  useEffect(() => {
    if (formattedOptions.length > 0) {
      const initialOption = formattedOptions[0];
      setSelectedOption(initialOption.value);
      onChange?.(initialOption.label, initialOption.value);
    }
  }, [options]);

  const handleChange = (newValue: string) => {
    setSelectedOption(newValue);
    const selectedLabel = formattedOptions.find((option) => option.value === newValue)?.label || '';
    onChange?.(selectedLabel, newValue);
  };

  const findNextValidIndex = (currentIndex: number, direction: 1 | -1) => {
    let nextIndex = currentIndex;

    do {
      nextIndex = (nextIndex + direction + formattedOptions.length) % formattedOptions.length;
    } while (formattedOptions[nextIndex].label === '---' && nextIndex !== currentIndex);

    return nextIndex;
  };

  const handleNext = () => {
    const currentIndex = formattedOptions.findIndex((option) => option.value === selectedOption);
    const nextIndex = findNextValidIndex(currentIndex, 1);
    handleChange(formattedOptions[nextIndex].value);
  };

  const handlePrev = () => {
    const currentIndex = formattedOptions.findIndex((option) => option.value === selectedOption);
    const prevIndex = findNextValidIndex(currentIndex, -1);
    handleChange(formattedOptions[prevIndex].value);
  };

  const selectedLabel = formattedOptions.find((option) => option.value === selectedOption)?.label;

  return (
    <div>
      <ButtonGroup>
        <Button
          icon="pi pi-chevron-left button-arrow"
          onClick={handlePrev}
          rounded
          text
          aria-label="Previous scenario"
          className="button-arrow button-group"
        />
        <Button label={selectedLabel || 'Немає даних'} className="button-group button-script" />
        <Button
          icon="pi pi-chevron-right button-arrow"
          onClick={handleNext}
          rounded
          text
          aria-label="Next scenario"
          className="button-arrow button-group"
        />
      </ButtonGroup>
    </div>
  );
};
