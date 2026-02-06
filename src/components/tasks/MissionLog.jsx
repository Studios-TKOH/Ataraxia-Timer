import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, GripVertical, Loader2, Tag as TagIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { tasksService } from '../../api/tasks.service';
import { useAuth } from '../../context/auth-context';
import { useAchievements } from '../../context/achievement-context';
import AdBanner from '../layout/AdBanner';

const MissionLog = ({ showAd }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTag, setNewTaskTag] = useState('General');
  const [loading, setLoading] = useState(false);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const inputRef = useRef(null);

  const { user, token, initialized } = useAuth();
  const { refreshAchievements } = useAchievements();

  const TITLE_REGEX = /^[a-zA-Z0-9\s\-_.,!?áéíóúÁÉÍÓÚñÑ]+$/;
  const TAG_REGEX = /^[a-zA-Z0-9\s\-_]+$/;

  useEffect(() => {
    if (editingTaskId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTaskId]);

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.title);
  };

  const saveEdit = async (id) => {
    const currentTask = tasks.find(t => t.id === id);
    if (editingText === currentTask.title) {
      setEditingTaskId(null);
      return;
    }

    if (!editingText.trim()) {
      toast.error("The title cannot be empty");
      setEditingTaskId(null);
      return;
    }

    if (!TITLE_REGEX.test(editingText)) {
      toast.error("Title contains invalid characters");
      return;
    }

    const oldTasks = [...tasks];
    setTasks(tasks.map(t => t.id === id ? { ...t, title: editingText } : t));
    setEditingTaskId(null);

    try {
      await tasksService.update(id, { title: editingText });
      toast.success('Mission updated', { icon: '✏️' });
    } catch (error) {
      toast.error("Failed to sync with server");
      setTasks(oldTasks);
    }
  };

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await tasksService.getAll();
      setTasks(data || []);
    } catch (error) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialized && token && !user?.isGuest) {
      loadTasks();
    }
  }, [initialized, token, user]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    if (!TITLE_REGEX.test(newTaskTitle)) {
      return toast.error("El título contiene caracteres no permitidos");
    }

    try {
      const savedTask = await tasksService.create({
        title: newTaskTitle,
        tag: newTaskTag
      });
      setTasks([...tasks, savedTask]);
      setNewTaskTitle('');
      toast.success('Nueva misión asignada! 🚀');
      refreshAchievements();
    } catch (error) {
      const message = error.response?.data?.message || "Error al crear la tarea";
      toast.error(Array.isArray(message) ? message[0] : message);
    }
  };

  const toggleTask = async (task) => {
    try {
      const updatedTask = await tasksService.update(task.id, { completed: !task.completed });
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      if (updatedTask.completed) {
        toast.success('Misión cumplida! 🎯');
        refreshAchievements();
      }
    } catch (error) {
      toast.error("Error al actualizar estado");
    }
  };

  const deleteTask = async (id) => {
    try {
      await tasksService.delete(id);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Misión eliminada');
      refreshAchievements();
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  return (
    <div className="mission-log-container" style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--glass-border)',
      borderRadius: '24px',
      padding: '1.5rem',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backdropFilter: 'blur(10px)'
    }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', letterSpacing: '2px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
        Mission Log
        <span>{loading ? '...' : `${tasks.filter(t => t.completed).length}/${tasks.length}`}</span>
      </h3>

      <form onSubmit={addTask} style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.2)',
          padding: '4px',
          borderRadius: '16px',
          border: '1px solid var(--glass-border)',
          gap: '8px'
        }}>
          <input
            type="text"
            placeholder="Add a new mission..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            disabled={loading}
            className="input-text"
            style={{
              background: 'transparent',
              border: 'none',
              flex: 1,
              padding: '10px 15px',
              fontSize: '0.9rem'
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '0 8px' }}>
            <span style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '0.8rem' }}>#</span>
            <input
              type="text"
              placeholder="Tag"
              value={newTaskTag}
              onChange={(e) => setNewTaskTag(e.target.value)}
              disabled={loading}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                width: '70px',
                fontSize: '0.75rem',
                outline: 'none',
                padding: '5px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'var(--primary-color)',
              border: 'none',
              color: 'white',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={20} />}
          </button>
        </div>
      </form>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {tasks.map((task) => (
          <div key={task.id} className="task-item" style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px',
            opacity: task.completed ? 0.6 : 1,
            transition: 'border 0.2s',
            border: editingTaskId === task.id ? '1px solid var(--primary-color)' : '1px solid transparent'
          }}>
            <button onClick={() => toggleTask(task)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.completed ? 'var(--primary-color)' : 'var(--text-muted)' }}>
              {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </button>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {editingTaskId === task.id ? (
                <input
                  ref={inputRef}
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => saveEdit(task.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(task.id);
                    if (e.key === 'Escape') setEditingTaskId(null);
                  }}
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '0.9rem',
                    outline: 'none',
                    padding: '2px 0'
                  }}
                />
              ) : (
                <span
                  onDoubleClick={() => startEditing(task)}
                  style={{
                    fontSize: '0.9rem',
                    color: 'white',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    cursor: 'text'
                  }}
                >
                  {task.title}
                </span>
              )}
              {task.tag && (
                <span style={{ fontSize: '0.7rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TagIcon size={10} /> {task.tag}
                </span>
              )}
            </div>

            <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.6 }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {showAd && <AdBanner />}
      </div>
    </div>
  );
};

export default MissionLog;