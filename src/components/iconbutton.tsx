import React from 'react';
import { Button } from 'primereact/button';
import PencilIcon from '../assets/icons/pencil_icon';
import TrashIcon from '../assets/icons/trash_icon';
import DocAddIconIcon from '../assets/icons/document_add_icon';
import DocDownloadIcon from '../assets/icons/document_download_icon';
import '../styles/scriptcomp.css';

type IconButtonProps = {
  iconName: 'edit' | 'doc_download' | 'doc_add' | 'delete';
  onClick: () => void;
};

export const ACIconButton: React.FC<IconButtonProps> = ({ iconName, onClick }) => {
  const renderIcon = () => {
    switch (iconName) {
      case 'edit':
        return <PencilIcon />;
      case 'doc_download':
        return <DocDownloadIcon />;
      case 'doc_add':
        return <DocAddIconIcon />;
      case 'delete':
        return <TrashIcon />;
      default:
        return null;
    }
  };

  return <Button icon={renderIcon()} className="p-button-rounded p-button-outlined icon-button" onClick={onClick} />;
};
