import { atom } from 'jotai';

// ペイン展開状態の管理
export interface PaneState {
  left: boolean;
  right: boolean;
  bottom: boolean;
}

// 初期状態：全て展開
const initialPaneState: PaneState = {
  left: true,
  right: true,
  bottom: true,
};

// ペイン状態管理用atom
export const paneStateAtom = atom<PaneState>(initialPaneState);

// 個別ペイン制御用derived atoms
export const leftPaneAtom = atom(
  (get) => get(paneStateAtom).left,
  (get, set, isOpen: boolean) => {
    set(paneStateAtom, { ...get(paneStateAtom), left: isOpen });
  }
);

export const rightPaneAtom = atom(
  (get) => get(paneStateAtom).right,
  (get, set, isOpen: boolean) => {
    set(paneStateAtom, { ...get(paneStateAtom), right: isOpen });
  }
);

export const bottomPaneAtom = atom(
  (get) => get(paneStateAtom).bottom,
  (get, set, isOpen: boolean) => {
    set(paneStateAtom, { ...get(paneStateAtom), bottom: isOpen });
  }
);

// ペイン切り替え用アクション
export const togglePaneAtom = atom(
  null,
  (get, set, pane: keyof PaneState) => {
    const currentState = get(paneStateAtom);
    set(paneStateAtom, {
      ...currentState,
      [pane]: !currentState[pane],
    });
  }
);