import { useEffect, useState } from 'react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { formatCurrency } from '../../utils/formatters'

interface ReportRow { label: string; value: string | number; sub?: string }

const consultasPorStatus: ReportRow[] = [
  { label: 'Realizadas',  value: 89,  sub: 'maio/2025' },
  { label: 'Agendadas',   value: 23,  sub: 'próximas'  },
  { label: 'Canceladas',  value: 8,   sub: 'maio/2025' },
  { label: 'Faltas',      value: 14,  sub: 'maio/2025' },
]

const arrecadacaoPorCampanha: ReportRow[] = [
  { label: 'Sorriso Solidário Maio', value: formatCurrency(12500), sub: 'meta: R$ 20.000' },
  { label: 'Dia das Mães TDB',       value: formatCurrency(8750),  sub: 'meta: R$ 10.000' },
  { label: 'Campanha Abril',         value: formatCurrency(16200), sub: 'encerrada'        },
]

const pacientesPorPrograma: ReportRow[] = [
  { label: 'Dentistas do Bem',  value: 198, sub: '63%' },
  { label: 'Apolônias do Bem',  value: 114, sub: '37%' },
]

const materiaisEstoqueBaixo: ReportRow[] = [
  { label: 'Luva cirúrgica',   value: '8 cx',  sub: 'mín. recomendado: 20'  },
  { label: 'Anestésico local', value: '2 cx',  sub: 'mín. recomendado: 10'  },
  { label: 'Escova de dente',  value: '3 un',  sub: 'mín. recomendado: 30'  },
]

function ReportTable({ rows }: { rows: ReportRow[] }) {
  return (
    <table className="w-full text-sm font-body">
      <tbody className="divide-y divide-gray-50">
        {rows.map((row) => (
          <tr key={row.label} className="hover:bg-gray-50 transition-colors">
            <td className="py-3 text-gray-700 font-medium">{row.label}</td>
            {row.sub && <td className="py-3 text-gray-400 text-xs">{row.sub}</td>}
            <td className="py-3 text-right font-display font-bold text-tdb-teal">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function Relatorios() {
  useEffect(() => { document.title = 'Relatórios | De Novo Não! ERP' }, [])

  const [period, setPeriod] = useState<'mes' | 'trimestre' | 'ano'>('mes')

  const handleExport = (tipo: string) => {
    alert(`Exportando relatório: ${tipo}\n\nNo Sprint 4, este botão consumirá a API Java para gerar o arquivo real.`)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-tdb-teal text-3xl">Relatórios</h1>
          <p className="text-gray-400 font-body text-sm">Análise consolidada dos dados do ERP</p>
        </div>
        {/* Período */}
        <div className="flex gap-2">
          {(['mes', 'trimestre', 'ano'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-sm font-body font-medium transition-all
                ${period === p ? 'bg-tdb-teal text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-tdb-green'}`}
            >
              {p === 'mes' ? 'Mês' : p === 'trimestre' ? 'Trimestre' : 'Ano'}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Atendimentos', value: '134', icon: '🦷', color: 'text-tdb-teal'  },
          { label: 'Arrecadado',         value: 'R$ 37.450', icon: '💰', color: 'text-tdb-green' },
          { label: 'Novos Pacientes',    value: '28',  icon: '👤', color: 'text-blue-500'  },
          { label: 'Taxa de Falta',      value: '12%', icon: '⚠️', color: 'text-yellow-500' },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center animate-fade-in-up">
            <p className="text-3xl mb-1">{k.icon}</p>
            <p className={`font-display font-extrabold text-2xl ${k.color}`}>{k.value}</p>
            <p className="text-gray-400 text-xs font-body mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Tabelas de relatórios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-bold text-tdb-teal text-lg">Consultas por Status</h2>
            <button onClick={() => handleExport('Consultas por Status')} className="text-xs text-tdb-green hover:underline font-body">Exportar</button>
          </div>
          <ReportTable rows={consultasPorStatus} />
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-bold text-tdb-teal text-lg">Arrecadação por Campanha</h2>
            <button onClick={() => handleExport('Arrecadação')} className="text-xs text-tdb-green hover:underline font-body">Exportar</button>
          </div>
          <ReportTable rows={arrecadacaoPorCampanha} />
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-bold text-tdb-teal text-lg">Pacientes por Programa</h2>
            <button onClick={() => handleExport('Pacientes por Programa')} className="text-xs text-tdb-green hover:underline font-body">Exportar</button>
          </div>
          <ReportTable rows={pacientesPorPrograma} />
          {/* Barra visual */}
          <div className="mt-4 flex rounded-xl overflow-hidden h-4">
            <div className="bg-tdb-teal transition-all duration-700" style={{ width: '63%' }} title="Dentistas do Bem" />
            <div className="bg-tdb-green transition-all duration-700" style={{ width: '37%' }} title="Apolônias do Bem" />
          </div>
          <div className="flex justify-between text-xs font-body text-gray-400 mt-1">
            <span>Dentistas do Bem 63%</span>
            <span>Apolônias do Bem 37%</span>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-bold text-tdb-teal text-lg">⚠️ Materiais com Estoque Baixo</h2>
            <button onClick={() => handleExport('Estoque Baixo')} className="text-xs text-tdb-green hover:underline font-body">Exportar</button>
          </div>
          <ReportTable rows={materiaisEstoqueBaixo} />
        </Card>
      </div>

      {/* Exportação completa */}
      <Card className="border-dashed border-2 border-tdb-teal/20">
        <h3 className="font-display font-bold text-tdb-teal text-lg mb-3">📥 Exportação Completa</h3>
        <p className="text-gray-500 font-body text-sm mb-4">
          No Sprint 4, estes botões consumirão a API Java para gerar arquivos reais em PDF ou Excel.
          Atualmente simulam a ação.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => handleExport('PDF Completo')} variant="primary" size="sm">📄 Exportar PDF</Button>
          <Button onClick={() => handleExport('Excel Completo')} variant="secondary" size="sm">📊 Exportar Excel</Button>
          <Button onClick={() => handleExport('JSON')} variant="ghost" size="sm">🔗 Exportar JSON</Button>
        </div>
      </Card>
    </div>
  )
}
