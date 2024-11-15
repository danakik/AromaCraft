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
import 'primereact/resources/primereact.min.css';

const MainPage = () => {
    const key = useSelector((state: RootState) => state.key.key) as string;
    const { data, error, isLoading, refetch } = useGetDataQuery(key);
    const navigate = useNavigate();


    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [editingItemKey, setEditingItemKey] = useState<string | null>(null);
    const [newName, setNewName] = useState<string>('');
    const [machineNumber, setMachineNumber] = useState('');
    const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
    const [saveRoom, { isLoading: isSaving }] = useSaveRoomMutation();
    const [deleteRoom] = useDeleteRoomMutation();
    const [selectItemKey, setSelectItemKey] = useState('');

    if (isLoading) return <p>Завантаження...</p>;

    if (error) {
        toast.error('Помилка при отриманні даних');
        return <p>Помилка при завантаженні даних.</p>;
    }

    if (!data || data.length === 0) {
        return <p>Немає доступних даних.</p>;
    }

    const handleButtonClick = (itemKey: string) => {
        localStorage.setItem('samogonKey', itemKey);
        navigate('/manualprocess');
    };

    const handleEditClick = (itemKey: string, currentName: string) => {
        setEditingItemKey(itemKey); 
        setNewName(currentName);   
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value); 
    };

    const handleSaveName = (itemKey: string) => {
        toast.success(`Збережена нова назва для ${itemKey}: ${newName}`);

        setEditingItemKey(null); 
        setNewName('');          
    };

    const handleCreateMachine = async () => {
 
        const createResponse = await createRoom({ machineNumber, key }).unwrap();
        console.log(machineNumber, key)
        console.log(createResponse); 
        if (createResponse.trim() === '3'){
            toast.error('Кімната уже існує');

        }else{
            const saveResponse = await saveRoom({ machineNumber, key }).unwrap();
            toast.success('Кімната успішно збережена');
            refetch();

        }
    };

    const DialogCreateRoom = () =>{
        handleCreateMachine();
        setVisible(false);
    }

    const handleDeleteClick = async() =>{
        const response = await deleteRoom({ machineNumber: selectItemKey,  key  }).unwrap();
        setVisible2(false);
        refetch();
    }

    const OpenDialogKey = async(key: string) =>{
        setSelectItemKey(key);
        setVisible2(true);
    }

    return (
        <div className="p-d-flex p-jc-center p-ai-center" style={{ height: '100vh', width: '100%' }}>
            <div className="p-card p-p-4 main-container">
                <h2 className="p-text-center main-header">Керування</h2>
                <div className="data-container">
                    {data.map((item) => (
                        <div key={item.key} className="data-block">
                            <table>
                                <tbody>
                                <tr className="data-row">
                                <td className="item-name">
                                        {editingItemKey === item.key ? (
                                            <h3>{item.name}</h3>
                                        ) : (
                                            <h3 onClick={() => handleEditClick(item.key, item.name)} style={{ cursor: 'pointer' }}>
                                                {item.name}
                                            </h3>
                                        )}
                                    </td>
                                    <td className="item-rename">
                                        {editingItemKey === item.key ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <InputText
                                                    value={newName}
                                                    onChange={handleNameChange}
                                                    placeholder="Нова назва пристрою..."
                                                    className="input-rename"
                                                />
                                                <Button
                                                    label="OK"
                                                    onClick={() => handleSaveName(item.key)}
                                                    className="button button-rename"
                                                />
                                            </div>
                                        ) : null}
                                    </td>
                                    <td className="item-id">
                                        <p className="item-key">{item.key}</p>
                                    </td>
                                    <td className="item-action">
                                        <Button className="button button-delete" label="Видалити" onClick={() => OpenDialogKey(item.key)} />
                                    </td>
                                    <td className="item-action">
                                        <Button className="button button-enter" label="Увійти" onClick={() => handleButtonClick(item.key)} />
                                    </td>
                                </tr>
                                </tbody>
                            </table> 
                        </div>
                    ))}
                </div>
                <Button className="button button-add" label="Додати пристрій" onClick={() => setVisible(true)} />

                <Dialog
                    header="Додайте ID пристрою"
                    visible={visible}
                    style={{width: '350px'}}
                    className="custom-dialog" 
                    onHide={() => {if (!visible) return; setVisible(false);}}
                    footer={
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                label="Скасувати"
                                icon="pi pi-times"
                                onClick={() => setVisible(false)}
                                className="p-button-text button button-cancel"
                                style={{ width: '150px' }}
                            />
                            <Button
                                label="Підтвердити"
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
                        <input
                            id="inputField"
                            type="number"
                            value={machineNumber}
                            onChange={(e) => setMachineNumber(e.target.value ? e.target.value.toString() : '')}
                            style={{ width: '80%' }}
                        />
                    </div>
                </Dialog>

                <Dialog
                    header={`Видалити?`}
                    visible={visible2}
                    style={{ width: '350px' }}
                    onHide={() => {if (!visible2) return; setVisible2(false);}}
                    footer={
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                label="Скасувати"
                                icon="pi pi-times"
                                onClick={() => setVisible2(false)}
                                className="p-button-text button button-cancel"
                                style={{ width: '150px' }}
                            />
                            <Button
                                label="Підтвердити"
                                icon="pi pi-check"
                                onClick={() => handleDeleteClick()}
                                className="p-button-text button button-confirm"
                                style={{ width: '150px' }}
                                autoFocus
                            />
                        </div>
                    }
                >
                    <p>Ви впевнені, що хочете видалити цей пристрій?</p>
                </Dialog>
            </div>
        </div>
    );
};

export default MainPage;
