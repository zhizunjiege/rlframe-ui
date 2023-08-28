// @generated by protobuf-ts 2.8.2
// @generated from protobuf file "agent.proto" (package "game.agent", syntax proto3)
// tslint:disable
import { CallData } from "./types";
import { SimAction } from "./types";
import { SimState } from "./types";
import { ServiceState } from "./types";
import { CommonResponse } from "./types";
import { CommonRequest } from "./types";
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MESSAGE_TYPE } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message game.agent.AgentConfig
 */
export interface AgentConfig {
  /**
   * @generated from protobuf field: bool training = 1;
   */
  training: boolean; // whether agent is used for `train` or `infer`
  /**
   * @generated from protobuf field: string name = 2;
   */
  name: string; // name of reinforcement learning algorithm
  /**
   * @generated from protobuf field: string hypers = 3;
   */
  hypers: string; // hyper params, format: json string of struct
  /**
   * @generated from protobuf field: string sifunc = 4;
   */
  sifunc: string; // states to inputs function, format: python code
  /**
   * @generated from protobuf field: string oafunc = 5;
   */
  oafunc: string; // outputs to actions funtion, format: python code
  /**
   * @generated from protobuf field: string rewfunc = 6;
   */
  rewfunc: string; // reward function, format: python code
  /**
   * @generated from protobuf field: repeated game.agent.AgentConfig.Hook hooks = 7;
   */
  hooks: AgentConfig_Hook[]; // agent hooks
}
/**
 * @generated from protobuf message game.agent.AgentConfig.Hook
 */
export interface AgentConfig_Hook {
  /**
   * @generated from protobuf field: string name = 1;
   */
  name: string; // name of hook
  /**
   * @generated from protobuf field: string args = 2;
   */
  args: string; // args of hook, format: json string of struct
}
/**
 * @generated from protobuf message game.agent.AgentMode
 */
export interface AgentMode {
  /**
   * @generated from protobuf field: bool training = 1;
   */
  training: boolean; // whether agent is in `train` or `infer` mode
}
/**
 * @generated from protobuf message game.agent.ModelWeights
 */
export interface ModelWeights {
  /**
   * @generated from protobuf field: bytes weights = 1;
   */
  weights: Uint8Array; // weights of model, format: Pickle bytes
}
/**
 * @generated from protobuf message game.agent.ModelBuffer
 */
export interface ModelBuffer {
  /**
   * @generated from protobuf field: bytes buffer = 1;
   */
  buffer: Uint8Array; // buffer of model, format: Pickle bytes
}
/**
 * @generated from protobuf message game.agent.ModelStatus
 */
