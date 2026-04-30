import { useState } from 'react';
import Icon from '@/components/ui/icon';

type Section = 'home' | 'about' | 'instructions' | 'contacts' | 'faq' | 'support';

interface Notification {
  id: string;
  number: string;
  title: string;
  status: 'new' | 'processing' | 'done' | 'rejected';
  date: string;
  description: string;
}

const NOTIFICATIONS: Notification[] = [
  { id: '1', number: '№ ОБ-2024-00142', title: 'Заявление о регистрации по месту жительства', status: 'processing', date: '28.04.2026', description: 'Ваше обращение передано на рассмотрение специалисту отдела регистрационного учёта.' },
  { id: '2', number: '№ СП-2024-00098', title: 'Запрос справки об отсутствии судимости', status: 'done', date: '25.04.2026', description: 'Документ готов. Вы можете получить его в МФЦ или скачать в личном кабинете.' },
  { id: '3', number: '№ ЗЛ-2024-00211', title: 'Обращение по вопросу земельного участка', status: 'new', date: '30.04.2026', description: 'Обращение зарегистрировано и ожидает распределения по компетентному органу.' },
  { id: '4', number: '№ ТХ-2024-00055', title: 'Жалоба на качество дорожного покрытия', status: 'rejected', date: '20.04.2026', description: 'Обращение перенаправлено в профильное ведомство. Повторно подайте заявку через 10 рабочих дней.' },
];

const FAQ_ITEMS = [
  { q: 'Как подать обращение через портал?', a: 'Зарегистрируйтесь на портале, перейдите в раздел «Подать обращение», выберите категорию и заполните форму. Среднее время заполнения — 5–10 минут.' },
  { q: 'В какие сроки рассматривается обращение?', a: 'Срок рассмотрения — до 30 календарных дней с момента регистрации. В случае необходимости срок может быть продлён с уведомлением заявителя.' },
  { q: 'Как отследить статус своего обращения?', a: 'Войдите в личный кабинет и перейдите в раздел «Мои обращения». Там отображаются все поданные заявки с актуальными статусами и комментариями.' },
  { q: 'Какие документы нужны для подачи заявления?', a: 'Перечень документов зависит от типа обращения. Он отображается на этапе заполнения формы. Обычно требуется паспорт и документы, подтверждающие суть обращения.' },
  { q: 'Можно ли подать обращение от имени другого лица?', a: 'Да, при наличии нотариально заверенной доверенности. Прикрепите скан документа на этапе заполнения формы.' },
  { q: 'Что делать, если пришёл отказ по обращению?', a: 'В ответе будет указана причина отказа и порядок обжалования. Вы вправе подать жалобу в вышестоящий орган или обратиться в суд.' },
];

const STATUS_LABELS: Record<string, string> = {
  new: 'Новое',
  processing: 'На рассмотрении',
  done: 'Исполнено',
  rejected: 'Возвращено',
};

