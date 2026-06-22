import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const books = [
  {
    title: 'Тёплый ноябрь',
    tag: 'Роман',
    desc: 'История о возвращении домой, где каждая комната хранит запах прошлого.',
    price: '590 ₽',
    cover: 'https://cdn.poehali.dev/projects/2bc16eb2-6189-439c-aa9d-3b1d907f8ce8/files/67fd3ae8-e985-4fb8-bbde-9d50e68e23e3.jpg',
  },
  {
    title: 'Синий час',
    tag: 'Сборник',
    desc: 'Двенадцать рассказов о тех минутах перед рассветом, когда всё возможно.',
    price: '450 ₽',
    cover: 'https://cdn.poehali.dev/projects/2bc16eb2-6189-439c-aa9d-3b1d907f8ce8/files/c478ac4a-1a52-45d3-8a0a-069064194d02.jpg',
  },
];

const stories = [
  { date: '18 июня', title: 'Кофе остыл, а разговор — нет', read: '4 мин', excerpt: 'Она пришла раньше на двадцать минут, и за это время успела придумать три повода уйти…' },
  { date: '9 июня', title: 'Дом, который меня помнит', read: '6 мин', excerpt: 'Скрип третьей ступеньки я узнаю с закрытыми глазами. Дом узнаёт меня по шагам…' },
  { date: '2 июня', title: 'Письмо без адреса', read: '3 мин', excerpt: 'Я пишу тебе, хотя знаю, что ты никогда это не прочтёшь. Может, поэтому пишу честно…' },
];

const plans = [
  { name: 'Читатель', price: '0 ₽', period: 'навсегда', features: ['Свежие истории раз в неделю', 'Доступ к архиву', 'Письма от автора'], accent: false },
  { name: 'Близкий круг', price: '290 ₽', period: 'в месяц', features: ['Всё из «Читателя»', 'Главы новых книг до релиза', 'Закрытые истории', 'Голос в сюжетных опросах'], accent: true },
  { name: 'Соавтор', price: '690 ₽', period: 'в месяц', features: ['Всё из «Близкого круга»', 'Имя в благодарностях книги', 'Личные аудио-чтения', 'Видеовстречи раз в месяц'], accent: false },
];

