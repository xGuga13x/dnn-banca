import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IAService } from '../../services/api'
import type { PrevisaoFalta, PrevisaoArrecadacao } from '../../types'
import { FormField, inputClass } from '../../components/FormField'
import Button from '../../components/Button'
import Card from '../../components/Card'
import { riscoColor, formatCurrency } from '../../utils/formatters'

// ─── Form types ──────────────────────────────────────────────────────────────
interface FaltaForm {
  distanciaKm: number
  faltasAnteriores: number
  diasAteConsulta: number
  rendaFamiliar: number
  turno: number
}

interface ArrecadacaoForm {
  duracaoDias: number
  metaValor: number
  campanhasAnteriores: number
  mesDoAno: number
}

export default function IA() {
  useEffect(() => { document.title = 'IA | De Novo Não! ERP' }, [])

  // ─── Health check ─────────────────────────────────────────────────────────
  const [apiOnline, setApiOnline] = useState<boolean | null>(null)

  useEffect(() => {
    IAService.health()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false))
  }, [])

  // ─── Previsão de Falta ────────────────────────────────────────────────────
  const [previsaoFalta, setPrevisaoFalta]         = useState<PrevisaoFalta | null>(null)
  const [loadingFalta, setLoadingFalta]           = useState(false)
  const [errorFalta, setErrorFalta]               = useState<string | null>(null)

  const faltaForm = useForm<FaltaForm>({ defaultValues: { distanciaKm: 5, faltasAnteriores: 0, diasAteConsulta: 3, rendaFamiliar: 1500, turno: 0 } })

  const handlePreverFalta = faltaForm.handleSubmit(async (data) => {
    setLoadingFalta(true); setErrorFalta(null)
    try {
      const res = await IAService.preverFalta(data) as PrevisaoFalta
      setPrevisaoFalta(res)
    } catch {
      // Fallback mock quando a API Python ainda não está no ar
      const prob = Math.min(0.99, Math.max(0.01,
        (data.faltasAnteriores * 0.2) + (data.distanciaKm > 20 ? 0.3 : 0.1) + (data.diasAteConsulta > 7 ? 0.2 : 0.05)
      ))
      setPrevisaoFalta({
        probabilidadeFalta: prob,
        risco: prob > 0.6 ? 'ALTO' : prob > 0.3 ? 'MEDIO' : 'BAIXO',
        recomendacao: prob > 0.6 ? 'Enviar lembrete reforçado' : prob > 0.3 ? 'Lembrete padrão' : 'Sem ação necessária',
      })
      setErrorFalta('⚠️ API Python offline — resultado simulado localmente.')
    } finally { setLoadingFalta(false) }
  })

  // ─── Previsão de Arrecadação ──────────────────────────────────────────────
  const [previsaoArrec, setPrevisaoArrec]         = useState<PrevisaoArrecadacao | null>(null)
  const [loadingArrec, setLoadingArrec]           = useState(false)
  const [errorArrec, setErrorArrec]               = useState<string | null>(null)

  const arrecForm = useForm<ArrecadacaoForm>({ defaultValues: { duracaoDias: 30, metaValor: 15000, campanhasAnteriores: 3, mesDoAno: 5 } })

  const handlePreverArrecadacao = arrecForm.handleSubmit(async (data) => {
    setLoadingArrec(true); setErrorArrec(null)
    try {
      const res = await IAService.preverArrecadacao(data) as PrevisaoArrecadacao
      setPrevisaoArrec(res)
    } catch {
      const previsto = data.metaValor * (0.7 + Math.random() * 0.6)
      setPrevisaoArrec({
        valorPrevisto: previsto,
        confianca: 0.72,
        tendencia: previsto > data.metaValor ? 'ALTA' : previsto > data.metaValor * 0.8 ? 'ESTAVEL' : 'BAIXA',
      })
      setErrorArrec('⚠️ API Python offline — resultado simulado localmente.')
    } finally { setLoadingArrec(false) }
  })

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-tdb-teal text-3xl">Inteligência Artificial</h1>
          <p className="text-gray-400 font-body text-sm">Modelos preditivos integrados via Python / FastAPI</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-body">
          <span className={`w-2.5 h-2.5 rounded-full ${apiOnline === true ? 'bg-green-500' : apiOnline === false ? 'bg-red-500' : 'bg-yellow-400 animate-pulse-slow'}`} />
          <span className={apiOnline === true ? 'text-green-600' : apiOnline === false ? 'text-red-500' : 'text-yellow-500'}>
            {apiOnline === true ? 'API Online' : apiOnline === false ? 'API Offline' : 'Verificando...'}
          </span>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-tdb-teal/5 border border-tdb-teal/10 rounded-2xl p-5 font-body text-sm text-tdb-teal">
        <strong className="font-display">Como funciona:</strong> Os modelos abaixo consomem os endpoints{' '}
        <code className="bg-tdb-teal/10 px-1.5 py-0.5 rounded text-xs">/predict/falta</code> e{' '}
        <code className="bg-tdb-teal/10 px-1.5 py-0.5 rounded text-xs">/predict/arrecadacao</code>{' '}
        da API Python. Configure a URL em <code className="bg-tdb-teal/10 px-1.5 py-0.5 rounded text-xs">VITE_IA_URL</code> no arquivo <code className="bg-tdb-teal/10 px-1.5 py-0.5 rounded text-xs">.env</code>.
        Quando offline, um fallback local simula o resultado.
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* ── Previsão de Falta ─────────────────────────────────────────────── */}
        <Card>
          <h2 className="font-display font-bold text-tdb-teal text-xl mb-5">🦷 Previsão de Falta em Consulta</h2>
          <form onSubmit={handlePreverFalta} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Distância (km)">
                <input type="number" step="0.1" min="0" {...faltaForm.register('distanciaKm', { valueAsNumber: true })} className={inputClass} />
              </FormField>
              <FormField label="Faltas anteriores">
                <input type="number" min="0" {...faltaForm.register('faltasAnteriores', { valueAsNumber: true })} className={inputClass} />
              </FormField>
              <FormField label="Dias até a consulta">
                <input type="number" min="0" {...faltaForm.register('diasAteConsulta', { valueAsNumber: true })} className={inputClass} />
              </FormField>
              <FormField label="Renda familiar (R$)">
                <input type="number" min="0" {...faltaForm.register('rendaFamiliar', { valueAsNumber: true })} className={inputClass} />
              </FormField>
              <FormField label="Turno">
                <select {...faltaForm.register('turno', { valueAsNumber: true })} className={inputClass}>
                  <option value={0}>Manhã</option>
                  <option value={1}>Tarde</option>
                  <option value={2}>Noite</option>
                </select>
              </FormField>
            </div>
            <Button type="submit" disabled={loadingFalta} className="w-full">
              {loadingFalta ? 'Calculando...' : 'Prever risco de falta'}
            </Button>
          </form>

          {/* Resultado */}
          {previsaoFalta && (
            <div className="mt-6 bg-gray-50 rounded-2xl p-5 space-y-3 animate-fade-in">
              <div className="flex justify-between items-center">
                <span className="font-body text-sm text-gray-500">Probabilidade de falta</span>
                <span className={`font-display font-extrabold text-3xl ${riscoColor[previsaoFalta.risco]}`}>
                  {(previsaoFalta.probabilidadeFalta * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${
                    previsaoFalta.risco === 'ALTO' ? 'bg-red-500' : previsaoFalta.risco === 'MEDIO' ? 'bg-yellow-400' : 'bg-green-500'
                  }`}
                  style={{ width: `${previsaoFalta.probabilidadeFalta * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm font-body">
                <span>Risco: <strong className={riscoColor[previsaoFalta.risco]}>{previsaoFalta.risco}</strong></span>
                <span className="text-gray-500">{previsaoFalta.recomendacao}</span>
              </div>
            </div>
          )}
          {errorFalta && <p className="mt-3 text-xs text-yellow-600 font-body">{errorFalta}</p>}
        </Card>

        {/* ── Previsão de Arrecadação ───────────────────────────────────────── */}
        <Card>
          <h2 className="font-display font-bold text-tdb-teal text-xl mb-5">📣 Previsão de Arrecadação</h2>
          <form onSubmit={handlePreverArrecadacao} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Duração (dias)">
                <input type="number" min="1" {...arrecForm.register('duracaoDias', { valueAsNumber: true })} className={inputClass} />
              </FormField>
              <FormField label="Meta (R$)">
                <input type="number" min="0" {...arrecForm.register('metaValor', { valueAsNumber: true })} className={inputClass} />
              </FormField>
              <FormField label="Campanhas anteriores">
                <input type="number" min="0" {...arrecForm.register('campanhasAnteriores', { valueAsNumber: true })} className={inputClass} />
              </FormField>
              <FormField label="Mês do ano (1-12)">
                <input type="number" min="1" max="12" {...arrecForm.register('mesDoAno', { valueAsNumber: true })} className={inputClass} />
              </FormField>
            </div>
            <Button type="submit" disabled={loadingArrec} className="w-full">
              {loadingArrec ? 'Calculando...' : 'Prever arrecadação'}
            </Button>
          </form>

          {/* Resultado */}
          {previsaoArrec && (
            <div className="mt-6 bg-gray-50 rounded-2xl p-5 space-y-3 animate-fade-in">
              <div className="flex justify-between items-center">
                <span className="font-body text-sm text-gray-500">Valor previsto</span>
                <span className="font-display font-extrabold text-3xl text-tdb-green">
                  {formatCurrency(previsaoArrec.valorPrevisto)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span>Confiança: <strong className="text-tdb-teal">{(previsaoArrec.confianca * 100).toFixed(0)}%</strong></span>
                <span className={`font-semibold ${
                  previsaoArrec.tendencia === 'ALTA' ? 'text-green-600'
                  : previsaoArrec.tendencia === 'BAIXA' ? 'text-red-500' : 'text-yellow-600'
                }`}>
                  Tendência: {previsaoArrec.tendencia === 'ALTA' ? '📈 Alta' : previsaoArrec.tendencia === 'BAIXA' ? '📉 Baixa' : '➡️ Estável'}
                </span>
              </div>
            </div>
          )}
          {errorArrec && <p className="mt-3 text-xs text-yellow-600 font-body">{errorArrec}</p>}
        </Card>

      </div>

      {/* Dica de integração */}
      <Card className="border-dashed border-2 border-tdb-green/30 bg-tdb-green/5">
        <h3 className="font-display font-bold text-tdb-teal text-lg mb-2">🔗 Como integrar a IA</h3>
        <div className="font-body text-sm text-gray-600 space-y-2">
          <p>1. Implemente o servidor Python com <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-xs">fastapi</code> e <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-xs">joblib</code></p>
          <p>2. Exponha os endpoints <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-xs">/predict/falta</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-xs">/predict/arrecadacao</code> e <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-xs">/health</code></p>
          <p>3. Adicione <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-xs">VITE_IA_URL=https://sua-api-python.com</code> no <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-xs">.env</code></p>
          <p>4. O front já está pronto para consumir — nenhuma alteração necessária ✅</p>
        </div>
      </Card>
    </div>
  )
}
