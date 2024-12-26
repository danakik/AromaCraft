import React from 'react';
import { Outlet } from 'react-router-dom';
import { SideBar } from '../SideBar/SideBar';
import GlobeIcon from '../../assets/icons/globe_icon'
import { Button } from 'primereact/button';
import { ButtonGroup } from 'primereact/buttongroup';
import './Layout.css';

export const Layout = () => {
  return (
    <div className="layout">
      <div className="sidebar-container">
        <SideBar />
{/*         <div className='flex flex-row gap-2 w-full align-items-start justify-content-start'>
          <ButtonGroup>
            <GlobeIcon />
            <Button className='button-lang active' label='UKR' />
            <Button className='button-lang' label='ENG' />
          </ButtonGroup>
        </div> */}
      </div>
      <div className="content-container">
        <Outlet />
      </div>
    </div>
  );
};
