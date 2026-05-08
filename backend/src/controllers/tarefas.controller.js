const prisma = require("../data/prisma");

const novaTarefa = async (req, res) => {
    try {

        const tarefa = req.body;

        const ntarefa = await prisma.tarefa.create({
            data: {
                titulo: tarefa.titulo,
                descricao: tarefa.descricao,
                datainicio: new Date(tarefa.datainicio),
                datafinal: new Date(tarefa.datafinal),
                imgurl: tarefa.imgurl
            }
        });

        return res.status(201).json(ntarefa);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro: "Erro ao cadastrar tarefa"
        });

    }
};

const listTarefa = async (req, res) => {
    try {

        const tarefas = await prisma.tarefa.findMany();

        return res.status(200).json(tarefas);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro: "Erro ao listar tarefas"
        });

    }
};

const buscarTarefa = async (req, res) => {
    try {

        const { id } = req.params;

        const tarefa = await prisma.tarefa.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!tarefa) {
            return res.status(404).json({
                erro: "Tarefa não encontrada"
            });
        }

        return res.status(200).json(tarefa);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro: "Erro ao buscar tarefa"
        });

    }
};

const apagarTarefa = async (req, res) => {
    try {

        const { id } = req.params;

        const tarefa = await prisma.tarefa.delete({
            where: {
                id: Number(id)
            }
        });

        return res.status(200).json(tarefa);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro: "Erro ao deletar tarefa"
        });

    }
};

const atualizarTarefa = async (req, res) => {
    try {

        const { id } = req.params;

        const dados = req.body;

        const tarefa = await prisma.tarefa.update({
            where: {
                id: Number(id)
            },

            data: {
                titulo: dados.titulo,
                descricao: dados.descricao,
                datainicio: new Date(dados.datainicio),
                datafinal: new Date(dados.datafinal),
                imgurl: dados.imgurl
            }
        });

        return res.status(200).json(tarefa);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro: "Erro ao atualizar tarefa"
        });

    }
};

module.exports = {
    novaTarefa,
    listTarefa,
    buscarTarefa,
    apagarTarefa,
    atualizarTarefa
};