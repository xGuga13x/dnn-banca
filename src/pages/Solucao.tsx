import { useEffect } from 'react'

const technologies = [
  { name: '☕ Java', description: 'API RESTful com endpoints para todo o CRUD do ERP. Autenticação JWT, regras de negócio e integração com Oracle.' },
  { name: '🗄️ Oracle Database', description: 'Armazenamento relacional com PK, FK, UK, CK e NN. Procedures, views e relatórios SQL.' },
  { name: '⚛️ React + Vite + TypeScript', description: 'SPA modular com React Router, hooks, TypeScript e TailwindCSS. Consome a API Java via fetch nativo.' },
  { name: '🐍 Python + FastAPI + ML', description: 'Modelos preditivos para previsão de faltas e arrecadação. Endpoints /predict e /health para integração.' },
]

const roadmap = [
  { stage: '1ª Etapa', title: 'Levantamento de Requisitos', desc: 'Identificação dos problemas: perda de dados, retrabalho e falta de controle.' },
  { stage: '2ª Etapa', title: 'Banco de Dados Oracle', desc: 'DDL completo com entidades, relacionamentos e regras de validação.' },
  { stage: '3ª Etapa', title: 'Back-end Java', desc: 'API REST com CRUD completo e camada DAO/BO/Exceções.' },
  { stage: '4ª Etapa', title: 'Front-end React', desc: 'SPA com ERP integrado, dashboard e consumo da API Java.' },
  { stage: '5ª Etapa', title: 'IA com Python', desc: 'Modelos preditivos treinados e expostos via FastAPI para o front consumir.' },
  { stage: '6ª Etapa', title: 'Deploy & Entrega Final', desc: 'Vercel (front) + servidor cloud (Java e Python) + documentação completa.' },
]

export default function Solucao() {
  useEffect(() => { document.title = 'Solução | De Novo Não!' }, [])

  return (
    <>
      <section className="text-center py-20 px-6 bg-gradient-to-br from-tdb-teal to-tdb-green text-white">
        <h1 className="font-display font-extrabold text-4xl mb-4 animate-fade-in-up">Solução do Projeto</h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto font-body">
          Tecnologias, arquitetura e roadmap do sistema De Novo Não!
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-8 py-14 space-y-16">
        {/* Tecnologias */}
        <section>
          <h2 className="font-display font-bold text-tdb-teal text-2xl mb-6 text-center">Tecnologias Utilizadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {technologies.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in-up">
                <h3 className="font-display font-bold text-tdb-teal text-lg mb-2">{t.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed font-body">{t.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Arquitetura */}
        <section className="bg-tdb-teal rounded-2xl p-8 text-white">
          <h2 className="font-display font-bold text-2xl mb-4">Arquitetura do Sistema</h2>
          <div className="font-body text-sm text-white/80 space-y-2">
            <p>React (front-end) → <strong className="text-tdb-yellow">Java</strong> (API REST) → <strong className="text-tdb-yellow">Oracle DB</strong></p>
            <p>Java → <strong className="text-tdb-yellow">Python / FastAPI</strong> (IA) → retorno ao front</p>
            <p>React → <strong className="text-tdb-yellow">ViaCEP</strong> (preenchimento automático de endereço)</p>
          </div>
        </section>

        {/* Roadmap */}
        <section>
          <h2 className="font-display font-bold text-tdb-teal text-2xl mb-6 text-center">Roadmap do Projeto</h2>
          <div className="space-y-4">
            {roadmap.map((step, index) => (
              <div key={step.stage} className="flex gap-4 items-start animate-fade-in-up" style={{ animationDelay: `${index * 0.08}s` }}>
                <div className="shrink-0 w-10 h-10 rounded-xl bg-tdb-teal text-white flex items-center justify-center font-display font-bold text-sm">
                  {index + 1}
                </div>
                <div className="bg-white rounded-xl p-4 flex-1 shadow-sm border border-gray-100">
                  <p className="text-xs text-tdb-green font-semibold font-body uppercase tracking-wide">{step.stage}</p>
                  <h3 className="font-display font-bold text-tdb-teal text-base">{step.title}</h3>
                  <p className="text-gray-500 text-sm font-body mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Links */}
        <section className="bg-gray-50 rounded-2xl p-8 text-center space-y-4">
          <h2 className="font-display font-bold text-tdb-teal text-xl">Materiais do Projeto</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://trello.com/invite/b/68ddc4897bcae36542cb9b4a/ATTIf42b43a5a6290d2060e49be9265cc490A66FF587/de-novo-nao"
              target="_blank" rel="noreferrer"
              className="bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition-colors font-body font-medium text-sm">
              📋 Trello — Backlogs
            </a>
            <a href="https://www.canva.com/design/DAG4Axfrhkc/V-gzqKDMzEQVUtIJONnJQQ/view"
              target="_blank" rel="noreferrer"
              className="bg-tdb-green text-white px-5 py-2 rounded-xl hover:bg-tdb-teal transition-colors font-body font-medium text-sm">
              💼 Modelo de Negócio
            </a>
          </div>
        </section>
      </div>
    </>
  )
}
