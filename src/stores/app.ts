import { ServiceInfo, createGrpcClient, createRestClient } from "~/api";

export const useAppStore = defineStore("app", {
  state: () => ({
    systemSettings: {
      bffAddr: `${window.location.hostname}:9999`, // address of bff server
      webAddr: window.location.host, // address of web server
      maxTerminalMessages: 100, // max number of terminal messages
      detailsRefreshInterval: 1000, // interval of refreshing details
    },
    grpc: null as Nullable<ReturnType<typeof createGrpcClient>>, // grpc client
    rest: null as Nullable<ReturnType<typeof createRestClient>>, // rest client
    services: [] as (ServiceInfo & { registered: boolean })[], // registered services
  }),
  actions: {
    loadSystemSettings() {
      const jsonStr = localStorage.getItem("systemSettings");
      if (jsonStr) {
        this.systemSettings = JSON.parse(jsonStr);
      }
    },
    saveSystemSettings() {
      localStorage.setItem(
        "systemSettings",
        JSON.stringify(this.systemSettings),
      );
    },

    async setGrpcClient() {
      this.grpc = createGrpcClient(this.systemSettings.bffAddr);
      const { response } = await this.grpc.getServiceInfo({ ids: [] });
      this.services = Object.values(response.services).map((service) => ({
        ...service,
        registered: true,
      }));
    },
    async setRestClient() {
      this.rest = createRestClient(this.systemSettings.webAddr);
      await this.rest.select("task", [], { id: -1 });
    },

    async registerService(index: number) {
      const service = this.services[index];
      await this.grpc!.registerService({
        services: {
          [service.name]: service,
        },
      });
      service.registered = true;
    },
    async unregisterService(index: number) {
      const service = this.services[index];
      await this.grpc!.unRegisterService({
        ids: [service.name],
      });
      service.registered = false;
    },
  },
});
