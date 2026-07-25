import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { sendReplyEmail, ADMIN_NOTIFICATION_EMAIL } from '../lib/emailjs';

export default function ReplyThread() {
  const { messageId } = useParams();

  const [originalMessage, setOriginalMessage] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [replies, setReplies] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // Charge le message d'origine (une seule fois)
  useEffect(() => {
    const fetchOriginal = async () => {
      try {
        const snap = await getDoc(doc(db, 'messages', messageId));
        if (snap.exists()) {
          setOriginalMessage(snap.data());
        } else {
          setNotFound(true);
        }
      } catch (err) {
        setNotFound(true);
      }
    };
    fetchOriginal();
  }, [messageId]);

  // Écoute le fil de discussion en direct
  useEffect(() => {
    const q = query(collection(db, 'messages', messageId, 'replies'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setReplies(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [messageId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    setError('');

    try {
      await addDoc(collection(db, 'messages', messageId, 'replies'), {
        author: 'client',
        text,
        createdAt: serverTimestamp()
      });

      // Notifie l'admin par email qu'une réponse est arrivée
      await sendReplyEmail({
        to_name: 'Léon',
        to_email: ADMIN_NOTIFICATION_EMAIL,
        message: `${originalMessage?.name || 'Un client'} a répondu : ${text}`,
        reply_link: window.location.href
      });

      setText('');
      setSent(true);
    } catch (err) {
      console.error('Erreur envoi réponse client :', err);
      setError("Impossible d'envoyer ta réponse pour l'instant. Réessaie dans un instant.");
    } finally {
      setSending(false);
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 font-sans">
        <p className="text-black/60 text-sm">Cette conversation est introuvable.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black py-16 px-4 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#D4AF37] uppercase">Conversation</span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold">
            {originalMessage?.subject || 'Votre échange avec Léon EVABAS'}
          </h1>
          {originalMessage && (
            <p className="text-sm text-black/50 font-mono">
              Message initial de {originalMessage.name} — {originalMessage.message}
            </p>
          )}
        </div>

        {/* FIL DE DISCUSSION */}
        <div className="space-y-4">
          {replies.length === 0 && (
            <p className="text-sm text-black/40 font-mono">Pas encore de réponse dans ce fil.</p>
          )}
          {replies.map((r) => (
            <div
              key={r.id}
              className={`p-4 rounded-2xl max-w-[85%] ${
                r.author === 'admin'
                  ? 'bg-black/[0.03] border border-black/10'
                  : 'bg-[#D4AF37]/10 border border-[#D4AF37]/20 ml-auto'
              }`}
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/40 block mb-1">
                {r.author === 'admin' ? 'Léon EVABAS' : originalMessage?.name || 'Toi'}
              </span>
              <p className="text-sm text-black/80 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>

        {/* FORMULAIRE DE RÉPONSE */}
        {sent ? (
          <div className="p-5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-center">
            <p className="text-sm text-black/70">Ta réponse a bien été envoyée à Léon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              rows="4"
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Écris ta réponse ici..."
              className="w-full px-4 py-3.5 rounded-xl bg-black/[0.02] border border-black/15 text-black placeholder:text-black/30 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
            />
            {error && <p className="text-xs text-red-500 font-mono">{error}</p>}
            <button
              type="submit"
              disabled={sending}
              className="px-6 py-3 rounded-xl bg-black text-white text-xs font-mono font-bold tracking-wider uppercase hover:bg-[#D4AF37] hover:text-black transition-all disabled:opacity-50 cursor-pointer"
            >
              {sending ? 'Envoi...' : 'Envoyer la réponse'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}