import React, { useState, useMemo } from 'react';
import { MenuItem } from 'primereact/menuitem';
import { PanelMenu, PanelMenuProps } from 'primereact/panelmenu';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '../../assets/icons/home_icon';
import ProcessIcon from '../../assets/icons/process_icon';
import DataIcon from '../../assets/icons/data_icon';
import SettingsIcon from '../../assets/icons/settings_icon';
import ExitIcon from '../../assets/icons/exit_icon';
import './SideBar.css';

export const SideBar = (props: PanelMenuProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Стани для фокусу та виділення
    const [focusedItem, setFocusedItem] = useState<string | null>(null);
    const [highlightedItem, setHighlightedItem] = useState<string | null>(null);

    const mainPageMenuItems: MenuItem[] = useMemo(
        () => [
            {
                label: 'Головна',
                icon: HomeIcon({
                    width: 22,
                    height: 23,
                    viewBox: '0 0 22 23',
                    fill: 'none',
                    xmlns: 'http://www.w3.org/2000/svg',
                    color: 'white',
                }),
                command: () => {
                    navigate('/main');
                },
                onFocus: () => setFocusedItem('main'), // Фокус на цей елемент
                onMouseEnter: () => setHighlightedItem('main'), // Виділення на цей елемент
            },
            {
                label: 'Вийти',
                icon: ExitIcon({
                    width: 16,
                    height: 16,
                    viewBox: '0 0 16 16',
                    xmlns: 'http://www.w3.org/2000/svg',
                }),
                command: () => {
                    navigate('/login');
                },
                onFocus: () => setFocusedItem('exit'), // Фокус на цей елемент
                onMouseEnter: () => setHighlightedItem('exit'), // Виділення на цей елемент
            },
        ],
        [navigate]
    );

    const defaultMenuItems: MenuItem[] = useMemo(
        () => [
            {
                label: 'Головна',
                icon: HomeIcon({
                    width: 22,
                    height: 23,
                    viewBox: '0 0 22 23',
                    fill: 'none',
                    xmlns: 'http://www.w3.org/2000/svg',
                    color: 'white',
                }),
                command: () => {
                    navigate('/main');
                },
                onFocus: () => setFocusedItem('main'),
                onMouseEnter: () => setHighlightedItem('main'),
            },
            {
                label: 'Процеси',
                icon: ProcessIcon({
                    width: 20,
                    height: 20,
                    viewBox: '0 0 20 20',
                    fill: 'none',
                    xmlns: 'http://www.w3.org/2000/svg',
                    color: 'white',
                }),
                items: [
                    {
                        label: 'Ручний',
                        command: () => {
                            navigate('/manualprocess');
                        },
                    },
                    {
                        label: 'Дистиляція',
                        command: () => {
                            navigate('/distillationprocess');
                        },
                    },
                    {
                        label: 'Ректифікація',
                        command: () => {
                            navigate('/rectificationprocess');
                        },
                    },
                ],
                onFocus: () => setFocusedItem('processes'),
                onMouseEnter: () => setHighlightedItem('processes'),
            },
            {
                label: 'Дані',
                icon: DataIcon({
                    width: 18,
                    height: 22,
                    viewBox: '0 0 18 22',
                    xmlns: 'http://www.w3.org/2000/svg',
                }),
                items: [
                    {
                        label: 'Температури',
                    },
                    {
                        label: 'Статистика',
                    },
                ],
            },
            {
                label: 'Налаштування',
                icon: SettingsIcon({
                    width: 22,
                    height: 22,
                    viewBox: '0 0 22 22',
                    xmlns: 'http://www.w3.org/2000/svg',
                    color: 'white',
                }),
            },
            {
                label: 'Вийти',
                icon: ExitIcon({
                    width: 16,
                    height: 16,
                    viewBox: '0 0 16 16',
                    xmlns: 'http://www.w3.org/2000/svg',
                }),
                command: () => {
                    navigate('/login');
                },
            },
        ],
        [navigate]
    );

    const menuItems = location.pathname === '/main' ? mainPageMenuItems : defaultMenuItems;
    const enhancedItems = menuItems.map((item) => ({
        ...item,
        className: `${item.className || ''} ${focusedItem === item.label ? 'focus' : ''} ${highlightedItem === item.label ? 'highlight' : ''}`,
    }));

    return <PanelMenu model={enhancedItems} className="custom-panelmenu" />;
};
