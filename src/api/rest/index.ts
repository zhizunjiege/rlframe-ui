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
  task: number; // foreign key
  server: string;
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
  task: number; // foreign key
  server: string;
  name: string;
  args: string; // json
};

// database tables full structs
export type DBTables = {
  task: TaskTable;
  agent: AgentTable;
  simenv: SimenvTable;
};

export type Task = {
  task: TaskTable;
  agents: AgentTable[];
  simenvs: SimenvTable[];
};

export type TaskIds = {
  task: number;
  agents: number[];
  simenvs: number[];
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
    conjunc: "AND" | "OR" = "AND",
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
    data: Modified<DBTables[T], { id?: number }>,
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
    data: Modified<Partial<DBTables[T]>, { id: number }>,
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
    data: Partial<DBTables[T]>,
  ): Promise<{ lastrowid: number; rowcount: number }> {
    const id = data.id ?? -1;
    if (id < 0) {
      const rst = await this.insert(
        table,
        data as Modified<DBTables[T], { id?: number }>,
      );
      return {
        lastrowid: rst.lastrowid,
        rowcount: 1,
      };
    } else {
      const rst = await this.update(
        table,
        data as Modified<Partial<DBTables[T]>, { id: number }>,
      );
      return {
        lastrowid: id,
        rowcount: rst.rowcount,
      };
    }
  }

  async delete<T extends keyof DBTables>(
    table: T,
    ids: number[],
  ): Promise<{ rowcount: number }> {
    const args = ids.map((v) => `ids=${v}`).join("&");
    const response = await fetch(`${this.addr}/${table}?${args}`, {
      method: "DELETE",
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  }

  async setTask(task: Task): Promise<TaskIds> {
    const response = await fetch(`${this.addr}/task/set`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(response.statusText);
    }
  }

  async getTask(id: number): Promise<Task> {
    const response = await fetch(`${this.addr}/task/${id}`, {
      method: "GET",
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(response.statusText);
    }
  }

  async delTask(ids: number[]): Promise<void> {
    const args = ids.map((v) => `ids=${v}`).join("&");
    const response = await fetch(`${this.addr}/task/del?${args}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  }
}

// export reset client creator
export function createRestClient(addr: string) {
  const client = new RestClient(addr);
  return client;
}