export interface ModelStatus {
  /**
   * @generated from protobuf field: string status = 1;
   */
  status: string; // status of model, format: json string of struct
}
// @generated message type with reflection information, may provide speed optimized methods
class AgentConfig$Type extends MessageType<AgentConfig> {
  constructor() {
    super("game.agent.AgentConfig", [
      { no: 1, name: "training", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
      { no: 2, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 3, name: "hypers", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 4, name: "sifunc", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 5, name: "oafunc", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 6, name: "rewfunc", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      {
        no: 7,
        name: "hooks",
        kind: "message",
        repeat: 1 /*RepeatType.PACKED*/,
        T: () => AgentConfig_Hook,
      },
    ]);
  }
  create(value?: PartialMessage<AgentConfig>): AgentConfig {
    const message = {
      training: false,
      name: "",
      hypers: "",
      sifunc: "",
      oafunc: "",
      rewfunc: "",
      hooks: [],
    };
    globalThis.Object.defineProperty(message, MESSAGE_TYPE, {
      enumerable: false,
      value: this,
    });
    if (value !== undefined)
      reflectionMergePartial<AgentConfig>(this, message, value);
    return message;
  }
  internalBinaryRead(
    reader: IBinaryReader,
    length: number,
    options: BinaryReadOptions,
    target?: AgentConfig
  ): AgentConfig {
    let message = target ?? this.create(),
      end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* bool training */ 1:
          message.training = reader.bool();
          break;
        case /* string name */ 2:
          message.name = reader.string();
          break;
        case /* string hypers */ 3:
          message.hypers = reader.string();
          break;
        case /* string sifunc */ 4:
          message.sifunc = reader.string();
          break;
        case /* string oafunc */ 5:
          message.oafunc = reader.string();
          break;
        case /* string rewfunc */ 6:
          message.rewfunc = reader.string();
          break;
        case /* repeated game.agent.AgentConfig.Hook hooks */ 7:
          message.hooks.push(
            AgentConfig_Hook.internalBinaryRead(
              reader,
              reader.uint32(),
              options
            )
          );
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(
              `Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`
            );
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(
              this.typeName,
              message,
              fieldNo,
              wireType,
              d
            );
      }
    }
    return message;
  }
  internalBinaryWrite(
    message: AgentConfig,
    writer: IBinaryWriter,
    options: BinaryWriteOptions
  ): IBinaryWriter {
    /* bool training = 1; */
    if (message.training !== false)
      writer.tag(1, WireType.Varint).bool(message.training);
    /* string name = 2; */
    if (message.name !== "")
      writer.tag(2, WireType.LengthDelimited).string(message.name);
    /* string hypers = 3; */
    if (message.hypers !== "")
      writer.tag(3, WireType.LengthDelimited).string(message.hypers);
    /* string sifunc = 4; */
    if (message.sifunc !== "")
      writer.tag(4, WireType.LengthDelimited).string(message.sifunc);
    /* string oafunc = 5; */
    if (message.oafunc !== "")
      writer.tag(5, WireType.LengthDelimited).string(message.oafunc);
    /* string rewfunc = 6; */
    if (message.rewfunc !== "")
      writer.tag(6, WireType.LengthDelimited).string(message.rewfunc);
    /* repeated game.agent.AgentConfig.Hook hooks = 7; */
    for (let i = 0; i < message.hooks.length; i++)
      AgentConfig_Hook.internalBinaryWrite(
        message.hooks[i],
        writer.tag(7, WireType.LengthDelimited).fork(),
        options
      ).join();
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(
        this.typeName,
        message,
        writer
      );
    return writer;
  }
}
/**
 * @generated MessageType for protobuf message game.agent.AgentConfig
 */
export const AgentConfig = new AgentConfig$Type();
// @generated message type with reflection information, may provide speed optimized methods
class AgentConfig_Hook$Type extends MessageType<AgentConfig_Hook> {
  constructor() {
    super("game.agent.AgentConfig.Hook", [
      { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 2, name: "args", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
    ]);
  }
  create(value?: PartialMessage<AgentConfig_Hook>): AgentConfig_Hook {
    const message = { name: "", args: "" };
    globalThis.Object.defineProperty(message, MESSAGE_TYPE, {
      enumerable: false,
      value: this,
    });
    if (value !== undefined)
      reflectionMergePartial<AgentConfig_Hook>(this, message, value);
    return message;
  }
  internalBinaryRead(
    reader: IBinaryReader,
    length: number,
    options: BinaryReadOptions,
    target?: AgentConfig_Hook
  ): AgentConfig_Hook {
    let message = target ?? this.create(),
      end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string name */ 1:
          message.name = reader.string();
          break;
        case /* string args */ 2:
          message.args = reader.string();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(
              `Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`
            );
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(
              this.typeName,
              message,
              fieldNo,
              wireType,
              d
            );
      }
    }
    return message;
  }
  internalBinaryWrite(
    message: AgentConfig_Hook,
    writer: IBinaryWriter,
    options: BinaryWriteOptions
  ): IBinaryWriter {
    /* string name = 1; */
    if (message.name !== "")
      writer.tag(1, WireType.LengthDelimited).string(message.name);
    /* string args = 2; */
    if (message.args !== "")
      writer.tag(2, WireType.LengthDelimited).string(message.args);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(
        this.typeName,
        message,
        writer
      );
    return writer;
  }
}
/**
 * @generated MessageType for protobuf message game.agent.AgentConfig.Hook
 */
