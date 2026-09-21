import prisma from "../config/database.js";
import { NotFoundError } from "../errors/AppError.js";

const publicUserSelect = {
  id: true,
  nome: true,
  email: true,
  papel: true,
  foto: true,
};

const publicSubjectSelect = {
  id: true,
  nome: true,
  ativa: true,
};

const publicQuestionSelect = {
  id: true,
  enunciado: true,
  dificuldade: true,
  respostaCorreta: true,
  ativa: true,
  createdAt: true,
  updatedAt: true,
  subject: { select: publicSubjectSelect },
  author: { select: publicUserSelect },
};

async function checkRelations({ subjectId, authorId }) {
  if (subjectId !== undefined) {
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      select: { id: true },
    });

    if (!subject) {
      throw new NotFoundError(`Matéria com ID ${subjectId} nao encontrada`);
    }
  }

  if (authorId !== undefined) {
    const author = await prisma.user.findUnique({
      where: { id: authorId },
      select: { id: true },
    });

    if (!author) {
      throw new NotFoundError(`Autor com ID ${authorId} nao encontrado`);
    }
  }
}

export async function getAllQuestions() {
  return prisma.question.findMany({
    select: publicQuestionSelect,
    orderBy: { createdAt: "desc" },
  });
}

export async function getQuestionById(questionId) {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: publicQuestionSelect,
  });

  if (!question) {
    throw new NotFoundError(`Questao com ID ${questionId} nao encontrada`);
  }

  return question;
}

export async function createQuestion(data) {
  await checkRelations(data);

  return prisma.question.create({
    data: {
      enunciado: data.enunciado,
      dificuldade: data.dificuldade,
      respostaCorreta: data.respostaCorreta ?? null,
      subjectId: data.subjectId,
      authorId: data.authorId,
      ativa: data.ativa ?? true,
    },
    select: publicQuestionSelect,
  });
}

export async function updateQuestion(questionId, data) {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: { id: true },
  });

  if (!question) {
    throw new NotFoundError(`Questao com ID ${questionId} nao encontrada`);
  }

  await checkRelations(data);

  return prisma.question.update({
    where: { id: questionId },
    data,
    select: publicQuestionSelect,
  });
}

export async function deleteQuestion(questionId) {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: { id: true },
  });

  if (!question) {
    throw new NotFoundError(`Questao com ID ${questionId} nao encontrada`);
  }

  try {
    return await prisma.question.delete({
      where: { id: questionId },
      select: publicQuestionSelect,
    });
  } catch (error) {
    if (error?.code === "P2025") {
      throw new NotFoundError(`Questao com ID ${questionId} nao encontrada`);
    }

    throw error;
  }
}
