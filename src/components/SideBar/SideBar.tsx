import { MenuItem } from 'primereact/menuitem'
import { PanelMenu, PanelMenuProps } from 'primereact/panelmenu'
import React, { useMemo } from 'react'
import HomeIcon from '../../assets/icons/home_icon'
import ProcessIcon from '../../assets/icons/process_icon'
import './SideBar.css'
import { useNavigate } from 'react-router-dom'
import DataIcon from '../../assets/icons/data_icon'
import SettingsIcon from '../../assets/icons/settings_cion'
import ExitIcon from '../../assets/icons/exit_icon'

export const SideBar = (props: PanelMenuProps) => {
    const navigate = useNavigate()
    const MENU_ITEMS: MenuItem[] = useMemo(
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
                    navigate('/main')
                },
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
                            // navigate('/')
                        },
                    },
                    {
                        label: 'Дистиляція',
                    },
                    {
                        label: 'Ректифікація',
                    },
                    {
                        label: 'Затирання',
                    },
                ],
            },
            {
                label: 'Дані',
                icon: DataIcon({
                    width: 18,
                    height: 22,
                    viewBox: '0 0 18 22',
                    xmlns: 'http://www.w3.org/2000/svg',
                }),
            },
            {
                label: 'Налаштування',
                icon: SettingsIcon({
                    width: 22,
                    height: 22,
                    viewBox: '0 0 22 22',
                    xmlns: 'http://www.w3.org/2000/svg',
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
            },
        ],
        []
    )
    return <PanelMenu model={MENU_ITEMS} />
}
