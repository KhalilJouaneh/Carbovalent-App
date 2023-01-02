import {types} from "mobx-state-tree"
import { useMemo } from "react";

export const RootStore = types.model({
    searchQuery: types.string,
})
.actions((store) => ({
    setSearchQuery(value) {
        store.searchQuery = value;
    },
}));




let _store;
export const useStore = () => {
    const store = useMemo(() => {
        if (!_store) {

            _store = RootStore.create({searchQuery: ""});
        }
        return _store;
    }, []);
    return store;
};

