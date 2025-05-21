import React, { useEffect, useState } from 'react';
import api, { updateTaskInBoard, deleteTaskInBoard, updateTasksOrder } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Swal from 'sweetalert2';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { arrayMove } from './arrayMove';

function SortableTaskItem({ task, listeners, attributes, setNodeRef, style, children }) {
  return (
    <li ref={setNodeRef} style={{ ...style, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* Drag handle */}
      <span {...attributes} {...listeners} style={{ cursor: 'grab', marginRight: 12, fontSize: 18, userSelect: 'none' }} title="Arrastrar">☰</span>
      {children}
    </li>
  );
}

const TaskList = ({ boardId, refreshKey }) => {
  const [tasks, setTasks] = useState([]);
  const { showToast } = useToast();
  const [localRefresh, setLocalRefresh] = useState(0);

  useEffect(() => {
    if (!boardId) return;
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/boards/${boardId}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
        setTasks(response.data);
      } catch (error) {
        showToast('Error fetching tasks', 'error');
      }
    };
    fetchTasks();
  }, [boardId, showToast, refreshKey, localRefresh]);

  // Drag & drop handlers
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex(t => t.id === active.id);
    const newIndex = tasks.findIndex(t => t.id === over.id);
    const newTasks = arrayMove(tasks, oldIndex, newIndex);
    setTasks(newTasks);
    try {
      console.log('Saving order for board:', boardId, 'Order:', newTasks.map(t => t.id));
      await updateTasksOrder(boardId, newTasks.map(t => t.id));
    } catch (err) {
      showToast('Error saving order', 'error');
      console.error('Error saving order:', err);
    }
  };

  if (!boardId) return null;

  function TaskSortableWrapper({ task, children }) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: task.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      background: isDragging ? '#e3f2fd' : undefined,
    };
    return (
      <SortableTaskItem key={task.id} task={task} setNodeRef={setNodeRef} attributes={attributes} listeners={listeners} style={style}>
        {children}
      </SortableTaskItem>
    );
  }

  return (
    <div className="task-list">
      <h3>Tasks</h3>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <ul style={{ padding: 0, listStyle: 'none' }}>
            {tasks.map((task) => (
              <TaskSortableWrapper key={task.id} task={task}>
                <div style={{ flex: 1 }}>
                  <div>
                    <strong style={task.status === 'completed' ? { textDecoration: 'line-through', color: '#888' } : {}}>{task.title}</strong>
                  </div>
                  <div style={{ fontSize: '0.97em', color: '#666', marginBottom: 2, textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>{task.description}</div>
                  <div style={{ fontSize: '0.95em', color: '#888' }}>
                    Status: <span style={{ color: '#7c83fd' }}>{task.status}</span> |
                    Priority: <span style={{ color: task.priority === 'high' ? '#f67280' : task.priority === 'medium' ? '#ffb347' : '#388e3c' }}>{task.priority}</span> |
                    Date: <span>{task.due_date ? task.due_date : 'Sin fecha'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    style={{
                      padding: '6px 14px',
                      borderRadius: 5,
                      background: task.status === 'completed' ? '#e0e0e0' : '#a5dee5',
                      color: task.status === 'completed' ? '#aaa' : '#2d2d2d',
                      border: 'none',
                      cursor: task.status === 'completed' ? 'not-allowed' : 'pointer',
                      textDecoration: 'none',
                      fontWeight: 500
                    }}
                    disabled={task.status === 'completed'}
                    onClick={async () => {
                      if (task.status !== 'completed') {
                        try {
                          await updateTaskInBoard(boardId, task.id, { ...task, status: 'completed' });
                          setLocalRefresh(Date.now());
                          showToast('Task completed', 'success');
                        } catch (err) {
                          showToast('Error completing task', 'error');
                        }
                      }
                    }}
                  >
                    {task.status === 'completed' ? 'Completed' : 'Complete'}
                  </button>
                  <button
                    style={{
                      padding: '6px 14px',
                      borderRadius: 5,
                      background: '#f67280',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                    onClick={async () => {
                      const result = await Swal.fire({
                        title: 'Delete task?',
                        text: 'This action cannot be undone.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#f67280',
                        cancelButtonColor: '#a5dee5',
                        confirmButtonText: 'Yes, delete',
                        cancelButtonText: 'Cancel',
                        background: '#fff',
                        color: '#2d2d2d',
                      });
                      if (result.isConfirmed) {
                        try {
                          await deleteTaskInBoard(boardId, task.id);
                          setLocalRefresh(Date.now());
                          showToast('Task deleted', 'success');
                        } catch (err) {
                          showToast('Error deleting task', 'error');
                        }
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </TaskSortableWrapper>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TaskList;
