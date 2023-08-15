// task table struct
export type TaskTable = {
  id: number;
  name: string;
  desc?: string;
  create_time?: string;
  update_time?: string;
};

// agent table struct
export type AgentTable = {
  id: number;
  desc?: string;
  create_time?: string;
  update_time?: string;
  training: number; // boolean
  name: string;
  hypers: string; // json
  sifunc: string; // python
  oafunc: string; // python
  rewfunc: string; // python
  hooks: string; // json
};

// simenv table struct
export type SimenvTable = {
  id: number;
  desc?: string;
  create_time?: string;
  update_time?: string;
  name: string;
  args: string; // json
};

// service table struct
export type ServiceTable = {
  id: number;
  desc?: string;
  create_time?: string;
  update_time?: string;
  task_id: number; // foreign key
  server_id: string;
  agent_id?: number; // foreign key
  simenv_id?: number; // foreign key
};

// database tables full structs
export type DBTables = {
  task: TaskTable;
  agent: AgentTable;
  simenv: SimenvTable;
  service: ServiceTable;
};

// RestClient class used to communicate with the database
class RestClient {
  private addr: string;

  constructor(addr: string) {
    this.addr = `http://${addr}/api/db`;
  }

  async select<T extends keyof DBTables>(
    table: T,
    columns: (keyof DBTables[T])[] = [],
    options: { [key in keyof DBTables[T]]?: DBTables[T][key] } = {},
    conjunc: "AND" | "OR" = "AND"
  ): Promise<DBTables[T][]> {
    const colArgs = columns.map((v) => `columns=${v as string}`);
    const optArgs = Object.entries(options).map(([k, v]) => `${k}=${v}`);
    const args = [...colArgs, ...optArgs, `conjunc=${conjunc}`].join("&");
    const response = await fetch(`${this.addr}/${table}?${args}`, {
      method: "GET",
    });
    if (response.ok) {
      const rows = (await response.json()) as DBTables[T][];
      return rows;
    } else {
      throw new Error(response.statusText);
    }
  }

  async insert<T extends keyof DBTables>(
    table: T,
    data: Modified<DBTables[T], { id?: number }>
  ): Promise<{ lastrowid: number }> {
    const row = { ...data } as DBTables[T];
    const response = await fetch(`${this.addr}/${table}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(row),
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  }

  async update<T extends keyof DBTables>(
    table: T,
    data: Modified<Partial<DBTables[T]>, { id: number }>
  ): Promise<{ rowcount: number }> {
    const row = { ...data } as DBTables[T];
    const response = await fetch(`${this.addr}/${table}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(row),
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  }

  async replace<T extends keyof DBTables>(
    table: T,
    data: Partial<DBTables[T]>
  ): Promise<{ lastrowid: number; rowcount: number }> {
    const id = data.id ?? -1;
    if (id < 0) {
      const rst = await this.insert(
        table,
        data as Modified<DBTables[T], { id?: number }>
      );
      return {
        lastrowid: rst.lastrowid,
        rowcount: 1,
      };
    } else {
      const rst = await this.update(
        table,
        data as Modified<Partial<DBTables[T]>, { id: number }>
      );
      return {
        lastrowid: id,
        rowcount: rst.rowcount,
      };
    }
  }

  async delete<T extends keyof DBTables>(
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
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  }
}

// export reset client creator
export function createRestClient(addr: string) {
  const client = new RestClient(addr);
  return client;
}