const STATUS_ICONS: Record<string, string> = {
  new: 'FileText',
  processing: 'Clock',
  done: 'CheckCircle',
  rejected: 'XCircle',
};

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [supportForm, setSupportForm] = useState({ name: '', email: '', message: '' });
  const [notifFilter, setNotifFilter] = useState<string>('all');

  const navItems: { id: Section; label: string }[] = [
    { id: 'home', label: 'Главная' },
    { id: 'about', label: 'О сервисе' },
    { id: 'instructions', label: 'Инструкция' },
    { id: 'contacts', label: 'Контакты' },
    { id: 'faq', label: 'Вопросы и ответы' },
    { id: 'support', label: 'Техническая поддержка' },
  ];

  const filteredNotifications = notifFilter === 'all'
    ? NOTIFICATIONS
    : NOTIFICATIONS.filter(n => n.status === notifFilter);

  const goto = (s: Section) => {
    setActiveSection(s);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-golos">
      {/* Top bar */}
      <div className="bg-[#003087] text-white text-xs">
        <div className="gov-container flex items-center justify-between py-2">
          <span className="opacity-80">Официальный портал государственных услуг</span>
          <div className="hidden md:flex items-center gap-4 opacity-80">
            <span>Версия для слабовидящих</span>
            <span>|</span>
            <span>ENG</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-[#D1D9E6] shadow-sm">
        <div className="gov-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#003087] rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Shield" size={26} className="text-white" />
              </div>
              <div>
                <div className="text-[#003087] font-bold text-lg leading-tight">
                  Портал государственных услуг
                </div>
                <div className="text-[#6B7280] text-xs mt-0.5">
                  Единая система электронных обращений граждан
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#003087] border border-[#003087] rounded hover:bg-[#EEF3FF] transition-colors">
                <Icon name="LogIn" size={16} />
                Войти
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#003087] rounded hover:bg-[#0050C8] transition-colors">
                <Icon name="FilePlus" size={16} />
                Подать обращение
              </button>
            </div>
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              <Icon name={mobileMenu ? 'X' : 'Menu'} size={22} />
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="border-t border-[#D1D9E6] bg-white hidden md:block">
          <div className="gov-container">
            <div className="flex items-center gap-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => goto(item.id)}
                  className={`nav-link py-3 text-sm font-medium transition-colors whitespace-nowrap ${activeSection === item.id ? 'active text-[#003087]' : 'text-[#374151] hover:text-[#003087]'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile nav */}
        {mobileMenu && (
          <nav className="md:hidden border-t border-[#D1D9E6] bg-white">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => goto(item.id)}
                className={`block w-full text-left px-6 py-3 text-sm font-medium border-b border-[#F0F2F6] last:border-0 ${activeSection === item.id ? 'text-[#003087] bg-[#EEF3FF]' : 'text-[#374151]'}`}
              >
                {item.label}
              </button>
            ))}
            <div className="px-6 py-4 flex flex-col gap-2">
              <button className="w-full py-2 text-sm font-medium text-[#003087] border border-[#003087] rounded">Войти</button>
              <button className="w-full py-2 text-sm font-semibold text-white bg-[#003087] rounded">Подать обращение</button>
            </div>
          </nav>
        )}
      </header>

      {/* Main */}
      <main>
        {/* HOME */}
        {activeSection === 'home' && (
          <div>
            <section className="bg-white border-b border-[#D1D9E6]">
              <div className="gov-container py-12">
                <div className="max-w-2xl animate-fade-in-up">
                  <div className="inline-flex items-center gap-2 bg-[#EEF3FF] text-[#003087] text-xs font-semibold px-3 py-1.5 rounded mb-5 uppercase tracking-wider">
                    <Icon name="Star" size={12} />
                    Официальный сервис
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-[#0D1C3D] leading-tight mb-4">
                    Электронные обращения граждан
                  </h1>
                  <p className="text-[#4B5563] text-lg leading-relaxed mb-8">
                    Подавайте обращения и заявления онлайн. Отслеживайте статус рассмотрения в режиме реального времени без посещения государственных учреждений.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => goto('support')}
                      className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-[#003087] rounded hover:bg-[#0050C8] transition-colors"
                    >
                      <Icon name="FilePlus" size={18} />
                      Подать обращение
                    </button>
                    <button
                      onClick={() => goto('instructions')}
                      className="flex items-center gap-2 px-6 py-3 font-medium text-[#003087] border border-[#003087] rounded hover:bg-[#EEF3FF] transition-colors"
                    >
                      <Icon name="BookOpen" size={18} />
                      Инструкция
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="bg-[#003087] text-white">
              <div className="gov-container py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { value: '1 247 831', label: 'Обращений обработано' },
                    { value: '98,4%', label: 'Рассмотрено вовремя' },
                    { value: '4,8 дня', label: 'Среднее время ответа' },
                    { value: '24/7', label: 'Работа портала' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</div>
                      <div className="text-xs text-blue-200 font-medium uppercase tracking-wide">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section className="gov-container py-10">
              <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                <div>
                  <div className="section-divider"></div>
                  <h2 className="text-2xl font-bold text-[#0D1C3D]">Система оповещений</h2>
                  <p className="text-[#6B7280] text-sm mt-1">Актуальный статус ваших обращений</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'Все' },
                    { key: 'new', label: 'Новые' },
                    { key: 'processing', label: 'На рассмотрении' },
                    { key: 'done', label: 'Исполнено' },
                    { key: 'rejected', label: 'Возвращено' },
                  ].map(f => (
                    <button
                      key={f.key}
                      onClick={() => setNotifFilter(f.key)}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${notifFilter === f.key ? 'bg-[#003087] text-white' : 'bg-white text-[#374151] border border-[#D1D9E6] hover:border-[#003087] hover:text-[#003087]'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredNotifications.map((n, i) => (
                  <div
                    key={n.id}
                    className="bg-white border border-[#D1D9E6] rounded-lg p-5 hover:shadow-md transition-shadow animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 min-w-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${n.status === 'new' ? 'bg-[#EEF3FF]' : n.status === 'processing' ? 'bg-[#FFF5E0]' : n.status === 'done' ? 'bg-[#EAF6EA]' : 'bg-[#FFF0EE]'}`}>
                          <Icon
                            name={STATUS_ICONS[n.status]}
                            size={20}
                            className={n.status === 'new' ? 'text-[#0050C8]' : n.status === 'processing' ? 'text-[#D46B00]' : n.status === 'done' ? 'text-[#1A7A1A]' : 'text-[#CC2200]'}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-mono text-[#6B7280]">{n.number}</span>
                            <span className={`status-badge status-${n.status}`}>
                              {STATUS_LABELS[n.status]}
                            </span>
                          </div>
                          <h3 className="font-semibold text-[#0D1C3D] text-sm leading-snug mb-1">{n.title}</h3>
                          <p className="text-xs text-[#6B7280] leading-relaxed">{n.description}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-[#9CA3AF] whitespace-nowrap">{n.date}</div>
                        <button className="mt-2 text-xs text-[#003087] hover:underline font-medium">
                          Подробнее
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredNotifications.length === 0 && (
                <div className="bg-white border border-[#D1D9E6] rounded-lg p-12 text-center">
                  <Icon name="Inbox" size={40} className="text-[#D1D9E6] mx-auto mb-3" />
                  <p className="text-[#9CA3AF] text-sm">Обращений в данной категории нет</p>
                </div>
              )}
            </section>

            {/* Services */}
            <section className="bg-white border-y border-[#D1D9E6]">
              <div className="gov-container py-10">
                <div className="section-divider"></div>
                <h2 className="text-2xl font-bold text-[#0D1C3D] mb-2">Популярные услуги</h2>
                <p className="text-[#6B7280] text-sm mb-8">Наиболее востребованные виды обращений</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { icon: 'Home', label: 'Регистрация по месту жительства', bg: '#EEF3FF', color: '#003087' },
                    { icon: 'Car', label: 'Транспорт и дорожное хозяйство', bg: '#FFF5E0', color: '#D46B00' },
                    { icon: 'TreePine', label: 'Земельные вопросы', bg: '#EAF6EA', color: '#1A7A1A' },
                    { icon: 'Building2', label: 'Жилищно-коммунальное хозяйство', bg: '#F3EEF9', color: '#6B21A8' },
                    { icon: 'GraduationCap', label: 'Образование и наука', bg: '#EEF3FF', color: '#003087' },
                    { icon: 'Heart', label: 'Здравоохранение', bg: '#FFF0EE', color: '#CC2200' },
                    { icon: 'Scale', label: 'Юридическая помощь', bg: '#FFF5E0', color: '#D46B00' },
                    { icon: 'ShieldCheck', label: 'Безопасность и правопорядок', bg: '#EAF6EA', color: '#1A7A1A' },
                  ].map((s, i) => (
                    <button
                      key={i}
                      className="bg-white border border-[#D1D9E6] rounded-lg p-4 text-left hover:shadow-md hover:border-[#003087] transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: s.bg }}>
                        <Icon name={s.icon} size={20} style={{ color: s.color }} />
                      </div>
                      <div className="text-sm font-medium text-[#0D1C3D] leading-snug group-hover:text-[#003087] transition-colors">
                        {s.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ABOUT */}
        {activeSection === 'about' && (
          <div className="gov-container py-10">
            <div className="animate-fade-in-up">
              <div className="section-divider"></div>
              <h1 className="text-3xl font-bold text-[#0D1C3D] mb-2">О сервисе</h1>
              <p className="text-[#6B7280] mb-10">Информация о портале и его возможностях</p>

              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="bg-white border border-[#D1D9E6] rounded-lg p-6">
                  <h2 className="text-xl font-bold text-[#0D1C3D] mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#EEF3FF] rounded flex items-center justify-center">
                      <Icon name="Info" size={16} className="text-[#003087]" />
                    </div>
                    Что такое портал
                  </h2>
                  <p className="text-[#4B5563] leading-relaxed text-sm">
                    Единый портал электронных обращений граждан — официальная государственная платформа, обеспечивающая гражданам возможность подавать обращения и заявления в органы государственной власти в электронном формате без личного визита.
                  </p>
                </div>
                <div className="bg-white border border-[#D1D9E6] rounded-lg p-6">
                  <h2 className="text-xl font-bold text-[#0D1C3D] mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#EAF6EA] rounded flex items-center justify-center">
                      <Icon name="Target" size={16} className="text-[#1A7A1A]" />
                    </div>
                    Цели и задачи
                  </h2>
                  <p className="text-[#4B5563] leading-relaxed text-sm">
                    Повышение доступности государственных услуг, сокращение бюрократических барьеров и обеспечение прозрачности процессов рассмотрения обращений граждан на всех уровнях власти.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-[#D1D9E6] rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-[#0D1C3D] mb-6">Возможности портала</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: 'FilePlus', title: 'Подача обращений', desc: 'Отправка заявлений в любые государственные органы 24/7' },
                    { icon: 'Bell', title: 'Система оповещений', desc: 'Мгновенные уведомления об изменении статуса обращения' },
                    { icon: 'Search', title: 'Отслеживание статусов', desc: 'Прозрачный мониторинг каждого этапа рассмотрения' },
                    { icon: 'Archive', title: 'Архив обращений', desc: 'Хранение истории всех ваших обращений в личном кабинете' },
                    { icon: 'FileText', title: 'Электронные документы', desc: 'Получение официальных ответов в электронном виде' },
                    { icon: 'Lock', title: 'Безопасность данных', desc: 'Защита персональных данных согласно законодательству РФ' },
                  ].map((f, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors">
                      <div className="w-9 h-9 bg-[#EEF3FF] rounded flex items-center justify-center flex-shrink-0">
                        <Icon name={f.icon} size={16} className="text-[#003087]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#0D1C3D] text-sm">{f.title}</div>
                        <div className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#003087] rounded-lg p-6 text-white">
                <h2 className="text-lg font-bold mb-2">Правовая основа</h2>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Портал функционирует в соответствии с Федеральным законом № 59-ФЗ «О порядке рассмотрения обращений граждан Российской Федерации», Федеральным законом № 149-ФЗ «Об информации, информационных технологиях и о защите информации», а также иными нормативно-правовыми актами в сфере электронного взаимодействия.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* INSTRUCTIONS */}
        {activeSection === 'instructions' && (
          <div className="gov-container py-10">
            <div className="animate-fade-in-up">
              <div className="section-divider"></div>
              <h1 className="text-3xl font-bold text-[#0D1C3D] mb-2">Инструкция по работе с порталом</h1>
              <p className="text-[#6B7280] mb-10">Пошаговое руководство для пользователей</p>

              <div className="space-y-4 mb-10">
                {[
                  { step: '01', title: 'Регистрация на портале', icon: 'UserPlus', desc: 'Перейдите по кнопке «Войти» в правом верхнем углу. Выберите способ входа: через Госуслуги (ЕСИА) или по электронной почте. Подтвердите учётную запись, перейдя по ссылке в письме.', time: '5 минут' },
                  { step: '02', title: 'Подача обращения', icon: 'FilePlus', desc: 'Нажмите «Подать обращение». Выберите категорию и тематику вашего вопроса. Заполните форму, указав суть обращения и прикрепив необходимые документы. Проверьте данные и отправьте.', time: '10 минут' },
                  { step: '03', title: 'Получение уведомлений', icon: 'Bell', desc: 'После регистрации обращения вам придёт уведомление на указанный e-mail с номером обращения. Все изменения статуса сопровождаются автоматическими оповещениями.', time: 'Автоматически' },
                  { step: '04', title: 'Отслеживание статуса', icon: 'Search', desc: 'Войдите в личный кабинет и перейдите в раздел «Мои обращения». Здесь отображается история всех ваших заявок и актуальные статусы рассмотрения.', time: 'В любое время' },
                  { step: '05', title: 'Получение ответа', icon: 'CheckCircle', desc: 'По завершении рассмотрения вам придёт уведомление. Официальный ответ будет доступен в личном кабинете, а также может быть направлен на бумажном носителе по запросу.', time: 'До 30 дней' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#D1D9E6] rounded-lg p-5 flex gap-5 hover:shadow-sm transition-shadow"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#003087] rounded-lg flex items-center justify-center">
                        <Icon name={item.icon} size={22} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest">Шаг {item.step}</span>
                        <span className="text-xs bg-[#EEF3FF] text-[#003087] px-2 py-0.5 rounded font-medium">{item.time}</span>
                      </div>
                      <h3 className="font-bold text-[#0D1C3D] mb-2">{item.title}</h3>
                      <p className="text-sm text-[#4B5563] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#EEF3FF] border border-[#C0D0F0] rounded-lg p-5 flex gap-4">
                <Icon name="Info" size={20} className="text-[#003087] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#003087] text-sm mb-1">Требования к обращению</div>
                  <ul className="text-sm text-[#374151] space-y-1">
                    <li>• Обращение должно содержать реальные данные заявителя</li>
                    <li>• Анонимные обращения не рассматриваются</li>
                    <li>• Максимальный объём обращения — 2 000 символов</li>
                    <li>• Прикрепляемые документы — не более 10 файлов по 5 МБ каждый</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTACTS */}
        {activeSection === 'contacts' && (
          <div className="gov-container py-10">
            <div className="animate-fade-in-up">
              <div className="section-divider"></div>
              <h1 className="text-3xl font-bold text-[#0D1C3D] mb-2">Контакты</h1>
              <p className="text-[#6B7280] mb-10">Реквизиты и контактная информация</p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[
                  { icon: 'MapPin', bg: '#EEF3FF', color: '#003087', title: 'Адрес', lines: ['103132, г. Москва,', 'Краснопресненская наб., д. 2'] },
                  { icon: 'Phone', bg: '#EAF6EA', color: '#1A7A1A', title: 'Телефон приёмной', lines: ['+7 (495) 000-00-00', 'Пн–Пт: 9:00–18:00'] },
                  { icon: 'Mail', bg: '#FFF5E0', color: '#D46B00', title: 'Электронная почта', lines: ['info@portal.gov.ru', 'Ответ в течение 3 рабочих дней'] },
                  { icon: 'Globe', bg: '#F3EEF9', color: '#6B21A8', title: 'Официальный сайт', lines: ['www.portal.gov.ru', 'Доступен 24/7'] },
                ].map((c, i) => (
                  <div key={i} className="bg-white border border-[#D1D9E6] rounded-lg p-5 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: c.bg }}>
                      <Icon name={c.icon} size={20} style={{ color: c.color }} />
                    </div>
                    <div>
                      <div className="font-semibold text-[#0D1C3D] text-sm mb-1">{c.title}</div>
                      {c.lines.map((l, j) => (
                        <div key={j} className="text-sm text-[#4B5563]">{l}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-[#D1D9E6] rounded-lg p-6">
                <h2 className="font-bold text-[#0D1C3D] mb-4">График работы</h2>
                <div className="space-y-0">
                  {[
                    { day: 'Понедельник — четверг', hours: '9:00 — 18:00', type: 'normal' },
                    { day: 'Пятница', hours: '9:00 — 16:45', type: 'normal' },
                    { day: 'Суббота — воскресенье', hours: 'Выходной день', type: 'off' },
                    { day: 'Электронный портал', hours: 'Круглосуточно', type: 'always' },
                  ].map((row, i) => (
                    <div key={i} className={`flex justify-between py-3 text-sm ${i < 3 ? 'border-b border-[#F0F2F6]' : ''}`}>
                      <span className="text-[#4B5563]">{row.day}</span>
                      <span className={`font-semibold ${row.type === 'always' ? 'text-[#1A7A1A]' : row.type === 'off' ? 'text-[#9CA3AF]' : 'text-[#0D1C3D]'}`}>{row.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeSection === 'faq' && (
          <div className="gov-container py-10">
            <div className="animate-fade-in-up">
              <div className="section-divider"></div>
              <h1 className="text-3xl font-bold text-[#0D1C3D] mb-2">Вопросы и ответы</h1>
              <p className="text-[#6B7280] mb-10">Ответы на наиболее часто задаваемые вопросы</p>

              <div className="space-y-3 mb-10">
                {FAQ_ITEMS.map((item, i) => (
                  <div
                    key={i}
                    className={`bg-white border rounded-lg overflow-hidden transition-all ${openFaq === i ? 'border-[#003087] shadow-sm' : 'border-[#D1D9E6] hover:border-[#A0B8E0]'}`}
                  >
                    <button
                      className="w-full flex items-center justify-between p-5 text-left"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#9CA3AF] w-6 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                        <span className="font-semibold text-[#0D1C3D] text-sm">{item.q}</span>
                      </div>
                      <Icon
                        name={openFaq === i ? 'ChevronUp' : 'ChevronDown'}
                        size={18}
                        className={`flex-shrink-0 ml-4 transition-transform ${openFaq === i ? 'text-[#003087]' : 'text-[#9CA3AF]'}`}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 border-t border-[#F0F2F6]">
                        <p className="text-sm text-[#4B5563] leading-relaxed pt-4 pl-9">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-[#003087] rounded-lg p-6 text-white flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="font-bold text-lg mb-1">Не нашли ответ?</div>
                  <div className="text-blue-200 text-sm">Обратитесь в службу технической поддержки</div>
                </div>
                <button
                  onClick={() => goto('support')}
                  className="px-5 py-2.5 bg-white text-[#003087] font-semibold text-sm rounded hover:bg-blue-50 transition-colors"
                >
                  Написать в поддержку
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUPPORT */}
        {activeSection === 'support' && (
          <div className="gov-container py-10">
            <div className="animate-fade-in-up">
              <div className="section-divider"></div>
              <h1 className="text-3xl font-bold text-[#0D1C3D] mb-2">Техническая поддержка</h1>
              <p className="text-[#6B7280] mb-10">Помощь по вопросам работы портала</p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { icon: 'Phone', bg: '#EEF3FF', color: '#003087', title: 'Телефон поддержки', desc: '8-800-100-00-00', sub: 'Звонок бесплатный, Пн–Пт 9:00–18:00' },
                  { icon: 'Mail', bg: '#EAF6EA', color: '#1A7A1A', title: 'E-mail', desc: 'support@portal.gov.ru', sub: 'Ответ в течение 1 рабочего дня' },
                  { icon: 'MessageSquare', bg: '#FFF5E0', color: '#D46B00', title: 'Онлайн-чат', desc: 'Доступен на сайте', sub: 'Пн–Пт 9:00–21:00' },
                ].map((c, i) => (
                  <div key={i} className="bg-white border border-[#D1D9E6] rounded-lg p-5 text-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: c.bg }}>
                      <Icon name={c.icon} size={22} style={{ color: c.color }} />
                    </div>
                    <div className="font-semibold text-[#0D1C3D] text-sm mb-1">{c.title}</div>
                    <div className="text-[#003087] font-bold text-sm mb-1">{c.desc}</div>
                    <div className="text-xs text-[#9CA3AF]">{c.sub}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-[#D1D9E6] rounded-lg p-6">
                <h2 className="font-bold text-[#0D1C3D] mb-1">Форма обращения в поддержку</h2>
                <p className="text-sm text-[#6B7280] mb-6">Опишите проблему, и наши специалисты свяжутся с вами</p>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">
                        Ваше имя <span className="text-[#CC2200]">*</span>
                      </label>
                      <input
                        type="text"
                        value={supportForm.name}
                        onChange={e => setSupportForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Иванов Иван Иванович"
                        className="w-full px-3 py-2.5 text-sm border border-[#D1D9E6] rounded focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">
                        Электронная почта <span className="text-[#CC2200]">*</span>
                      </label>
                      <input
                        type="email"
                        value={supportForm.email}
                        onChange={e => setSupportForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="example@mail.ru"
                        className="w-full px-3 py-2.5 text-sm border border-[#D1D9E6] rounded focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">
                      Описание проблемы <span className="text-[#CC2200]">*</span>
                    </label>
                    <textarea
                      value={supportForm.message}
                      onChange={e => setSupportForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Опишите проблему подробно..."
                      rows={5}
                      className="w-full px-3 py-2.5 text-sm border border-[#D1D9E6] rounded focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087] transition-colors resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button className="px-6 py-2.5 bg-[#003087] text-white text-sm font-semibold rounded hover:bg-[#0050C8] transition-colors">
                      Отправить обращение
                    </button>
                    <p className="text-xs text-[#9CA3AF]">
                      Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0D1C3D] text-white mt-16">
        <div className="gov-container py-10">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Icon name="Shield" size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm">Портал государственных услуг</div>
                  <div className="text-blue-300 text-xs">Официальный ресурс</div>
                </div>
              </div>
              <p className="text-blue-200 text-xs leading-relaxed">
                Единая система электронных обращений граждан. Подача и отслеживание обращений в государственные органы в режиме онлайн.
              </p>
            </div>
            <div>
              <div className="font-semibold text-sm mb-3">Разделы</div>
              <div className="space-y-2">
                {navItems.map(item => (
                  <button key={item.id} onClick={() => goto(item.id)} className="block text-blue-300 text-xs hover:text-white transition-colors">
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="font-semibold text-sm mb-3">Документы</div>
              <div className="space-y-2 text-blue-300 text-xs">
                <div>Политика конфиденциальности</div>
                <div>Пользовательское соглашение</div>
                <div>Защита персональных данных</div>
                <div>Доступность сервиса</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="text-blue-300 text-xs">© 2026 Портал государственных услуг. Все права защищены.</div>
            <div className="flex items-center gap-2 text-xs text-blue-300">
              <Icon name="Lock" size={12} />
              Защищённое соединение
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
