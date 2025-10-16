import { Conta } from "../database/models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.VITE_CRYPTO_KEY // Em produção, use uma variável de ambiente para armazenar o segredo

export default async function contaRoutes(fastify) {
    fastify.post("/login", async (request, reply) => {
        try {
            const { email, senha } = request.body;
            const conta = await Conta.findOne({ where: { email } });

            if(!conta) {
                reply.code(401).send({ error: "Credenciais inválidas" });
                return
            }
            
            const senhaValida = await bcrypt.compare(senha, conta.senha);

            if(senhaValida) {
                const token = jwt.sign({ id: conta.id, email: conta.email, nome: conta.nome, img: conta.img }, SECRET, { expiresIn: '1h' });
                reply.send({ message: "Login bem-sucedido", conta, token, ok: true });
            } else {
                reply.code(401).send({ error: "Credenciais inválidas" });
            }

        } catch (err) {
            console.log(err);
            reply.code(500).send({ error: "Erro ao processar login" });
        }
    });

    fastify.post("/conta", async (request, reply) => {
        try {
            const data = request.body;
            data.senha = await bcrypt.hash(data.senha, 10); // Hash da senha antes de salvar

            const novaConta = await Conta.create(data);
            reply.code(201).send(novaConta);
        } catch (err) {
            console.log(err);
            reply.code(500).send({ error: "Erro ao cadastrar conta" });
        }   
    });
}