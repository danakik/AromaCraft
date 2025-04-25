import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import BlockTempIcon from '../assets/icons/blocktemp_icon';
import '../styles/styles.css';
import '../styles/blocktemp.css';

type BlockTempProps = {
  color: 'orange' | 'blue' | 'purple' | 'red';
  temp: string;
  name: string;
  help?: string; // hint text in the dialog
};

const getColor = (color: string) => {
  switch (color) {
    case 'purple':
      return '#9e4ae7';
    case 'orange':
      return '#e7764a';
    case 'red':
      return '#e74a4a';
    case 'blue':
      return '#2942e1';
    default:
      return '#9e4ae7';
  }
};

export const ACBlockTemp: React.FC<BlockTempProps> = ({ color, temp, name, help = '' }) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const handleClick = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  let color_choosed = getColor(color);

  const tempTemp = `${temp.toString().replace('.', ',')}°C`;

  return (
    <div className="blockTemp">
      <div style={{ backgroundColor: color_choosed }} className="imgBlockTemp">
        <BlockTempIcon color="white" />
      </div>
      <p className="tempBlockTemp">{tempTemp}</p>
      <p className="textBlockTemp" onClick={handleClick} style={{ cursor: 'pointer' }}>
        {name}
      </p>
      <Dialog header={name} visible={dialogVisible} onHide={hideDialog} className="dialog">
        <p>{help}</p>
      </Dialog>
    </div>
  );
};

export const ACBlockTempSmall: React.FC<BlockTempProps> = ({ color, temp, name, help = '' }) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const handleClick = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  let color_choosed = getColor(color);
  const tempTemp = `${temp.toString().replace('.', ',')}°C`;

  return (
    <div className="blockTemp-s flex align-items-start justify-content-start p-3">
      <div style={{ backgroundColor: color_choosed }} className="imgBlockTemp-s mt-3">
        <BlockTempIcon color="white" />
      </div>
      <div className="flex flex-column align-items-start justify-content-start">
        <p className="tempBlockTemp">{tempTemp}</p>
        <p className="textBlockTemp" onClick={handleClick} style={{ cursor: 'pointer' }}>
          {name}
        </p>
      </div>
      <Dialog header={name} visible={dialogVisible} onHide={hideDialog} className="dialog">
        <p>{help}</p>
      </Dialog>
    </div>
  );
};
