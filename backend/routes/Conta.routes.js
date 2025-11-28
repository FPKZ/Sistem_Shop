import { Conta } from "../database/models/index.js";
import Solicitacao from "../database/models/Solicitacao.js";
import pedidosRegistros from "../database/pedidos-registros.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// eslint-disable-next-line no-undef
const SECRET = process.env.VITE_CRYPTO_KEY // Em produção, use uma variável de ambiente para armazenar o segredo

export default async function contaRoutes(fastify) {

    fastify.get("/contas", async (request, reply) => {
        try{
            const contas = await Conta.findAll()

            if(!contas) return reply.code(404).send({message: "Nenhuma conta encontrada"})

            reply.code(200).send(contas)
        } catch(err) {
            console.log(err)
            reply.code(500).send({ error: "Erro ao buscar Contas"})
        }
    })

    fastify.post("/login", async (request, reply) => {
        try {
            const { email, senha } = request.body;
            const conta = await Conta.findOne({ where: { email } });

            if(!conta) {
                reply.code(401).send({ error: "Credenciais inválidas", ok: false });
                return
            }
            
            const senhaValida = await bcrypt.compare(senha, conta.senha);

            if(senhaValida) {
                const token = jwt.sign({ id: conta.id, email: conta.email, nome: conta.nome, img: conta.img }, SECRET, { expiresIn: '4h' });
                reply.send({ message: "Login bem-sucedido", conta, token, ok: true });
            } else {
                reply.code(401).send({ error: "Credenciais inválidas", ok: false });
            }

        } catch (err) {
            console.log(err);
            reply.code(500).send({ error: "Erro ao processar login", ok: false });
        }
    });

    fastify.put("/editar-user/:id", async (request, reply) =>{
        try{
            const conta = await Conta.findByPk(request.params.id)
            if(!conta) return reply.code(404).send({ message: "Usuario não encontrado!", ok: false})

            await conta.update(request.body)

            reply.code(200).send({ message: "Usuario alterado com sucesso!", conta, ok: true})
        } catch(err){
            console.log(err)
            reply.code(500).send({ error: "Erro ao alterar usuario", ok: false})
        }
    })
    fastify.put("/reset-senha/:id", async (request, reply) => {
        try{
            const conta = await Conta.findByPk(request.params.id)
            if(!conta) return reply.code(404).send({ message: "Usuario não encontrado!", ok: false})
            
            const senha = "mudar123"

            const senhaHash = await bcrypt.hash(senha, 10)

            await conta.update({ senha: senhaHash })

            reply.code(200).send({ message: "Senha alterada com sucesso!", conta: {senha: senha, ...conta}, ok: true})
        } catch(err){
            console.log(err)
            reply.code(500).send({ error: "Erro ao alterar senha", ok: false})
        }
    })

    fastify.delete("/delete-user/:id", async (request, reply) => {
        try{
            const conta = await Conta.findByPk(request.params.id)
            if(!conta) return reply.code(404).send({ message: "Conta não encontrada", ok: false})

            await conta.destroy()
            reply.code(200).send({ message: "Conta deletada com sucesso", ok: true})
        } catch(err) {
            console.log(err)
            reply.code(500).send({ error: "Erro ao deletar conta", ok: true})
        }
    })

    fastify.post("/cadastrar-conta", async (request, reply) => {
        try {
            const data = request.body;
            const conta = await Conta.findOne({ where: { email: data.email}})
            if(conta) return reply.code(500).send({ message: "Usuario já existe", ok: false})
            data.senha = await bcrypt.hash(data.senha, 10); // Hash da senha antes de salvar

            const novaConta = await Conta.create(data);
            reply.code(201).send({novaConta, ok: true});
        } catch (err) {
            console.log(err);
            reply.code(500).send({ error: "Erro ao cadastrar conta", ok: false });
        }   
    });



    fastify.post("/register", async (request, reply) => {
        try{
            await pedidosRegistros.sync()

            const { nome, email, senha } = request.body
            const conta = await Conta.findOne({ where: { email } })
            if(conta) return reply.code(500).send({ message: "Usuario já existe", ok: false, error: { email: "Email ja cadastrado"}})

            const novaSenha = await bcrypt.hash(senha, 10);

            const novaSolicitacao = await Solicitacao.create({ nome, email, senha: novaSenha })
            reply.code(200).send({ message: "Pedido de registro realizado com sucesso!", novaSolicitacao, ok: true})
        } catch(err) {
            console.log(err)
            reply.code(500).send({ error: "Erro ao realizar pedido de registro!", ok: false})
        }
    })

    fastify.get("/pendentes", async (request, reply) => {
        try{
            const solicitacoes = await Solicitacao.findAll({
                where: { status: "pendente" }
            })

            reply.code(200).send(solicitacoes)
        } catch(err) {
            console.log(err)
            reply.code(500).send({ error: "Erro ao buscar solicitações pendentes"})
        }
    })

    fastify.put("/aprovar/:id", async (request, reply) => {
        try{
            const solicitacao = await Solicitacao.findByPk(request.params.id)
            if(!solicitacao) return reply.code(404).send({ message: "Solicitação não encontrada", ok: false})

            const data = {
                nome: solicitacao.nome,
                email: solicitacao.email,
                senha: solicitacao.senha,
                cargo: "User"
            }
            const novaConta = Conta.create(data)

            await solicitacao.destroy()
            reply.code(200).send({ message: "Solicitação aprovada!", novaConta, ok: true})
        } catch(err) {
            console.log(err)
            reply.code(500).send({ error: "Erro ao aprovar a solicitação", ok: false})
        }
    })
    
    fastify.delete("/negar/:id", async (request, reply) => {
        try{
            const solicitacao = await Solicitacao.findByPk(request.params.id)
            if(!solicitacao) return reply.code(404).send({ erro: "Solicitação não encontrada", ok: false})
        
            await solicitacao.destroy()
            reply.code(200).send({ message: "Solicitação Negada!", ok: true})
            
        } catch(err) {
            console.log(err)
            reply.code(500).send({ error: "Erro ao negar solicitação", ok: false})
        }
    })
}