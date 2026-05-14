import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Consulta, StatusConsulta } from '../../types'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { FormField, inputClass } from '../../components/FormField'
import Badge from '../../components/Badge'
import EmptyState from '../../components/EmptyState'
import { statusColor, statusLabel, formatDate } from '../../utils/formatters'
import { useFeriados } from '../../hooks/useFeriados'

const mockConsultas: Consulta[] = [
  { idConsulta: 1, idPaciente: 1, nomePaciente: 'Maria Oliveira',  idDentista: 1, nomeDentista: 'Dr. João Silva',  dtConsulta: '2025-04-18', status: 'REALIZADA', observacoes: 'Limpeza concluída.' },
  { idConsulta: 2, idPaciente: 2, nomePaciente: 'Pedro Santos',    idDentista: 2, nomeDentista: 'Dra. Ana Costa',  dtConsulta: '2025-04-18', status: 'AGENDADA',  observacoes: '' },
  { idConsulta: 3, idPaciente: 3, nomePaciente: 'Lucia Ferreira',  idDentista: 3, nomeDentista: 'Dr. Carlos Lima', dtConsulta: '2025-04-17', status: 'FALTA',      observacoes: 'Paciente não compareceu.' },
  { idConsulta: 4, idPaciente: 1, nomePaciente: 'Maria Oliveira',  idDentista: 2, nomeDentista: 'Dra. Ana Costa',  dtConsulta: '2025-04-10', status: 'REALIZADA',  observacoes: 'Extração realizada.' },
]

type FormData = Omit<Consulta, 'idConsulta'>
const statusOptions: StatusConsulta[] = ['AGENDADA', 'REALIZADA', 'CANCELADA', 'FALTA']

