import api from "@app/httpClient";

export async function getUsers() {
  try {
    const data = await api.get("/contas");
    return data.contas ?? data;
  } catch (err) {
    console.error("Erro ao buscar Usuários", err);
  }
}

export async function cadastrarUser(data) {
  try {
    return await api.post("/cadastrar-conta", data);
  } catch (err) {
    console.error("Erro ao cadastrar usuário", err);
  }
}

export async function editarUser(data) {
  try {
    return await api.put(`/editar-user/${data.id}`, data);
  } catch (err) {
    console.error("Erro ao editar usuário", err);
  }
}

export async function resetSenha(id) {
  try {
    return await api.put(`/reset-senha/${id}`, {});
  } catch (err) {
    console.error("Erro ao resetar senha", err);
  }
}

export async function deleteUser(id) {
  try {
    return await api.delete(`/delete-user/${id}`);
  } catch (err) {
    console.error("Erro ao deletar usuário", err);
  }
}

export async function getSolicitacoes() {
  try {
    const data = await api.get("/pendentes");
    return data.solicitacoes ?? data;
  } catch (err) {
    console.error("Erro ao buscar solicitações pendentes", err);
  }
}

export async function aproveSolicitacoes(id) {
  try {
    return await api.put(`/aprovar/${id}`, {});
  } catch (err) {
    console.error("Erro ao aprovar proposta", err);
  }
}

export async function deleteSolicitacao(id) {
  try {
    return await api.delete(`/negar/${id}`);
  } catch (err) {
    console.error("Erro ao recusar Solicitação", err);
  }
}