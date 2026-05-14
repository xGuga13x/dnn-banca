import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Paciente } from '../../types'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { FormField, inputClass } from '../../components/FormField'
import Badge from '../../components/Badge'
import EmptyState from '../../components/EmptyState'
import { ViaCEP } from '../../services/api'
import { formatCPF } from '../../utils/formatters'
import { useUFs, useMunicipios } from '../../hooks/useIBGE'

const mockPacientes: Paciente[] = [
  { id: 1, idPaciente: 1, nome: 'Maria Oliveira',  cpf: '12345678901', email: 'maria@email.com',  telefone: '11999990001', dataNascimento: '1990-05-10', programa: 'DENTISTAS_DO_BEM',    ativo: true },
  { id: 2, idPaciente: 2, nome: 'Pedro Santos',    cpf: '23456789012', email: 'pedro@email.com',  telefone: '11999990002', dataNascimento: '1985-03-22', programa: 'APOLONICAS_DO_BEM', ativo: true },
  { id: 3, idPaciente: 3, nome: 'Lucia Ferreira',  cpf: '34567890123', email: 'lucia@email.com',  telefone: '11999990003', dataNascimento: '2000-11-15', programa: 'DENTISTAS_DO_BEM',    ativo: false },
]

type FormData = Omit<Paciente, 'id' | 'idPaciente' | 'ativo'>

