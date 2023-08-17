export async function getScenarioList(addr: string, token: string) {
  const res = await fetch(`http://${addr}/api/scenario/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify({
      types: [0],
      pageNum: 0,
      pageSize: 0,
    }),
  });
  const data = await res.json();
  return data.data.list as {
    id: number;
    name: string;
  }[];
}

export async function getExpDesignList(addr: string, token: string) {
  const res = await fetch(`http://${addr}/api/design/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify({
      pageNum: 0,
      pageSize: 0,
    }),
  });
  const data = await res.json();
  return data.data.list as {
    id: number;
    scenarioId: number;
    name: string;
  }[];
}

export async function getScenarioFile(addr: string, token: string, id: number) {
  const res = await fetch(`http://${addr}/api/scenario/unpack`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify({
      id,
      types: [1],
    }),
  });
  const data = await res.json();
  return data.data.scenarioFile as string;
}

export async function getModels(addr: string, token: string, ids: string[]) {
  const res = await fetch(`http://${addr}/api/model/unpack`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify({
      ids,
      types: [0],
    }),
  });
  const data = await res.json();
  return data.data as {
    id: string;
    name: string;
  }[];
}
