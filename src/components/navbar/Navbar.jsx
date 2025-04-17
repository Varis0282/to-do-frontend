import '@ant-design/v5-patch-for-react-19';
import React from 'react';
import { LogoutOutlined, HomeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { Tooltip, Avatar, Dropdown, message } from 'antd';

const Navbar = () => {
    const logOut = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const userName = user.name || 'User';

    const menuItems = [
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: <HomeOutlined />,
            onClick: () => {
                message.info('Feature coming soon! Stay tuned!');
            },
        },
        {
            key: 'calendar',
            label: 'Calendar',
            icon: <CalendarOutlined />,
            onClick: () => {
                message.info('Feature coming soon! Stay tuned!');
            },
        },
        {
            key: 'profile',
            label: 'My Profile',
            icon: <UserOutlined />,
            onClick: () => {
                message.info('Tap on Profile section in Tabs below to edit your profile!');
            },
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: logOut,
            danger: true,
        },
    ];

    return (
        <div className='sticky top-0 z-10 bg-white shadow-md'>
            <div className='flex flex-row justify-between items-center h-16 px-4 md:px-8'>
                {/* Logo and Brand */}
                <div className='flex items-center'>
                    <div className='bg-blue-500 text-white p-2 rounded-md mr-3'>
                        <CalendarOutlined style={{ fontSize: '18px' }} />
                    </div>
                    <span className='text-xl font-bold text-gray-800'>TaskMaster</span>
                </div>

                {/* Center Title - Only visible on larger screens */}
                <div className='hidden md:block'>
                    <h1 className='text-xl font-semibold text-gray-700'>To Do List</h1>
                </div>

                {/* User Profile and Actions */}
                <div className='flex items-center gap-4'>
                    <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
                        <div className='flex items-center cursor-pointer'>
                            <Avatar className='bg-blue-500'>
                                <UserOutlined />
                            </Avatar>
                            <span className='hidden md:inline ml-2 font-medium'>{userName}</span>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </div>
    );
};

export default Navbar;