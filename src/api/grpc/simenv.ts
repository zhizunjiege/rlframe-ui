// @generated by protobuf-ts 2.8.2
// @generated from protobuf file "simenv.proto" (package "game.simenv", syntax proto3)
// tslint:disable
import { CallData } from "./types";
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
 * @generated from protobuf message game.simenv.SimenvConfig
 */
export interface SimenvConfig {
  /**
   * @generated from protobuf field: string type = 1;
   */
  type: string; // type of simenv
  /**
   * @generated from protobuf field: string args = 2;
   */
  args: string; // args of the simenv, format: json string of struct
}
/**
 * @generated from protobuf message game.simenv.SimCmd
 */
export interface SimCmd {
  /**
   * @generated from protobuf field: string type = 1;
   */
  type: string; // cmd: init/start/pause/step/resume/stop/episode/param
  /**
   * @generated from protobuf field: string params = 2;
   */
  params: string; // params of the cmd, format: json string of struct
}
/**
 * @generated from protobuf message game.simenv.SimInfo
 */
export interface SimInfo {
  /**
   * @generated from protobuf field: string state = 1;
   */
  state: string; // sim state: uninited/stopped/running/suspended
  /**
   * @generated from protobuf field: string data = 2;
   */
  data: string; // sim data, format: json string of struct
  /**
   * @generated from protobuf field: string logs = 3;
   */
  logs: string; // sim logs, format: json string of array
}
// @generated message type with reflection information, may provide speed optimized methods
class SimenvConfig$Type extends MessageType<SimenvConfig> {
  constructor() {
    super("game.simenv.SimenvConfig", [
      { no: 1, name: "type", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 2, name: "args", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
    ]);
  }
  create(value?: PartialMessage<SimenvConfig>): SimenvConfig {
    const message = { type: "", args: "" };
    globalThis.Object.defineProperty(message, MESSAGE_TYPE, {
      enumerable: false,
      value: this,
    });
    if (value !== undefined)
      reflectionMergePartial<SimenvConfig>(this, message, value);
    return message;
  }
  internalBinaryRead(
    reader: IBinaryReader,
    length: number,
    options: BinaryReadOptions,
    target?: SimenvConfig
  ): SimenvConfig {
    let message = target ?? this.create(),
      end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string type */ 1:
          message.type = reader.string();
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
    message: SimenvConfig,
    writer: IBinaryWriter,
    options: BinaryWriteOptions
  ): IBinaryWriter {
    /* string type = 1; */
    if (message.type !== "")
      writer.tag(1, WireType.LengthDelimited).string(message.type);
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
 * @generated MessageType for protobuf message game.simenv.SimenvConfig
 */
export const SimenvConfig = new SimenvConfig$Type();
// @generated message type with reflection information, may provide speed optimized methods
class SimCmd$Type extends MessageType<SimCmd> {
  constructor() {
    super("game.simenv.SimCmd", [
      { no: 1, name: "type", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 2, name: "params", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
    ]);
  }
  create(value?: PartialMessage<SimCmd>): SimCmd {
    const message = { type: "", params: "" };
    globalThis.Object.defineProperty(message, MESSAGE_TYPE, {
      enumerable: false,
      value: this,
    });
    if (value !== undefined)
      reflectionMergePartial<SimCmd>(this, message, value);
    return message;
  }
  internalBinaryRead(
    reader: IBinaryReader,
    length: number,
    options: BinaryReadOptions,
    target?: SimCmd
  ): SimCmd {
    let message = target ?? this.create(),
      end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string type */ 1:
          message.type = reader.string();
          break;
        case /* string params */ 2:
          message.params = reader.string();
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
    message: SimCmd,
    writer: IBinaryWriter,
    options: BinaryWriteOptions
  ): IBinaryWriter {
    /* string type = 1; */
    if (message.type !== "")
      writer.tag(1, WireType.LengthDelimited).string(message.type);
    /* string params = 2; */
    if (message.params !== "")
      writer.tag(2, WireType.LengthDelimited).string(message.params);
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
 * @generated MessageType for protobuf message game.simenv.SimCmd
 */
export const SimCmd = new SimCmd$Type();
// @generated message type with reflection information, may provide speed optimized methods
class SimInfo$Type extends MessageType<SimInfo> {
  constructor() {
    super("game.simenv.SimInfo", [
      { no: 1, name: "state", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 2, name: "data", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
      { no: 3, name: "logs", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
    ]);
  }
  create(value?: PartialMessage<SimInfo>): SimInfo {
    const message = { state: "", data: "", logs: "" };
    globalThis.Object.defineProperty(message, MESSAGE_TYPE, {
      enumerable: false,
      value: this,
    });
    if (value !== undefined)
      reflectionMergePartial<SimInfo>(this, message, value);
    return message;
  }
  internalBinaryRead(
    reader: IBinaryReader,
    length: number,
    options: BinaryReadOptions,
    target?: SimInfo
  ): SimInfo {
    let message = target ?? this.create(),
      end = reader.pos + length;
    while (reader.pos < end) {
      let [fieldNo, wireType] = reader.tag();
      switch (fieldNo) {
        case /* string state */ 1:
          message.state = reader.string();
          break;
        case /* string data */ 2:
          message.data = reader.string();
          break;
        case /* string logs */ 3:
          message.logs = reader.string();
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
    message: SimInfo,
    writer: IBinaryWriter,
    options: BinaryWriteOptions
  ): IBinaryWriter {
    /* string state = 1; */
    if (message.state !== "")
      writer.tag(1, WireType.LengthDelimited).string(message.state);
    /* string data = 2; */
    if (message.data !== "")
      writer.tag(2, WireType.LengthDelimited).string(message.data);
    /* string logs = 3; */
    if (message.logs !== "")
      writer.tag(3, WireType.LengthDelimited).string(message.logs);
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
 * @generated MessageType for protobuf message game.simenv.SimInfo
 */
export const SimInfo = new SimInfo$Type();
/**
 * @generated ServiceType for protobuf service game.simenv.Simenv
 */
export const Simenv = new ServiceType("game.simenv.Simenv", [
  { name: "ResetService", options: {}, I: CommonRequest, O: CommonResponse },
  { name: "QueryService", options: {}, I: CommonRequest, O: ServiceState },
  { name: "GetSimenvConfig", options: {}, I: CommonRequest, O: SimenvConfig },
  { name: "SetSimenvConfig", options: {}, I: SimenvConfig, O: CommonResponse },
  { name: "SimControl", options: {}, I: SimCmd, O: CommonResponse },
  { name: "SimMonitor", options: {}, I: CommonRequest, O: SimInfo },
  { name: "Call", options: {}, I: CallData, O: CallData },
]);