const Index = () => {
  const [menu, setMenu] = useState(false);

  const Nav = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {[['Истории', '#stories'], ['Книги', '#books'], ['Подписка', '#subscribe'], ['Об авторе', '#author']].map(([t, h]) => (
        <a key={h} href={h} onClick={() => setMenu(false)}
          className={`relative font-medium transition-colors hover:text-coral ${mobile ? 'text-2xl py-3 font-display' : 'text-sm'}`}>
          {t}
        </a>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-background text-ink overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60">
        <div className="container flex items-center justify-between h-16">
          <a href="#" className="font-display text-2xl font-700 tracking-tight">
            Анна<span className="text-coral">.</span>пишет
          </a>
          <nav className="hidden md:flex items-center gap-8"><Nav /></nav>
          <div className="hidden md:block">
            <Button className="rounded-full bg-ink text-cream hover:bg-coral transition-colors">Подписаться</Button>
          </div>
          <button className="md:hidden" onClick={() => setMenu(!menu)}>
            <Icon name={menu ? 'X' : 'Menu'} size={26} />
          </button>
        </div>
        {menu && (
          <div className="md:hidden flex flex-col px-6 pb-6 gap-1 animate-fade-up bg-background">
            <Nav mobile />
            <Button className="rounded-full bg-ink text-cream mt-3">Подписаться</Button>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative pt-36 pb-24 md:pt-48 md:pb-32">
        <div className="absolute top-10 -left-20 w-96 h-96 rounded-full bg-coral/30 blur-3xl animate-blob" />
        <div className="absolute top-40 right-0 w-96 h-96 rounded-full bg-amber/30 blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 grain opacity-[0.15] pointer-events-none" />
        <div className="container relative">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-ink/5 border border-ink/10 animate-fade-up">
              <Icon name="Feather" size={15} className="text-coral" /> Живые истории каждую неделю
            </span>
            <h1 className="mt-6 font-display font-600 leading-[0.95] text-6xl md:text-8xl tracking-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Я рассказываю<br />
              <span className="italic text-coral">истории</span>, которые<br />
              остаются с вами.
            </h1>
            <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Короткие рассказы, новые книги и письма из-за кулис. Подпишитесь — и читайте первыми, ещё до того, как история станет книгой.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Button size="lg" className="rounded-full h-14 px-8 text-base bg-coral text-cream hover:bg-ink transition-colors" asChild>
                <a href="#subscribe">Оформить подписку <Icon name="ArrowRight" size={18} className="ml-1" /></a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base border-ink/20 hover:bg-ink hover:text-cream" asChild>
                <a href="#stories">Читать истории</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="py-5 bg-ink text-cream overflow-hidden">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((k) => (
            <div key={k} className="flex items-center gap-8 pr-8 font-display text-2xl italic">
              {['проза', 'письма', 'рассказы', 'романы', 'дневники', 'честно', 'тепло', 'вслух'].map((w) => (
                <span key={w} className="flex items-center gap-8">{w}<Icon name="Asterisk" size={20} className="text-coral" /></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Stories */}
      <section id="stories" className="py-24 md:py-32 container">
        <div className="flex items-end justify-between mb-14 gap-6">
          <div>
            <p className="text-coral font-medium mb-2">Свежее</p>
            <h2 className="font-display text-5xl md:text-6xl font-600">Истории недели</h2>
          </div>
          <a href="#" className="hidden md:flex items-center gap-2 font-medium hover:text-coral transition-colors">
            Весь архив <Icon name="ArrowRight" size={18} />
          </a>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((s, i) => (
            <article key={i}
              className="group p-8 rounded-3xl bg-card border border-border hover:border-coral hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
                <span>{s.date}</span><span className="w-1 h-1 rounded-full bg-coral" /><span>{s.read} чтения</span>
              </div>
              <h3 className="font-display text-2xl font-600 mb-3 group-hover:text-coral transition-colors">{s.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{s.excerpt}</p>
              <span className="inline-flex items-center gap-2 font-medium text-sm">
                Читать <Icon name="ArrowUpRight" size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </article>
          ))}
        </div>
      </section>

      {/* Books */}
      <section id="books" className="py-24 md:py-32 bg-ink text-cream relative overflow-hidden">
        <div className="absolute -top-20 right-10 w-80 h-80 rounded-full bg-coral/20 blur-3xl" />
        <div className="container relative">
          <p className="text-amber font-medium mb-2">Каталог</p>
          <h2 className="font-display text-5xl md:text-6xl font-600 mb-14">Мои книги</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {books.map((b, i) => (
              <div key={i} className="group flex flex-col sm:flex-row gap-7 p-7 rounded-3xl bg-cream/5 border border-cream/10 hover:bg-cream/10 transition-colors">
                <div className="sm:w-44 shrink-0">
                  <img src={b.cover} alt={b.title}
                    className="w-full aspect-[3/4] object-cover rounded-2xl shadow-2xl group-hover:animate-float" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium uppercase tracking-wider text-amber mb-2">{b.tag}</span>
                  <h3 className="font-display text-3xl font-600 mb-3">{b.title}</h3>
                  <p className="text-cream/70 leading-relaxed mb-auto">{b.desc}</p>
                  <div className="flex items-center justify-between mt-6">
                    <span className="font-display text-2xl">{b.price}</span>
                    <Button className="rounded-full bg-coral text-cream hover:bg-amber hover:text-ink transition-colors">
                      <Icon name="ShoppingBag" size={16} className="mr-1" /> Купить
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section id="subscribe" className="py-24 md:py-32 container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-coral font-medium mb-2">Подписка</p>
          <h2 className="font-display text-5xl md:text-6xl font-600 mb-4">Станьте ближе к историям</h2>
          <p className="text-muted-foreground text-lg">Выберите формат участия. Отменить можно в любой момент — без вопросов.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((p, i) => (
            <div key={i}
              className={`flex flex-col p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 ${
                p.accent ? 'bg-coral text-cream border-coral shadow-2xl md:scale-105' : 'bg-card border-border hover:border-coral'
              }`}>
              {p.accent && <span className="self-start text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-cream/20 mb-4">Популярный</span>}
              <h3 className="font-display text-3xl font-600 mb-1">{p.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display text-4xl font-700">{p.price}</span>
                <span className={p.accent ? 'text-cream/80' : 'text-muted-foreground'}>/ {p.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Icon name="Check" size={18} className={`mt-0.5 shrink-0 ${p.accent ? 'text-cream' : 'text-coral'}`} />
                    <span className={p.accent ? 'text-cream/90' : 'text-muted-foreground'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Button className={`mt-auto rounded-full h-12 ${
                p.accent ? 'bg-cream text-ink hover:bg-ink hover:text-cream' : 'bg-ink text-cream hover:bg-coral'
              } transition-colors`}>
                Выбрать
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Author */}
      <section id="author" className="py-24 md:py-32 bg-secondary">
        <div className="container grid md:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-coral/20 blur-2xl" />
            <img src="https://cdn.poehali.dev/projects/2bc16eb2-6189-439c-aa9d-3b1d907f8ce8/files/f18d2be0-bedf-4ea7-90bd-1f0ce5d275b9.jpg"
              alt="Автор" className="relative w-full aspect-square object-cover rounded-[2rem] shadow-xl" />
          </div>
          <div>
            <p className="text-coral font-medium mb-2">Об авторе</p>
            <h2 className="font-display text-5xl md:text-6xl font-600 mb-6">Привет, я Анна</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-5">
              Я пишу о людях и их тихих поворотных моментах — тех, что меняют жизнь, оставаясь незаметными для остальных. За десять лет вышло четыре книги, но больше всего я люблю короткие истории, которые рождаются здесь, на этом сайте.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Подписка — это способ писать честнее и свободнее, зная, что вы рядом.
            </p>
            <div className="flex gap-3">
              {['Send', 'Instagram', 'Youtube', 'Mail'].map((ic) => (
                <a key={ic} href="#"
                  className="w-12 h-12 grid place-items-center rounded-full bg-ink text-cream hover:bg-coral transition-colors">
                  <Icon name={ic} size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA + Footer */}
      <footer className="bg-ink text-cream">
        <div className="container py-20 text-center">
          <h2 className="font-display text-4xl md:text-6xl font-600 mb-6 text-balance">
            Не пропустите следующую <span className="italic text-coral">историю</span>
          </h2>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-8">
            <input type="email" placeholder="Ваш e-mail"
              className="flex-1 h-14 px-6 rounded-full bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/50 outline-none focus:border-coral transition-colors" />
            <Button className="h-14 px-8 rounded-full bg-coral text-cream hover:bg-amber hover:text-ink transition-colors">
              Подписаться
            </Button>
          </form>
        </div>
        <div className="border-t border-cream/10">
          <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-cream/60">
            <span className="font-display text-lg text-cream">Анна<span className="text-coral">.</span>пишет</span>
            <span>© 2026 · Все истории защищены любовью к читателю</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
