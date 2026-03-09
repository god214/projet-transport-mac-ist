'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Définition des lignes et quartiers
const lignes = {
  ligne1: [
    'Charbonnage',
    'Rond point de la démocratie',
    'Nzeng Ayong',
    'Échangeur de la caisse',
    'PK5',
    'PK6',
    'PK7',
    'PK8',
    'PK9',
    'PK10',
    'PK11',
    'PK12'
  ],
  ligne2: [
    'Carrefour SNI',
    'Petro',
    'Acaé',
    'IAI',
    'Awendjé',
    'Plein ciel',
    'PK5',
    'PK6',
    'PK7',
    'PK8',
    'PK9',
    'PK10',
    'PK11',
    'PK12'
  ]
};

export default function Home() {
  const [form, setForm] = useState({ nom: '', prenom: '', telephone: '', quartier: '' });
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'danger'>('success');
  const [ligneSelectionnee, setLigneSelectionnee] = useState<'ligne1' | 'ligne2' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!form.nom || !form.prenom || !form.quartier) {
      setMessage('Nom, prénom et quartier sont obligatoires.');
      setType('danger');
      return;
    }

    const { error } = await supabase
      .from('etudiant')
      .insert([{
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        numero_telephone: form.telephone.trim() || null,
        quartier: form.quartier
      }]);

    if (error) {
      setMessage('Erreur : ' + error.message);
      setType('danger');
      console.error('Erreur Supabase :', error);
    } else {
      setMessage(`Inscription réussie ! Bienvenue ${form.prenom} ${form.nom} 🎉`);
      setType('success');
      setForm({ nom: '', prenom: '', telephone: '', quartier: '' });
      setLigneSelectionnee(null);
    }
  };

  const quartiers = ligneSelectionnee ? lignes[ligneSelectionnee] : [];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="pt-8 px-8 flex justify-between items-center">
          <img src="/img/AC.jpg" alt="Mutuelle Action Collective" className="h-20 object-contain" />
          <img src="/img/ist.jpeg" alt="Institut Supérieur de Technologie" className="h-24 object-contain" />
        </div>

        <div className="px-8 pb-8">
          <h2 className="text-2xl font-bold text-center mt-6">Inscription au Projet Transport</h2>
          <p className="text-center text-blue-600 font-medium">
            Institut Supérieur de Technologie × Mutuelle Action Collective
          </p>

          {message && (
            <div className={`mt-6 p-4 rounded-lg text-center ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nom <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={form.nom}
                onChange={e => setForm({ ...form, nom: e.target.value })}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prénom <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={form.prenom}
                onChange={e => setForm({ ...form, prenom: e.target.value })}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Numéro de téléphone</label>
              <input
                type="tel"
                value={form.telephone}
                onChange={e => setForm({ ...form, telephone: e.target.value })}
                placeholder="Ex: 0777123456"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sélection de la ligne */}
            <div>
              <label className="block text-sm font-medium mb-1">Votre ligne de transport <span className="text-red-500">*</span></label>
              <div className="flex gap-4 mb-3">
                <button
                  type="button"
                  onClick={() => setLigneSelectionnee('ligne1')}
                  className={`flex-1 py-3 rounded-lg font-medium transition ${
                    ligneSelectionnee === 'ligne1'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Ligne 1
                </button>
                <button
                  type="button"
                  onClick={() => setLigneSelectionnee('ligne2')}
                  className={`flex-1 py-3 rounded-lg font-medium transition ${
                    ligneSelectionnee === 'ligne2'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Ligne 2
                </button>
              </div>

              {ligneSelectionnee && (
                <p className="text-sm text-gray-600 mt-2">
                  {ligneSelectionnee === 'ligne1' ? 'Ligne 1' : 'Ligne 2'} sélectionnée
                </p>
              )}
            </div>

            {/* Affichage des quartiers seulement si une ligne est sélectionnée */}
            {ligneSelectionnee && (
              <div>
                <label className="block text-sm font-medium mb-1">Votre quartier <span className="text-red-500">*</span></label>
                <select
                  required
                  value={form.quartier}
                  onChange={e => setForm({ ...form, quartier: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choisissez votre quartier --</option>
                  {quartiers.map((q, index) => (
                    <option key={index} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg text-lg transition mt-6"
            >
              S'inscrire au projet transport
            </button>
          </form>

          <a href="/admin" className="block text-center mt-6 text-gray-600 hover:text-blue-600 underline">
            Espace Administrateur (Président MAC)
          </a>
        </div>
      </div>
    </div>
  );
}