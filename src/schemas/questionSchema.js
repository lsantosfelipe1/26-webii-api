import { z } from "zod";
import { positiveIdSchema } from "./idSchema.js";

const difficultySchema = z.union([
    z.number(),
    z.string().regex(/^\d+$/, "Use um número inteiro em formato decimal"),
]).pipe(
    z.coerce
        .number()
        .int("Dificuldade deve ser um número inteiro")
        .min(1, "Dificuldade deve estar entre 1 e 3")
        .max(3, "Dificuldade deve estar entre 1 e 3"),
);

const respostaCorretaSchema = z.union([
    z
        .string()
        .trim()
        .min(1, "Resposta correta nao pode estar vazia")
        .max(500, "Resposta correta deve ter no máximo 500 caracteres"),
    z.null(),
]);

/**
 * Schema para POST /questions.
 */
export const createQuestionSchema = z
    .object({
        enunciado: z
            .string()
            .trim()
            .min(3, "Enunciado deve ter pelo menos 3 caracteres")
            .max(500, "Enunciado deve ter no máximo 500 caracteres"),

        dificuldade: difficultySchema,

        respostaCorreta: respostaCorretaSchema.optional(),

        subjectId: positiveIdSchema,

        authorId: positiveIdSchema,

        ativa: z.boolean().optional(),
    })
    .strict();

/**
 * Schema para PATCH /questions/:id.
 */
export const updateQuestionSchema = z
    .object({
        enunciado: z
            .string()
            .trim()
            .min(3, "Enunciado deve ter pelo menos 3 caracteres")
            .max(500, "Enunciado deve ter no máximo 500 caracteres")
            .optional(),

        dificuldade: difficultySchema.optional(),

        respostaCorreta: respostaCorretaSchema.optional(),

        subjectId: positiveIdSchema.optional(),

        authorId: positiveIdSchema.optional(),

        ativa: z.boolean().optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Envie pelo menos um campo para atualizaçao",
    });

/**
 * Schema para parâmetros :id.
 */
export const questionIdParamSchema = z.object({
    id: positiveIdSchema,
});