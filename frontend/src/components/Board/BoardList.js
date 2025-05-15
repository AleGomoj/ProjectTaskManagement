import React, { useEffect, useState } from 'react';
import { fetchBoards, createBoard, updateBoard, deleteBoard } from '../../services/api';

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [newBoard, setNewBoard] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: '', description: '' });

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
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Error creating board';
      alert(msg);
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
    } catch (error) {
      alert('Error updating board');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Delete Board?')) return;
    try {
      await deleteBoard(id);
      setBoards(boards.filter((b) => b.id !== id));
    } catch (error) {
      alert('Error deleting board');
    }
  };

  return (
    <div className="board-list">
      <h2>Boards</h2>
      <ul>
        {boards.map((board) => (
          <li key={board.id}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {editId === board.id ? (
                <>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Nombre"
                  />
                  <input
                    type="text"
                    value={editData.description}
                    onChange={e => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Descripción"
                  />
                </>
              ) : (
                <>
                  <strong>{board.name}</strong>
                  {board.description && <span style={{ marginLeft: 8 }}>{board.description}</span>}
                </>
              )}
            </div>
            {editId === board.id ? (
              <>
                <button onClick={() => handleUpdate(board.id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => handleEdit(board)}>Edit</button>
                <button onClick={() => handleDelete(board.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div>
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
        <button onClick={handleCreate}>Create</button>
      </div>
    </div>
  );
};

export default BoardList;