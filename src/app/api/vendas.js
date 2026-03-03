const back = import.meta.env.VITE_BACKEND_URL;

//venda
export async function getVendaById(id) {
  try {
    const response = await fetch(`${back}/venda/${id}`, { method: "GET" });
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar Venda por ID", error);
  }
}

export async function postVenda(data) {
  try {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${back}/venda`, {
      method: "POST",
      headers: isFormData
        ? {}
        : {
            "Content-Type": "application/json",
          },
      body: isFormData ? data : JSON.stringify(data),
    });
    //console.log(response.status)
    return await response.json();
  } catch (error) {
    console.error("Erro ao cadastrar venda", error);
  }
}

export async function deleteVenda(id) {
  try {
    await fetch(`${back}/venda/${id}`, { method: "DELETE" });
  } catch (error) {
    console.error("Erro ao deletar venda", error);
  }
}

//nota vendas

export async function getNotaVendas() {
  try {
    const notavendas = await (
      await fetch(`${back}/notasVendas`, { method: "GET" })
    ).json();
    return notavendas;
  } catch (error) {
    console.error("Erro ao buscar Notas Vendas", error);
  }
}

export async function putNotaVenda(data) {
  try {
    const response = await fetch(`${back}/notaVenda`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    //console.log(response.status)
    return response;
  } catch (error) {
    console.error("Erro ao cadastrar Nota Venda", error);
  }
}

export async function deleteNotaVenda(id) {
  try {
    await fetch(`${back}/notaVenda/${id}`, { method: "DELETE" });
  } catch (error) {
    console.error("Erro ao deleter Nota Venda", error);
  }
}

// Estorno e Devolucao
export async function putEstorno(id) {
  try {
    const response = await fetch(`${back}/venda/${id}/estorno`, {
      method: "PUT",
    });
    return await response.json();
  } catch (error) {
    console.error("Erro ao estornar venda", error);
  }
}

export async function putDevolucao(id, data) {
  try {
    const response = await fetch(`${back}/venda/${id}/devolucao`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Erro ao devolver venda", error);
  }
}
export async function getVendas() {
  try {
    const response = await fetch(`${back}/vendas`, { method: "GET" });
    const vendas = await response.json();
    console.log(vendas);
    return vendas;
  } catch (error) {
    console.error("Erro ao buscar Vendas", error);
  }
}

export async function getVendasDashboard() {
  try {
    const response = await fetch(`${back}/vendas/dashboard`, { method: "GET" });
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard", error);
  }
}

export async function putFinalizarVenda(id, data) {
  try {
    const response = await fetch(`${back}/venda/${id}/finalizar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Erro ao finalizar reserva", error);
  }
}
