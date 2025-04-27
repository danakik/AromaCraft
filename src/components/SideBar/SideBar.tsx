import React, { useState, useMemo, useEffect } from 'react';
import { MenuItem } from 'primereact/menuitem';
import { PanelMenu, PanelMenuProps } from 'primereact/panelmenu';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '../../assets/icons/home_icon';
import ProcessIcon from '../../assets/icons/process_icon';
import DataIcon from '../../assets/icons/data_icon';
import SettingsIcon from '../../assets/icons/settings_icon';
import ExitIcon from '../../assets/icons/exit_icon';
import { SelectButton } from 'primereact/selectbutton';
import i18n from '../../i18n/config';
import { useTranslation } from 'react-i18next';
import './SideBar.css';

export const SideBar = (props: PanelMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  const defaultLanguage = localStorage.getItem('language') || 'uk';
  const [selectedOption, setSelectedOption] = useState(defaultLanguage);

  useEffect(() => {
    i18n.changeLanguage(defaultLanguage);
    setSelectedOption(defaultLanguage);
  }, []);

  const handleLanguageChange = (value: string) => {
    if (value === null) {
      return;
    }
    setSelectedOption(value);
    i18n.changeLanguage(value);
    localStorage.setItem('language', value);
  };

  const selectButtonOptions = [
    { label: 'ENG', value: 'en' },
    { label: 'UKR', value: 'uk' },
  ];

  const homeIcon = useMemo(
    () =>
      HomeIcon({
        width: 20,
        height: 21,
        viewBox: '0 0 23 24',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        color: 'white',
      }),
    [],
  );
  const exitIcon = useMemo(
    () =>
      ExitIcon({
        width: 20,
        height: 20,
        viewBox: '0 0 20 20',
        xmlns: 'http://www.w3.org/2000/svg',
      }),
    [],
  );
  const processIcon = useMemo(
    () =>
      ProcessIcon({
        width: 23,
        height: 23,
        viewBox: '0 0 23 23',
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
        width: 20,
        height: 20,
        viewBox: '0 0 20 20',
        xmlns: 'http://www.w3.org/2000/svg',
        color: 'white',
      }),
    [],
  );

  const mainPageMenuItems: MenuItem[] = useMemo(
    () => [
      {
        label: t('menu_main'),
        icon: homeIcon,
        command: () => navigate('/main'),
        className: location.pathname === '/main' ? 'active' : '',
      },
      {
        label: t('menu_exit'),
        icon: exitIcon,
        command: () => navigate('/login'),
        className: location.pathname === '/login' ? 'active' : '',
      },
    ],
    [navigate, location.pathname, homeIcon, exitIcon, t],
  );

  const defaultMenuItems: MenuItem[] = useMemo(
    () => [
      {
        label: t('menu_main'),
        icon: homeIcon,
        command: () => navigate('/device'),
        className: location.pathname === '/device' ? 'active' : '',
      },
      {
        key: 'process',
        label: t('menu_process'),
        icon: processIcon,
        items: [
          {
            label: t('menu_process_manual'),
            command: () => navigate('/manualprocess'),
            className: location.pathname === '/manualprocess' ? 'active' : '',
            key: 'manual',
          },
          {
            label: t('menu_process_distillation'),
            command: () => navigate('/distillationprocess'),
            className: location.pathname === '/distillationprocess' ? 'active' : '',
            key: 'distillation',
          },
          {
            label: t('menu_process_rectification'),
            command: () => navigate('/rectificationprocess'),
            className: location.pathname === '/rectificationprocess' ? 'active' : '',
            key: 'rectification',
          },
          {
            label: t('menu_process_mashing'),
            command: () => navigate('/mashingprocess'),
            className: location.pathname === '/mashingprocess' ? 'active' : '',
            key: 'mashing',
          },
        ],
      },
      {
        key: 'data',
        label: t('menu_data'),
        icon: dataIcon,
        items: [
          /* {
            label: t('menu_data_column_param'),
            command: () => navigate('/calculation'),
            className: location.pathname === '/calculation' ? 'active' : '',
          }, */
          {
            label: t('menu_data_temperatures'),
            command: () => navigate('/datatemperatures'),
            className: location.pathname === '/datatemperatures' ? 'active' : '',
          },
          /* {
            label: 'Розрахунки для процесу затирання',
            command: () => navigate('/calcmashing'),
            className: location.pathname === '/calcmashing' ? 'active' : '',
          }, */
        ],
      },
      {
        label: t('menu_settings'),
        icon: settingsIcon,
        command: () => navigate('/setting'),
        className: location.pathname === '/setting' ? 'active' : '',
      },
      {
        label: t('menu_exit'),
        icon: exitIcon,
        command: () => navigate('/main'),
        className: location.pathname === '/main' ? 'active' : '',
      },
    ],
    [navigate, location.pathname, homeIcon, processIcon, dataIcon, settingsIcon, exitIcon, t],
  );

  const menuItems = location.pathname === '/main' ? mainPageMenuItems : defaultMenuItems;

  useEffect(() => {
    const newExpandedKeys: Record<string, boolean> = { ...expandedKeys };

    if (
      location.pathname.startsWith('/manualprocess') ||
      location.pathname.startsWith('/distillationprocess') ||
      location.pathname.startsWith('/rectificationprocess') ||
      location.pathname.startsWith('/mashingprocess')
    ) {
      newExpandedKeys['process'] = true;
    }

    if (
      location.pathname.startsWith('/datatemperatures') ||
      location.pathname.startsWith('/calculation') ||
      location.pathname.startsWith('/calcmashing')
    ) {
      newExpandedKeys['data'] = true;
    }

    setExpandedKeys(newExpandedKeys);
  }, [location.pathname]);

  return (
    <>
      <div className="flex flex-column align-items-stretch justify-content-between w-full h-full">
        <div className="flex-1 flex flex-column align-items-start justify-content-start w-full">
          <div className="flex flex-column align-items-center justify-content-center w-full">
            <PanelMenu
              model={menuItems}
              className="custom-panelmenu"
              expandedKeys={expandedKeys}
              onExpandedKeysChange={setExpandedKeys}
              multiple
            />
          </div>
        </div>
        <div
          className="flex flex-row align-items-center justify-content-center w-full select-lang mt-auto"
          style={{ marginBottom: '40px' }}
        >
          <SelectButton
            value={selectedOption}
            options={selectButtonOptions}
            onChange={(e) => handleLanguageChange(e.value)}
            optionLabel="label"
            dataKey="value"
            className="custom-select-button"
          />
        </div>
      </div>
    </>
  );
};
