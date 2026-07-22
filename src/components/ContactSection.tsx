import React, { useState } from 'react';
import { Mail, MessageCircle, HelpCircle, ChevronDown, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import { FAQ_DATA } from '../data/courses';
import { getWhatsAppLink } from '../utils/whatsapp';

export default function ContactSection() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    level: 'TS',
    subject: 'Question Générale',
    message: ''
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formError) setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setFormError('');

    const whatsappMessage = [
      `Nouveau message via Senephysiquechimie`,
      `Nom : ${formData.fullName}`,
      `Email : ${formData.email}`,
      `Niveau : ${formData.level}`,
      `Sujet : ${formData.subject}`,
      '',
      formData.message
    ].join('\n');

    window.open(getWhatsAppLink(whatsappMessage), '_blank', 'noopener,noreferrer');

    setSubmitSuccess(true);
    setFormData({
      fullName: '',
      email: '',
      level: 'TS',
      subject: 'Question Générale',
      message: ''
    });
  };

  return (
    <section id="contact-faq" className="py-16 bg-white border-t border-slate-200 relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0056d203_1px,transparent_1px),linear-gradient(to_bottom,#0056d203_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Column 1: FAQ Accordion */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F1F] tracking-tight">
                Besoin d'aide ou de précisions ?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
                Consultez les réponses aux interrogations les plus fréquentes des élèves et parents au sujet des cours de Physique-Chimie.
              </p>
            </div>

            <div className="space-y-3">
              {FAQ_DATA.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    id={`faq-item-${idx}`}
                    className="rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-[#0056D2]/30 hover:shadow-sm transition-all duration-200"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-slate-800 transition-colors hover:text-[#0056D2]"
                    >
                      <div className="flex items-center space-x-3 pr-4">
                        <HelpCircle className={`h-4.5 w-4.5 shrink-0 transition-colors ${isOpen ? 'text-[#0056D2]' : 'text-slate-400'}`} />
                        <span>{faq.question}</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#0056D2]' : ''}`} />
                    </button>
                    
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100 bg-slate-50/50 animate-in slide-in-from-top-1 duration-150">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Sleek Interactive Contact Form */}
          <div className="relative">
            
            <div className="relative p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md">
              <div className="mb-6">
                <span className="text-[10px] font-mono font-bold text-[#0056D2] uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100/40">
                  Formulaire de Contact
                </span>
                <h3 className="text-xl font-bold text-[#1F1F1F] mt-3">
                  Envoyer un message à l'enseignant
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 font-medium">
                  Une question sur un cours, un exercice bloquant ou une demande de correction ? Remplissez ce formulaire, il s'ouvrira directement dans WhatsApp.
                </p>
              </div>

              {submitSuccess ? (
                <div className="p-6 rounded-2xl bg-[#0056D2]/5 border border-blue-100 text-center animate-in zoom-in-95 duration-300">
                  <div className="inline-flex p-3 rounded-full bg-blue-50 text-[#0056D2] mb-3.5">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h4 className="text-base font-bold text-[#1F1F1F]">Votre message est prêt sur WhatsApp !</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Un nouvel onglet WhatsApp s'est ouvert avec votre message pré-rempli. Il ne reste plus qu'à cliquer sur "Envoyer" là-bas.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-[#0056D2] hover:bg-[#00419e] text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {formError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-250 text-xs text-red-650 flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="Ex: Thomas Dubois"
                        className="w-full bg-white border border-slate-300 focus:border-[#0056D2] focus:ring-1 focus:ring-blue-100 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
                        Adresse e-mail *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="thomas.dubois@gmail.com"
                        className="w-full bg-white border border-slate-300 focus:border-[#0056D2] focus:ring-1 focus:ring-blue-100 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
                        Votre Niveau scolaire
                      </label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-300 focus:border-[#0056D2] rounded-xl px-3.5 py-3 text-xs text-slate-800 focus:outline-none transition-colors"
                      >
                        <option value="TS">Terminale S (TS)</option>
                        <option value="1S">Première S (1S)</option>
                        <option value="2S">Seconde S (2S)</option>
                        <option value="Collège">Collège (4e/3e)</option>
                        <option value="Autre">Autre niveau</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
                        Sujet du message
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-300 focus:border-[#0056D2] rounded-xl px-3.5 py-3 text-xs text-slate-800 focus:outline-none transition-colors"
                      >
                        <option value="Question Générale">Question Générale</option>
                        <option value="Aide Exercice">Aide sur un Exercice</option>
                        <option value="Erreur support">Signalement d'erreur dans un PDF</option>
                        <option value="Fascicule">Demande de Fascicule Physique</option>
                        <option value="Partenariat">Autre demande</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
                      Votre Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="Saisissez votre question ou demande ici..."
                      className="w-full bg-white border border-slate-300 focus:border-[#0056D2] focus:ring-1 focus:ring-blue-100 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#25D366] hover:bg-[#1ebc59] text-white font-bold text-xs py-3.5 rounded-xl uppercase tracking-wider shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Envoyer via WhatsApp</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
