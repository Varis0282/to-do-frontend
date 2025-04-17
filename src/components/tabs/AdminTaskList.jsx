import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { baseUrl } from '../../config'
import { useDispatch } from 'react-redux'
import { setLoading } from '../../redux/LoaderReducer'
import { message, Tooltip, Table, Button, Dropdown, Space, Tag } from 'antd'
import { DeleteOutlined, DownOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const TaskList = () => {
    const [task, setTask] = useState([]);
    const dispatch = useDispatch();

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
            message.error(error?.response?.data?.message || 'Some error occurred')
            console.log("Error in getTasks", error);
        }
        dispatch(setLoading(false))
    };

    const deleteTask = async (id) => {
        dispatch(setLoading(true))
        try {
            const response = await axios.delete(`${baseUrl}/api/task/${id}`, { headers })
            if (response.data.success) {
                message.success(response.data.message)
                getTasks();
            }
        } catch (error) {
            message.error(error?.response?.data?.message || 'Some error occurred')
            console.log("Error in deleteTask", error);
        }
        dispatch(setLoading(false))
    }


    const updateTaskStatus = async (taskId, status) => {
        dispatch(setLoading(true))
        try {
            // Find the task with the given ID
            const taskToUpdate = task.find(t => t._id === taskId);

            if (taskToUpdate.status === 'Completed') {
                message.error("Can't change status of completed task")
                dispatch(setLoading(false))
                return;
            }

            // Only update if the status is different
            if (taskToUpdate && taskToUpdate.status !== status) {
                const updatedTask = {
                    ...taskToUpdate,
                    status,
                    // If status is 'Completed', set completedAt to current date
                    ...(status === 'Completed' ? { completedAt: new Date().toISOString() } : {})
                };

                const response = await axios.put(
                    `${baseUrl}/api/task/${taskId}`,
                    updatedTask,
                    { headers }
                );

                if (response.data.success) {
                    message.success(`Task status updated to ${status}`);
                    getTasks();
                }
            }
        } catch (error) {
            message.error(error?.response?.data?.message || 'Failed to update task status');
            console.log("Error in updateTaskStatus", error);
        }
        dispatch(setLoading(false));
    };

    const convertDate = (date) => {
        if (!date) return 'N/A';
        let d = new Date(date);
        return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}, ${d.getFullYear()}`
    }

    // Function to render status tags with different colors
    const renderStatusTag = (status) => {
        let color;
        let icon;

        switch (status) {
            case 'Completed':
                color = 'success';
                icon = <CheckCircleOutlined />;
                break;
            case 'In Progress':
                color = 'processing';
                icon = <ClockCircleOutlined />;
                break;
            case 'Pending':
                color = 'warning';
                icon = <ExclamationCircleOutlined />;
                break;
            default:
                color = 'default';
                icon = null;
        }

        return (
            <Tag color={color} icon={icon}>
                {status}
            </Tag>
        );
    };

    // Function to render priority with color coding
    const renderPriority = (priority) => {
        let color;

        switch (priority) {
            case 'High':
                color = '#ff4d4f';
                break;
            case 'Medium':
                color = '#faad14';
                break;
            case 'Low':
                color = '#52c41a';
                break;
            default:
                color = '#000000';
        }

        return <span style={{ color }}>{priority}</span>;
    };

    const columns = [
        {
            title: 'User',
            dataIndex: ['user', 'name'],
            key: 'user',
            render: (_, record) => (
                <Tooltip title={record.user?.email}>
                    <span className='font-medium'>
                        {record.user.name}
                    </span>
                </Tooltip>
            )
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <Tooltip title={text}><span className='font-medium'>{text.length > 30 ? text.slice(0, 30) + "..." : text}</span></Tooltip>,

        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (text) => <Tooltip title={text}><span>{text.length > 20 ? text.slice(0, 20) + "..." : text}</span></Tooltip>,
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            render: renderPriority,
            filters: [
                { text: 'High', value: 'High' },
                { text: 'Medium', value: 'Medium' },
                { text: 'Low', value: 'Low' },
            ],
            onFilter: (value, record) => record.priority === value,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: renderStatusTag,
            filters: [
                { text: 'Pending', value: 'Pending' },
                { text: 'In Progress', value: 'In Progress' },
                { text: 'Completed', value: 'Completed' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => convertDate(text),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Completed At',
            dataIndex: 'completedAt',
            key: 'completedAt',
            render: (text) => text ? convertDate(text) : 'Not completed yet',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        }
    ];

    useEffect(() => {
        getTasks();
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Task List ({task.length})</h1>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <Table
                    columns={columns}
                    dataSource={task}
                    rowKey="_id"
                    bordered={true}
                    pagination={{
                        pageSize: 10,
                    }}
                    scroll={{ x: 'max-content' }}
                />
            </div>
        </div>
    )
}

export default TaskList