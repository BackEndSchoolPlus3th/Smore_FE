import { RoomStore } from './RoomStore';
import { createContext, useContext } from 'react';

interface RootStore {
  roomStore: RoomStore;
}

export const rootStore: RootStore = {
  roomStore: new RoomStore(),
};

export const StoreContext = createContext<RootStore>(rootStore);

export const StoreProvider = StoreContext.Provider;

export const useStore = (): RootStore => {
  return useContext(StoreContext);
};
