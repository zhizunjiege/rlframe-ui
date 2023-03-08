// @generated by protobuf-ts 2.8.2
// @generated from protobuf file "bff.proto" (package "game.bff", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { BFF } from "./bff";
import type { CallDataMap } from "./bff";
import type { ModelStatusMap } from "./bff";
import type { ModelBufferMap } from "./bff";
import type { ModelWeightsMap } from "./bff";
import type { AgentModeMap } from "./bff";
import type { AgentConfigMap } from "./bff";
import type { SimInfoMap } from "./bff";
import type { SimCmdMap } from "./bff";
import type { SimenvConfigMap } from "./bff";
import type { ServiceStateMap } from "./bff";
import type { RouteConfig } from "./bff";
import type { ServiceInfoMap } from "./bff";
import type { ServiceIdList } from "./bff";
import type { ServiceInfoList } from "./bff";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { CommonResponse } from "./types";
import type { CommonRequest } from "./types";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service game.bff.BFF
 */
export interface IBFFClient {
  /**
   * reset bff server
   *
   * @generated from protobuf rpc: ResetServer(game.types.CommonRequest) returns (game.types.CommonResponse);
   */
  resetServer(
    input: CommonRequest,
    options?: RpcOptions
  ): UnaryCall<CommonRequest, CommonResponse>;
  /**
   * register services
   *
   * @generated from protobuf rpc: RegisterService(game.bff.ServiceInfoList) returns (game.bff.ServiceIdList);
   */
  registerService(
    input: ServiceInfoList,
    options?: RpcOptions
  ): UnaryCall<ServiceInfoList, ServiceIdList>;
  /**
   * unregister services
   *
   * @generated from protobuf rpc: UnRegisterService(game.bff.ServiceIdList) returns (game.types.CommonResponse);
   */
  unRegisterService(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, CommonResponse>;
  /**
   * get services info
   *
   * @generated from protobuf rpc: GetServiceInfo(game.bff.ServiceIdList) returns (game.bff.ServiceInfoMap);
   */
  getServiceInfo(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, ServiceInfoMap>;
  /**
   * set services info
   *
   * @generated from protobuf rpc: SetServiceInfo(game.bff.ServiceInfoMap) returns (game.types.CommonResponse);
   */
  setServiceInfo(
    input: ServiceInfoMap,
    options?: RpcOptions
  ): UnaryCall<ServiceInfoMap, CommonResponse>;
  /**
   * get route config
   *
   * @generated from protobuf rpc: GetRouteConfig(game.types.CommonRequest) returns (game.bff.RouteConfig);
   */
  getRouteConfig(
    input: CommonRequest,
    options?: RpcOptions
  ): UnaryCall<CommonRequest, RouteConfig>;
  /**
   * set route config
   *
   * @generated from protobuf rpc: SetRouteConfig(game.bff.RouteConfig) returns (game.types.CommonResponse);
   */
  setRouteConfig(
    input: RouteConfig,
    options?: RpcOptions
  ): UnaryCall<RouteConfig, CommonResponse>;
  /**
   * reset simenv/agent services state
   *
   * @generated from protobuf rpc: ResetService(game.bff.ServiceIdList) returns (game.types.CommonResponse);
   */
  resetService(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, CommonResponse>;
  /**
   * start simenv/agent services state
   *
   * @generated from protobuf rpc: QueryService(game.bff.ServiceIdList) returns (game.bff.ServiceStateMap);
   */
  queryService(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, ServiceStateMap>;
  /**
   * get simenv configs
   *
   * @generated from protobuf rpc: GetSimenvConfig(game.bff.ServiceIdList) returns (game.bff.SimenvConfigMap);
   */
  getSimenvConfig(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, SimenvConfigMap>;
  /**
   * set simenv configs
   *
   * @generated from protobuf rpc: SetSimenvConfig(game.bff.SimenvConfigMap) returns (game.types.CommonResponse);
   */
  setSimenvConfig(
    input: SimenvConfigMap,
    options?: RpcOptions
  ): UnaryCall<SimenvConfigMap, CommonResponse>;
  /**
   * control simenv
   *
   * @generated from protobuf rpc: SimControl(game.bff.SimCmdMap) returns (game.types.CommonResponse);
   */
  simControl(
    input: SimCmdMap,
    options?: RpcOptions
  ): UnaryCall<SimCmdMap, CommonResponse>;
  /**
   * get simenv info
   *
   * @generated from protobuf rpc: SimMonitor(game.bff.ServiceIdList) returns (game.bff.SimInfoMap);
   */
  simMonitor(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, SimInfoMap>;
  /**
   * get agent configs
   *
   * @generated from protobuf rpc: GetAgentConfig(game.bff.ServiceIdList) returns (game.bff.AgentConfigMap);
   */
  getAgentConfig(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, AgentConfigMap>;
  /**
   * set agent configs
   *
   * @generated from protobuf rpc: SetAgentConfig(game.bff.AgentConfigMap) returns (game.types.CommonResponse);
   */
  setAgentConfig(
    input: AgentConfigMap,
    options?: RpcOptions
  ): UnaryCall<AgentConfigMap, CommonResponse>;
  /**
   * get agent mode
   *
   * @generated from protobuf rpc: GetAgentMode(game.bff.ServiceIdList) returns (game.bff.AgentModeMap);
   */
  getAgentMode(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, AgentModeMap>;
  /**
   * set agent mode
   *
   * @generated from protobuf rpc: SetAgentMode(game.bff.AgentModeMap) returns (game.types.CommonResponse);
   */
  setAgentMode(
    input: AgentModeMap,
    options?: RpcOptions
  ): UnaryCall<AgentModeMap, CommonResponse>;
  /**
   * get model weights
   *
   * @generated from protobuf rpc: GetModelWeights(game.bff.ServiceIdList) returns (game.bff.ModelWeightsMap);
   */
  getModelWeights(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, ModelWeightsMap>;
  /**
   * set model weights
   *
   * @generated from protobuf rpc: SetModelWeights(game.bff.ModelWeightsMap) returns (game.types.CommonResponse);
   */
  setModelWeights(
    input: ModelWeightsMap,
    options?: RpcOptions
  ): UnaryCall<ModelWeightsMap, CommonResponse>;
  /**
   * get model buffer
   *
   * @generated from protobuf rpc: GetModelBuffer(game.bff.ServiceIdList) returns (game.bff.ModelBufferMap);
   */
  getModelBuffer(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, ModelBufferMap>;
  /**
   * set model buffer
   *
   * @generated from protobuf rpc: SetModelBuffer(game.bff.ModelBufferMap) returns (game.types.CommonResponse);
   */
  setModelBuffer(
    input: ModelBufferMap,
    options?: RpcOptions
  ): UnaryCall<ModelBufferMap, CommonResponse>;
  /**
   * get model status
   *
   * @generated from protobuf rpc: GetModelStatus(game.bff.ServiceIdList) returns (game.bff.ModelStatusMap);
   */
  getModelStatus(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, ModelStatusMap>;
  /**
   * set model status
   *
   * @generated from protobuf rpc: SetModelStatus(game.bff.ModelStatusMap) returns (game.types.CommonResponse);
   */
  setModelStatus(
    input: ModelStatusMap,
    options?: RpcOptions
  ): UnaryCall<ModelStatusMap, CommonResponse>;
  /**
   * any rpc call
   *
   * @generated from protobuf rpc: Call(game.bff.CallDataMap) returns (game.bff.CallDataMap);
   */
  call(
    input: CallDataMap,
    options?: RpcOptions
  ): UnaryCall<CallDataMap, CallDataMap>;
}
/**
 * @generated from protobuf service game.bff.BFF
 */
export class BFFClient implements IBFFClient, ServiceInfo {
  typeName = BFF.typeName;
  methods = BFF.methods;
  options = BFF.options;
  constructor(private readonly _transport: RpcTransport) {}
  /**
   * reset bff server
   *
   * @generated from protobuf rpc: ResetServer(game.types.CommonRequest) returns (game.types.CommonResponse);
   */
  resetServer(
    input: CommonRequest,
    options?: RpcOptions
  ): UnaryCall<CommonRequest, CommonResponse> {
    const method = this.methods[0],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<CommonRequest, CommonResponse>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * register services
   *
   * @generated from protobuf rpc: RegisterService(game.bff.ServiceInfoList) returns (game.bff.ServiceIdList);
   */
  registerService(
    input: ServiceInfoList,
    options?: RpcOptions
  ): UnaryCall<ServiceInfoList, ServiceIdList> {
    const method = this.methods[1],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<ServiceInfoList, ServiceIdList>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * unregister services
   *
   * @generated from protobuf rpc: UnRegisterService(game.bff.ServiceIdList) returns (game.types.CommonResponse);
   */
  unRegisterService(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, CommonResponse> {
    const method = this.methods[2],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<ServiceIdList, CommonResponse>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * get services info
   *
   * @generated from protobuf rpc: GetServiceInfo(game.bff.ServiceIdList) returns (game.bff.ServiceInfoMap);
   */
  getServiceInfo(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, ServiceInfoMap> {
    const method = this.methods[3],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<ServiceIdList, ServiceInfoMap>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * set services info
   *
   * @generated from protobuf rpc: SetServiceInfo(game.bff.ServiceInfoMap) returns (game.types.CommonResponse);
   */
  setServiceInfo(
    input: ServiceInfoMap,
    options?: RpcOptions
  ): UnaryCall<ServiceInfoMap, CommonResponse> {
    const method = this.methods[4],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<ServiceInfoMap, CommonResponse>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * get route config
   *
   * @generated from protobuf rpc: GetRouteConfig(game.types.CommonRequest) returns (game.bff.RouteConfig);
   */
  getRouteConfig(
    input: CommonRequest,
    options?: RpcOptions
  ): UnaryCall<CommonRequest, RouteConfig> {
    const method = this.methods[5],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<CommonRequest, RouteConfig>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * set route config
   *
   * @generated from protobuf rpc: SetRouteConfig(game.bff.RouteConfig) returns (game.types.CommonResponse);
   */
  setRouteConfig(
    input: RouteConfig,
    options?: RpcOptions
  ): UnaryCall<RouteConfig, CommonResponse> {
    const method = this.methods[6],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<RouteConfig, CommonResponse>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * reset simenv/agent services state
   *
   * @generated from protobuf rpc: ResetService(game.bff.ServiceIdList) returns (game.types.CommonResponse);
   */
  resetService(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, CommonResponse> {
    const method = this.methods[7],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<ServiceIdList, CommonResponse>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * start simenv/agent services state
   *
   * @generated from protobuf rpc: QueryService(game.bff.ServiceIdList) returns (game.bff.ServiceStateMap);
   */
  queryService(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, ServiceStateMap> {
    const method = this.methods[8],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<ServiceIdList, ServiceStateMap>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * get simenv configs
   *
   * @generated from protobuf rpc: GetSimenvConfig(game.bff.ServiceIdList) returns (game.bff.SimenvConfigMap);
   */
  getSimenvConfig(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, SimenvConfigMap> {
    const method = this.methods[9],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<ServiceIdList, SimenvConfigMap>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * set simenv configs
   *
   * @generated from protobuf rpc: SetSimenvConfig(game.bff.SimenvConfigMap) returns (game.types.CommonResponse);
   */
  setSimenvConfig(
    input: SimenvConfigMap,
    options?: RpcOptions
  ): UnaryCall<SimenvConfigMap, CommonResponse> {
    const method = this.methods[10],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<SimenvConfigMap, CommonResponse>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * control simenv
   *
   * @generated from protobuf rpc: SimControl(game.bff.SimCmdMap) returns (game.types.CommonResponse);
   */
  simControl(
    input: SimCmdMap,
    options?: RpcOptions
  ): UnaryCall<SimCmdMap, CommonResponse> {
    const method = this.methods[11],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<SimCmdMap, CommonResponse>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * get simenv info
   *
   * @generated from protobuf rpc: SimMonitor(game.bff.ServiceIdList) returns (game.bff.SimInfoMap);
   */
  simMonitor(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, SimInfoMap> {
    const method = this.methods[12],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<ServiceIdList, SimInfoMap>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * get agent configs
   *
   * @generated from protobuf rpc: GetAgentConfig(game.bff.ServiceIdList) returns (game.bff.AgentConfigMap);
   */
  getAgentConfig(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, AgentConfigMap> {
    const method = this.methods[13],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<ServiceIdList, AgentConfigMap>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * set agent configs
   *
   * @generated from protobuf rpc: SetAgentConfig(game.bff.AgentConfigMap) returns (game.types.CommonResponse);
   */
  setAgentConfig(
    input: AgentConfigMap,
    options?: RpcOptions
  ): UnaryCall<AgentConfigMap, CommonResponse> {
    const method = this.methods[14],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<AgentConfigMap, CommonResponse>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * get agent mode
   *
   * @generated from protobuf rpc: GetAgentMode(game.bff.ServiceIdList) returns (game.bff.AgentModeMap);
   */
  getAgentMode(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, AgentModeMap> {
    const method = this.methods[15],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<ServiceIdList, AgentModeMap>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * set agent mode
   *
   * @generated from protobuf rpc: SetAgentMode(game.bff.AgentModeMap) returns (game.types.CommonResponse);
   */
  setAgentMode(
    input: AgentModeMap,
    options?: RpcOptions
  ): UnaryCall<AgentModeMap, CommonResponse> {
    const method = this.methods[16],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<AgentModeMap, CommonResponse>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * get model weights
   *
   * @generated from protobuf rpc: GetModelWeights(game.bff.ServiceIdList) returns (game.bff.ModelWeightsMap);
   */
  getModelWeights(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, ModelWeightsMap> {
    const method = this.methods[17],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<ServiceIdList, ModelWeightsMap>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * set model weights
   *
   * @generated from protobuf rpc: SetModelWeights(game.bff.ModelWeightsMap) returns (game.types.CommonResponse);
   */
  setModelWeights(
    input: ModelWeightsMap,
    options?: RpcOptions
  ): UnaryCall<ModelWeightsMap, CommonResponse> {
    const method = this.methods[18],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<ModelWeightsMap, CommonResponse>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * get model buffer
   *
   * @generated from protobuf rpc: GetModelBuffer(game.bff.ServiceIdList) returns (game.bff.ModelBufferMap);
   */
  getModelBuffer(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, ModelBufferMap> {
    const method = this.methods[19],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<ServiceIdList, ModelBufferMap>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * set model buffer
   *
   * @generated from protobuf rpc: SetModelBuffer(game.bff.ModelBufferMap) returns (game.types.CommonResponse);
   */
  setModelBuffer(
    input: ModelBufferMap,
    options?: RpcOptions
  ): UnaryCall<ModelBufferMap, CommonResponse> {
    const method = this.methods[20],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<ModelBufferMap, CommonResponse>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * get model status
   *
   * @generated from protobuf rpc: GetModelStatus(game.bff.ServiceIdList) returns (game.bff.ModelStatusMap);
   */
  getModelStatus(
    input: ServiceIdList,
    options?: RpcOptions
  ): UnaryCall<ServiceIdList, ModelStatusMap> {
    const method = this.methods[21],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<ServiceIdList, ModelStatusMap>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * set model status
   *
   * @generated from protobuf rpc: SetModelStatus(game.bff.ModelStatusMap) returns (game.types.CommonResponse);
   */
  setModelStatus(
    input: ModelStatusMap,
    options?: RpcOptions
  ): UnaryCall<ModelStatusMap, CommonResponse> {
    const method = this.methods[22],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<ModelStatusMap, CommonResponse>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
  /**
   * any rpc call
   *
   * @generated from protobuf rpc: Call(game.bff.CallDataMap) returns (game.bff.CallDataMap);
   */
  call(
    input: CallDataMap,
    options?: RpcOptions
  ): UnaryCall<CallDataMap, CallDataMap> {
    const method = this.methods[23],
      opt = this._transport.mergeOptions(options);
    return stackIntercept<CallDataMap, CallDataMap>(
      "unary",
      this._transport,
      method,
      opt,
      input
    );
  }
}
