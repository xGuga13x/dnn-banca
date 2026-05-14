import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Prontuario } from '../../types'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { FormField, inputClass } from '../../components/FormField'
import EmptyState from '../../components/EmptyState'
import { formatDate } from '../../utils/formatters'
import { gerarDescricaoClinica } from '../../services/gemini'

interface ProntuarioComPaciente extends Prontuario {
  nomePaciente: string
  nomeDentista: string
}

const mockProntuarios: ProntuarioComPaciente[] = [
  { idProntuario: 1, idConsulta: 1, descricao: 'Limpeza completa realizada. Paciente orientado sobre higiene bucal. Próxima consulta em 6 meses.', dtRegistro: '2025-04-18', nomePaciente: 'Maria Oliveira', nomeDentista: 'Dr. João Silva' },
  { idProntuario: 2, idConsulta: 4, descricao: 'Extração do dente 38 sem intercorrências. Prescrito analgésico e antibiótico por 7 dias.', dtRegistro: '2025-04-10', nomePaciente: 'Maria Oliveira', nomeDentista: 'Dra. Ana Costa' },
  { idProntuario: 3, idConsulta: 2, descricao: 'Avaliação inicial. Identificada necessidade de aparelho ortodôntico. Encaminhado para consulta especializada.', dtRegistro: '2025-04-18', nomePaciente: 'Pedro Santos', nomeDentista: 'Dra. Ana Costa' },
]

type FormData = Omit<Prontuario, 'idProntuario' | 'dtRegistro'> & {
  nomePaciente: string
  nomeDentista: string
}

