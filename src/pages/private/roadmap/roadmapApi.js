export async function fetchAllPages(path, { signal, params = {} } = {}, client) {
  const items = [];
  let page = 0;
  while (true) {
    const { data } = await client.get(path, { signal, params: { ...params, page, size: 100 } });
    const content = data.content ?? [];
    items.push(...content);
    if (data.last === true || !content.length || page + 1 >= (data.totalPages ?? 1)) break;
    page += 1;
  }
  return items;
}

export function buildNodes(steps) {
  return [...steps].sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id).map((step, index) => ({
    id: String(step.id), type: 'roadmap',
    position: { x: step.x ?? 360, y: step.y ?? 80 + index * 140 },
    style: { width: 230, height: 68 },
    data: { label: step.title, description: step.description },
  }));
}

export function errorMessage(error, fallback) {
  const data = error.response?.data;
  if (Array.isArray(data)) return data.map(item => item.mensaje || item.message).filter(Boolean).join('. ') || fallback;
  return data?.mensaje || data?.message || data?.error || fallback;
}

export function createRoadmapApi(client) {
  return {
    fetchAllPages: (path, options) => fetchAllPages(path, options, client),
    savePosition: (id, position) => client.put(`/roadmap-step/${id}`, { x: position.x, y: position.y }),
    saveStatus: (stepId, status, existing) => existing
      ? client.put(`/user-step-progress/${existing.id}`, { status })
      : client.post('/user-step-progress', { status, roadmapStepId: Number(stepId) }),
    createRoadmap: values => client.post('/roadmap', { ...values, createdVia: 'MANUAL' }),
    createGeneratedRoadmap: values => client.post('/roadmap', { ...values, createdVia: 'AI_AGENT', isPublic: false }),
    loadConnections: (id, options) => client.get(`/roadmap/${id}/connections`, options),
    saveConnections: (id, graph) => client.put(`/roadmap/${id}/connections`, graph),
    deleteRoadmap: id => client.delete(`/roadmap/${id}`),
    updateStep: (id, values) => client.put(`/roadmap-step/${id}`, values),
    deleteStep: id => client.delete(`/roadmap-step/${id}`),
    createStep: (roadmapId, values) => client.post('/roadmap-step', { ...values, roadmapId }),
  };
}
