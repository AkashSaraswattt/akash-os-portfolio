export default function CityBackdrop({ moving }: { moving: boolean }) {
  return <div className="wallpaper workspace-backdrop city-wallpaper" data-mode="city" data-motion={moving ? 'playing' : 'paused'} aria-hidden="true">
    <div className="city-pan city-animated"><picture><source media="(max-width:767px)" srcSet="/assets/wallpapers/cyber-city-mobile.webp"/><img src="/assets/wallpapers/cyber-city.webp" alt="" width={1536} height={1024} fetchPriority="high" decoding="async" draggable={false}/></picture></div>
    <div className="city-mist city-animated"/>
    <svg className="city-foreground city-animated" viewBox="0 0 1600 300" preserveAspectRatio="none" focusable="false">
      <path d="M0 300V180H90V155H140V170H230V205H340V130H390V110H430V130H510V230H650V200H730V180H800V215H940V155H1010V135H1045V155H1130V230H1230V185H1310V150H1370V165H1460V210H1600V300Z" fill="#0c111b"/>
      <path d="M350 160H400M350 173H380M950 184H998M950 196H980M1320 181H1350" stroke="#8bb2e1" strokeWidth="2" opacity=".3"/>
    </svg>
  </div>;
}
