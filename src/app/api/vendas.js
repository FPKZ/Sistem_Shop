import api from "@app/httpClient";

// Vendas
export async function getVendaById(id) {
  try {
    return await api.get(`/venda/${id}`);
  } catch (error) {
    console.error("Erro ao buscar Venda por ID", error);
  }
}

export async function postVenda(data) {
  try {
    return await api.post("/venda", data);
  } catch (error) {
    console.error("Erro ao cadastrar venda", error);
  }
}

export async function deleteVenda(id) {
  try {
    await api.delete(`/venda/${id}`);
  } catch (error) {
    console.error("Erro ao deletar venda", error);
  }
}

export async function getVendas() {
  try {
    return await api.get("/vendas");
  } catch (error) {
    console.error("Erro ao buscar Vendas", error);
  }
}

export async function getVendasDashboard() {
  try {
    return await api.get("/vendas/dashboard");
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard", error);
  }
}

export async function putFinalizarVenda(id, data) {
  try {
    return await api.put(`/venda/${id}/finalizar`, data);
  } catch (error) {
    console.error("Erro ao finalizar reserva", error);
  }
}

export async function putEstorno(id) {
  try {
    return await api.put(`/venda/${id}/estorno`, {});
  } catch (error) {
    console.error("Erro ao estornar venda", error);
  }
}

export async function putDevolucao(id, data) {
  try {
    return await api.put(`/venda/${id}/devolucao`, data);
  } catch (error) {
    console.error("Erro ao devolver venda", error);
  }
}

// Notas de Venda
export async function getNotaVendas() {
  try {
    return await api.get("/notasVendas");
  } catch (error) {
    console.error("Erro ao buscar Notas Vendas", error);
  }
}

export async function putNotaVenda(data) {
  try {
    return await api.post("/notaVenda", data);
  } catch (error) {
    console.error("Erro ao cadastrar Nota Venda", error);
  }
}

export async function deleteNotaVenda(id) {
  try {
    await api.delete(`/notaVenda/${id}`);
  } catch (error) {
    console.error("Erro ao deletar Nota Venda", error);
  }
}
