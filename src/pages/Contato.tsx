import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FormField, inputClass } from '../components/FormField'
import Button from '../components/Button'

interface ContactFormData {
  nome: string
  email: string
  telefone?: string
  assunto?: string
  mensagem: string
}

const contactInfo = [
  { icon: '📧', label: 'Presidente',    value: 'turmadobem@tdb.org.br' },
  { icon: '📢', label: 'Comunicação',   value: 'comunicacao@tdb.org.br' },
  { icon: '💬', label: 'Fale Conosco',  value: 'faleconosco@tdb.org.br' },
  { icon: '📞', label: 'Telefone',      value: '+55 (11) 5084-7276' },
]

export default function Contato() {
  useEffect(() => { document.title = 'Contato | De Novo Não!' }, [])

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>()

  const onSubmit = (data: ContactFormData) => {
    console.log('Contato enviado:', data)
    alert('Mensagem enviada com sucesso!')
    reset()
  }

  return (
    <>
      <section className="text-center py-20 px-6 bg-gradient-to-br from-tdb-teal to-tdb-green text-white">
        <h1 className="font-display font-extrabold text-4xl mb-4 animate-fade-in-up">Entre em Contato</h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto font-body">
          Envie suas dúvidas ou sugestões para a equipe Da Turma do Bem.
        </p>
      </section>

      <section className="py-14 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <h2 className="font-display font-bold text-tdb-teal text-2xl">Formulário de Contato</h2>

          <FormField label="Seu nome" error={errors.nome?.message} required>
            <input type="text" {...register('nome', { required: 'Nome é obrigatório' })} className={inputClass} placeholder="Nome completo" />
          </FormField>

          <FormField label="Seu e-mail" error={errors.email?.message} required>
            <input type="email" {...register('email', {
              required: 'E-mail é obrigatório',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' },
            })} className={inputClass} placeholder="email@exemplo.com" />
          </FormField>

          <FormField label="Telefone">
            <input type="tel" {...register('telefone')} className={inputClass} placeholder="(11) 99999-9999" />
          </FormField>

          <FormField label="Assunto">
            <input type="text" {...register('assunto')} className={inputClass} placeholder="Assunto da mensagem" />
          </FormField>

          <FormField label="Mensagem" error={errors.mensagem?.message} required>
            <textarea rows={4} {...register('mensagem', { required: 'Mensagem é obrigatória' })}
              className={inputClass + ' resize-y'} placeholder="Escreva sua mensagem..." />
          </FormField>

          <Button type="submit" size="lg" className="w-full">Enviar Mensagem</Button>
        </form>

        {/* Informações */}
        <div>
          <h2 className="font-display font-bold text-tdb-teal text-2xl mb-6">Informações</h2>
          <div className="space-y-4">
            {contactInfo.map((c) => (
              <div key={c.label} className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="text-xs text-gray-400 font-body uppercase tracking-wide">{c.label}</p>
                  <p className="text-tdb-teal font-semibold font-body text-sm">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-tdb-teal/5 rounded-2xl p-4 border border-tdb-teal/10">
            <p className="text-tdb-teal font-body text-sm">
              📍 Rua Maurício Francisco Klabin, 449 — Vila Mariana, São Paulo - SP, 04120-020
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
