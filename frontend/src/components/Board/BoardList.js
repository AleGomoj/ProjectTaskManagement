import React, { useEffect, useState } from 'react';
import { fetchBoards, createBoard, updateBoard, deleteBoard, updateBoardsOrder } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import TaskList from '../Task/TaskList';
import TaskForm from '../Task/TaskForm';
import Swal from 'sweetalert2';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { arrayMove } from '../Task/arrayMove';

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [newBoard, setNewBoard] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: '', description: '' });
  const [showTaskFormFor, setShowTaskFormFor] = useState(null);
  const [taskRefreshKey, setTaskRefreshKey] = useState({});
  const { showToast } = useToast();
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const data = await fetchBoards();
        setBoards(data);
      } catch (error) {
        setBoards([]);
      }
    };
    loadBoards();
  }, []);

  const handleCreate = async () => {
    if (!newBoard.name) return;
    try {
      const createdBoard = await createBoard(newBoard);
      setBoards([...boards, createdBoard]);
      setNewBoard({ name: '', description: '' });
      setShowCreate(false);
      showToast('Board created successfully', 'success');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Error creating board';
      showToast(msg, 'error');
    }
  };

  const handleEdit = (board) => {
    setEditId(board.id);
    setEditData({ name: board.name, description: board.description });
  };

  const handleUpdate = async (id) => {
    try {
      const updatedBoard = await updateBoard(id, editData);
      setBoards(boards.map((b) => (b.id === id ? updatedBoard : b)));
      setEditId(null);
      showToast('Board updated', 'success');
    } catch (error) {
      showToast('Error updating board', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete board?',
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
    if (!result.isConfirmed) return;
    try {
      await deleteBoard(id);
      setBoards(boards.filter((b) => b.id !== id));
      showToast('Board deleted', 'success');
    } catch (error) {
      showToast('Error deleting board', 'error');
    }
  };

  const handleBoardDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = boards.findIndex(b => b.id === active.id);
    const newIndex = boards.findIndex(b => b.id === over.id);
    const newBoards = arrayMove(boards, oldIndex, newIndex);
    setBoards(newBoards);
    try {
      await updateBoardsOrder(newBoards.map(b => b.id));
    } catch (err) {
      showToast('Error saving board order', 'error');
      // Opcional: recargar boards si falla
    }
  };

  function SortableBoardItem({ board, children }) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: board.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      background: isDragging ? '#e3f2fd' : undefined,
    };
    return (
      <li ref={setNodeRef} style={{ ...style, flexDirection: 'column', alignItems: 'flex-start', display: 'flex', marginBottom: 18 }}>
        <span {...attributes} {...listeners} style={{ cursor: 'grab', marginRight: 12, fontSize: 18, userSelect: 'none', alignSelf: 'flex-end' }} title="Arrastrar">☰</span>
        {children}
      </li>
    );
  }

  return (
    <div className="board-list">
      <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#7c83fd', letterSpacing: '1.5px', marginBottom: 28 }}>Boards</h2>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleBoardDragEnd}>
        <SortableContext items={boards.map(b => b.id)} strategy={verticalListSortingStrategy}>
          <ul>
            {boards.map((board) => (
              <SortableBoardItem key={board.id} board={board}>
                <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
                  {editId === board.id ? (
                    <>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={e => setEditData({ ...editData, name: e.target.value })}
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        value={editData.description}
                        onChange={e => setEditData({ ...editData, description: e.target.value })}
                        placeholder="Description"
                      />
                    </>
                  ) : (
                    <>
                      <strong style={{ fontSize: '1.35rem', color: '#232946', fontWeight: 800, letterSpacing: '0.5px' }}>{board.name}</strong>
                      {board.description && <span style={{ marginLeft: 8 }}>{board.description}</span>}
                    </>
                  )}
                </div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  {editId === board.id ? (
                    <>
                      <button onClick={() => handleUpdate(board.id)}>Save</button>
                      <button onClick={() => setEditId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(board)}>Edit</button>
                      <button
                        onClick={() => handleDelete(board.id)}
                        style={{
                          background: 'linear-gradient(90deg, #f67280 0%, #f7b2b7 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          padding: '7px 16px',
                          fontWeight: 700,
                          fontSize: '1rem',
                          boxShadow: '0 2px 8px #f6728033',
                          transition: 'background 0.2s, color 0.2s',
                          cursor: 'pointer',
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.background = 'linear-gradient(90deg, #f7b2b7 0%, #f67280 100%)';
                          e.currentTarget.style.color = '#232946';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = 'linear-gradient(90deg, #f67280 0%, #f7b2b7 100%)';
                          e.currentTarget.style.color = '#fff';
                        }}
                      >
                        Delete
                      </button>
                      <button onClick={() => setShowTaskFormFor(showTaskFormFor === board.id ? null : board.id)}>
                        {showTaskFormFor === board.id ? 'Cancel Task' : 'Add Task'}
                      </button>
                    </>
                  )}
                </div>
                {showTaskFormFor === board.id && (
                  <div style={{ width: '100%', marginTop: 8 }}>
                    <TaskForm
                      boardId={board.id}
                      setTask={() => {
                        setShowTaskFormFor(null);
                        setTaskRefreshKey((prev) => ({ ...prev, [board.id]: Date.now() }));
                      }}
                    />
                  </div>
                )}
                <div style={{ width: '100%', marginTop: 8 }}>
                  <TaskList boardId={board.id} refreshKey={taskRefreshKey[board.id] || 0} />
                </div>
              </SortableBoardItem>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <button
        className="fab-create-board"
        onClick={() => setShowCreate((prev) => !prev)}
        aria-label="Create Board"
      >
        <span style={{ fontSize: 32, lineHeight: 1 }}>+</span>
      </button>
      {showCreate && (
        <div className="create-board-modal">
          <div className="create-board-form">
            <h3>Create new board</h3>
            <input
              type="text"
              placeholder="Name"
              value={newBoard.name}
              onChange={e => setNewBoard({ ...newBoard, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              value={newBoard.description}
              onChange={e => setNewBoard({ ...newBoard, description: e.target.value })}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button onClick={handleCreate}>Create</button>
              <button onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardList;