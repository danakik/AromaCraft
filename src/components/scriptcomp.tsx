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

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    if (formattedOptions.length > 0) {
      let newIndex = selectedIndex < formattedOptions.length ? selectedIndex : 0;
      if (formattedOptions[newIndex].label === '---') {
        newIndex = formattedOptions.findIndex((option) => option.label !== '---');
        if (newIndex === -1) newIndex = 0;
      }

      setSelectedIndex(newIndex);
      onChange?.(formattedOptions[newIndex].label, formattedOptions[newIndex].value);
    }
  }, [options]);

  const handleChange = (newIndex: number) => {
    setSelectedIndex(newIndex);
    onChange?.(formattedOptions[newIndex].label, formattedOptions[newIndex].value);
  };

  const findNextValidIndex = (currentIndex: number, direction: 1 | -1) => {
    let nextIndex = currentIndex;
    do {
      nextIndex = (nextIndex + direction + formattedOptions.length) % formattedOptions.length;
    } while (formattedOptions[nextIndex].label === '---' && nextIndex !== currentIndex);
    return nextIndex;
  };

  const handleNext = () => handleChange(findNextValidIndex(selectedIndex, 1));
  const handlePrev = () => handleChange(findNextValidIndex(selectedIndex, -1));

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
        <Button
          label={formattedOptions[selectedIndex]?.label || 'Немає даних'}
          className="button-group button-script"
        />
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
