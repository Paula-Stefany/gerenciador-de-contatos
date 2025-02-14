import {z} from 'zod';


export const createContactFormSchema = z.object({
    nome: z.string()
        .nonempty('Preencha o nome do usuário.')
        .regex(/^[A-Za-z]+$/i, 'Apenas letras são permitidas'),
    numero: z.string()
        .nonempty('Preencha o número.')
        .refine((value) => {
            const numericValue = value.replace(/\D/g, '');
            return numericValue.length === 11;
            
        }, 'Digite um número de telefone válido'),
        
    email: z.string().email('Email inválido'),
        
    categoria: z.object({
        familia: z.boolean(),
        amigos: z.boolean(),
        colegas: z.boolean()
    })
        .refine(data => Object.values(data).includes(true), {
            message: 'Uma categoria deve ser selecionada'
        })
        
        /// Colocar o certo e se ele não atingir cairá no que estiver {}
        .refine(data => Object.values(data).filter(value => value === true).length === 1, {
            message: 'Somente uma categoria pode ser selecionada'
        })

})

export type createContactFormData = z.infer<typeof createContactFormSchema>

