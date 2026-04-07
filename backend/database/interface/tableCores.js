import { Cores } from "../models/index.js";

export default class tableCores {
    constructor() {
        this.table = [
            { id: 1, name: "Azul", hex: "#0000FF" },
            { id: 2, name: "Vermelho", hex: "#FF0000" },
            { id: 3, name: "Verde", hex: "#00FF00" },
            { id: 4, name: "Amarelo", hex: "#FFFF00" },
            { id: 5, name: "Preto", hex: "#000000" },
            { id: 6, name: "Branco", hex: "#FFFFFF" },
            { id: 7, name: "Prata", hex: "#C0C0C0" },
            { id: 8, name: "Dourado", hex: "#FFD700" },
            { id: 9, name: "Bronze", hex: "#CD7F32" },
            { id: 10, name: "Cobre", hex: "#B87333" },
            { id: 11, name: "Azul Marinho", hex: "#000080" },
            { id: 12, name: "Azul Claro", hex: "#ADD8E6" },
            { id: 13, name: "Azul Petróleo", hex: "#0B4C5F" },
            { id: 14, name: "Verde Musgo", hex: "#8A9A5B" },
            { id: 15, name: "Verde Claro", hex: "#90EE90" },
            { id: 16, name: "Verde Água", hex: "#7FFFD4" },
            { id: 17, name: "Verde Oliva", hex: "#808000" },
            { id: 18, name: "Rosa", hex: "#FFC0CB" },
            { id: 19, name: "Rosa Choque", hex: "#FC0FC0" },
            { id: 20, name: "Roxo", hex: "#800080" },
            { id: 21, name: "Lilás", hex: "#C8A2C8" },
            { id: 22, name: "Laranja", hex: "#FFA500" },
            { id: 23, name: "Coral", hex: "#FF7F50" },
            { id: 24, name: "Marrom", hex: "#A52A2A" },
            { id: 25, name: "Bege", hex: "#F5F5DC" },
            { id: 26, name: "Vinho", hex: "#722F37" },
            { id: 27, name: "Cinza Claro", hex: "#D3D3D3" },
            { id: 28, name: "Cinza Escuro", hex: "#A9A9A9" },
            { id: 29, name: "Turquesa", hex: "#40E0D0" },
            { id: 30, name: "Ciano", hex: "#00FFFF" },
        ]
    }

    async seedCoresIniciais() {
        try {
            const quantidadeAtual = await Cores.count()

            if (quantidadeAtual === 0) {
                await Cores.bulkCreate(this.table);
            }
        } catch (error) {
            console.error("Erro ao semear cores:", error);
        }
    }
}