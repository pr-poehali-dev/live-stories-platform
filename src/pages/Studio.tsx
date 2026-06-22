import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Work, listWorks, createWork, updateWork, deleteWork } from '@/lib/api';

const EMOJIS = ['📖', '📕', '📗', '📘', '✍️', '🌙', '☕', '🕯️', '🍂', '💌', '🌊', '⭐'];

const empty: Partial<Work> = {
  type: 'story', title: '', cover_emoji: '📖', content: '', access: 'free', status: 'draft',
};

const Studio = () => {
  const { toast } = useToast();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Partial<Work>>(empty);

  const load = async () => {
    setLoading(true);
    try {
      setWorks(await listWorks(false));
    } catch {
      toast({ title: 'Не удалось загрузить', variant: 'destructive' });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const words = (draft.content || '').trim().split(/\s+/).filter(Boolean).length;

  const save = async (status: 'draft' | 'published') => {
    if (!draft.title?.trim()) {
      toast({ title: 'Добавьте название', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const payload = { ...draft, status };
      const saved = draft.id ? await updateWork(draft.id, payload) : await createWork(payload);
      setDraft(saved);
      await load();
      toast({ title: status === 'published' ? 'Опубликовано ✨' : 'Черновик сохранён' });
    } catch {
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    }
    setSaving(false);
  };

  const remove = async (id: number) => {
    await deleteWork(id);
    if (draft.id === id) setDraft(empty);
    await load();
    toast({ title: 'Удалено' });
  };

  return (
    <div className="min-h-screen bg-background text-ink">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <a href="/" className="font-display text-2xl font-700 tracking-tight">
            Анна<span className="text-coral">.</span>пишет
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="PenLine" size={16} className="text-coral" /> Кабинет автора
            </span>
            <Button variant="outline" className="rounded-full" asChild>
              <a href="/"><Icon name="Eye" size={16} className="mr-1" /> Открыть сайт</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8 grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        {/* Editor */}
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex rounded-full bg-secondary p-1">
              {(['story', 'book'] as const).map((t) => (
                <button key={t} onClick={() => setDraft({ ...draft, type: t })}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    draft.type === t ? 'bg-coral text-cream' : 'text-muted-foreground'
                  }`}>
                  {t === 'story' ? 'История' : 'Книга'}
                </button>
              ))}
            </div>
            <div className="flex rounded-full bg-secondary p-1">
              {(['free', 'paid'] as const).map((a) => (
                <button key={a} onClick={() => setDraft({ ...draft, access: a })}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    draft.access === a ? 'bg-ink text-cream' : 'text-muted-foreground'
                  }`}>
                  {a === 'free' ? 'Бесплатно' : 'По подписке'}
                </button>
              ))}
            </div>
            {draft.id && (
              <span className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground">
                {draft.status === 'published' ? '● Опубликовано' : '○ Черновик'}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {EMOJIS.map((e) => (
              <button key={e} onClick={() => setDraft({ ...draft, cover_emoji: e })}
                className={`w-10 h-10 rounded-xl text-lg transition-all ${
                  draft.cover_emoji === e ? 'bg-coral/15 ring-2 ring-coral scale-110' : 'bg-secondary hover:scale-105'
                }`}>
                {e}
              </button>
            ))}
          </div>

          <Input value={draft.title || ''} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="Название произведения..."
            className="border-0 border-b border-border rounded-none px-0 text-3xl md:text-4xl font-display font-600 h-auto py-3 focus-visible:ring-0 placeholder:text-muted-foreground/50" />

          <Textarea value={draft.content || ''} onChange={(e) => setDraft({ ...draft, content: e.target.value })}
            placeholder="Здесь начинается ваша история. Просто пишите..."
            className="border-0 rounded-none px-0 mt-4 min-h-[420px] text-lg leading-relaxed resize-none focus-visible:ring-0 placeholder:text-muted-foreground/50" />

          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-border">
            <span className="text-sm text-muted-foreground">{words} слов</span>
            <div className="flex gap-3">
              {draft.id && (
                <Button variant="ghost" onClick={() => setDraft(empty)} className="rounded-full">
                  <Icon name="Plus" size={16} className="mr-1" /> Новое
                </Button>
              )}
              <Button variant="outline" onClick={() => save('draft')} disabled={saving} className="rounded-full">
                <Icon name="Save" size={16} className="mr-1" /> В черновик
              </Button>
              <Button onClick={() => save('published')} disabled={saving}
                className="rounded-full bg-coral text-cream hover:bg-ink transition-colors">
                <Icon name="Send" size={16} className="mr-1" /> Опубликовать
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar list */}
        <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-600">Мои работы</h2>
            <span className="text-sm text-muted-foreground">{works.length}</span>
          </div>
          {loading ? (
            <p className="text-muted-foreground text-sm py-8 text-center">Загрузка...</p>
          ) : works.length === 0 ? (
            <div className="text-center py-10">
              <span className="text-4xl">🪶</span>
              <p className="text-muted-foreground text-sm mt-3">Пока пусто. Напишите первую историю!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {works.map((w) => (
                <div key={w.id} onClick={() => setDraft(w)}
                  className={`group p-3 rounded-2xl cursor-pointer transition-colors border ${
                    draft.id === w.id ? 'bg-coral/10 border-coral' : 'border-transparent hover:bg-secondary'
                  }`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{w.cover_emoji || '📄'}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{w.title || 'Без названия'}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{w.type === 'book' ? 'Книга' : 'История'}</span>
                        <span className="w-1 h-1 rounded-full bg-current opacity-40" />
                        <span className={w.status === 'published' ? 'text-coral font-medium' : ''}>
                          {w.status === 'published' ? 'опубликовано' : 'черновик'}
                        </span>
                        {w.access === 'paid' && <Icon name="Lock" size={11} />}
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); remove(w.id); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Studio;
