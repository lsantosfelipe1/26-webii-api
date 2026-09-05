import prisma from "../config/database.js";

const publicUserSelect = {
  id: true,
  nome: true,
  email: true,
};

const publicSubjectSelect = {
  id: true,
  nome: true,
};

function toPositiveInt(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

// CREATE - Criar nova questão
export const create = async (req, res) => {
  try {
    const { enunciado, dificuldade, respostaCorreta, subjectId, authorId } =
      req.body;

    if (
      typeof enunciado !== "string" ||
      !enunciado.trim() ||
      dificuldade === undefined ||
      subjectId === undefined ||
      authorId === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Enunciado, dificuldade, matéria e autor sao obrigatórios",
      });
    }

    const dificuldadeValida = Number(dificuldade);
    const materiaValida = toPositiveInt(subjectId);
    const autorValido = toPositiveInt(authorId);

    if (
      !Number.isInteger(dificuldadeValida) ||
      ![1, 2, 3].includes(dificuldadeValida)
    ) {
      return res.status(400).json({
        success: false,
        message: "Dificuldade deve ser 1, 2 ou 3",
      });
    }

    if (!materiaValida || !autorValido) {
      return res.status(400).json({
        success: false,
        message: "subjectId e authorId devem ser números inteiros positivos",
      });
    }

    const subject = await prisma.subject.findUnique({
      where: {
        id: materiaValida,
      },
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: `Matéria com ID ${materiaValida} nao encontrada`,
      });
    }

    const author = await prisma.user.findUnique({
      where: {
        id: autorValido,
      },
    });

    if (!author) {
      return res.status(404).json({
        success: false,
        message: `Autor com ID ${autorValido} nao encontrado`,
      });
    }

    const novaQuestao = await prisma.question.create({
      data: {
        enunciado: enunciado.trim(),
        dificuldade: dificuldadeValida,
        respostaCorreta: respostaCorreta?.trim() || null,
        subjectId: materiaValida,
        authorId: autorValido,
      },
      select: {
        id: true,
        enunciado: true,
        dificuldade: true,
        respostaCorreta: true,
        ativa: true,
        subject: {
          select: publicSubjectSelect,
        },
        author: {
          select: publicUserSelect,
        },
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Questao criada com sucesso",
      data: novaQuestao,
    });
  } catch (error) {
    console.error("Erro ao criar questao:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao criar questao",
    });
  }
};

// READ - Listar questões
export const getAll = async (_req, res) => {
  try {
    const questoes = await prisma.question.findMany({
      select: {
        id: true,
        enunciado: true,
        dificuldade: true,
        respostaCorreta: true,
        ativa: true,
        createdAt: true,
        updatedAt: true,
        subject: {
          select: publicSubjectSelect,
        },
        author: {
          select: publicUserSelect,
        },
      },
      orderBy: { id: "asc" },
    });

    return res.status(200).json({
      success: true,
      data: questoes,
      total: questoes.length,
    });
  } catch (error) {
    console.error("Erro ao listar questoes:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao listar questoes",
    });
  }
};

// READ - Buscar questão por ID
export const getById = async (req, res) => {
  try {
    const questionId = toPositiveInt(req.params.id);

    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: "ID inválido. Deve ser um número inteiro positivo",
      });
    }

    const questao = await prisma.question.findUnique({
      where: { id: questionId },
      select: {
        id: true,
        enunciado: true,
        dificuldade: true,
        respostaCorreta: true,
        ativa: true,
        createdAt: true,
        updatedAt: true,
        subject: {
          select: publicSubjectSelect,
        },
        author: {
          select: publicUserSelect,
        },
      },
    });

    if (!questao) {
      return res.status(404).json({
        success: false,
        message: `Questão com ID ${questionId} não encontrada`,
      });
    }

    return res.status(200).json({
      success: true,
      data: questao,
    });
  } catch (error) {
    console.error("Erro ao buscar questão:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao buscar questão",
    });
  }
};
