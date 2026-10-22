export function apiError(error, fallback) {
  const data = error.response?.data;
  if (Array.isArray(data)) return data.map(item => item.mensaje || item.message).filter(Boolean).join('. ') || fallback;
  return data?.mensaje || data?.message || error.message || fallback;
}

export function rankCareers(options) {
  const scores = new Map();
  for (const option of options) {
    for (const [career, score] of Object.entries(option.careerScore ?? {})) {
      if (career.trim() && Number.isFinite(score)) scores.set(career, (scores.get(career) ?? 0) + score);
    }
  }
  return [...scores].map(([career, score]) => ({ career, score }))
    .sort((a, b) => b.score - a.score || a.career.localeCompare(b.career, 'es'));
}

export function prepareResult(questions, answers) {
  if (!questions.length) throw new Error('No hay preguntas disponibles.');
  const selected = questions.map(question => {
    const option = question.opciones.find(item => String(item.id) === String(answers[question.id]));
    if (!option) throw new Error('Responde todas las preguntas antes de finalizar.');
    return option;
  });
  const ranking = rankCareers(selected);
  if (!ranking.length || ranking[0].score <= 0) {
    throw new Error('Las opciones seleccionadas no tienen puntajes suficientes para calcular el resultado.');
  }
  return { suggestedCareer: ranking[0].career, vocacionalOptionIds: selected.map(option => option.id) };
}

export function createVocationalApi(client) {
  async function pages(path, signal, visit) {
    let page = 0;
    const items = [];
    while (true) {
      const { data } = await client.get(path, { signal, params: { page, size: 100, sort: 'id,asc' } });
      const content = data.content ?? [];
      if (visit) {
        const match = visit(content);
        if (match) return match;
      } else items.push(...content);
      if (!content.length || data.last === true || page + 1 >= (data.totalPages ?? 1)) break;
      page += 1;
    }
    return visit ? null : items;
  }

  async function findResult(userId, signal) {
    return pages('/vocational-test-result', signal,
      content => content.find(item => String(item.userId) === String(userId)));
  }

  return {
    findResult,
    async load(signal) {
      const { data: user } = await client.get('/me', { signal });
      const result = await findResult(user.id, signal);
      if (result) return { userId: user.id, result, questions: [] };
      const listed = await pages('/vocational-question', signal);
      const questions = listed.map(question => ({
        id: question.id, texto: question.text,
        opciones: (question.vocacionalOptions ?? []).map(option => ({
          id: option.id, texto: option.text, careerScore: option.careerScore,
        })),
      }));
      if (questions.some(question => !question.opciones.length)) {
        throw new Error('Hay preguntas sin opciones configuradas. Intenta nuevamente cuando el test esté disponible.');
      }
      return { userId: user.id, result: null, questions };
    },
    async submit(userId, questions, answers) {
      const payload = prepareResult(questions, answers);
      // Also check on retries: a previous request may have saved before losing its response.
      const previous = await findResult(userId);
      if (previous) return previous;
      try {
        const { data } = await client.post('/vocational-test-result', payload);
        return data;
      } catch (error) {
        if (error.response?.status === 409) {
          const saved = await findResult(userId);
          if (saved) return saved;
        }
        throw error;
      }
    },
  };
}
