import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase-admin';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  where,
  getDocs,
  documentId
} from 'firebase/firestore';
import { sendReplyEmail } from '../lib/emailjs';

// ---------- HELPERS : TENDANCES & ACTIVITÉ ----------
function dateKeyOffset(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function relativeTime(timestamp) {
  if (!timestamp?.toMillis) return '';
  const diffMs = Date.now() - timestamp.toMillis();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return 'hier';
  return `il y a ${diffD} jours`;
}

function buildActivityFeed({ messages, projects, experiences, formations, skills }) {
  const items = [
    ...messages.map((m) => ({ label: `Message de ${m.name}`, date: m.createdAt, key: `msg-${m.id}` })),
    ...projects.map((p) => ({ label: `Projet ajouté : ${p.name}`, date: p.createdAt, key: `proj-${p.id}` })),
    ...experiences.map((e) => ({ label: `Expérience ajoutée : ${e.title}`, date: e.createdAt, key: `exp-${e.id}` })),
    ...formations.map((f) => ({ label: `Formation ajoutée : ${f.title}`, date: f.createdAt, key: `form-${f.id}` })),
    ...skills.map((s) => ({ label: `Compétences ajoutées : ${s.category}`, date: s.createdAt, key: `skill-${s.id}` }))
  ];
  return items
    .filter((i) => i.date?.toMillis)
    .sort((a, b) => b.date.toMillis() - a.date.toMillis())
    .slice(0, 6);
}

// ---------- SOUS-VUE : VUE D'ENSEMBLE ----------
function TrendBadge({ current, previous }) {
  if (previous === 0) {
    if (current === 0) return null;
    return <span className="text-xs font-mono text-emerald-400 ml-2">nouveau</span>;
  }
  const change = Math.round(((current - previous) / previous) * 100);
  if (change === 0) return <span className="text-xs font-mono text-white/40 ml-2">stable</span>;
  const positive = change > 0;
  return (
    <span className={`text-xs font-mono ml-2 ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
      {positive ? '↗' : '↘'} {Math.abs(change)}%
    </span>
  );
}

function OverviewTab({ messages, projects, experiences, formations, skills, visitors, onGoTo }) {
  const unread = messages.filter((m) => m.status !== 'read' && m.status !== 'replied').length;
  const [weekVisits, setWeekVisits] = useState(null);
  const [prevWeekVisits, setPrevWeekVisits] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [last7, prev7] = await Promise.all([
          fetchDailyRange(dateKeyOffset(6), dateKeyOffset(-1)),
          fetchDailyRange(dateKeyOffset(13), dateKeyOffset(6))
        ]);
        if (cancelled) return;
        setWeekVisits(last7.reduce((sum, d) => sum + (d.visits || 0), 0));
        setPrevWeekVisits(prev7.reduce((sum, d) => sum + (d.visits || 0), 0));
      } catch (err) {
        console.warn('Tendance hebdo indisponible :', err.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const activity = buildActivityFeed({ messages, projects, experiences, formations, skills });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-white">Performances de la plateforme</h1>
        <p className="text-sm text-white/50 font-mono mt-1">État de l'activité en temps réel.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-[#0f1420] border border-white/10 rounded-2xl p-6">
          <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Visiteurs uniques</span>
          <div className="text-4xl font-bold text-white mt-2 flex items-baseline">
            {visitors}
            {weekVisits !== null && prevWeekVisits !== null && (
              <TrendBadge current={weekVisits} previous={prevWeekVisits} />
            )}
          </div>
          <span className="text-[10px] font-mono text-white/30 block mt-1">tendance sur 7 jours (visites)</span>
        </div>
        <div className="bg-[#0f1420] border border-white/10 rounded-2xl p-6">
          <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Messages reçus</span>
          <div className="text-4xl font-bold text-white mt-2">{messages.length}</div>
          {unread > 0 && (
            <span className="text-xs font-mono text-[#E85D04] mt-1 block">{unread} non lu(s)</span>
          )}
        </div>
        <div className="bg-[#0f1420] border border-white/10 rounded-2xl p-6">
          <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Projets publiés</span>
          <div className="text-4xl font-bold text-white mt-2">{projects.length}</div>
        </div>
        <div className="bg-[#0f1420] border border-white/10 rounded-2xl p-6">
          <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Expériences au CV</span>
          <div className="text-4xl font-bold text-white mt-2">{experiences.length}</div>
        </div>
      </div>

      <div className="bg-[#0f1420] border border-white/10 rounded-2xl p-6 space-y-3">
        <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Raccourcis rapides</span>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onGoTo('projects')}
            className="flex-1 text-left px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm hover:border-[#E85D04] transition-colors"
          >
            Ajouter un projet →
          </button>
          <button
            onClick={() => onGoTo('messages')}
            className="flex-1 text-left px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm hover:border-[#E85D04] transition-colors"
          >
            Consulter la boîte →
          </button>
        </div>
      </div>

      <div className="bg-[#0f1420] border border-white/10 rounded-2xl p-6 space-y-4">
        <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Activité récente</span>
        {activity.length === 0 ? (
          <p className="text-sm text-white/40 font-mono">Rien à afficher pour l'instant.</p>
        ) : (
          <div className="space-y-2">
            {activity.map((item) => (
              <div key={item.key} className="flex items-center justify-between text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <span className="text-white/80">{item.label}</span>
                <span className="text-white/30 text-xs font-mono shrink-0 ml-4">{relativeTime(item.date)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#0f1420] border border-white/10 rounded-2xl p-6 space-y-3">
        <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Flux d'activité</span>
        <p className="text-sm text-white/70 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Le Dashboard est correctement synchronisé avec Firestore.
        </p>
      </div>
    </div>
  );
}

// ---------- FIL DE DISCUSSION D'UN MESSAGE ----------
function MessageThread({ message }) {
  const [replies, setReplies] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'messages', message.id, 'replies'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setReplies(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [message.id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    setError('');

    try {
      await addDoc(collection(db, 'messages', message.id, 'replies'), {
        author: 'admin',
        text,
        createdAt: serverTimestamp()
      });

      await sendReplyEmail({
        to_name: message.name,
        to_email: message.email,
        message: text,
        reply_link: `${window.location.origin}/reply/${message.id}`
      });

      await updateDoc(doc(db, 'messages', message.id), { status: 'replied' });
      setText('');
    } catch (err) {
      console.error('Erreur envoi réponse admin :', err);
      setError("L'email n'a pas pu être envoyé (la réponse a quand même été enregistrée).");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border-t border-white/10 pt-4 mt-2 space-y-3">
      {replies.map((r) => (
        <div
          key={r.id}
          className={`p-3 rounded-xl max-w-[90%] text-sm ${
            r.author === 'admin'
              ? 'bg-[#E85D04]/10 border border-[#E85D04]/20 ml-auto text-white/90'
              : 'bg-white/[0.03] border border-white/10 text-white/80'
          }`}
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">
            {r.author === 'admin' ? 'Toi' : message.name}
          </span>
          {r.text}
        </div>
      ))}

      <form onSubmit={handleSend} className="flex gap-2 pt-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écris ta réponse..."
          className="flex-1 px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-[#E85D04] transition-colors"
        />
        <button
          type="submit"
          disabled={sending}
          className="px-4 py-2.5 rounded-lg bg-[#E85D04] hover:bg-[#E85D04]/90 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
        >
          {sending ? '...' : 'Envoyer'}
        </button>
      </form>
      {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
    </div>
  );
}

// ---------- SOUS-VUE : MESSAGES ----------
function MessagesTab({ messages }) {
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const markRead = async (id) => {
    await updateDoc(doc(db, 'messages', id), { status: 'read' });
  };

  const remove = async (id) => {
    if (window.confirm('Supprimer ce message ?')) {
      await deleteDoc(doc(db, 'messages', id));
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const normalizedStatus = msg.status || 'new';
    const matchesStatus = statusFilter === 'all' || normalizedStatus === statusFilter;
    const haystack = `${msg.name} ${msg.email} ${msg.subject} ${msg.message} ${msg.budget || ''}`.toLowerCase();
    const matchesSearch = search.trim() === '' || haystack.includes(search.trim().toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif font-bold text-white">Messages & Bookings</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un nom, un email, un budget, un mot-clé..."
            className="w-full px-3.5 py-2.5 pr-9 rounded-lg bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-[#E85D04] transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Effacer la recherche"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-sm cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-[#E85D04]"
        >
          <option value="all">Tous les statuts</option>
          <option value="new">Nouveau</option>
          <option value="read">Lu</option>
          <option value="replied">Répondu</option>
        </select>
      </div>

      {(search || statusFilter !== 'all') && (
        <p className="text-xs font-mono text-white/40">
          {filteredMessages.length} message(s) trouvé(s) sur {messages.length}
        </p>
      )}

      {filteredMessages.length === 0 && (
        <p className="text-sm text-white/50 font-mono">
          {messages.length === 0 ? 'Aucun message pour l\'instant.' : 'Aucun message ne correspond à ta recherche.'}
        </p>
      )}

      <div className="space-y-4">
        {filteredMessages.map((msg) => {
          const isOpen = expandedId === msg.id;
          return (
            <div key={msg.id} className="bg-[#0f1420] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-white font-bold text-sm">{msg.name}</span>
                  <span className="text-white/40 text-xs font-mono ml-2">{msg.email}</span>
                </div>
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded ${
                    msg.status === 'new' || !msg.status
                      ? 'bg-[#E85D04]/20 text-[#E85D04]'
                      : msg.status === 'replied'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-white/5 text-white/50'
                  }`}
                >
                  {msg.status === 'new' || !msg.status ? 'Nouveau' : msg.status === 'replied' ? 'Répondu' : 'Lu'}
                </span>
              </div>
              <p className="text-white/80 text-sm font-semibold">{msg.subject}</p>
              {msg.budget && <p className="text-white/50 text-xs font-mono">Budget : {msg.budget}</p>}
              <p className="text-white/70 text-sm leading-relaxed">{msg.message}</p>

              <div className="flex gap-3 pt-2 border-t border-white/10">
                <button
                  onClick={() => setExpandedId(isOpen ? null : msg.id)}
                  className="text-xs font-mono text-[#E85D04] hover:underline"
                >
                  {isOpen ? 'Fermer la conversation' : 'Répondre'}
                </button>
                {(msg.status === 'new' || !msg.status) && (
                  <button onClick={() => markRead(msg.id)} className="text-xs font-mono text-white/50 hover:text-white">
                    Marquer comme lu
                  </button>
                )}
                <button onClick={() => remove(msg.id)} className="text-xs font-mono text-red-400 hover:text-red-300 ml-auto">
                  Supprimer
                </button>
              </div>

              {isOpen && <MessageThread message={msg} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- FORMULAIRE PROJET (ajout ET édition) ----------
function ProjectForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [form, setForm] = useState(
    initial || { name: '', category: '', tags: '', image: '', link: '', description: '', stack: '', badge: 'Full-Stack', featured: false }
  );
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (e) => {
    const value = field === 'featured' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f1420] border border-white/10 rounded-2xl p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nom du projet" value={form.name} onChange={handleChange('name')} required />
        <Input label="Catégorie" value={form.category} onChange={handleChange('category')} placeholder="Site vitrine • Refonte UI/UX" required />
        <Input label="Tags (séparés par virgule)" value={form.tags} onChange={handleChange('tags')} placeholder="React, Supabase, SaaS" />
        <Input label="Stack technique" value={form.stack} onChange={handleChange('stack')} placeholder="React, Tailwind, Supabase" />
        <Input label="URL image" value={form.image} onChange={handleChange('image')} placeholder="/images/mon-projet.png" />
        <Input label="Lien du projet" value={form.link} onChange={handleChange('link')} placeholder="https://..." />
        <Input label="Badge (CV)" value={form.badge} onChange={handleChange('badge')} placeholder="Full-Stack / Frontend" />
      </div>
      <div className="space-y-1.5">
        <label className="block text-[10px] font-mono font-bold tracking-widest text-white/50 uppercase">Description</label>
        <textarea
          rows="3"
          value={form.description}
          onChange={handleChange('description')}
          className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-[#E85D04] transition-colors resize-none"
        />
      </div>
      <label className="flex items-center gap-2 text-xs text-white/70 font-mono">
        <input type="checkbox" checked={form.featured} onChange={handleChange('featured')} />
        Afficher aussi dans "Projets Phares" du CV
      </label>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-lg bg-[#E85D04] hover:bg-[#E85D04]/90 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? '...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-lg border border-white/10 text-white/60 hover:text-white text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}

// ---------- SOUS-VUE : PROJETS ----------
function ProjectsTab({ projects }) {
  const [editingId, setEditingId] = useState(null);

  const handleAdd = async (form) => {
    await addDoc(collection(db, 'projects'), {
      name: form.name,
      category: form.category,
      tags: (form.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      image: form.image,
      link: form.link,
      description: form.description,
      stack: form.stack,
      badge: form.badge,
      featured: !!form.featured,
      createdAt: serverTimestamp()
    });
  };

  const handleUpdate = async (id, form) => {
    await updateDoc(doc(db, 'projects', id), {
      name: form.name,
      category: form.category,
      tags: Array.isArray(form.tags) ? form.tags : (form.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      image: form.image,
      link: form.link,
      description: form.description,
      stack: form.stack,
      badge: form.badge,
      featured: !!form.featured
    });
    setEditingId(null);
  };

  const remove = async (id) => {
    if (window.confirm('Supprimer ce projet ?')) {
      await deleteDoc(doc(db, 'projects', id));
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-serif font-bold text-white">Gérer les projets</h1>

      <ProjectForm onSubmit={handleAdd} submitLabel="Ajouter le projet" />

      <div className="space-y-3">
        {projects.map((p) =>
          editingId === p.id ? (
            <ProjectForm
              key={p.id}
              initial={{ ...p, tags: (p.tags || []).join(', ') }}
              submitLabel="Enregistrer les modifications"
              onCancel={() => setEditingId(null)}
              onSubmit={(form) => handleUpdate(p.id, form)}
            />
          ) : (
            <div key={p.id} className="bg-[#0f1420] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <span className="text-white font-bold text-sm">{p.name}</span>
                <p className="text-white/50 text-xs font-mono">{p.category}</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button onClick={() => setEditingId(p.id)} className="text-xs font-mono text-[#E85D04] hover:underline">
                  Modifier
                </button>
                <button onClick={() => remove(p.id)} className="text-xs font-mono text-red-400 hover:text-red-300">
                  Supprimer
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ---------- SOUS-VUE : CV / PARCOURS ----------
function CvTab({ experiences, formations, skills }) {
  const addExperience = (data) => addDoc(collection(db, 'cv_experiences'), { ...data, createdAt: serverTimestamp() });
  const updateExperience = (id, data) => updateDoc(doc(db, 'cv_experiences', id), data);

  const addFormation = (data) => addDoc(collection(db, 'cv_formations'), { ...data, createdAt: serverTimestamp() });
  const updateFormation = (id, data) => updateDoc(doc(db, 'cv_formations', id), data);

  const addSkill = (data) =>
    addDoc(collection(db, 'cv_skills'), {
      ...data,
      items: data.items.split(',').map((i) => i.trim()).filter(Boolean),
      createdAt: serverTimestamp()
    });
  const updateSkill = (id, data) =>
    updateDoc(doc(db, 'cv_skills', id), {
      ...data,
      items: Array.isArray(data.items) ? data.items : data.items.split(',').map((i) => i.trim()).filter(Boolean)
    });

  const remove = async (colName, id) => {
    if (window.confirm('Supprimer cet élément ?')) {
      await deleteDoc(doc(db, colName, id));
    }
  };

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-serif font-bold text-white">Mon CV / Parcours</h1>

      <CvSection
        title="Expériences professionnelles"
        items={experiences}
        fields={[
          { key: 'title', label: 'Titre du poste' },
          { key: 'period', label: 'Période (ex: 2025 — Présent)' },
          { key: 'company', label: 'Entreprise' },
          { key: 'desc', label: 'Description', textarea: true }
        ]}
        renderItem={(item) => (
          <>
            <span className="text-white font-bold text-sm">{item.title}</span>
            <p className="text-white/50 text-xs font-mono">{item.company} · {item.period}</p>
          </>
        )}
        onAdd={addExperience}
        onUpdate={updateExperience}
        onDelete={(id) => remove('cv_experiences', id)}
      />

      <CvSection
        title="Formations & certificats"
        items={formations}
        fields={[
          { key: 'date', label: 'Date (ex: 2026)' },
          { key: 'title', label: 'Titre / certificat' },
          { key: 'desc', label: 'Description', textarea: true }
        ]}
        renderItem={(item) => (
          <>
            <span className="text-white font-bold text-sm">{item.title}</span>
            <p className="text-white/50 text-xs font-mono">{item.date}</p>
          </>
        )}
        onAdd={addFormation}
        onUpdate={updateFormation}
        onDelete={(id) => remove('cv_formations', id)}
      />

      <CvSection
        title="Compétences / langages"
        items={skills}
        fields={[
          { key: 'category', label: 'Catégorie (ex: Frontend)' },
          { key: 'items', label: 'Compétences (séparées par virgule)' }
        ]}
        renderItem={(item) => (
          <>
            <span className="text-white font-bold text-sm">{item.category}</span>
            <p className="text-white/50 text-xs font-mono">{(item.items || []).join(', ')}</p>
          </>
        )}
        onAdd={addSkill}
        onUpdate={updateSkill}
        onDelete={(id) => remove('cv_skills', id)}
        formatInitial={(item) => ({ ...item, items: (item.items || []).join(', ') })}
      />
    </div>
  );
}

function CvSection({ title, items, fields, renderItem, onAdd, onUpdate, onDelete, formatInitial }) {
  const [editingId, setEditingId] = useState(null);

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-mono font-bold tracking-widest text-[#E85D04] uppercase">{title}</h2>

      <CvForm fields={fields} onSubmit={onAdd} submitLabel="Ajouter" />

      <div className="space-y-2">
        {items.map((item) =>
          editingId === item.id ? (
            <CvForm
              key={item.id}
              fields={fields}
              initial={formatInitial ? formatInitial(item) : item}
              submitLabel="Enregistrer"
              onCancel={() => setEditingId(null)}
              onSubmit={async (data) => {
                await onUpdate(item.id, data);
                setEditingId(null);
              }}
            />
          ) : (
            <div key={item.id} className="bg-[#0f1420] border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
              <div>{renderItem(item)}</div>
              <div className="flex gap-3 shrink-0">
                <button onClick={() => setEditingId(item.id)} className="text-xs font-mono text-[#E85D04] hover:underline">
                  Modifier
                </button>
                <button onClick={() => onDelete(item.id)} className="text-xs font-mono text-red-400 hover:text-red-300">
                  Supprimer
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function CvForm({ fields, initial, onSubmit, onCancel, submitLabel }) {
  const empty = Object.fromEntries(fields.map((f) => [f.key, '']));
  const [form, setForm] = useState(initial || empty);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
      if (!initial) setForm(empty);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f1420] border border-white/10 rounded-2xl p-5 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map((f) =>
          f.textarea ? (
            <div key={f.key} className="sm:col-span-2 space-y-1.5">
              <label className="block text-[10px] font-mono font-bold tracking-widest text-white/50 uppercase">{f.label}</label>
              <textarea
                rows="2"
                value={form[f.key]}
                onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-[#E85D04] transition-colors resize-none"
              />
            </div>
          ) : (
            <Input
              key={f.key}
              label={f.label}
              value={form[f.key]}
              onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
            />
          )
        )}
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-lg bg-[#E85D04] hover:bg-[#E85D04]/90 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? '...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg border border-white/10 text-white/60 hover:text-white text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-mono font-bold tracking-widest text-white/50 uppercase">{label}</label>
      <input
        type="text"
        {...props}
        className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-[#E85D04] transition-colors"
      />
    </div>
  );
}

// ---------- SOUS-VUE : STATISTIQUES ----------
function pad(n) {
  return String(n).padStart(2, '0');
}
function monthStartKey(year, month) {
  return `${year}-${pad(month)}-01`;
}
function monthEndKeyExclusive(year, month) {
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  return `${nextYear}-${pad(nextMonth)}-01`;
}
function yearStartKey(year) {
  return `${year}-01-01`;
}
function yearEndKeyExclusive(year) {
  return `${year + 1}-01-01`;
}

async function fetchDailyRange(startKey, endKeyExclusive) {
  const q = query(
    collection(db, 'stats_daily'),
    orderBy(documentId()),
    where(documentId(), '>=', startKey),
    where(documentId(), '<', endKeyExclusive)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ date: d.id, ...d.data() }));
}

function StatCard({ label, value }) {
  return (
    <div className="bg-[#0f1420] border border-white/10 rounded-2xl p-6">
      <span className="text-xs font-mono text-white/50 uppercase tracking-widest">{label}</span>
      <div className="text-4xl font-bold text-white mt-2">{value}</div>
    </div>
  );
}

function StatsTab({ visitors, totalVisits }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [monthDays, setMonthDays] = useState([]);
  const [monthTotal, setMonthTotal] = useState(0);
  const [yearTotal, setYearTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const [monthDocs, yearDocs] = await Promise.all([
          fetchDailyRange(monthStartKey(year, month), monthEndKeyExclusive(year, month)),
          fetchDailyRange(yearStartKey(year), yearEndKeyExclusive(year))
        ]);
        if (cancelled) return;
        setMonthDays(monthDocs);
        setMonthTotal(monthDocs.reduce((sum, d) => sum + (d.visits || 0), 0));
        setYearTotal(yearDocs.reduce((sum, d) => sum + (d.visits || 0), 0));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const maxVisits = Math.max(1, ...monthDays.map((d) => d.visits || 0));
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-white">Statistiques</h1>
        <p className="text-sm text-white/50 font-mono mt-1">Fréquentation réelle de ton site.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <StatCard label="Visites totales" value={totalVisits} />
        <StatCard label="Visiteurs uniques" value={visitors} />
        <StatCard label="Sélection (mois)" value={loading ? '…' : monthTotal} />
        <StatCard label="Sélection (année)" value={loading ? '…' : yearTotal} />
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="px-3.5 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-[#E85D04]"
        >
          {[now.getFullYear(), now.getFullYear() - 1].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="px-3.5 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-[#E85D04]"
        >
          {monthNames.map((name, i) => (
            <option key={name} value={i + 1}>{name}</option>
          ))}
        </select>
      </div>

      <div className="bg-[#0f1420] border border-white/10 rounded-2xl p-6">
        <span className="text-xs font-mono text-white/50 uppercase tracking-widest block mb-4">
          Visites par jour — {monthNames[month - 1]} {year}
        </span>
        <div className="flex items-end gap-1">
          {Array.from({ length: daysInMonth }, (_, i) => {
            const dayNum = i + 1;
            const dateKey = `${year}-${pad(month)}-${pad(dayNum)}`;
            const dayData = monthDays.find((d) => d.date === dateKey);
            const visits = dayData?.visits || 0;
            const heightPct = (visits / maxVisits) * 100;
            return (
              <div
                key={dateKey}
                className="flex-1 flex flex-col items-center"
                title={`${dayNum} ${monthNames[month - 1]} : ${visits} visite(s)`}
              >
                <div className="w-full h-40 flex items-end">
                  <div
                    className="w-full bg-[#E85D04] rounded-t transition-all"
                    style={{ height: `${visits > 0 ? Math.max(heightPct, 4) : 0}%` }}
                  />
                </div>
                <span className="text-[8px] font-mono text-white/30 mt-1.5">{dayNum}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------- SHELL DU DASHBOARD ----------
export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [formations, setFormations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [visitors, setVisitors] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);

  useEffect(() => {
    const unsubMessages = onSnapshot(query(collection(db, 'messages'), orderBy('createdAt', 'desc')), (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const unsubProjects = onSnapshot(query(collection(db, 'projects'), orderBy('createdAt', 'desc')), (snap) => {
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const unsubExperiences = onSnapshot(query(collection(db, 'cv_experiences'), orderBy('createdAt', 'desc')), (snap) => {
      setExperiences(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const unsubFormations = onSnapshot(query(collection(db, 'cv_formations'), orderBy('createdAt', 'desc')), (snap) => {
      setFormations(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const unsubSkills = onSnapshot(query(collection(db, 'cv_skills'), orderBy('createdAt', 'desc')), (snap) => {
      setSkills(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const unsubStats = onSnapshot(doc(db, 'stats', 'global'), (snap) => {
      const data = snap.exists() ? snap.data() : {};
      setVisitors(data.total || 0);
      setTotalVisits(data.totalVisits || 0);
    });

    return () => {
      unsubMessages();
      unsubProjects();
      unsubExperiences();
      unsubFormations();
      unsubSkills();
      unsubStats();
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { key: 'overview', label: "Vue d'ensemble" },
    { key: 'stats', label: 'Statistiques' },
    { key: 'messages', label: 'Messages & Bookings' },
    { key: 'projects', label: 'Gérer les projets' },
    { key: 'cv', label: 'Mon CV / Parcours' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0e17] font-sans flex">
      <aside className="w-72 shrink-0 border-r border-white/10 p-6 flex flex-col justify-between">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-serif font-bold text-white">
              Dashboard <span className="text-[#E85D04]">Admin</span>
            </h2>
            <p className="text-xs text-white/40 font-mono mt-1">Espace personnel de gestion</p>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === item.key
                    ? 'bg-[#E85D04] text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm font-semibold transition-colors"
        >
          Déconnexion
        </button>
      </aside>

      <main className="flex-1 p-8 max-w-5xl">
        {activeTab === 'overview' && (
          <OverviewTab
            messages={messages}
            projects={projects}
            experiences={experiences}
            formations={formations}
            skills={skills}
            visitors={visitors}
            onGoTo={setActiveTab}
          />
        )}
        {activeTab === 'stats' && <StatsTab visitors={visitors} totalVisits={totalVisits} />}
        {activeTab === 'messages' && <MessagesTab messages={messages} />}
        {activeTab === 'projects' && <ProjectsTab projects={projects} />}
        {activeTab === 'cv' && <CvTab experiences={experiences} formations={formations} skills={skills} />}
      </main>
    </div>
  );
}