import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Layout    from './components/Layout'
import ERPLayout from './components/ERPLayout'

import Home              from './pages/Home'
import Sobre             from './pages/Sobre'
import FAQ               from './pages/FAQ'
import Contato           from './pages/Contato'
import Integrantes       from './pages/Integrantes'
import IntegranteDetalhe from './pages/IntegranteDetalhe'
import Solucao           from './pages/Solucao'
import NotFound          from './pages/NotFound'

import Dashboard   from './pages/erp/Dashboard'
import Pacientes   from './pages/erp/Pacientes'
import Dentistas   from './pages/erp/Dentistas'
import Voluntarios from './pages/erp/Voluntarios'
import Doadores    from './pages/erp/Doadores'
import Consultas   from './pages/erp/Consultas'
import Prontuarios from './pages/erp/Prontuarios'
import Campanhas   from './pages/erp/Campanhas'
import Doacoes     from './pages/erp/Doacoes'
import Materiais   from './pages/erp/Materiais'
import IA          from './pages/erp/IA'
import Relatorios  from './pages/erp/Relatorios'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index                  element={<Home />} />
          <Route path="sobre"           element={<Sobre />} />
          <Route path="faq"             element={<FAQ />} />
          <Route path="contato"         element={<Contato />} />
          <Route path="integrantes"     element={<Integrantes />} />
          <Route path="integrantes/:id" element={<IntegranteDetalhe />} />
          <Route path="solucao"         element={<Solucao />} />
        </Route>

        <Route path="/erp" element={<ERPLayout />}>
          <Route index                  element={<Dashboard />} />
          <Route path="pacientes"       element={<Pacientes />} />
          <Route path="dentistas"       element={<Dentistas />} />
          <Route path="voluntarios"     element={<Voluntarios />} />
          <Route path="doadores"        element={<Doadores />} />
          <Route path="consultas"       element={<Consultas />} />
          <Route path="prontuarios"     element={<Prontuarios />} />
          <Route path="campanhas"       element={<Campanhas />} />
          <Route path="doacoes"         element={<Doacoes />} />
          <Route path="materiais"       element={<Materiais />} />
          <Route path="ia"              element={<IA />} />
          <Route path="relatorios"      element={<Relatorios />} />
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="*"    element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
