import React, { useState, useMemo, useEffect } from 'react';
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

  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  const homeIcon = useMemo(
    () =>
      HomeIcon({
        width: 22,
        height: 23,
        viewBox: '0 0 22 23',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        color: 'white',
      }),
    [],
  );
  const exitIcon = useMemo(
    () => ExitIcon({ width: 16, height: 16, viewBox: '0 0 16 16', xmlns: 'http://www.w3.org/2000/svg' }),
    [],
  );
  const processIcon = useMemo(
    () =>
      ProcessIcon({
        width: 20,
        height: 20,
        viewBox: '0 0 20 20',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        color: 'white',
      }),
    [],
  );
  const dataIcon = useMemo(
    () => DataIcon({ width: 18, height: 22, viewBox: '0 0 18 22', xmlns: 'http://www.w3.org/2000/svg' }),
    [],
  );
  const settingsIcon = useMemo(
    () =>
      SettingsIcon({
        width: 22,
        height: 22,
        viewBox: '0 0 22 22',
        xmlns: 'http://www.w3.org/2000/svg',
        color: 'white',
      }),
    [],
  );

  const mainPageMenuItems: MenuItem[] = useMemo(
    () => [
      {
        label: 'Головна',
        icon: homeIcon,
        command: () => navigate('/main'),
        className: location.pathname === '/main' ? 'active' : '',
      },
      {
        label: 'Вийти',
        icon: exitIcon,
        command: () => navigate('/login'),
        className: location.pathname === '/login' ? 'active' : '',
      },
    ],
    [navigate, location.pathname, homeIcon, exitIcon],
  );

  const defaultMenuItems: MenuItem[] = useMemo(
    () => [
      {
        label: 'Головна',
        icon: homeIcon,
        command: () => navigate('/main'),
        className: location.pathname === '/main' ? 'active' : '',
      },
      {
        key: 'process',
        label: 'Процеси',
        icon: processIcon,
        className: location.pathname.endsWith('process') ? 'active' : '',
        items: [
          {
            label: 'Ручний',
            command: () => navigate('/manualprocess'),
            className: location.pathname === '/manualprocess' ? 'active' : '',
          },
          {
            label: 'Дистиляція',
            command: () => navigate('/distillationprocess'),
            className: location.pathname === '/distillationprocess' ? 'active' : '',
          },
          {
            label: 'Ректифікація',
            command: () => navigate('/rectificationprocess'),
            className: location.pathname === '/rectificationprocess' ? 'active' : '',
          },
        ],
      },
      {
        key: 'data',
        label: 'Дані',
        icon: dataIcon,
        className: location.pathname.startsWith('/data') ? 'active' : '',
        items: [
          {
            label: 'Температури',
            command: () => navigate('/datatemperatures'),
            className: location.pathname === '/datatemperatures' ? 'active' : '',
          },
          {
            label: 'Статистика',
            command: () => navigate('/datastatistics'),
            className: location.pathname === '/datastatistics' ? 'active' : '',
          },
        ],
      },
      {
        label: 'Налаштування',
        icon: settingsIcon,
        command: () => navigate('/setting'),
        className: location.pathname === '/setting' ? 'active' : '',
      },
      {
        label: 'Вийти',
        icon: exitIcon,
        command: () => navigate('/login'),
        className: location.pathname === '/login' ? 'active' : '',
      },
    ],
    [navigate, location.pathname, homeIcon, processIcon, dataIcon, settingsIcon, exitIcon],
  );

  const menuItems = location.pathname === '/main' ? mainPageMenuItems : defaultMenuItems;

  useEffect(() => {
    const newExpandedKeys: Record<string, boolean> = { ...expandedKeys };

    // Розгортання для меню "Процеси"
    if (
      location.pathname.startsWith('/manualprocess') ||
      location.pathname.startsWith('/distillationprocess') ||
      location.pathname.startsWith('/rectificationprocess')
    ) {
      newExpandedKeys['process'] = true;
    }

    // Розгортання для меню "Дані"
    if (location.pathname.startsWith('/datatemperatures') || location.pathname.startsWith('/datastatistics')) {
      newExpandedKeys['data'] = true;
    }

    setExpandedKeys(newExpandedKeys);
  }, [location.pathname]);

  return (
    <PanelMenu
      model={menuItems}
      className="custom-panelmenu"
      expandedKeys={expandedKeys}
      onExpandedKeysChange={setExpandedKeys}
      multiple
    />
  );
};
