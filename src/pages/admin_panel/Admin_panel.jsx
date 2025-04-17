import React, { use, useEffect, useState } from 'react'
import axios from 'axios'
import { baseUrl } from '../../config'
import { useDispatch } from 'react-redux'
import { setLoading } from '../../redux/LoaderReducer'
import { message, Tabs } from 'antd'
import { Navbar, Profile, AdminTaskList } from '../../components'
import { useNavigate } from 'react-router-dom'


const Task = () => {

  const [task, setTask] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `${localStorage.getItem("token")}`,
  }


  const getTasks = async () => {
    dispatch(setLoading(true))
    try {
      const response = await axios.get(`${baseUrl}/api/task`, { headers })
      if (response.data.success) {
        message.success(response.data.message)
        setTask(response.data.tasks)
      }
    } catch (error) {
      message.error(error?.response?.data?.message || 'Some error occured')
      console.log("Error in getTasks", error);
    }
    dispatch(setLoading(false))
  };

  const items = [
    {
      key: '1',
      label: 'View Tasks',
      children: <AdminTaskList />,
    },
    {
      key: '2',
      label: 'Edit Profile',
      children: <Profile />,
    },
  ];

  useEffect(() => {
    getTasks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user?.role === '1') {
      navigate('/')
    }
  }, [user, navigate]);


  return (
    task && (
      <div className='flex flex-col'>
        <Navbar />
        <div className='p-6'>
          <div className='flex flex-row justify-between items-center mb-6'>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>Admin Panel</h1>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <Tabs
              defaultActiveKey="1"
              items={items}
              animated
              size="large"
            />
          </div>
        </div>
      </div>
    )
  )
}

export default Task
