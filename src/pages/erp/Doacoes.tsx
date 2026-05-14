import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Doacao } from '../../types'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { FormField, inputClass } from '../../components/FormField'
import EmptyState from '../../components/EmptyState'
import { formatCurrency, formatDate } from '../../utils/formatters'

const mockDoacoes: Doacao[] = [
  { idDoacao: 1, idDoador: 1, nomeDoador: 'Empresa XYZ',    idCampanha: 1, nomeCampanha: 'Sorriso Solidário Maio 2025', valor: 5000,  dtDoacao: '2025-05-02', formaPgto: 'PIX' },
  { idDoacao: 2, idDoador: 2, nomeDoador: 'João Voluntário', idCampanha: 1, nomeCampanha: 'Sorriso Solidário Maio 2025', valor: 200,   dtDoacao: '2025-05-03', formaPgto: 'Boleto' },
  { idDoacao: 3,              nomeDoador: 'Anônimo',         idCampanha: 2, nomeCampanha: 'Dia das Mães TDB 2025',       valor: 150,   dtDoacao: '2025-05-06', formaPgto: 'PIX' },
  { idDoacao: 4, idDoador: 3, nomeDoador: 'Maria Apoiadora', idCampanha: 1, nomeCampanha: 'Sorriso Solidário Maio 2025', valor: 1000,  dtDoacao: '2025-05-07', formaPgto: 'Cartão' },
]

const formasPgto = ['PIX', 'Boleto', 'Cartão', 'Transferência', 'Dinheiro']

type FormData = Omit<Doacao, 'idDoacao'>

export default function Doacoes() {
  useEffect(() => { document.title = 'Doações | De Novo Não! ERP' }, [])

  const [doacoes, setDoacoes]   = useState<Doacao[]>(mockDoacoes)
  const [search, setSearch]     = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  const filtered = doacoes.filter((d) =>
    (d.nomeDoador ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (d.nomeCampanha ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const totalGeral = doacoes.reduce((acc, d) => acc + d.valor, 0)

  const openNew = () => { reset(); setModalOpen(true) }

  const onSubmit = (data: FormData) => {
    setDoacoes((prev) => [...prev, { ...data, idDoacao: Date.now(), valor: Number(data.valor) }])
    setModalOpen(false)
  }

  const handleDelete = (id: number) => {
    if (!confirm('Remover esta doação?')) return
    setDoacoes((prev) => prev.filter((d) => d.idDoacao !== id))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-tdb-teal text-3xl">Doações</h1>
          <p className="text-gray-400 font-body text-sm">
            {doacoes.length} registros · Total: <span className="font-semibold text-tdb-green">{formatCurrency(totalGeral)}</span>
          </p>
        </div>
        <Button onClick={openNew}>+ Registrar Doação</Button>
      </div>

      {/* Busca */}
      <input type="text" placeholder="Buscar por doador ou campanha..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        className={inputClass + ' max-w-sm'} />

      {/* Tabela */}
      {filtered.length === 0
        ? <EmptyState icon="💰" title="Nenhuma doação encontrada" />
        : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-gray-400">
                    <th className="px-6 py-4 font-semibold">Doador</th>
                    <th className="px-6 py-4 font-semibold hidden md:table-cell">Campanha</th>
                    <th className="px-6 py-4 font-semibold">Valor</th>
                    <th className="px-6 py-4 font-semibold hidden sm:table-cell">Data</th>
                    <th className="px-6 py-4 font-semibold hidden lg:table-cell">Forma</th>
                    <th className="px-6 py-4 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((d) => (
                    <tr key={d.idDoacao} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{d.nomeDoador ?? 'Anônimo'}</td>
                      <td className="px-6 py-4 text-gray-500 hidden md:table-cell text-xs">{d.nomeCampanha}</td>
                      <td className="px-6 py-4 font-semibold text-tdb-green">{formatCurrency(d.valor)}</td>
                      <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{formatDate(d.dtDoacao)}</td>
                      <td className="px-6 py-4 text-gray-500 hidden lg:table-cell">{d.formaPgto}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleDelete(d.idDoacao)} className="text-red-400 hover:underline text-xs font-medium">Remover</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-100">
                  <tr>
                    <td className="px-6 py-3 font-display font-bold text-tdb-teal" colSpan={2}>Total</td>
                    <td className="px-6 py-3 font-display font-bold text-tdb-green">{formatCurrency(filtered.reduce((a, d) => a + d.valor, 0))}</td>
                    <td colSpan={3} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )
      }

      {/* Modal */}
      <Modal open={modalOpen} title="Registrar Doação" onClose={() => setModalOpen(false)} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nome do Doador">
            <input type="text" {...register('nomeDoador')} className={inputClass} placeholder="Deixe vazio para anônimo" />
          </FormField>
          <FormField label="Campanha">
            <input type="text" {...register('nomeCampanha')} className={inputClass} placeholder="Nome da campanha" />
          </FormField>
          <FormField label="Valor (R$)" error={errors.valor?.message} required>
            <input type="number" step="0.01" min="0.01"
              {...register('valor', { required: 'Valor é obrigatório', min: { value: 0.01, message: 'Valor deve ser maior que zero' } })}
              className={inputClass} placeholder="0,00" />
          </FormField>
          <FormField label="Forma de pagamento" required>
            <select {...register('formaPgto')} className={inputClass}>
              {formasPgto.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </FormField>
          <FormField label="Data da doação" error={errors.dtDoacao?.message} required>
            <input type="date" {...register('dtDoacao', { required: 'Obrigatório' })} className={inputClass} />
          </FormField>
          <div className="md:col-span-2 flex justify-end gap-3 mt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Registrar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
