import { canConnect, layoutConnections } from "./roadmapGraph.js";

const clean = value => value.replace(/[*_`]/g, "").trim();

function validate(values) {
  const { title, description, category, steps } = values ?? {};
  if (![title, description, category].every(value => typeof value === 'string' && value.trim())
    || title.length > 255 || category.length > 255 || !Array.isArray(steps) || !steps.length || steps.length > 50
    || steps.some(step => typeof step?.title !== 'string' || !step.title.trim() || step.title.length > 255
      || typeof step.description !== 'string' || !step.description.trim())) {
    throw new Error('La respuesta del agente no contiene un roadmap completo. Intenta generarlo nuevamente.');
  }
  const connections = values.connections ?? steps.slice(1).map((_, index) => ({ source: index, target: index + 1 }));
  if (!Array.isArray(connections) || connections.length > 2000) throw new Error('Las conexiones generadas no son validas.');
  const checked = [];
  for (const link of connections) {
    if (!Number.isInteger(link?.source) || !Number.isInteger(link?.target)
      || !canConnect(checked, link.source, link.target, steps.map((_, index) => index))) {
      throw new Error('El agente genero conexiones invalidas o ciclicas. Intenta nuevamente.');
    }
    checked.push({ sourceId: link.source, targetId: link.target });
  }
  const positions = layoutConnections(steps.length, connections);
  return { title: title.trim(), description: description.trim(), category: category.trim(),
    isPublic: false, createdVia: 'AI_AGENT', connections,
    steps: steps.map((step, orderIndex) => ({ title: step.title.trim(), description: step.description.trim(),
      orderIndex, ...positions[orderIndex] })),
  };
}

export function parseGeneratedRoadmap(text, context) {
  const trimmed = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  if (trimmed.startsWith('{')) {
    try { return validate(JSON.parse(trimmed)); }
    catch { throw new Error('El agente devolvió un roadmap con formato inválido. Vuelve a generarlo.'); }
  }
  // Accept the phase-based Markdown used by the existing agent system prompt.
  const lines = text.split(/\r?\n/);
  const steps = [];
  let current;
  for (const line of lines) {
    if (/^\s*(?:#{1,6}\s*)?(?:\*\*)?(?:Fase|M[oó]dulo|Etapa)\s+\d+\b/i.test(line)) {
      current = { title: clean(line.replace(/^\s*#+\s*/, '')), description: '' };
      steps.push(current);
    } else if (current && !/^\s*[-*_]{3,}\s*$/.test(line)) {
      current.description += line + '\n';
    }
  }
  return validate({ title: `Roadmap: ${context.areas.join(', ')}`.slice(0, 255),
    category: context.areas[0], description: `Ruta para ${context.career}. Objetivo: ${context.goal}. ${context.hours} horas por semana.`, steps });
}

export function formatAgentReply(text) {
  try {
    const data = JSON.parse(text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''));
    const roadmap = validate(data);
    return `# ${roadmap.title}\n\n${roadmap.description}\n\n` + roadmap.steps
      .map((step, index) => `## ${index + 1}. ${step.title}\n\n${step.description}`).join('\n\n');
  } catch { return text; }
}
