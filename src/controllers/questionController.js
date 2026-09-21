import * as questionService from "../services/questionService.js";

/**
 * Cria uma questao com dados já validados pelo middleware.
 */
export async function create(req, res, next) {
    try {
        const data = await questionService.createQuestion(req.body);

        res.status(201).json({
            success: true,
            message: "Questao criada com sucesso",
            data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Lista todas as questões.
 */
export async function getAll(_req, res, next) {
    try {
        const data = await questionService.getAllQuestions();

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
 * Busca uma questao pelo ID já validado.
 */
export async function getById(req, res, next) {
    try {
        const data = await questionService.getQuestionById(req.params.id);

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Atualiza parcialmente uma questao.
 */
export async function update(req, res, next) {
    try {
        const data = await questionService.updateQuestion(
            req.params.id,
            req.body,
        );

        res.status(200).json({
            success: true,
            message: "Questao atualizada com sucesso",
            data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Remove uma questao.
 */
export async function remove(req, res, next) {
    try {
        const data = await questionService.deleteQuestion(req.params.id);

        res.status(200).json({
            success: true,
            message: "Questao removida com sucesso",
            data,
        });
    } catch (error) {
        next(error);
    }
}