import { randomUUID } from "node:crypto"

export class database{
  #videos = new Map()


  list(query){
    // return Array.from(this.#videos.entries()).filter(videos => {
    //   console.log(videos)
    //   if (query){
    //     return videos.titulo.includes(query)
    //   }
    //   return true;
    // }) // converte em array
    // assim retorna tudo em um objeto inves de separar o id das informações do video
    return Array.from(this.#videos.entries())
      .map((video) => {
        const id = video[0]
        const data = video[1]

        return {
          id,
          ...data,
        }
      })
      .filter(videos => {
        if (query){
          return videos.titulo.includes(query)
        }
        return true;
      })
  }

  create(video){
    const videoid = randomUUID()

    this.#videos.set(videoid, video)
  }

  atualizar(id, video){
    this.#videos.set(id, video)
  }

  delete(id){
    this.#videos.delete(id)
  }
}