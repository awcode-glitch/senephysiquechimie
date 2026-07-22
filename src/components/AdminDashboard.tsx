import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { saveCourse, deleteCourse, deleteCourses, seedCoursesIfEmpty } from '../lib/coursesStore';
import { uploadCoursePdf, MAX_PDF_BYTES, formatFileSize } from '../lib/cloudinary';
import { Course } from '../types';
import { SEED_COURSE_IDS } from '../data/courses';
import { Lock, ShieldCheck, Plus, Pencil, Trash2, X, Save, ArrowLeft, Filter, Search, Upload, FileCheck2, LogOut, KeyRound, Sparkles } from 'lucide-react';

interface AdminDashboardProps {
  courses: Course[];
  onClose: () => void;
}

const LEVEL_LABELS: Record<Course['level'], string> = {
  TS: 'Terminale S (TS)',
  '1S': 'Première S (1S)',
  '2S': 'Seconde S (2S)',
  '3eme': 'Troisième (3ème)',
  '4eme': 'Quatrième (4ème)',
  Fascicules: 'Fascicules & Livres',
  CSM: 'Cours Santé Militaire (CSM)',
  CGS: 'Concours Général Sénégalais (CGS)',
  BAC: 'Annales de BAC'
};

const LEVEL_ORDER: Course['level'][] = ['TS', '1S', '2S', '3eme', '4eme', 'Fascicules', 'CSM', 'CGS', 'BAC'];
const SUBJECTS: Course['subject'][] = ['Physique', 'Chimie', 'Mixte'];

// These levels use the year/tour/série archive layout (BacArchive) on the public site
const ARCHIVE_LEVELS: Course['level'][] = ['BAC', 'CSM', 'CGS'];

const BAC_ROUNDS: NonNullable<Course['examRound']>[] = ['Premier tour', 'Second tour'];
const BAC_SERIES = ['S1', 'S2', 'L2'];
const DOC_TYPES: NonNullable<Course['docType']>[] = ['Cours', 'TD', 'Évaluation'];

const emptyForm = {
  title: '',
  chapterNumber: '',
  level: 'TS' as Course['level'],
  subject: 'Physique' as Course['subject'],
  description: '',
  downloadsCount: '0',
  tags: '',
  publishDate: new Date().toISOString().slice(0, 10),
  youtubeUrl: '',
  docType: 'Cours' as NonNullable<Course['docType']>,
  examYear: new Date().getFullYear().toString(),
  examRound: 'Premier tour' as NonNullable<Course['examRound']>,
  examSeries: 'S1'
};

type FormState = typeof emptyForm;

