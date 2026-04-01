import api from "@app/httpClient";

export async function getNotas() {
  try {
    const data = await api.get("/notas");
    return data;
  } catch (error) {
    console.error("Erro ao buscar notas", error);
  }
}

export async function postNota(data) {
  try {
    return await api.post("/nota", data);
  } catch (error) {
    console.error("Erro ao cadastrar nota", error);
  }
}

export async function putNota(id, data) {
  try {
    return await api.put(`/nota/${id}`, data);
  } catch (err) {
    console.error("Erro ao editar nota", err);
  }
}

export async function deleteNotas(id) {
  try {
    await api.delete(`/nota/${id}`);
  } catch (err) {
    console.error("Erro ao deletar Nota", err);
  }
}