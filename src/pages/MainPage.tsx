import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useGetDataQuery } from '../api/mainApi';
import { toast } from 'react-toastify';
import { useSaveRoomMutation } from '../api/saveRoomApi';
import { useCreateRoomMutation } from '../api/createRoomApi';
import { useDeleteRoomMutation } from '../api/deleteRoomApi';
import '../styles/main_page.css';
import 'primeflex/primeflex.css';
import { useChangeNameMutation } from '../api/changeNameApi';
import { useTranslation } from 'react-i18next';

const MainPage = () => {
  const key = useSelector((state: RootState) => state.key.key) as string;
  const { data, error, isLoading, refetch } = useGetDataQuery(key);
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [visible_delete, setvisible_delete] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editingItemKey, setEditingItemKey] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [machineNumber, setMachineNumber] = useState('');
  const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
  const [saveRoom, { isLoading: isSaving }] = useSaveRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();
  const [selectItemKey, setSelectItemKey] = useState('');
  const [changeName, { isLoading: isChanging }] = useChangeNameMutation();

  const { t } = useTranslation();

  if (isLoading) return <p>{t('loading')}</p>;

  if (error) {
    toast.error(t('loading_error'));
    return <p>{t('loading_error_t')}</p>;
  }

  if (!data || data.length === 0) {
    return <p>{t('no_data')}</p>;
  }

  const handleButtonClick = (itemKey: string) => {
    localStorage.setItem('samogonKey', itemKey);
    navigate('/device');
  };

  const handleEditClick = (itemKey: string, currentName: string) => {
    setEditingItemKey(itemKey);
    setNewName(currentName);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handleSaveName = async (itemKey: string) => {
    toast.success(`${t('main_rename_toast_success')} ${itemKey}: ${newName}`);
    const response = await changeName({ key, c: itemKey, n: newName });
    setEditingItemKey(null);
    setNewName('');
    refetch();
  };

  const handleCreateMachine = async () => {
    const createResponse = await createRoom({ machineNumber, key }).unwrap();
    console.log(machineNumber, key);
    console.log(createResponse);
    if (createResponse.trim() === '3') {
      toast.error(t('main_rename_toast_error'));
    } else {
      const saveResponse = await saveRoom({ machineNumber, key }).unwrap();
      toast.success(t('main_save_device'));
      refetch();
    }
  };

  const DialogCreateRoom = () => {
    handleCreateMachine();
    setVisible(false);
  };

  const handleDeleteClick = async () => {
    const response = await deleteRoom({ machineNumber: selectItemKey, key }).unwrap();
    setvisible_delete(false);
    refetch();
  };

  const OpenDialogKey = async (key: string) => {
    setSelectItemKey(key);
    setvisible_delete(true);
  };

  return (
    <div className="flex justify-content-center align-items-center h-screen w-full">
      <div className="flex flex-column align-items-center p-4 w-800px min-h-10rem main-container">
        <h2 className="text-center main-header">{t('main_managment')}</h2>
        {data.map((item) => (
          <div key={item.key} className="data-container w-full">
            <div className="flex align-items-center justify-content-between w-full data-row gap-0">
              <div className="flex flex-column item-name">
                {editingItemKey === item.key ? (
                  <h3>{item.name}</h3>
                ) : (
                  <h3 onClick={() => handleEditClick(item.key, item.name)} style={{ cursor: 'pointer' }}>
                    {item.name}
                  </h3>
                )}
              </div>
              <div className="flex flex-column item-rename">
                {editingItemKey === item.key ? (
                  <div className="flex align-items-center">
                    <InputText
                      value={newName}
                      onChange={handleNameChange}
                      placeholder={t('main_rename_device')}
                      className="input-rename"
                    />
                    <Button label="OK" onClick={() => handleSaveName(item.key)} className="button button-rename" />
                  </div>
                ) : null}
              </div>
              <div className="flex flex-column align-items-start item-id">
                <p className="item-key">{item.key}</p>
              </div>
              <div className="flex item-action">
                <Button className="button button-delete" label={t('main_delete')} onClick={() => OpenDialogKey(item.key)} />
                <Button className="button button-enter" label={t('main_enter')} onClick={() => handleButtonClick(item.key)} />
              </div>
            </div>
          </div>
        ))}
        <Button className="button button-add mt-3" label={t('main_add_device')} onClick={() => setVisible(true)} />
      </div>
      <Dialog
        header={t('main_dialog_add_device')}
        visible={visible}
        style={{ width: '350px' }}
        className="custom-dialog"
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              label={t('button_cancel')}
              icon="pi pi-times"
              onClick={() => setVisible(false)}
              className="p-button-text button button-cancel"
              style={{ width: '150px' }}
            />
            <Button
              label={t('button_confirm')}
              icon="pi pi-check"
              onClick={DialogCreateRoom}
              className="p-button-text button button-confirm"
              style={{ width: '150px' }}
              autoFocus
            />
          </div>
        }
      >
        <div className="field" style={{ display: 'flex', justifyContent: 'center' }}>
          <InputText
            id="inputField"
            value={machineNumber}
            onChange={(e) => setMachineNumber(e.target.value ? e.target.value.toString() : '')}
            style={{ width: '80%' }}
          />
        </div>
      </Dialog>
      <Dialog
        header={t('main_dialog_delete_device')}
        visible={visible_delete}
        style={{ width: '350px' }}
        onHide={() => {
          if (!visible_delete) return;
          setvisible_delete(false);
        }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              label={t('button_cancel')}
              icon="pi pi-times"
              onClick={() => setvisible_delete(false)}
              className="p-button-text button button-cancel"
              style={{ width: '150px' }}
            />
            <Button
              label={t('button_confirm')}
              icon="pi pi-check"
              onClick={() => handleDeleteClick()}
              className="p-button-text button button-confirm"
              style={{ width: '150px' }}
              autoFocus
            />
          </div>
        }
      >
        <p>{t('main_dialog_delete_text')}</p>
      </Dialog>
    </div>
  );
};

export default MainPage;
