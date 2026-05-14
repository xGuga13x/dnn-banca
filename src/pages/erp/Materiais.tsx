import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Material } from '../../types'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { FormField, inputClass } from '../../components/FormField'
import Badge from '../../components/Badge'
import EmptyState from '../../components/EmptyState'

const mockMateriais: Material[] = [
  { idMaterial: 1, nome: 'Luva cirúrgica',    descricao: 'Caixa com 100 unidades',   quantidade: 8,   unidade: 'cx'  },
  { idMaterial: 2, nome: 'Máscara descartável', descricao: 'Pacote com 50 unidades',  quantidade: 25,  unidade: 'pct' },
  { idMaterial: 3, nome: 'Fio dental',         descricao: 'Rolo 50m',                quantidade: 120, unidade: 'un'  },
  { idMaterial: 4, nome: 'Escova de dente',    descricao: 'Macia, adulto',            quantidade: 3,   unidade: 'un'  },
  { idMaterial: 5, nome: 'Pasta de dente',     descricao: 'Tubo 90g',                quantidade: 45,  unidade: 'un'  },
  { idMaterial: 6, nome: 'Anestésico local',   descricao: 'Ampola 1,8ml',            quantidade: 2,   unidade: 'cx'  },
]

const ESTOQUE_BAIXO = 10

type FormData = Omit<Material, 'idMaterial'>

export default function Materiais() {
  useEffect(() => { document.title = 'Materiais | De Novo Não! ERP' }, [])

  const [materiais, setMateriais] = useState<Material[]>(mockMateriais)
  const [search, setSearch]       = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState<Material | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  const filtered = materiais.filter((m) =>
    m.nome.toLowerCase().includes(search.toLowerCase())
  )

  const estoqueBaixo = materiais.filter((m) => m.quantidade < ESTOQUE_BAIXO).length

  const openNew = () => { setEditing(null); reset(); setModalOpen(true) }
  const openEdit = (m: Material) => {
    setEditing(m)
    reset({ nome: m.nome, descricao: m.descricao, quantidade: m.quantidade, unidade: m.unidade })
    setModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (!confirm('Remover este material?')) return
    setMateriais((prev) => prev.filter((m) => m.idMaterial !== id))
  }

  const onSubmit = (data: FormData) => {
    const qty = Number(data.quantidade)
    if (editing) {
      setMateriais((prev) => prev.map((m) => m.idMaterial === editing.idMaterial ? { ...m, ...data, quantidade: qty } : m))
    } else {
      setMateriais((prev) => [...prev, { ...data, idMaterial: Date.now(), quantidade: qty }])
    }
    setModalOpen(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-tdb-teal text-3xl">Materiais</h1>
          <p className="text-gray-400 font-body text-sm">
            {materiais.length} itens cadastrados
            {estoqueBaixo > 0 && (
              <span className="ml-2 text-red-500 font-semibold">· ⚠️ {estoqueBaixo} com estoque baixo</span>
            )}
          </p>
        </div>
        <Button onClick={openNew}>+ Novo Material</Button>
      </div>

      {/* Busca */}
      <input type="text" placeholder="Buscar material..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        className={inputClass + ' max-w-sm'} />

      {/* Cards de materiais */}
      {filtered.length === 0
        ? <EmptyState icon="🧰" title="Nenhum material encontrado" />
        : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((m) => {
              const baixo = m.quantidade < ESTOQUE_BAIXO
              return (
                <div
                  key={m.idMaterial}
                  className={`bg-white rounded-2xl p-5 shadow-sm border transition-all animate-fade-in-up
                    ${baixo ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-display font-bold text-tdb-teal text-base leading-tight">{m.nome}</h3>
                    {baixo && <Badge label="Baixo" className="bg-red-100 text-red-600 shrink-0 ml-2" />}
                  </div>
                  {m.descricao && <p className="text-gray-400 text-xs font-body mb-3">{m.descricao}</p>}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className={`font-display font-extrabold text-3xl ${baixo ? 'text-red-500' : 'text-tdb-teal'}`}>
                        {m.quantidade}
                      </p>
                      <p className="text-gray-400 text-xs font-body">{m.unidade ?? 'unidades'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(m)} className="text-tdb-teal hover:underline text-xs font-medium">Editar</button>
                      <button onClick={() => handleDelete(m.idMaterial)} className="text-red-400 hover:underline text-xs font-medium">Remover</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      }

      {/* Modal */}
      <Modal open={modalOpen} title={editing ? 'Editar Material' : 'Novo Material'} onClose={() => setModalOpen(false)} size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Nome do material" error={errors.nome?.message} required>
            <input type="text" {...register('nome', { required: 'Obrigatório' })} className={inputClass} />
          </FormField>
          <FormField label="Descrição">
            <input type="text" {...register('descricao')} className={inputClass} placeholder="Ex: Caixa com 100 unidades" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Quantidade" error={errors.quantidade?.message} required>
              <input type="number" min="0"
                {...register('quantidade', { required: 'Obrigatório', min: { value: 0, message: 'Não pode ser negativo' } })}
                className={inputClass} />
            </FormField>
            <FormField label="Unidade">
              <input type="text" {...register('unidade')} className={inputClass} placeholder="un, cx, pct..." />
            </FormField>
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editing ? 'Salvar' : 'Cadastrar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
