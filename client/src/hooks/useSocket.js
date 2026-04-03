import { useEffect } from 'react';
import { getSocket } from '../socket/socket';

// Generic hook: listens to a socket event and calls handler
// Automatically cleans up the listener when component unmounts
// Usage: useSocket('note:created', (note) => addNote(note))
const useSocket = (event, handler) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on(event, handler);

    // Cleanup — prevents duplicate listeners on re-renders
    return () => {
      socket.off(event, handler);
    };
  }, [event, handler]);
};

export default useSocket;