export default function Pacientes() {
  useEffect(() => { document.title = 'Pacientes | De Novo Não! ERP' }, [])

  const [pacientes, setPacientes]   = useState<Paciente[]>(mockPacientes)
  const [search, setSearch]         = useState('')
  const [modalOpen, setModalOpen]   = useState(false)
  const [editing, setEditing]       = useState<Paciente | null>(null)
  const [loadingCep, setLoadingCep] = useState(false)
  const [ufSelecionada, setUfSelecionada] = useState('')

  // APIs externas
  const { ufs, loading: loadingUFs }             = useUFs()
  const { municipios, loading: loadingMunicipios } = useMunicipios(ufSelecionada)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>()
  const ufWatched = watch('uf', '')

  // Sincroniza UF selecionada com o hook de municípios
  useEffect(() => {
    setUfSelecionada(ufWatched ?? '')
    setValue('cidade', '') // limpa cidade ao trocar UF
  }, [ufWatched, setValue])

  const filtered = pacientes.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase()) || p.cpf.includes(search)
  )

  const openNew = () => { setEditing(null); reset(); setUfSelecionada(''); setModalOpen(true) }
  const openEdit = (p: Paciente) => {
    setEditing(p)
    setUfSelecionada(p.uf ?? '')
    reset({
      nome: p.nome, cpf: p.cpf, email: p.email, telefone: p.telefone,
      dataNascimento: p.dataNascimento, programa: p.programa,
      cep: p.cep, logradouro: p.logradouro, numero: p.numero,
      bairro: p.bairro, cidade: p.cidade, uf: p.uf,
    })
    setModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (!confirm('Desativar este paciente?')) return
    setPacientes(prev => prev.map(p => p.id === id ? { ...p, ativo: false } : p))
  }

  // ViaCEP — preenche endereço pelo CEP
  const handleCep = async (cep: string) => {
    if (cep.replace(/\D/g, '').length !== 8) return
    setLoadingCep(true)
    try {
      const data = await ViaCEP.buscar(cep)
      setValue('logradouro', data.logradouro)
      setValue('bairro', data.bairro)
      setValue('uf', data.uf)
      setUfSelecionada(data.uf)
      // Aguarda municípios carregarem e então define a cidade
      setTimeout(() => setValue('cidade', data.localidade), 600)
    } catch { /* CEP inválido */ }
    finally { setLoadingCep(false) }
  }

  const onSubmit = (data: FormData) => {
    if (editing) {
      setPacientes(prev => prev.map(p => p.id === editing.id ? { ...p, ...data } : p))
    } else {
      const novo: Paciente = { ...data, id: Date.now(), idPaciente: Date.now(), ativo: true }
      setPacientes(prev => [...prev, novo])
    }
    setModalOpen(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-tdb-teal text-3xl">Pacientes</h1>
          <p className="text-gray-500 text-sm mt-1">
            {pacientes.filter(p => p.ativo).length} ativos · {pacientes.length} no total
          </p>
        </div>
        <Button onClick={openNew}>+ Novo Paciente</Button>
      </div>

      {/* Busca */}
      <input
        type="search" placeholder="Buscar por nome ou CPF..."
        className={inputClass}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Tabela */}
      {filtered.length === 0 ? (
        <EmptyState title="Nenhum paciente" message="Cadastre um novo paciente para começar." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                {['Nome', 'CPF', 'Programa', 'Telefone', 'Status', 'Ações'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{p.nome}</td>
                  <td className="px-4 py-3 text-gray-500">{formatCPF(p.cpf)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.programa === 'DENTISTAS_DO_BEM' ? 'success' : 'warning'}>
                      {p.programa === 'DENTISTAS_DO_BEM' ? 'Dentistas' : 'Apolônias'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.telefone}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.ativo ? 'success' : 'error'}>{p.ativo ? 'Ativo' : 'Inativo'}</Badge>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => openEdit(p)}>Editar</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>Desativar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? 'Editar Paciente' : 'Novo Paciente'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <FormField label="Nome completo" error={errors.nome?.message}>
            <input className={inputClass} placeholder="Nome do paciente"
              {...register('nome', { required: 'Nome obrigatório' })} />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="CPF" error={errors.cpf?.message}>
              <input className={inputClass} placeholder="00000000000" maxLength={11}
                {...register('cpf', { required: 'CPF obrigatório', minLength: { value: 11, message: 'CPF inválido' } })} />
            </FormField>
            <FormField label="Data de nascimento" error={errors.dataNascimento?.message}>
              <input type="date" className={inputClass}
                {...register('dataNascimento', { required: 'Data obrigatória' })} />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Telefone" error={errors.telefone?.message}>
              <input className={inputClass} placeholder="(11) 99999-0000"
                {...register('telefone', { required: 'Telefone obrigatório' })} />
            </FormField>
            <FormField label="E-mail">
              <input type="email" className={inputClass} placeholder="email@exemplo.com"
                {...register('email')} />
            </FormField>
          </div>

          <FormField label="Programa" error={errors.programa?.message}>
            <select className={inputClass} {...register('programa', { required: 'Selecione o programa' })}>
              <option value="">Selecione...</option>
              <option value="DENTISTAS_DO_BEM">🦷 Dentistas do Bem</option>
              <option value="APOLONICAS_DO_BEM">💛 Apolônias do Bem</option>
            </select>
          </FormField>

          {/* Endereço via ViaCEP + IBGE */}
          <div className="border-t pt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Endereço
              <span className="ml-2 text-tdb-green normal-case font-normal">
                · preenchimento automático via ViaCEP + IBGE
              </span>
            </p>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="col-span-1">
                <FormField label="CEP">
                  <div className="relative">
                    <input className={inputClass} placeholder="00000-000" maxLength={9}
                      {...register('cep', {
                        onChange: e => handleCep(e.target.value)
                      })} />
                    {loadingCep && (
                      <span className="absolute right-2 top-2 text-xs text-gray-400">🔍</span>
                    )}
                  </div>
                </FormField>
              </div>
              <div className="col-span-2">
                <FormField label="Logradouro">
                  <input className={inputClass} placeholder="Rua, Av..."
                    {...register('logradouro')} />
                </FormField>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <FormField label="Número">
                <input className={inputClass} placeholder="Nº"
                  {...register('numero')} />
              </FormField>
              <div className="col-span-2">
                <FormField label="Bairro">
                  <input className={inputClass} placeholder="Bairro"
                    {...register('bairro')} />
                </FormField>
              </div>
            </div>

            {/* UF via IBGE */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label={`Estado ${loadingUFs ? '(carregando...)' : '— via IBGE'}`}>
                <select className={inputClass} {...register('uf')}
                  disabled={loadingUFs}
                  onChange={e => {
                    setValue('uf', e.target.value)
                    setUfSelecionada(e.target.value)
                    setValue('cidade', '')
                  }}>
                  <option value="">Selecione o estado...</option>
                  {ufs.map(uf => (
                    <option key={uf.sigla} value={uf.sigla}>
                      {uf.sigla} — {uf.nome}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Município via IBGE */}
              <FormField label={loadingMunicipios ? 'Cidade (carregando...)' : 'Cidade — via IBGE'}>
                <select className={inputClass} {...register('cidade')}
                  disabled={!ufSelecionada || loadingMunicipios}>
                  <option value="">
                    {!ufSelecionada
                      ? 'Selecione o estado primeiro'
                      : loadingMunicipios
                        ? 'Carregando cidades...'
                        : 'Selecione a cidade...'}
                  </option>
                  {municipios.map(m => (
                    <option key={m.id} value={m.nome}>{m.nome}</option>
                  ))}
                </select>
              </FormField>
            </div>

            {ufSelecionada && !loadingMunicipios && municipios.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                📍 {municipios.length} cidades encontradas para {ufSelecionada}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editing ? 'Salvar alterações' : 'Cadastrar paciente'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
