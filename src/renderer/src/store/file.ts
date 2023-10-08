import { defineStore} from "pinia";

export const useSelectedFilesStore = defineStore('selectedFilesStore', {
  state: () => {
    return {
      selectedFiles: {
        name: '',
        type: '',
        attribute: 0,
        startId: 0,
        len: 0,
        selected: false
      }
    }
  },

  actions: {
    selectItems(item: any) {
      this.selectedFiles = item
    }
  }
})
