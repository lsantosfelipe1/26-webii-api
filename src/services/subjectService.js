import prisma from "../config/database.js";
import { ConflictError, NotFoundError } from "../errors/AppError.js";

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
  createdAt: true,
  updatedAt: true,
  professor: { select: publicUserSelect },
};

export async function getAllSubjects() {
  return prisma.subject.findMany({
    select: publicSubjectSelect,
    orderBy: { createdAt: "desc" },
  });
}

export async function getSubjectById(subjectId) {
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    select: publicSubjectSelect,
  });

  if (!subject) {
    throw new NotFoundError(`Matéria com ID ${subjectId} nao encontrada`);
  }

  return subject;
}

export async function createSubject(data) {
  const professor = await prisma.user.findUnique({
    where: { id: data.professorId },
    select: { id: true },
  });

  if (!professor) {
    throw new NotFoundError(
      `Professor com ID ${data.professorId} nao encontrado`,
    );
  }

  return prisma.subject.create({
    data: {
      nome: data.nome,
      professorId: data.professorId,
      ativa: data.ativa ?? true,
    },
    select: publicSubjectSelect,
  });
}

export async function updateSubject(subjectId, data) {
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    select: { id: true },
  });

  if (!subject) {
    throw new NotFoundError(`Matéria com ID ${subjectId} nao encontrada`);
  }

  if (data.professorId !== undefined) {
    const professor = await prisma.user.findUnique({
      where: { id: data.professorId },
      select: { id: true },
    });

    if (!professor) {
      throw new NotFoundError(
        `Professor com ID ${data.professorId} nao encontrado`,
      );
    }
  }

  return prisma.subject.update({
    where: { id: subjectId },
    data,
    select: publicSubjectSelect,
  });
}

export async function deleteSubject(subjectId) {
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    select: {
      id: true,
      _count: {
        select: {
          questions: true,
        },
      },
    },
  });

  if (!subject) {
    throw new NotFoundError(`Matéria com ID ${subjectId} nao encontrada`);
  }

  if (subject._count.questions > 0) {
    throw new ConflictError("Matéria possui questoes vinculadas");
  }

  try {
    return await prisma.subject.delete({
      where: { id: subjectId },
      select: publicSubjectSelect,
    });
  } catch (error) {
    if (error?.code === "P2003" || error?.code === "P2014") {
      throw new ConflictError("Matéria possui questoes vinculadas");
    }

    if (error?.code === "P2025") {
      throw new NotFoundError(`Matéria com ID ${subjectId} nao encontrada`);
    }

    throw error;
  }
}
