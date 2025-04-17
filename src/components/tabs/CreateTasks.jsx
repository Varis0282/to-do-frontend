import React from 'react'
import { Button, Input, Select, DatePicker } from 'antd';
import { Field } from '..'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../config';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../redux/LoaderReducer';
import { message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
const { TextArea } = Input;


const CreateTasks = () => {
  const [disableSave, setDisableSave] = useState(true);
  const [task, setTask] = useState({});

  const dispatch = useDispatch();

  const handlePriorityChange = (value) => {
    setTask({ ...task, priority: value });
  };

  const inputChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `${localStorage.getItem("token")}`,
  }

  const saveTask = async () => {
    console.log("task", task);
    if (!task.title || !task.description || !task.priority) {
      message.error("Please fill all the fields")
      return;
    }
    dispatch(setLoading(true))
    try {
      const response = await axios.post(`${baseUrl}/api/task`, task, { headers })
      if (response.data.success) {
        message.success(response.data.message);
        setTask({});
      }
    } catch (error) {
      message.error(error?.response?.data?.message || 'Some error occured')
      console.log("Error in saveTask in add task", error);
    }
    dispatch(setLoading(false))
  }

  useEffect(() => {
    if (task.title && task.description && task.priority) {
      setDisableSave(false)
    } else {
      setDisableSave(true)
    }
  }, [task])


  return (
    <div className="flex flex-col gap-4">
      <Field label="Title" name="title" type="text" placeholder="Enter title" onChange={(e) => inputChange(e)} value={task.title} />
      <div className="flex flex-col">
        <label className={"mb-2 flex items-center gap-2 text-sm font-medium text-gray-600"}>
          Description
        </label>
        <TextArea rows={4} placeholder='Enter Description' name='description' value={task.description} onChange={(e) => inputChange(e)} />
      </div>
      <div className="flex flex-col w-full">
        <label className={"mb-2 flex items-center gap-2 text-sm font-medium text-gray-600"}>
          Priority
        </label>
        <Select
          defaultValue={task?.priority}
          value={task?.priority}
          onChange={handlePriorityChange}
          options={[
            {
              value: 'Low',
              label: 'Low',
            },
            {
              value: 'Medium',
              label: 'Medium',
            },
            {
              value: 'High',
              label: 'High',
            },
          ]}
        />
      </div>
      <div className="flex justify-end">
        <Button key="submit" onClick={() => saveTask()} type='primary' disabled={disableSave}>
          Submit
        </Button>
      </div>
    </div>
  )
}

export default CreateTasks
