import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Calendar, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV ? 'http://localhost:3001/api/phrases' : '/api/phrases'
);

function App() {
  const [phrases, setPhrases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newPhraseText, setNewPhraseText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Fetch phrases on load
  useEffect(() => {
    fetchPhrases();
  }, []);

  const fetchPhrases = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPhrases(data);
    } catch (error) {
      console.error("Error fetching phrases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newPhraseText.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newPhraseText }),
      });
      const newPhrase = await res.json();
      setPhrases([newPhrase, ...phrases]); // Add to top
      setNewPhraseText('');
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding phrase:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres borrar esta frase?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setPhrases(phrases.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const startEdit = (phrase) => {
    setEditingId(phrase.id);
    setEditText(phrase.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editText }),
      });
      const updated = await res.json();
      setPhrases(phrases.map(p => (p.id === id ? updated : p)));
      setEditingId(null);
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-safe">

      {/* Header Fijo */}
      <header className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/50 px-6 py-5 shadow-2xl shadow-black/20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light tracking-wide text-zinc-50">
              Frases
            </h1>
            <p className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase mt-0.5">Colección Personal</p>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`p-3 rounded-full transition-all duration-500 ${isAdding
              ? 'bg-zinc-800 text-zinc-400 rotate-45 scale-95'
              : 'bg-zinc-100 text-zinc-950 hover:bg-white hover:scale-110 shadow-lg shadow-zinc-100/10'
              }`}
          >
            <Plus size={22} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 pt-8 pb-24">

        {/* Formulario de Agregar (Animado) */}
        <div className={`overflow-hidden transition-all duration-500 ease-out ${isAdding ? 'max-h-56 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
          <form onSubmit={handleAdd} className="bg-zinc-900/80 backdrop-blur-sm p-5 rounded-3xl border border-zinc-800/60 shadow-2xl shadow-black/40">
            <textarea
              autoFocus
              placeholder="Escribe algo memorable..."
              className="w-full text-base p-0 bg-transparent border-none focus:ring-0 resize-none placeholder:text-zinc-600 text-zinc-200 mb-4 leading-relaxed"
              rows={3}
              value={newPhraseText}
              onChange={(e) => setNewPhraseText(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-5 py-2.5 text-xs font-medium text-zinc-500 rounded-xl hover:bg-zinc-800/50 transition-all tracking-wide uppercase"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!newPhraseText.trim()}
                className="bg-zinc-100 text-zinc-950 px-6 py-2.5 rounded-xl text-xs font-bold shadow-xl shadow-zinc-100/5 hover:bg-white hover:shadow-zinc-100/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all tracking-wide uppercase"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>

        {/* Lista de Frases */}
        <div className="flex flex-col gap-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-10 h-10 border-2 border-zinc-800 border-t-zinc-400 rounded-full animate-spin"></div>
              <p className="text-zinc-600 text-sm animate-pulse tracking-wide">Cargando frases...</p>
            </div>
          ) : phrases.length === 0 ? (
            <div className="text-center py-32 text-zinc-600">
              <div className="text-5xl mb-4 opacity-20">✨</div>
              <p className="text-sm tracking-wide">Aún no hay frases.</p>
              <p className="text-xs text-zinc-700 mt-2">Comienza tu colección</p>
            </div>
          ) : (
            phrases.map((phrase, index) => (
              <div
                key={phrase.id}
                className="group relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/40 transition-all duration-300 hover:bg-zinc-900/80 hover:border-zinc-700/60 hover:shadow-xl hover:shadow-black/20"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {editingId === phrase.id ? (
                  // Edit Mode
                  <div className="animate-in fade-in zoom-in-95 duration-300">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full text-base p-3 bg-zinc-800/50 text-zinc-200 rounded-xl border border-zinc-700/50 focus:ring-2 focus:ring-zinc-600 focus:border-transparent resize-none mb-4 leading-relaxed"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={cancelEdit}
                        className="p-2.5 text-zinc-500 hover:bg-zinc-800/50 rounded-xl transition-all"
                      >
                        <X size={18} strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => saveEdit(phrase.id)}
                        className="p-2.5 bg-zinc-100 text-zinc-950 rounded-xl shadow-lg hover:scale-105 hover:bg-white transition-all"
                      >
                        <Save size={18} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2 text-[9px] uppercase font-bold tracking-widest text-zinc-600 bg-zinc-800/40 px-2.5 py-1.5 rounded-lg border border-zinc-800/60">
                        <Calendar size={11} strokeWidth={2.5} />
                        {phrase.date ? format(new Date(phrase.date), "d MMM yyyy", { locale: es }) : 'Sin fecha'}
                      </div>

                      {/* Actions (always visible) */}
                      <div className="flex gap-1.5 transition-all duration-300">
                        <button
                          onClick={() => startEdit(phrase)}
                          className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition-all"
                        >
                          <Edit2 size={15} strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => handleDelete(phrase.id)}
                          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all"
                        >
                          <Trash2 size={15} strokeWidth={2} />
                        </button>
                      </div>
                    </div>

                    <p className="text-lg font-light leading-relaxed text-zinc-300 whitespace-pre-wrap tracking-wide">
                      "{phrase.text}"
                    </p>

                    {/* Subtle gradient line */}
                    <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-zinc-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Gradient fade at bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none" />
    </div>
  );
}

export default App;
