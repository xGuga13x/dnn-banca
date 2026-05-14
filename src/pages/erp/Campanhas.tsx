import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Campanha } from '../../types'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { FormField, inputClass } from '../../components/FormField'
import Badge from '../../components/Badge'
import EmptyState from '../../components/EmptyState'
import { formatCurrency, formatDate } from '../../utils/formatters'

const mockCampanhas: Campanha[] = [
  { idCampanha: 1, nome: 'Sorriso Solidário Maio 2025',  descricao: 'Campanha mensal de arrecadação.', dtInicio: '2025-05-01', dtFim: '2025-05-31', metaValor: 20000, totalArrecadado: 12500, ativo: true },
  { idCampanha: 2, nome: 'Dia das Mães TDB 2025',        descricao: 'Especial mês das mães.',          dtInicio: '2025-05-05', dtFim: '2025-05-15', metaValor: 10000, totalArrecadado: 8750,  ativo: true },
  { idCampanha: 3, nome: 'Campanha Abril 2025',           descricao: 'Encerrada.',                      dtInicio: '2025-04-01', dtFim: '2025-04-30', metaValor: 15000, totalArrecadado: 16200, ativo: false },
]

type FormData = Omit<Campanha, 'idCampanha' | 'totalArrecadado' | 'ativo'>

export default function Campanhas() {
  useEffect(() => { document.title = 'Campanhas | De Novo Não! ERP' }, [])

  const [campanhas, setCampanhas] = useState<Campanha[]>(mockCampanhas)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState<Campanha | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  const openNew  = () => { setEditing(null); reset(); setModalOpen(true) }
  const openEdit = (c: Campanha) => {
    setEditing(c)
    reset({ nome: c.nome, descricao: c.descricao, dtInicio: c.dtInicio, dtFim: c.dtFim, metaValor: c.metaValor })
    setModalOpen(true)
  }

  const onSubmit = (data: FormData) => {
    if (editing) {
      setCampanhas((prev) => prev.map((c) => c.idCampanha === editing.idCampanha ? { ...c, ...data } : c))
    } else {
      setCampanhas((prev) => [...prev, { ...data, idCampanha: Date.now(), totalArrecadado: 0, ativo: true }])
    }
    setModalOpen(false)
  }

  const handleEncerrar = (id: number) => {
    if (!confirm('Encerrar esta campanha?')) return
    setCampanhas((prev) => prev.map((c) => c.idCampanha === id ? { ...c, ativo: false } : c))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-tdb-teal text-3xl">Campanhas</h1>
          <p className="text-gray-400 font-body text-sm">{campanhas.filter(c => c.ativo).length} campanhas ativas</p>
        </div>
        <Button onClick={openNew}>+ Nova Campanha</Button>
      </div>

      {campanhas.length === 0
        ? <EmptyState icon="📣" title="Nenhuma campanha cadastrada" />
        : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {campanhas.map((c) => {
              const pct = c.metaValor ? Math.min(100, Math.round(((c.totalArrecadado ?? 0) / c.metaValor) * 100)) : 0
              return (
                <div key={c.idCampanha} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 animate-fade-in-up">
                  <div className="flex justify-between items-start">
                    <h3 className="font-display font-bold text-tdb-teal text-base leading-tight">{c.nome}</h3>
                    <Badge label={c.ativo ? 'Ativa' : 'Encerrada'} className={c.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'} />
                  </div>
                  {c.descricao && <p className="text-gray-500 text-sm font-body">{c.descricao}</p>}
                  <div className="text-xs text-gray-400 font-body">
                    {formatDate(c.dtInicio)} → {formatDate(c.dtFim)}
                  </div>
                  {c.metaValor && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 font-body mb-1">
                        <span>{formatCurrency(c.totalArrecadado ?? 0)}</span>
                        <span>Meta: {formatCurrency(c.metaValor)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-tdb-green rounded-full h-2 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-right text-tdb-teal font-semibold mt-1">{pct}%</p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => openEdit(c)} className="text-tdb-teal hover:underline text-xs font-medium">Editar</button>
                    {c.ativo && <button onClick={() => handleEncerrar(c.idCampanha)} className="text-red-400 hover:underline text-xs font-medium">Encerrar</button>}
                  </div>
                </div>
              )
            })}
          </div>
        )
      }

      <Modal open={modalOpen} title={editing ? 'Editar Campanha' : 'Nova Campanha'} onClose={() => setModalOpen(false)} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Nome da campanha" error={errors.nome?.message} required>
            <input type="text" {...register('nome', { required: 'Obrigatório' })} className={inputClass} />
          </FormField>
          <FormField label="Descrição">
            <textarea rows={2} {...register('descricao')} className={inputClass + ' resize-none'} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Data início" error={errors.dtInicio?.message} required>
              <input type="date" {...register('dtInicio', { required: 'Obrigatório' })} className={inputClass} />
            </FormField>
            <FormField label="Data fim" error={errors.dtFim?.message} required>
              <input type="date" {...register('dtFim', { required: 'Obrigatório' })} className={inputClass} />
            </FormField>
          </div>
          <FormField label="Meta de arrecadação (R$)">
            <input type="number" step="0.01" {...register('metaValor', { valueAsNumber: true })} className={inputClass} placeholder="0,00" />
          </FormField>
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editing ? 'Salvar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