export default function Prontuarios() {
  useEffect(() => { document.title = 'Prontuários | De Novo Não! ERP' }, [])

  const [prontuarios, setProntuarios] = useState<ProntuarioComPaciente[]>(mockProntuarios)
  const [search, setSearch]           = useState('')
  const [selected, setSelected]       = useState<ProntuarioComPaciente | null>(null)
  const [modalOpen, setModalOpen]     = useState(false)
  const [detailOpen, setDetailOpen]   = useState(false)

  // Gemini
  const [anotacoes, setAnotacoes]         = useState('')
  const [loadingIA, setLoadingIA]         = useState(false)
  const [sugestao, setSugestao]           = useState('')
  const [erroIA, setErroIA]               = useState('')

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>()

  const filtered = prontuarios.filter(p =>
    p.nomePaciente.toLowerCase().includes(search.toLowerCase()) ||
    p.nomeDentista.toLowerCase().includes(search.toLowerCase())
  )

  const openNew = () => {
    reset({ idConsulta: 0, nomePaciente: '', nomeDentista: '', descricao: '' })
    setSugestao('')
    setAnotacoes('')
    setErroIA('')
    setModalOpen(true)
  }

  const openDetail = (p: ProntuarioComPaciente) => { setSelected(p); setDetailOpen(true) }

  const onSubmit = (data: FormData) => {
    setProntuarios(prev => [...prev, {
      ...data,
      idProntuario: Date.now(),
      dtRegistro: new Date().toISOString().split('T')[0],
    }])
    setModalOpen(false)
  }

  const handleGerarIA = async () => {
    if (!anotacoes.trim()) return
    setLoadingIA(true)
    setErroIA('')
    setSugestao('')
    try {
      const texto = await gerarDescricaoClinica(anotacoes)
      setSugestao(texto)
    } catch (e: unknown) {
      setErroIA(e instanceof Error ? e.message : 'Erro ao conectar ao Gemini')
    } finally {
      setLoadingIA(false)
    }
  }

  const usarSugestao = () => {
    setValue('descricao', sugestao)
    setSugestao('')
    setAnotacoes('')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl" style={{ color: '#2d4a1e' }}>Prontuários</h1>
          <p className="text-gray-400 font-body text-sm">{prontuarios.length} registros clínicos</p>
        </div>
        <Button onClick={openNew}>+ Novo Registro</Button>
      </div>

      <input type="text" placeholder="Buscar por paciente ou dentista..."
        value={search} onChange={e => setSearch(e.target.value)}
        className={inputClass + ' max-w-sm'} />

      {filtered.length === 0
        ? <EmptyState icon="📋" title="Nenhum prontuário encontrado" />
        : (
          <div className="space-y-3">
            {filtered.map(p => (
              <div key={p.idProntuario} onClick={() => openDetail(p)}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-display font-bold" style={{ color: '#2d4a1e' }}>{p.nomePaciente}</p>
                    <p className="text-gray-400 text-xs font-body">
                      {p.nomeDentista} · {formatDate(p.dtRegistro)} · Consulta #{p.idConsulta}
                    </p>
                  </div>
                  <span className="text-sm font-body font-medium shrink-0" style={{ color: '#7ab800' }}>
                    Ver detalhes →
                  </span>
                </div>
                <p className="text-gray-600 text-sm font-body mt-3 line-clamp-2">{p.descricao}</p>
              </div>
            ))}
          </div>
        )
      }

      {/* Modal detalhe */}
      <Modal isOpen={detailOpen} title="Prontuário Clínico" onClose={() => setDetailOpen(false)} size="md">
        {selected && (
          <div className="space-y-4 font-body">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Paciente', value: selected.nomePaciente },
                { label: 'Dentista', value: selected.nomeDentista },
                { label: 'Data',     value: formatDate(selected.dtRegistro) },
                { label: 'Consulta', value: `#${selected.idConsulta}` },
              ].map(row => (
                <div key={row.label}>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">{row.label}</p>
                  <p className="font-semibold" style={{ color: '#2d4a1e' }}>{row.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: '#f4f9ec' }}>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Descrição clínica</p>
              <p className="text-gray-700 text-sm leading-relaxed">{selected.descricao}</p>
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => setDetailOpen(false)}>Fechar</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal novo registro */}
      <Modal isOpen={modalOpen} title="Novo Registro de Prontuário" onClose={() => setModalOpen(false)} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="ID da Consulta" error={errors.idConsulta?.message} required>
              <input type="number" className={inputClass} placeholder="Ex: 1"
                {...register('idConsulta', { required: 'Obrigatório', valueAsNumber: true })} />
            </FormField>
            <FormField label="Nome do Paciente" error={errors.nomePaciente?.message} required>
              <input className={inputClass} placeholder="Nome do paciente"
                {...register('nomePaciente', { required: 'Obrigatório' })} />
            </FormField>
            <FormField label="Nome do Dentista" error={errors.nomeDentista?.message} required>
              <input className={inputClass} placeholder="Nome do dentista"
                {...register('nomeDentista', { required: 'Obrigatório' })} />
            </FormField>
          </div>

          {/* Assistente Gemini */}
          <div className="rounded-xl border-2 border-dashed p-4 space-y-3"
            style={{ borderColor: '#7ab800', backgroundColor: '#f4f9ec' }}>
            <div className="flex items-center gap-2">
              <span className="text-base">✨</span>
              <p className="text-sm font-semibold" style={{ color: '#2d4a1e' }}>
                Assistente de IA — Gerador de descrição clínica
              </p>
            </div>
            <p className="text-xs text-gray-500 font-body">
              Descreva em palavras simples o que foi feito. O Gemini transforma em texto clínico profissional.
            </p>
            <textarea rows={2} className={inputClass + ' resize-none text-sm'}
              placeholder="Ex: fiz limpeza, tinha tártaro, orientei escovar melhor..."
              value={anotacoes}
              onChange={e => setAnotacoes(e.target.value)} />
            <button type="button" onClick={handleGerarIA}
              disabled={loadingIA || !anotacoes.trim()}
              className="text-xs px-4 py-1.5 rounded-full font-semibold disabled:opacity-50 transition-opacity hover:opacity-80 font-body"
              style={{ backgroundColor: '#7ab800', color: 'white' }}>
              {loadingIA ? 'Gerando...' : 'Gerar descrição clínica'}
            </button>

            {erroIA && <p className="text-xs text-red-500 font-body">{erroIA}</p>}

            {sugestao && (
              <div className="rounded-lg p-3 space-y-2" style={{ backgroundColor: 'white' }}>
                <p className="text-xs font-semibold" style={{ color: '#7ab800' }}>Sugestão gerada:</p>
                <p className="text-sm text-gray-700 leading-relaxed font-body">{sugestao}</p>
                <button type="button" onClick={usarSugestao}
                  className="text-xs font-semibold hover:underline font-body"
                  style={{ color: '#2d4a1e' }}>
                  Usar esta descrição →
                </button>
              </div>
            )}
          </div>

          <FormField label="Descrição clínica" error={errors.descricao?.message} required>
            <textarea rows={4} className={inputClass + ' resize-y'}
              placeholder="Descreva os procedimentos realizados, observações e recomendações..."
              {...register('descricao', { required: 'Descrição é obrigatória' })} />
          </FormField>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Registrar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
