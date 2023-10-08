import { defineStore } from 'pinia';

export const useEventStore = defineStore({
  id: 'eventStore',
  state: () => ({
    eventDataFromNavibar: null,
    eventDataFromDashboard: null,
    eventTriggered: false,
    eventParams: null
  }),
  actions: {
    triggerEvent(eventParams: any) {
      this.eventTriggered = true;
      console.log("store获取到参数：" + eventParams);
      this.eventParams = eventParams;
    },
    resetEvent() {
      this.eventTriggered = false;
      this.eventParams = null;
    },
    sendDataFromNavibar(eventData: any) {
      this.eventDataFromNavibar = eventData;
    },
    sendDataFromDashboard(eventData: any) {
      this.eventDataFromDashboard = eventData;
    },
    resetData() {
      this.eventDataFromNavibar = null;
      this.eventDataFromDashboard = null;
    }
  }
});