export const AgentConfig_Hook = new AgentConfig_Hook$Type();
// @generated message type with reflection information, may provide speed optimized methods
class AgentMode$Type extends MessageType<AgentMode> {
  constructor() {
    super("game.agent.AgentMode", [
      { no: 1, name: "training", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
    ]);
  }
  create(value?: PartialMessage<AgentMode>): AgentMode {
    const message = { training: false };
    globalThis.Object.defineProperty(message, MESSAGE_TYPE, {
      enumerable: false,
      value: this,
    });
    if (value !== undefined)
      reflectionMergePartial<AgentMode>(this, message, value);
    return message;
  }
  internalBinaryRead(
    reader: IBinaryReader,
    length: number,
    options: BinaryReadOptions,
    target?: AgentMode
  ): AgentMode {
    let message = target ?? this.create(),
      end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* bool training */ 1:
          message.training = reader.bool();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(
              `Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`
            );
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(
              this.typeName,
              message,
              fieldNo,
              wireType,
              d
            );
      }
    }
    return message;
  }
  internalBinaryWrite(
    message: AgentMode,
    writer: IBinaryWriter,
    options: BinaryWriteOptions
  ): IBinaryWriter {
    /* bool training = 1; */
    if (message.training !== false)
      writer.tag(1, WireType.Varint).bool(message.training);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(
        this.typeName,
        message,
        writer
      );
    return writer;
  }
}
/**
 * @generated MessageType for protobuf message game.agent.AgentMode
 */
export const AgentMode = new AgentMode$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ModelWeights$Type extends MessageType<ModelWeights> {
  constructor() {
    super("game.agent.ModelWeights", [
      { no: 1, name: "weights", kind: "scalar", T: 12 /*ScalarType.BYTES*/ },
    ]);
  }
  create(value?: PartialMessage<ModelWeights>): ModelWeights {
    const message = { weights: new Uint8Array(0) };
    globalThis.Object.defineProperty(message, MESSAGE_TYPE, {
      enumerable: false,
      value: this,
    });
    if (value !== undefined)
      reflectionMergePartial<ModelWeights>(this, message, value);
    return message;
  }
  internalBinaryRead(
    reader: IBinaryReader,
    length: number,
    options: BinaryReadOptions,
    target?: ModelWeights
  ): ModelWeights {
    let message = target ?? this.create(),
      end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* bytes weights */ 1:
          message.weights = reader.bytes();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(
              `Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`
            );
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(
              this.typeName,
              message,
              fieldNo,
              wireType,
              d
            );
      }
    }
    return message;
  }
  internalBinaryWrite(
    message: ModelWeights,
    writer: IBinaryWriter,
    options: BinaryWriteOptions
  ): IBinaryWriter {
    /* bytes weights = 1; */
    if (message.weights.length)
      writer.tag(1, WireType.LengthDelimited).bytes(message.weights);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(
        this.typeName,
        message,
        writer
      );
    return writer;
  }
}
/**
 * @generated MessageType for protobuf message game.agent.ModelWeights
 */
export const ModelWeights = new ModelWeights$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ModelBuffer$Type extends MessageType<ModelBuffer> {
  constructor() {
    super("game.agent.ModelBuffer", [
      { no: 1, name: "buffer", kind: "scalar", T: 12 /*ScalarType.BYTES*/ },
    ]);
  }
  create(value?: PartialMessage<ModelBuffer>): ModelBuffer {
    const message = { buffer: new Uint8Array(0) };
    globalThis.Object.defineProperty(message, MESSAGE_TYPE, {
      enumerable: false,
      value: this,
    });
    if (value !== undefined)
      reflectionMergePartial<ModelBuffer>(this, message, value);
    return message;
  }
  internalBinaryRead(
    reader: IBinaryReader,
    length: number,
    options: BinaryReadOptions,
    target?: ModelBuffer
  ): ModelBuffer {
    let message = target ?? this.create(),
      end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* bytes buffer */ 1:
          message.buffer = reader.bytes();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(
              `Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`
            );
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(
              this.typeName,
              message,
              fieldNo,
              wireType,
              d
            );
      }
    }
    return message;
  }
  internalBinaryWrite(
    message: ModelBuffer,
    writer: IBinaryWriter,
    options: BinaryWriteOptions
  ): IBinaryWriter {
    /* bytes buffer = 1; */
    if (message.buffer.length)
      writer.tag(1, WireType.LengthDelimited).bytes(message.buffer);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(
        this.typeName,
        message,
        writer
      );
    return writer;
  }
}
/**
 * @generated MessageType for protobuf message game.agent.ModelBuffer
 */
