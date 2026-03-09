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
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    quartier: ''
  });
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'danger'>('success');
  const [ligneSelectionnee, setLigneSelectionnee] = useState<'ligne1' | 'ligne2' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const nomTrim = form.nom.trim();
    const prenomTrim = form.prenom.trim();
    const telephoneTrim = form.telephone.trim();
    const quartierTrim = form.quartier.trim();

    if (!nomTrim || !prenomTrim || !quartierTrim) {
      setMessage('Nom, prénom et quartier sont obligatoires.');
      setType('danger');
      return;
    }

    const { error } = await supabase
      .from('etudiant')
      .insert([{
        nom: nomTrim,
        prenom: prenomTrim,
        numero_telephone: telephoneTrim || null,
        quartier: quartierTrim
      }]);

    if (error) {
      console.error('Erreur Supabase lors de l\'inscription :', error);
      setMessage('Erreur lors de l\'inscription : ' + error.message);
      setType('danger');
    } else {
      setMessage(`Inscription réussie ! Bienvenue ${prenomTrim} ${nomTrim} 🎉`);
      setType('success');
      setForm({ nom: '', prenom: '', telephone: '', quartier: '' });
      setLigneSelectionnee(null);
    }
  };

  const quartiers = ligneSelectionnee ? lignes[ligneSelectionnee] : [];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Logos */}
        <div className="pt-10 px-10 flex justify-between items-center">
          <img
            src="/img/AC.jpg"
            alt="Mutuelle Action Collective"
            className="h-20 object-contain"
          />
          <img
            src="/img/ist.jpeg"
            alt="Institut Supérieur de Technologie"
            className="h-24 object-contain"
          />
        </div>

        <div className="px-10 pb-10">
          <h2 className="text-3xl font-bold text-center mt-8 text-gray-900">
            Inscription au Projet Transport
          </h2>
          <p className="text-center text-blue-600 font-medium mt-2">
            Institut Supérieur de Technologie × Mutuelle Action Collective
          </p>

          {message && (
            <div
              className={`mt-6 p-4 rounded-lg text-center font-medium ${
                type === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Votre nom"
              />
            </div>

            {/* Prénom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Votre prénom"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                placeholder="Ex: 0777123456"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Ligne de transport */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Votre ligne de transport <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <button
                  type="button"
                  onClick={() => setLigneSelectionnee('ligne1')}
                  className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 border ${
                    ligneSelectionnee === 'ligne1'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  Ligne 1
                </button>
                <button
                  type="button"
                  onClick={() => setLigneSelectionnee('ligne2')}
                  className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 border ${
                    ligneSelectionnee === 'ligne2'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  Ligne 2
                </button>
              </div>

              {ligneSelectionnee && (
                <p className="text-sm text-gray-600 mt-1">
                  {ligneSelectionnee === 'ligne1' ? 'Ligne 1' : 'Ligne 2'} sélectionnée
                </p>
              )}
            </div>

            {/* Quartier */}
            {ligneSelectionnee && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Votre quartier <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.quartier}
                  onChange={(e) => setForm({ ...form, quartier: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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

            {/* Bouton Soumettre */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg text-lg transition duration-200 shadow-md mt-8"
            >
              S'inscrire au projet transport
            </button>
          </form>

          <a
            href="/admin"
            className="block text-center mt-8 text-gray-600 hover:text-blue-600 underline text-sm"
          >
            Espace Administrateur (Président MAC)
          </a>
        </div>
      </div>
    </div>
  );
}
