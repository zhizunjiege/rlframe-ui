// export common response interface
export interface RestResponse<DataType> {
  code: number;
  msg: string;
  data: DataType;
}

// export database interface
export interface Database {
  agent: {
    id: number;
    name: string;
    description: string;
    create_time?: string;
    update_time?: string;
    type: string;
    hypers: string;
    structs?: string;
    builder?: string;
    states_inputs_func: string;
    outputs_actions_func: string;
    reward_func: string;
    weights?: Blob;
    buffer?: Blob;
    status?: string;
  };
  simenv: {
    id: number;
    name: string;
    description: string;
    create_time?: string;
    update_time?: string;
    type: string;
    args: string;
    params: string;
  };
  task: {
    id: number;
    name: string;
    description: string;
    create_time?: string;
    update_time?: string;
    services: string;
    routes: string;
  };
}

export type DBTables = keyof Database;

// export select options type
export type SelectOptions = {
  id?: number;
  limit?: number;
  offset?: number;
};

// export insert data type
export type InsertData<T extends DBTables> = Omit<Database[T], "id">;

// export update data type
export type UpdateData<T extends DBTables> = Partial<Omit<Database[T], "id">>;

// RestClient class used to communicate with the database
class RestClient {
  private addr: string;

  constructor(addr: string) {
    this.addr = `http://${addr}/api/db`;
  }

  public async select<T extends DBTables>(
    table: T,
    columns: string[] = [],
    options: SelectOptions = {}
  ): Promise<RestResponse<Database[T][]>> {
    const colArgs = columns.map((v) => `columns=${v}`);
    const optArgs = Object.entries(options).map(([k, v]) => `${k}=${v}`);
    const args = [...colArgs, ...optArgs].join("&");
    const response = await fetch(`${this.addr}/${table}?${args}`, {
      method: "GET",
    });
    return response.json();
  }

  public async insert<T extends DBTables>(
    table: T,
    data: InsertData<T>
  ): Promise<RestResponse<{ rowid: number }>> {
    const response = await fetch(`${this.addr}/${table}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  public async update<T extends DBTables>(
    table: T,
    id: number,
    data: UpdateData<T>
  ): Promise<RestResponse<null>> {
    const response = await fetch(`${this.addr}/${table}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  public async delete<T extends DBTables>(
    table: T,
    id: number
  ): Promise<RestResponse<null>> {
    const response = await fetch(`${this.addr}/${table}/${id}`, {
      method: "DELETE",
    });
    return response.json();
  }
}

// export reset client creator
export function createRestClient(addr: string) {
  const client = new RestClient(addr);
  return client;
}
