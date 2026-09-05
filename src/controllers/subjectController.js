import prisma from "../config/database.js";

const publicUserSelect = {
  id: true,
  nome: true,
  email: true,
};

function toPositiveInt(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

// CREATE - Criar nova matéria
export const create = async (req, res) => {
  try {
    const { nome, professorId } = req.body;

    if (typeof nome !== "string" || !nome.trim() || professorId == undefined) {
      return res.status(400).json({
        success: false,
        message: "Nome e Id do professor sao obrigatórios",
      });
    }

    const professorValido = toPositiveInt(professorId);
    if (!professorValido) {
      return res.status(400).json({
        success: false,
        message: "Id do professor inválido",
      });
    }

    const professor = await prisma.user.findUnique({
      where: { id: professorValido },
    });

    if (!professor) {
      return res.status(404).json({
        success: false,
        message: `Professor com Id ${professorValido} nao encontrado`,
      });
    }

    const novaMateria = await prisma.subject.create({
      data: {
        nome: nome.trim(),
        professorId: professorValido,
      },
      select: {
        id: true,
        nome: true,
        ativa: true,
        createdAt: true,
        professor: {
          select: publicUserSelect,
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Matéria criada com sucesso!",
      data: novaMateria,
    });
  } catch (error) {
    console.error("Erro ao criar matéria:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao criar matéria",
    });
  }
};

// READ - Listar todas as matérias
export const getAll = async (_req, res) => {
  try {
    const materias = await prisma.subject.findMany({
      select: {
        id: true,
        nome: true,
        ativa: true,
        professor: {
          select: publicUserSelect,
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { id: "asc" },
    });

    return res.status(200).json({
      success: true,
      data: materias,
      total: materias.length,
    });
  } catch (error) {
    console.error("Erro ao listar matérias:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao listar matérias",
    });
  }
};

// READ - Buscar matéria por ID
export const getById = async (req, res) => {
  try {
    const subjectId = toPositiveInt(req.params.id);

    if (!subjectId) {
      return res.status(400).json({
        success: false,
        message: "ID inválido. Deve ser um número inteiro positivo",
      });
    }

    const materia = await prisma.subject.findUnique({
      where: { id: subjectId },
      select: {
        id: true,
        nome: true,
        ativa: true,
        createdAt: true,
        updatedAt: true,
        professor: {
          select: publicUserSelect,
        },
      },
    });

    if (!materia) {
      return res.status(404).json({
        success: false,
        message: `Matéria com ID ${subjectId} nao encontrada`,
      });
    }

    return res.status(200).json({
      success: true,
      data: materia,
    });
  } catch (error) {
    console.error("Erro ao buscar matéria:", error);

    return res.status(500).json({
      success: false,
      message: "Erro ao buscar matéria",
    });
  }
};
