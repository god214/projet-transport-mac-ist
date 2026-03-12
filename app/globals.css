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
  ],
  ligne3: [
    'Ntoum',
    'Poste de contrôle de la gendarmerie',
    'Nzobéré',
    'Ancien motel',
    'Les eaux et forêts',
    'Les 2 lions',
    'Le lac',
    'Le bar bleu',
    'Le château',
    'Nkolassi',
    'Nkoltang',
    'Florentine',
    'Pk27',
    'Poste de contrôle d\'essassa',
    'Monastère',
    'Thégué thégué',
    'Berthe et jean',
    'Sortie d\'Olam',
    'Garage',
    'Pk14',
    'Entré ou sortie bikélé',
    'Pk13',
    'Pk12'
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
  const [ligneSelectionnee, setLigneSelectionnee] = useState<'ligne1' | 'ligne2' | 'ligne3' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    const nomTrim = form.nom.trim();
    const prenomTrim = form.prenom.trim();
    const telephoneTrim = form.telephone.trim();
    const quartierTrim = form.quartier.trim();

    if (!nomTrim || !prenomTrim || !telephoneTrim || !quartierTrim) {
      setMessage('Tous les champs sont obligatoires (nom, prénom, téléphone, quartier).');
      setType('danger');
      setIsSubmitting(false);
      return;
    }

    // Vérification anti-doublon (nom + prénom + téléphone + quartier)
    let query = supabase
      .from('etudiant')
      .select('id')
      .eq('nom', nomTrim)
      .eq('prenom', prenomTrim)
      .eq('numero_telephone', telephoneTrim)
      .eq('quartier', quartierTrim);

    const { data: existing, error: checkError } = await query.maybeSingle();

    if (checkError) {
      console.error('Erreur lors de la vérification :', checkError);
      setMessage('Erreur lors de la vérification de ton inscription.');
      setType('danger');
      setIsSubmitting(false);
      return;
    }

    if (existing) {
      setMessage('Tu t’es déjà inscrit avec ces informations (nom, prénom, téléphone, quartier).');
      setType('danger');
      setIsSubmitting(false);
      return;
    }

    // Insertion
    const { error } = await supabase
      .from('etudiant')
      .insert([{
        nom: nomTrim,
        prenom: prenomTrim,
        numero_telephone: telephoneTrim,
        quartier: quartierTrim
      }]);

    if (error) {
      console.error('Erreur Supabase lors de l\'inscription :', error);
      if (error.code === '23505') {
        setMessage('Cette combinaison existe déjà dans la base.');
      } else {
        setMessage('Erreur lors de l\'inscription : ' + error.message);
      }
      setType('danger');
    } else {
      setMessage(`Inscription réussie ! Bienvenue ${prenomTrim} ${nomTrim} 🎉`);
      setType('success');
      setForm({ nom: '', prenom: '', telephone: '', quartier: '' });
      setLigneSelectionnee(null);
    }

    setIsSubmitting(false);
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

            {/* Téléphone - maintenant obligatoire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
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
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setLigneSelectionnee('ligne1')}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 border ${
                      ligneSelectionnee === 'ligne1'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Ligne 1
                  </button>
                  <span className="text-xs text-gray-600">Charbonnage-Bikélé</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setLigneSelectionnee('ligne2')}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 border ${
                      ligneSelectionnee === 'ligne2'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Ligne 2
                  </button>
                  <span className="text-xs text-gray-600">Carrefour SNI-Bikélé</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setLigneSelectionnee('ligne3')}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 border ${
                      ligneSelectionnee === 'ligne3'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Ligne 3
                  </button>
                  <span className="text-xs text-gray-600">Ntoum-Bikélé</span>
                </div>
              </div>

              {ligneSelectionnee && (
                <p className="text-sm text-gray-600 mt-1 text-center">
                  {ligneSelectionnee === 'ligne1'
                    ? 'Ligne 1 : Charbonnage-Bikélé'
                    : ligneSelectionnee === 'ligne2'
                      ? 'Ligne 2 : Carrefour SNI-Bikélé'
                      : 'Ligne 3 : Ntoum-Bikélé'}{' '}
                  sélectionnée
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
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white font-bold py-4 rounded-lg text-lg transition duration-200 shadow-md mt-8 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Vérification en cours...' : "S'inscrire au projet transport"}
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
