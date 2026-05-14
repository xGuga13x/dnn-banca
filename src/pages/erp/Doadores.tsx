import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Doador } from '../../types'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { FormField, inputClass } from '../../components/FormField'
import Badge from '../../components/Badge'
import EmptyState from '../../components/EmptyState'
import { formatCPF } from '../../utils/formatters'

const mockDoadores: Doador[] = [
  { id: 1, idDoador: 1, nome: 'Empresa XYZ Ltda',    cpf: '12345600001', email: 'contato@xyz.com.br', telefone: '1130000001', dataNascimento: '', tipoDoador: 'PJ', ativo: true },
  { id: 2, idDoador: 2, nome: 'João Voluntário',      cpf: '98765400001', email: 'joao@email.com',     telefone: '11988880001', dataNascimento: '1980-06-15', tipoDoador: 'PF', ativo: true },
  { id: 3, idDoador: 3, nome: 'Maria Apoiadora',      cpf: '11122200001', email: 'maria@email.com',    telefone: '11988880002', dataNascimento: '1975-09-22', tipoDoador: 'PF', ativo: true },
]

type FormData = Omit<Doador, 'id' | 'idDoador' | 'ativo'>

export default function Doadores() {
  useEffect(() => { document.title = 'Doadores | De Novo Não! ERP' }, [])

  const [doadores, setDoadores] = useState<Doador[]>(mockDoadores)
  const [search, setSearch]     = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]   = useState<Doador | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  const filtered = doadores.filter((d) =>
    d.nome.toLowerCase().includes(search.toLowerCase()) ||
    d.cpf.includes(search)
  )

  const openNew  = () => { setEditing(null); reset(); setModalOpen(true) }
  const openEdit = (d: Doador) => {
    setEditing(d)
    reset({ nome: d.nome, cpf: d.cpf, email: d.email, telefone: d.telefone, dataNascimento: d.dataNascimento, tipoDoador: d.tipoDoador })
    setModalOpen(true)
  }
  const handleToggle = (id: number) => {
    setDoadores((prev) => prev.map((d) => d.id === id ? { ...d, ativo: !d.ativo } : d))
  }
  const onSubmit = (data: FormData) => {
    if (editing) {
      setDoadores((prev) => prev.map((d) => d.id === editing.id ? { ...d, ...data } : d))
    } else {
      setDoadores((prev) => [...prev, { ...data, id: Date.now(), idDoador: Date.now(), ativo: true }])
    }
    setModalOpen(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-tdb-teal text-3xl">Doadores</h1>
          <p className="text-gray-400 font-body text-sm">{doadores.filter(d => d.ativo).length} doadores ativos</p>
        </div>
        <Button onClick={openNew}>+ Novo Doador</Button>
      </div>

      <input type="text" placeholder="Buscar por nome ou CPF/CNPJ..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        className={inputClass + ' max-w-sm'} />

      {filtered.length === 0
        ? <EmptyState icon="💛" title="Nenhum doador encontrado" />
        : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-gray-400">
                    <th className="px-6 py-4 font-semibold">Nome</th>
                    <th className="px-6 py-4 font-semibold hidden md:table-cell">CPF/CNPJ</th>
                    <th className="px-6 py-4 font-semibold hidden sm:table-cell">Tipo</th>
                    <th className="px-6 py-4 font-semibold hidden lg:table-cell">E-mail</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{d.nome}</td>
                      <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{formatCPF(d.cpf)}</td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <Badge label={d.tipoDoador}
                          className={d.tipoDoador === 'PJ' ? 'bg-blue-100 text-blue-700' : 'bg-tdb-green/10 text-tdb-teal'} />
                      </td>
                      <td className="px-6 py-4 text-gray-500 hidden lg:table-cell">{d.email}</td>
                      <td className="px-6 py-4">
                        <Badge label={d.ativo ? 'Ativo' : 'Inativo'}
                          className={d.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(d)} className="text-tdb-teal hover:underline text-xs font-medium">Editar</button>
                          <button onClick={() => handleToggle(d.id)} className="text-yellow-500 hover:underline text-xs font-medium">
                            {d.ativo ? 'Desativar' : 'Ativar'}
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

      <Modal open={modalOpen} title={editing ? 'Editar Doador' : 'Novo Doador'} onClose={() => setModalOpen(false)} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nome / Razão Social" error={errors.nome?.message} required>
            <input type="text" {...register('nome', { required: 'Obrigatório' })} className={inputClass} />
          </FormField>
          <FormField label="CPF / CNPJ" error={errors.cpf?.message} required>
            <input type="text" {...register('cpf', { required: 'Obrigatório' })} className={inputClass} placeholder="Somente números" />
          </FormField>
          <FormField label="Tipo" required>
            <select {...register('tipoDoador')} className={inputClass}>
              <option value="PF">Pessoa Física</option>
              <option value="PJ">Pessoa Jurídica</option>
            </select>
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
          <div className="md:col-span-2 flex justify-end gap-3 mt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editing ? 'Salvar' : 'Cadastrar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
