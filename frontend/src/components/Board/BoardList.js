import React, { useEffect, useState } from 'react';
import { fetchBoards, createBoard, updateBoard, deleteBoard } from '../../services/api';

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [newBoard, setNewBoard] = useState({ name: '', description: '' });

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const data = await fetchBoards();
        setBoards(data);
      } catch (error) {
        console.error('Error fetching boards:', error);
      }
    };

    loadBoards();
  }, []);

  const handleCreate = async () => {
    try {
      const createdBoard = await createBoard(newBoard);
      setBoards([...boards, createdBoard]);
      setNewBoard({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const updatedBoard = await updateBoard(id, updatedData);
      setBoards(boards.map((board) => (board.id === id ? updatedBoard : board)));
    } catch (error) {
      console.error('Error updating board:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBoard(id);
      setBoards(boards.filter((board) => board.id !== id));
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  return (
    <div>
      <h2>Boards</h2>
      <ul>
        {boards.map((board) => (
          <li key={board.id}>
            <h3>{board.name}</h3>
            <p>{board.description}</p>
            <button onClick={() => handleUpdate(board.id, { name: 'Updated Name', description: 'Updated Description' })}>Edit</button>
            <button onClick={() => handleDelete(board.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        <h3>Create New Board</h3>
        <input
          type="text"
          placeholder="Board Name"
          value={newBoard.name}
          onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
        />
        <textarea
          placeholder="Board Description"
          value={newBoard.description}
          onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
        />
        <button onClick={handleCreate}>Create</button>
      </div>
    </div>
  );
};

export default BoardList;