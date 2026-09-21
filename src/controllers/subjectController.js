import * as subjectService from "../services/subjectService.js";

/**
 * Cria uma matéria com dados já validados pelo middleware.
 */
export async function create(req, res, next) {
    try {
        const data = await subjectService.createSubject(req.body);

        res.status(201).json({
            success: true,
            message: "Matéria criada com sucesso",
            data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Lista todas as matérias.
 */
export async function getAll(_req, res, next) {
    try {
        const data = await subjectService.getAllSubjects();

        res.status(200).json({
            success: true,
            data,
            total: data.length,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Busca uma matéria pelo ID já validado pelo middleware.
 */
export async function getById(req, res, next) {
    try {
        const data = await subjectService.getSubjectById(req.params.id);

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Atualiza parcialmente uma matéria.
 */
export async function update(req, res, next) {
    try {
        const data = await subjectService.updateSubject(
            req.params.id,
            req.body,
        );

        res.status(200).json({
            success: true,
            message: "Matéria atualizada com sucesso",
            data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Remove uma matéria sem questões vinculadas.
 */
export async function remove(req, res, next) {
    try {
        const data = await subjectService.deleteSubject(req.params.id);

        res.status(200).json({
            success: true,
            message: "Matéria removida com sucesso",
            data,
        });
    } catch (error) {
        next(error);
    }
}