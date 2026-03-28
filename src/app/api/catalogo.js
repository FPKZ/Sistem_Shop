const back = import.meta.env.VITE_BACKEND_URL

async function getProduto({ categoria = "", nome = "" }) {
  try {
    //console.log({item, nome})
    const produtos = await (
      await fetch(`${back}/catalogo?categoria=${categoria}&nome=${nome}`, {
        method: "GET",
      })
    ).json();
    //console.log(produtos);
    return produtos;
  } catch (error) {
    console.error("Erro ao buscar produtos", error);
  }
}

async function postPedido(pedido){
  try{
    const response = await fetch(`${back}/pedido`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pedido),
    });
    const result = await response.json();
    return result;
  }catch(error){
    console.error("Erro ao fazer pedido", error);
  }
}

export {
  getProduto,
  postPedido
}