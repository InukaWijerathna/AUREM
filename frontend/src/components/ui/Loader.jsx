export default function Loader({ size = 'md', text = '' }) {
  const dim = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      {/* Thin rotating ring in Deep Gold */}
      <div className={`${dim} relative`}>
        <div className="absolute inset-0 rounded-full border border-sand-gold/40" />
        <div
          className="absolute inset-0 rounded-full border-t border-primary-600 animate-spin"
          style={{ animationDuration: '1.2s' }}
        />
      </div>
      {text ? (
        <p className="text-xs tracking-widest uppercase font-sans font-medium text-mid-gold">{text}</p>
      ) : (
        <p className="text-xs tracking-widest uppercase font-sans font-medium text-mid-gold">Loading</p>
      )}
    </div>
  );
}