export default function AdminDashboard({ courses, onClose }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const [filterLevel, setFilterLevel] = useState<'All' | Course['level']>('All');
  const [filterSubject, setFilterSubject] = useState<'All' | Course['subject']>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingMeta, setEditingMeta] = useState<{ fileSize: string; pdfUrl: string } | null>(null);
  const [pdfUpload, setPdfUpload] = useState<{ file: File; fileSize: string; fileName: string } | null>(null);
  const [pdfError, setPdfError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, emailInput.trim(), passwordInput);
      setIsAuthenticated(true);
      // First login ever: populates Firestore with the starter courses if the collection is still empty.
      seedCoursesIfEmpty().catch((seedErr) => console.error('Erreur de seed Firestore', seedErr));
    } catch (err) {
      setAuthError('Identifiants incorrects.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!emailInput.trim()) {
      setAuthError('Saisissez votre e-mail ci-dessus, puis cliquez sur "Mot de passe oublié".');
      return;
    }
    setAuthError('');
    try {
      await sendPasswordResetEmail(auth, emailInput.trim());
      setResetSent(true);
    } catch (err) {
      setAuthError("Impossible d'envoyer l'e-mail de réinitialisation. Vérifiez l'adresse saisie.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
    setEditingMeta(null);
    setPdfUpload(null);
    setPdfError('');
  };

  const startEdit = (course: Course) => {
    setForm({
      title: course.title,
      chapterNumber: course.chapterNumber ? String(course.chapterNumber) : '',
      level: course.level,
      subject: course.subject,
      description: course.description,
      downloadsCount: String(course.downloadsCount),
      tags: course.tags.join(', '),
      publishDate: course.publishDate,
      youtubeUrl: course.youtubeUrl || '',
      docType: course.docType || 'Cours',
      examYear: course.examYear || new Date().getFullYear().toString(),
      examRound: course.examRound || 'Premier tour',
      examSeries: course.examSeries || 'S1'
    });
    setEditingId(course.id);
    setEditingMeta({ fileSize: course.fileSize, pdfUrl: course.pdfUrl });
    setPdfUpload(null);
    setPdfError('');
    setShowForm(true);
  };

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setPdfError('Le fichier doit être un PDF.');
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setPdfError(`Le fichier dépasse la taille maximale de ${formatFileSize(MAX_PDF_BYTES)}.`);
      return;
    }

    setPdfError('');
    setPdfUpload({ file, fileSize: formatFileSize(file.size), fileName: file.name });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;

    const id = editingId || `${form.level.toLowerCase()}-${Date.now()}`;

    setIsSaving(true);
    try {
      let pdfUrl = editingMeta?.pdfUrl ?? `#${id}`;
      let fileSize = editingMeta?.fileSize ?? '1.0 MB';

      if (pdfUpload) {
        pdfUrl = await uploadCoursePdf(pdfUpload.file);
        fileSize = pdfUpload.fileSize;
      }

      const updatedCourse: Course = {
        id,
        title: form.title.trim(),
        chapterNumber: form.chapterNumber ? Number(form.chapterNumber) : undefined,
        level: form.level,
        subject: form.subject,
        description: form.description.trim(),
        fileSize,
        downloadsCount: Number(form.downloadsCount) || 0,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        pdfUrl,
        publishDate: form.publishDate,
        youtubeUrl: form.youtubeUrl.trim() || undefined,
        docType: ARCHIVE_LEVELS.includes(form.level) ? undefined : form.docType,
        examYear: ARCHIVE_LEVELS.includes(form.level) ? form.examYear.trim() || undefined : undefined,
        examRound: ARCHIVE_LEVELS.includes(form.level) ? form.examRound : undefined,
        examSeries: form.level === 'BAC' ? form.examSeries.trim() || undefined : undefined
      };

      await saveCourse(updatedCourse);
      resetForm();
    } catch (err) {
      setPdfError("Erreur lors de l'enregistrement. Réessayez.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer définitivement ce cours ?')) {
      await deleteCourse(id);
    }
  };

  const [isCleaningDemo, setIsCleaningDemo] = useState(false);
  const demoCourseIds = courses.filter((c) => SEED_COURSE_IDS.includes(c.id)).map((c) => c.id);

  const handleCleanupDemo = async () => {
    if (!window.confirm(`Supprimer les ${demoCourseIds.length} cours de démonstration restants ?`)) return;
    setIsCleaningDemo(true);
    try {
      await deleteCourses(demoCourseIds);
    } finally {
      setIsCleaningDemo(false);
    }
  };

  const filteredCourses = courses.filter((c) => {
    if (filterLevel !== 'All' && c.level !== filterLevel) return false;
    if (filterSubject !== 'All' && c.subject !== filterSubject) return false;
    if (searchQuery.trim() && !c.title.toLowerCase().includes(searchQuery.trim().toLowerCase())) return false;
    return true;
  });

  // If not authenticated, show the Firebase login screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-8 shadow-md transition-colors duration-300">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-[#0056D2] border border-blue-100 mb-4">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Espace Enseignant</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Accès protégé — connectez-vous avec votre compte administrateur.</p>
        </div>
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <input
            type="email"
            autoFocus
            required
            value={emailInput}
            onChange={(e) => { setEmailInput(e.target.value); setAuthError(''); }}
            placeholder="Adresse e-mail"
            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
              authError ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-[#0056D2]'
            }`}
          />
          <input
            type="password"
            required
            value={passwordInput}
            onChange={(e) => { setPasswordInput(e.target.value); setAuthError(''); }}
            placeholder="Mot de passe"
            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
              authError ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-[#0056D2]'
            }`}
          />
          {authError && <p className="text-xs text-red-500 font-semibold">{authError}</p>}
          {resetSent && (
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5" /> E-mail de réinitialisation envoyé — vérifiez votre boîte de réception.
            </p>
          )}
          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-sm py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            {authLoading ? 'Connexion...' : 'Se connecter'}
          </button>
          <button type="button" onClick={handleForgotPassword} className="w-full text-xs text-[#0056D2] hover:text-blue-800 font-semibold text-center cursor-pointer">
            Mot de passe oublié ?
          </button>
          <button type="button" onClick={onClose} className="w-full text-xs text-slate-500 hover:text-slate-700 font-semibold text-center pt-1 cursor-pointer">
            Retour à l'accueil
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-[#0056D2] border border-blue-100">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Panneau d'Administration</h2>
            <p className="text-xs text-slate-500 font-medium">{courses.length} cours au total sur la plateforme.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
          <button onClick={onClose} className="inline-flex items-center gap-2 text-xs font-bold text-[#0056D2] hover:text-blue-800 transition-colors cursor-pointer">
            <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
          </button>
        </div>
      </div>

      {/* Add button + one-time demo cleanup */}
      <div className="flex justify-end items-center gap-3 mb-4">
        {demoCourseIds.length > 0 && (
          <button
            onClick={handleCleanupDemo}
            disabled={isCleaningDemo}
            className="inline-flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {isCleaningDemo ? 'Suppression...' : `Nettoyer les ${demoCourseIds.length} cours de démo`}
          </button>
        )}
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Ajouter un cours
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">{editingId ? 'Modifier le cours' : 'Nouveau cours'}</h3>
            <button type="button" onClick={resetForm} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">Titre</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-slate-300 focus:border-[#0056D2] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">Niveau</label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value as Course['level'] })}
                className="w-full border border-slate-300 focus:border-[#0056D2] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none transition-colors"
              >
                {LEVEL_ORDER.map((lvl) => <option key={lvl} value={lvl}>{LEVEL_LABELS[lvl]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">Matière</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value as Course['subject'] })}
                className="w-full border border-slate-300 focus:border-[#0056D2] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none transition-colors"
              >
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">N° Chapitre (optionnel)</label>
              <input
                type="number"
                value={form.chapterNumber}
                onChange={(e) => setForm({ ...form, chapterNumber: e.target.value })}
                className="w-full border border-slate-300 focus:border-[#0056D2] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {!ARCHIVE_LEVELS.includes(form.level) && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">Type de document</label>
              <select
                value={form.docType}
                onChange={(e) => setForm({ ...form, docType: e.target.value as NonNullable<Course['docType']> })}
                className="w-full border border-slate-300 focus:border-[#0056D2] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none transition-colors"
              >
                {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <p className="text-[10px] text-slate-400 font-medium mt-1">"Cours" = chapitre classique. Choisissez "TD" ou "Évaluation" pour que ce document apparaisse dans les liens rapides du menu de navigation.</p>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">Description</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-slate-300 focus:border-[#0056D2] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">Tags (séparés par une virgule)</label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Ex: Mécanique, Newton"
                className="w-full border border-slate-300 focus:border-[#0056D2] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">Date de publication</label>
              <input
                type="date"
                value={form.publishDate}
                onChange={(e) => setForm({ ...form, publishDate: e.target.value })}
                className="w-full border border-slate-300 focus:border-[#0056D2] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">Fichier PDF du cours</label>
            <label
              htmlFor="pdf-upload-input"
              className="flex items-center gap-3 w-full border border-dashed border-slate-300 hover:border-[#0056D2] rounded-xl px-3.5 py-3 text-sm cursor-pointer transition-colors"
            >
              {pdfUpload ? (
                <>
                  <FileCheck2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                  <span className="text-slate-700 font-semibold truncate">{pdfUpload.fileName}</span>
                  <span className="text-slate-400 text-xs shrink-0 ml-auto">{pdfUpload.fileSize}</span>
                </>
              ) : editingMeta && !editingMeta.pdfUrl.startsWith('#') ? (
                <>
                  <FileCheck2 className="h-4.5 w-4.5 text-[#0056D2] shrink-0" />
                  <span className="text-slate-700 font-semibold">PDF déjà attaché ({editingMeta.fileSize})</span>
                  <span className="text-slate-400 text-xs shrink-0 ml-auto">Cliquez pour le remplacer</span>
                </>
              ) : (
                <>
                  <Upload className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                  <span className="text-slate-500">Cliquez pour choisir un fichier PDF...</span>
                </>
              )}
            </label>
            <input
              id="pdf-upload-input"
              type="file"
              accept="application/pdf"
              onChange={handlePdfFileChange}
              className="hidden"
            />
            {pdfError && <p className="text-[10px] text-red-500 font-semibold mt-1">{pdfError}</p>}
            <p className="text-[10px] text-slate-400 font-medium mt-1">Taille maximale : {formatFileSize(MAX_PDF_BYTES)}.</p>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">Lien vidéo YouTube (optionnel)</label>
            <input
              type="url"
              value={form.youtubeUrl}
              onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full border border-slate-300 focus:border-[#0056D2] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none transition-colors"
            />
            <p className="text-[10px] text-slate-400 font-medium mt-1">Laissez vide pour utiliser une recherche YouTube automatique.</p>
          </div>

          {ARCHIVE_LEVELS.includes(form.level) && (
            <div className={`grid grid-cols-1 gap-4 p-4 rounded-xl bg-blue-50/40 border border-blue-100 ${form.level === 'BAC' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">Année de session</label>
                <input
                  type="text"
                  value={form.examYear}
                  onChange={(e) => setForm({ ...form, examYear: e.target.value })}
                  placeholder="Ex: 2026"
                  className="w-full border border-slate-300 focus:border-[#0056D2] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">Tour</label>
                <select
                  value={form.examRound}
                  onChange={(e) => setForm({ ...form, examRound: e.target.value as NonNullable<Course['examRound']> })}
                  className="w-full border border-slate-300 focus:border-[#0056D2] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none transition-colors"
                >
                  {BAC_ROUNDS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {form.level === 'BAC' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">Série</label>
                  <select
                    value={form.examSeries}
                    onChange={(e) => setForm({ ...form, examSeries: e.target.value })}
                    className="w-full border border-slate-300 focus:border-[#0056D2] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none transition-colors"
                  >
                    {BAC_SERIES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
              Annuler
            </button>
            <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50">
              <Save className="h-4 w-4" /> {isSaving ? 'Enregistrement...' : editingId ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un cours..."
            className="w-full border border-slate-300 focus:border-[#0056D2] rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-800 focus:outline-none transition-colors"
          />
        </div>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value as 'All' | Course['level'])}
          className="border border-slate-300 focus:border-[#0056D2] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none transition-colors"
        >
          <option value="All">Tous les niveaux</option>
          {LEVEL_ORDER.map((lvl) => <option key={lvl} value={lvl}>{LEVEL_LABELS[lvl]}</option>)}
        </select>
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value as 'All' | Course['subject'])}
          className="border border-slate-300 focus:border-[#0056D2] rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none transition-colors"
        >
          <option value="All">Toutes matières</option>
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Course list */}
      <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0056D2] uppercase tracking-wider mb-3">
        <Filter className="h-3.5 w-3.5" /> {filteredCourses.length} résultat{filteredCourses.length > 1 ? 's' : ''}
      </div>

      <div className="flex flex-col gap-3">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-bold uppercase bg-blue-50 text-[#0056D2] px-2 py-0.5 rounded border border-blue-100">
                  {LEVEL_LABELS[course.level]}
                </span>
                <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                  {course.subject}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 truncate">{course.title}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{course.fileSize} · {course.downloadsCount} téléchargements</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => startEdit(course)}
                className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-[#0056D2] border border-slate-200 transition-colors cursor-pointer"
                title="Modifier"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(course.id)}
                className="p-2 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 transition-colors cursor-pointer"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12 text-sm text-slate-500 font-medium bg-white border border-slate-200 rounded-2xl">
            Aucun cours ne correspond aux filtres actuels.
          </div>
        )}
      </div>
    </div>
  );
}
