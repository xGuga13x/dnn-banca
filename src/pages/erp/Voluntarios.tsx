import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Voluntario } from '../../types'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { FormField, inputClass } from '../../components/FormField'
import Badge from '../../components/Badge'
import EmptyState from '../../components/EmptyState'
import { formatCPF } from '../../utils/formatters'

const mockVoluntarios: Voluntario[] = [
  { id: 1, idVoluntario: 1, nome: 'Fernanda Lima',   cpf: '44455566677', email: 'fernanda@email.com', telefone: '11977770001', dataNascimento: '1993-08-20', area: 'Recepção',        ativo: true  },
  { id: 2, idVoluntario: 2, nome: 'Rafael Souza',    cpf: '55566677788', email: 'rafael@email.com',   telefone: '11977770002', dataNascimento: '1988-04-12', area: 'Logística',       ativo: true  },
  { id: 3, idVoluntario: 3, nome: 'Camila Torres',   cpf: '66677788899', email: 'camila@email.com',   telefone: '11977770003', dataNascimento: '2001-01-30', area: 'Comunicação',     ativo: false },
]

type FormData = Omit<Voluntario, 'id' | 'idVoluntario' | 'ativo'>

export default function Voluntarios() {
  useEffect(() => { document.title = 'Voluntários | De Novo Não! ERP' }, [])

  const [voluntarios, setVoluntarios] = useState<Voluntario[]>(mockVoluntarios)
  const [search, setSearch]           = useState('')
  const [modalOpen, setModalOpen]     = useState(false)
  const [editing, setEditing]         = useState<Voluntario | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  const filtered = voluntarios.filter((v) =>
    v.nome.toLowerCase().includes(search.toLowerCase())
  )

  const openNew = () => { setEditing(null); reset(); setModalOpen(true) }
  const openEdit = (v: Voluntario) => {
    setEditing(v)
    reset({ nome: v.nome, cpf: v.cpf, email: v.email, telefone: v.telefone, dataNascimento: v.dataNascimento, area: v.area })
    setModalOpen(true)
  }
  const handleToggle = (id: number) => {
    setVoluntarios((prev) => prev.map((v) => v.id === id ? { ...v, ativo: !v.ativo } : v))
  }
  const onSubmit = (data: FormData) => {
    if (editing) {
      setVoluntarios((prev) => prev.map((v) => v.id === editing.id ? { ...v, ...data } : v))
    } else {
      setVoluntarios((prev) => [...prev, { ...data, id: Date.now(), idVoluntario: Date.now(), ativo: true }])
    }
    setModalOpen(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-tdb-teal text-3xl">Voluntários</h1>
          <p className="text-gray-400 font-body text-sm">{voluntarios.filter(v => v.ativo).length} voluntários ativos</p>
        </div>
        <Button onClick={openNew}>+ Novo Voluntário</Button>
      </div>

      <input type="text" placeholder="Buscar por nome..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        className={inputClass + ' max-w-sm'} />

      {filtered.length === 0
        ? <EmptyState icon="🤝" title="Nenhum voluntário encontrado" />
        : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-gray-400">
                    <th className="px-6 py-4 font-semibold">Nome</th>
                    <th className="px-6 py-4 font-semibold hidden md:table-cell">CPF</th>
                    <th className="px-6 py-4 font-semibold hidden sm:table-cell">Área</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{v.nome}</td>
                      <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{formatCPF(v.cpf)}</td>
                      <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{v.area}</td>
                      <td className="px-6 py-4">
                        <Badge label={v.ativo ? 'Ativo' : 'Inativo'}
                          className={v.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(v)} className="text-tdb-teal hover:underline text-xs font-medium">Editar</button>
                          <button onClick={() => handleToggle(v.id)} className="text-yellow-500 hover:underline text-xs font-medium">
                            {v.ativo ? 'Desativar' : 'Ativar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      }

      <Modal open={modalOpen} title={editing ? 'Editar Voluntário' : 'Novo Voluntário'} onClose={() => setModalOpen(false)} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nome completo" error={errors.nome?.message} required>
            <input type="text" {...register('nome', { required: 'Obrigatório' })} className={inputClass} />
          </FormField>
          <FormField label="CPF" error={errors.cpf?.message} required>
            <input type="text" maxLength={11} {...register('cpf', { required: 'Obrigatório' })} className={inputClass} placeholder="Somente números" />
          </FormField>
          <FormField label="E-mail" error={errors.email?.message} required>
            <input type="email" {...register('email', { required: 'Obrigatório' })} className={inputClass} />
          </FormField>
          <FormField label="Telefone">
            <input type="tel" {...register('telefone')} className={inputClass} placeholder="(11) 99999-9999" />
          </FormField>
          <FormField label="Data de Nascimento">
            <input type="date" {...register('dataNascimento')} className={inputClass} />
          </FormField>
          <FormField label="Área de atuação">
            <input type="text" {...register('area')} className={inputClass} placeholder="Ex: Recepção, Logística..." />
          </FormField>
          <div className="md:col-span-2 flex justify-end gap-3 mt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editing ? 'Salvar' : 'Cadastrar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
