'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [etudiants, setEtudiants] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'action_collective';

  const fetchEtudiants = async (query = '') => {
    setLoading(true);
    setError('');

    let q = supabase
      .from('etudiant')
      .select('nom, prenom, numero_telephone, quartier', { count: 'exact' })
      .order('nom', { ascending: true });

    if (query.trim()) {
      q = q.ilike('quartier', `%${query.trim()}%`);
    }

    const { data, error, count } = await q;

    if (error) {
      console.error('Erreur Supabase admin :', error);
      setError('Erreur lors du chargement : ' + error.message);
      setEtudiants([]);
      setTotalCount(0);
    } else {
      console.log('Données admin récupérées :', data?.length || 0, 'inscrits');
      setEtudiants(data || []);
      setTotalCount(count || 0);
    }

    setLoading(false);
  };

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setError('');
      fetchEtudiants();
    } else {
      setError('Mot de passe incorrect');
    }
  };

  const handleSearch = () => {
    fetchEtudiants(searchQuery);
  };

  const handleShowAll = () => {
    setSearchQuery('');
    fetchEtudiants('');
  };

  const handleRefresh = () => {
    fetchEtudiants(searchQuery);
  };

  const handlePrintPDF = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * { visibility: hidden; }
        .print-area, .print-area * { visibility: visible; }
        .print-area { position: absolute; left: 0; top: 0; width: 100%; }
        .no-print { display: none !important; }
        .page-break { page-break-before: always; }
      }
    `;
    document.head.appendChild(style);

    window.print();

    setTimeout(() => document.head.removeChild(style), 100);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setPasswordInput('');
    setEtudiants([]);
    setTotalCount(0);
    setSearchQuery('');
  };

  useEffect(() => {
    if (loggedIn) {
      fetchEtudiants();
    }
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 no-print">
          <h1 className="text-3xl font-bold text-center mb-3 text-gray-800">
            Espace Administrateur
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Président de la Mutuelle Action Collective
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-center font-medium">
              {error}
            </div>
          )}

          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Mot de passe administrateur"
            className="w-full border border-gray-300 rounded-lg px-5 py-4 mb-6 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition duration-200 shadow-md"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 print-area">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 no-print">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Administration Projet Transport
            </h1>
            <p className="text-gray-600 mt-2">
              Total inscrits :{' '}
              <span className="font-semibold text-blue-600">{totalCount}</span>
            </p>
          </div>
          <div className="flex gap-4 no-print">
            <button
              onClick={handleRefresh}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-md"
            >
              Rafraîchir
            </button>
            <button
              onClick={handlePrintPDF}
              disabled={etudiants.length === 0 || loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Imprimer / PDF
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-medium transition shadow-md"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8 no-print">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un quartier précis (ex: Charbonnage, Nzeng Ayong, PK12...)"
              className="flex-1 border border-gray-300 rounded-lg px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-bold transition shadow-md"
            >
              Rechercher
            </button>
            <button
              onClick={handleShowAll}
              className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-bold transition shadow-md"
            >
              Voir tous
            </button>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-xl mb-8 text-center no-print">
            {error}
          </div>
        )}

        {/* Résultats */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            Chargement des inscrits...
          </div>
        ) : etudiants.length === 0 ? (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-12 text-center text-gray-600">
            <p className="text-xl font-medium">Aucun inscrit trouvé</p>
            {searchQuery && <p className="mt-2">pour "{searchQuery}"</p>}
            <p className="mt-4 text-sm text-gray-500">
              Vérifiez que la table 'etudiant' contient des données dans Supabase.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden print-area">
            <div className="p-6 border-b border-gray-200 no-print">
              <p className="text-lg font-medium">
                {searchQuery.trim()
                  ? `Résultats pour "${searchQuery}" (${etudiants.length} étudiant(s))`
                  : `Tous les inscrits (${etudiants.length})`}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider">
                      Prénom
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider">
                      Quartier
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {etudiants.map((etudiant, index) => (
                    <tr key={index} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap font-medium text-gray-900">
                        {etudiant.nom}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-gray-900">
                        {etudiant.prenom}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-gray-600">
                        {etudiant.numero_telephone || '—'}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-gray-600">
                        {etudiant.quartier}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="text-center text-gray-500 text-sm mt-12 no-print">
          Institut Supérieur de Technologie & Mutuelle Action Collective – Projet Transport –{' '}
          {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