export default function Consultas() {
  useEffect(() => { document.title = 'Consultas | De Novo Não! ERP' }, [])

  const [consultas, setConsultas] = useState<Consulta[]>(mockConsultas)
  const [search, setSearch]       = useState('')
  const [filterStatus, setFilter] = useState<StatusConsulta | ''>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState<Consulta | null>(null)

  // Data selecionada no formulário para checar feriado
  const [dataSelecionada, setDataSelecionada] = useState('')
  const anoSelecionado = dataSelecionada
    ? new Date(dataSelecionada + 'T00:00:00').getFullYear()
    : new Date().getFullYear()

  // BrasilAPI — feriados do ano corrente/selecionado
  const { eFeriado, loading: loadingFeriados } = useFeriados(anoSelecionado)
  const feriadoAviso = dataSelecionada ? eFeriado(dataSelecionada) : null

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  const filtered = consultas.filter(c => {
    const matchSearch = c.nomePaciente?.toLowerCase().includes(search.toLowerCase()) ?? true
    const matchStatus = filterStatus ? c.status === filterStatus : true
    return matchSearch && matchStatus
  })

  const openNew  = () => { setEditing(null); reset(); setDataSelecionada(''); setModalOpen(true) }
  const openEdit = (c: Consulta) => {
    setEditing(c)
    reset(c)
    setDataSelecionada(c.dtConsulta ?? '')
    setModalOpen(true)
  }

  const onSubmit = (data: FormData) => {
    if (editing) {
      setConsultas(prev => prev.map(c => c.idConsulta === editing.idConsulta ? { ...c, ...data } : c))
    } else {
      setConsultas(prev => [...prev, { ...data, idConsulta: Date.now() }])
    }
    setModalOpen(false)
  }

  const handleDelete = (id: number) => {
    if (!confirm('Cancelar esta consulta?')) return
    setConsultas(prev => prev.map(c => c.idConsulta === id ? { ...c, status: 'CANCELADA' } : c))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-tdb-teal text-3xl">Consultas</h1>
          <p className="text-gray-400 font-body text-sm">{consultas.length} consultas registradas</p>
        </div>
        <Button onClick={openNew}>+ Nova Consulta</Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <input type="text" placeholder="Buscar por paciente..."
          value={search} onChange={e => setSearch(e.target.value)}
          className={inputClass + ' max-w-xs'} />
        <select value={filterStatus} onChange={e => setFilter(e.target.value as StatusConsulta | '')}
          className={inputClass + ' w-40'}>
          <option value="">Todos</option>
          {statusOptions.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}
        </select>
      </div>

      {/* Aviso de feriados nas consultas agendadas */}
      {(() => {
        const agendadasEmFeriado = consultas.filter(c => {
          if (c.status !== 'AGENDADA') return false
          return eFeriado(c.dtConsulta) !== null
        })
        if (agendadasEmFeriado.length === 0) return null
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex gap-3 items-start">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold text-yellow-800 text-sm">Consultas agendadas em feriados nacionais</p>
              <ul className="mt-1 space-y-0.5">
                {agendadasEmFeriado.map(c => {
                  const f = eFeriado(c.dtConsulta)!
                  return (
                    <li key={c.idConsulta} className="text-yellow-700 text-xs">
                      • {c.nomePaciente} — {formatDate(c.dtConsulta)} ({f.name})
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        )
      })()}

      {filtered.length === 0
        ? <EmptyState icon="📅" title="Nenhuma consulta encontrada" />
        : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-gray-400">
                    <th className="px-6 py-4 font-semibold">Paciente</th>
                    <th className="px-6 py-4 font-semibold hidden md:table-cell">Dentista</th>
                    <th className="px-6 py-4 font-semibold hidden sm:table-cell">Data</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(c => {
                    const feriado = eFeriado(c.dtConsulta)
                    return (
                      <tr key={c.idConsulta} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{c.nomePaciente}</td>
                        <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{c.nomeDentista}</td>
                        <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">
                          <span>{formatDate(c.dtConsulta)}</span>
                          {feriado && c.status === 'AGENDADA' && (
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full"
                              title={feriado.name}>
                              🎉 Feriado
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge label={statusLabel[c.status]} className={statusColor[c.status]} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(c)}
                              className="text-tdb-teal hover:underline font-medium text-xs">
                              Editar
                            </button>
                            {c.status === 'AGENDADA' && (
                              <button onClick={() => handleDelete(c.idConsulta)}
                                className="text-red-400 hover:underline font-medium text-xs">
                                Cancelar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      }

      <Modal open={modalOpen} title={editing ? 'Editar Consulta' : 'Nova Consulta'}
        onClose={() => setModalOpen(false)} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <FormField label="ID do Paciente" error={errors.idPaciente?.message} required>
            <input type="number" className={inputClass} placeholder="ID do paciente"
              {...register('idPaciente', { required: 'Obrigatório', valueAsNumber: true })} />
          </FormField>

          <FormField label="Nome do Paciente">
            <input className={inputClass} placeholder="Nome do paciente"
              {...register('nomePaciente')} />
          </FormField>

          <FormField label="ID do Dentista" error={errors.idDentista?.message} required>
            <input type="number" className={inputClass} placeholder="ID do dentista"
              {...register('idDentista', { required: 'Obrigatório', valueAsNumber: true })} />
          </FormField>

          <FormField label="Nome do Dentista">
            <input className={inputClass} placeholder="Nome do dentista"
              {...register('nomeDentista')} />
          </FormField>

          <FormField label="Data da Consulta" error={errors.dtConsulta?.message} required>
            <input type="date" className={inputClass}
              {...register('dtConsulta', {
                required: 'Obrigatório',
                onChange: e => setDataSelecionada(e.target.value),
              })} />
            {/* Aviso de feriado em tempo real */}
            {loadingFeriados && dataSelecionada && (
              <p className="text-xs text-gray-400 mt-1">Verificando feriados...</p>
            )}
            {feriadoAviso && !loadingFeriados && (
              <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 flex gap-2 items-center">
                <span>🎉</span>
                <p className="text-xs text-yellow-700">
                  <strong>{feriadoAviso.name}</strong> — esta data é um feriado nacional.
                  Confirme se a consulta será mantida.
                </p>
              </div>
            )}
          </FormField>

          <FormField label="Status">
            <select className={inputClass} {...register('status')}>
              {statusOptions.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}
            </select>
          </FormField>

          <FormField label="Observações">
            <textarea rows={3} className={inputClass + ' md:col-span-2 resize-none'}
              placeholder="Observações clínicas..."
              {...register('observacoes')} />
          </FormField>

          <div className="md:col-span-2 flex justify-end gap-3 mt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editing ? 'Salvar' : 'Agendar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