export const ModelBuffer = new ModelBuffer$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ModelStatus$Type extends MessageType<ModelStatus> {
  constructor() {
    super("game.agent.ModelStatus", [
      { no: 1, name: "status", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
    ]);
  }
  create(value?: PartialMessage<ModelStatus>): ModelStatus {
    const message = { status: "" };
    globalThis.Object.defineProperty(message, MESSAGE_TYPE, {
      enumerable: false,
      value: this,
    });
    if (value !== undefined)
      reflectionMergePartial<ModelStatus>(this, message, value);
    return message;
  }
  internalBinaryRead(
    reader: IBinaryReader,
    length: number,
    options: BinaryReadOptions,
    target?: ModelStatus
  ): ModelStatus {
    let message = target ?? this.create(),
      end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string status */ 1:
          message.status = reader.string();
          break;
        default:
          let u = options.readUnknownField;
          if (u === "throw")
            throw new globalThis.Error(
              `Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`
            );
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(
              this.typeName,
              message,
              fieldNo,
              wireType,
              d
            );
      }
    }
    return message;
  }
  internalBinaryWrite(
    message: ModelStatus,
    writer: IBinaryWriter,
    options: BinaryWriteOptions
  ): IBinaryWriter {
    /* string status = 1; */
    if (message.status !== "")
      writer.tag(1, WireType.LengthDelimited).string(message.status);
    let u = options.writeUnknownFields;
    if (u !== false)
      (u == true ? UnknownFieldHandler.onWrite : u)(
        this.typeName,
        message,
        writer
      );
    return writer;
  }
}
/**
 * @generated MessageType for protobuf message game.agent.ModelStatus
 */
export const ModelStatus = new ModelStatus$Type();
/**
 * @generated ServiceType for protobuf service game.agent.Agent
 */
export const Agent = new ServiceType("game.agent.Agent", [
  { name: "ResetService", options: {}, I: CommonRequest, O: CommonResponse },
  { name: "QueryService", options: {}, I: CommonRequest, O: ServiceState },
  { name: "GetAgentConfig", options: {}, I: CommonRequest, O: AgentConfig },
  { name: "SetAgentConfig", options: {}, I: AgentConfig, O: CommonResponse },
  { name: "GetAgentMode", options: {}, I: CommonRequest, O: AgentMode },
  { name: "SetAgentMode", options: {}, I: AgentMode, O: CommonResponse },
  { name: "GetModelWeights", options: {}, I: CommonRequest, O: ModelWeights },
  { name: "SetModelWeights", options: {}, I: ModelWeights, O: CommonResponse },
  { name: "GetModelBuffer", options: {}, I: CommonRequest, O: ModelBuffer },
  { name: "SetModelBuffer", options: {}, I: ModelBuffer, O: CommonResponse },
  { name: "GetModelStatus", options: {}, I: CommonRequest, O: ModelStatus },
  { name: "SetModelStatus", options: {}, I: ModelStatus, O: CommonResponse },
  {
    name: "GetAction",
    serverStreaming: true,
    clientStreaming: true,
    options: {},
    I: SimState,
    O: SimAction,
  },
  { name: "Call", options: {}, I: CallData, O: CallData },
]);
