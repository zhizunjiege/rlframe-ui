import { base64decode, base64encode } from "@protobuf-ts/runtime";

// dictionary
type AnyDict = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: any;
};

// export agent table struct
export type AgentTable = {
  id: number;
  name: string;
  description: string;
  create_time?: string;
  update_time?: string;
  type: string;
  hypers: AnyDict;
  sifunc: string;
  oafunc: string;
  rewfunc: string;
  weights?: Uint8Array;
  buffer?: Uint8Array;
  status?: AnyDict;
};

// export simenv table struct
export type SimenvTable = {
  id: number;
  name: string;
  description: string;
  create_time?: string;
  update_time?: string;
  type: string;
  args: AnyDict;
  params?: AnyDict;
};

// export task table struct
export type TaskTable = {
  id: number;
  name: string;
  description: string;
  create_time?: string;
  update_time?: string;
  services: {
    [key: string]: {
      infos: {
        type: string;
        name: string;
        host: string;
        port: number;
        desc: string;
      };
      configs: number;
    };
  };
  routes?: {
    [key: string]: {
      [key: string]: string[];
    };
  };
};

// database tables full structs
type DBTables = {
  agent: AgentTable;
  simenv: SimenvTable;
  task: TaskTable;
};

// database tables meta infos
type DBTablesMeta = {
  [table in keyof DBTables]: {
    [column in keyof DBTables[table]]: {
      type: string;
      notnull: boolean;
    };
  };
};

// select options
type SelectOptions = {
  id?: number;
  limit?: number;
  offset?: number;
};

// RestClient class used to communicate with the database
class RestClient {
  private addr: string;

  private tables: Nullable<DBTablesMeta>;

  constructor(addr: string) {
    this.addr = `http://${addr}/api/db`;
    this.tables = null;
  }

  public async meta() {
    const response = await fetch(this.addr, { method: "GET" });
    this.tables = (await response.json()) as DBTablesMeta;
  }

  public async select<T extends keyof DBTables>(
    table: T,
    columns: (keyof DBTables[T])[] = [],
    options: SelectOptions = {}
  ): Promise<DBTables[T][]> {
    const colArgs = columns.map((v) => `columns=${v as string}`);
    const optArgs = Object.entries(options).map(([k, v]) => `${k}=${v}`);
    const args = [...colArgs, ...optArgs].join("&");
    const response = await fetch(`${this.addr}/${table}?${args}`, {
      method: "GET",
    });
    const rows = (await response.json()) as DBTables[T][];
    for (const row of rows) {
      this.decode(table, row);
    }
    return rows;
  }

  public async insert<T extends keyof DBTables>(
    table: T,
    data: DBTables[T]
  ): Promise<{ lastrowid: number }> {
    const row = { ...data } as DBTables[T];
    this.encode(table, row);
    const response = await fetch(`${this.addr}/${table}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(row),
    });
    return response.json();
  }

  public async update<T extends keyof DBTables>(
    table: T,
    data: Partial<DBTables[T]>
  ): Promise<{ rowcount: number }> {
    const row = { ...data } as DBTables[T];
    this.encode(table, row);
    const response = await fetch(`${this.addr}/${table}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(row),
    });
    return response.json();
  }

  public async replace<T extends keyof DBTables>(
    table: T,
    data: Partial<DBTables[T]>
  ): Promise<{ lastrowid: number; rowcount: number }> {
    const id = data.id;
    if (id !== undefined) {
      if (id < 0) {
        const rst = await this.insert(table, data as DBTables[T]);
        return {
          lastrowid: rst.lastrowid,
          rowcount: 1,
        };
      } else {
        const rst = await this.update(table, data);
        return {
          lastrowid: id,
          rowcount: rst.rowcount,
        };
      }
    } else {
      throw new Error("Id is required");
    }
  }

  public async delete<T extends keyof DBTables>(
    table: T,
    ids: number[]
  ): Promise<{ rowcount: number }> {
    const response = await fetch(`${this.addr}/${table}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });
    return response.json();
  }

  /*
   * decode base64 to binary and json to object inplace
   */
  private decode<T extends keyof DBTables>(table: T, row: DBTables[T]) {
    const meta = this.tables?.[table];
    for (const key in row) {
      if (meta?.[key].type === "BLOB") {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        row[key] = base64decode(row[key] as string) as any;
      } else if (meta?.[key].type === "JSON") {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        row[key] = JSON.parse(row[key] as string);
      }
    }
  }

  /*
   * encode binary to base64 and object to json inplace
   */
  private encode<T extends keyof DBTables>(table: T, row: DBTables[T]) {
    const meta = this.tables?.[table];
    for (const key in row) {
      if (meta?.[key].type === "BLOB") {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        row[key] = base64encode(row[key] as Uint8Array) as any;
      } else if (meta?.[key].type === "JSON") {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        row[key] = JSON.stringify(row[key]) as any;
      }
    }
  }
}

// export reset client creator
export function createRestClient(addr: string) {
  const client = new RestClient(addr);
  return client;
}
