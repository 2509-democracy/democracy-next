import { atom } from 'jotai';
import { WebSocketClient, createWebSocketClient } from '@/libs/websocket';

interface MatchingState {
  status: 'idle' | 'connecting' | 'waiting' | 'matched' | 'error';
  queueSize: number;
  roomId?: string;
  players: string[];
  error?: string;
}

const initialMatchingState: MatchingState = {
  status: 'idle',
  queueSize: 0,
  players: [],
};

// Base atoms
export const webSocketClientAtom = atom<WebSocketClient | null>(null);
export const isConnectedAtom = atom<boolean>(false);
export const matchingStateAtom = atom<MatchingState>(initialMatchingState);

// Action atoms
export const connectAtom = atom(
  null,
  async (get, set, url: string) => {
    const client = get(webSocketClientAtom);
    
    // 既存接続があれば切断
    if (client) {
      client.disconnect();
    }

    set(matchingStateAtom, { ...initialMatchingState, status: 'connecting' });

    try {
      const newClient = createWebSocketClient(url, {
        onConnect: () => {
          console.log('WebSocket connected');
          set(isConnectedAtom, true);
          set(matchingStateAtom, { ...initialMatchingState, status: 'idle' });
        },
        
        onDisconnect: () => {
          console.log('WebSocket disconnected');
          set(isConnectedAtom, false);
          set(matchingStateAtom, { ...initialMatchingState, status: 'idle' });
        },
        
        onError: (error) => {
          console.error('WebSocket error:', error);
          set(isConnectedAtom, false);
          set(matchingStateAtom, {
            ...initialMatchingState,
            status: 'error',
            error: 'Connection error'
          });
        },
        
        onMatchingJoined: (data) => {
          console.log('Joined matching queue:', data);
          set(matchingStateAtom, {
            status: 'waiting',
            queueSize: data.queueSize || 0,
            players: [],
          });
        },
        
        onMatchingLeft: (data) => {
          console.log('Left matching queue:', data);
          set(matchingStateAtom, initialMatchingState);
        },
        
        onMatchFound: (data) => {
          console.log('Match found:', data);
          set(matchingStateAtom, {
            status: 'matched',
            queueSize: 0,
            roomId: data.roomId,
            players: data.players || [],
          });
        },
      });

      await newClient.connect();
      set(webSocketClientAtom, newClient);
      
    } catch (error) {
      console.error('Failed to connect:', error);
      set(matchingStateAtom, {
        ...initialMatchingState,
        status: 'error',
        error: 'Failed to connect to server'
      });
    }
  }
);

export const disconnectAtom = atom(
  null,
  (get, set) => {
    const client = get(webSocketClientAtom);
    if (client) {
      client.disconnect();
      set(webSocketClientAtom, null);
      set(isConnectedAtom, false);
      set(matchingStateAtom, initialMatchingState);
    }
  }
);

export const joinMatchingAtom = atom(
  null,
  (get, set) => {
    const client = get(webSocketClientAtom);
    const isConnected = get(isConnectedAtom);
    if (client && isConnected) {
      client.joinMatching();
      const currentMatching = get(matchingStateAtom);
      set(matchingStateAtom, {
        ...currentMatching,
        status: 'waiting'
      });
    }
  }
);

export const leaveMatchingAtom = atom(
  null,
  (get, set) => {
    const client = get(webSocketClientAtom);
    const isConnected = get(isConnectedAtom);
    if (client && isConnected) {
      client.leaveMatching();
    }
  }
);

export const setMatchingStatusAtom = atom(
  null,
  (get, set, status: MatchingState['status']) => {
    const currentMatching = get(matchingStateAtom);
    set(matchingStateAtom, {
      ...currentMatching,
      status
    });
  }
);

export const setErrorAtom = atom(
  null,
  (get, set, error: string) => {
    const currentMatching = get(matchingStateAtom);
    set(matchingStateAtom, {
      ...currentMatching,
      status: 'error',
      error
    });
  }
);

export const resetAtom = atom(
  null,
  (_get, set) => {
    set(matchingStateAtom, initialMatchingState);
  }
);