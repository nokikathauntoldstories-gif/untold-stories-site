export default function AdSlot({
  type,
  className = "",
}: {
  type: "leaderboard" | "sidebar" | "in-article" | "footer";
  className?: string;
}) {
  const sizes: Record<string, string> = {
    leaderboard: "h-[90px] sm:h-[90px]",
    sidebar: "h-[250px]",
    "in-article": "h-[250px] my-6",
    footer: "h-[90px]",
  };

  return (
    <div className={`ad-slot ${sizes[type]} ${className}`}>
      {/* AdSense: Replace this div with your AdSense ad unit code
           Example:
           <ins className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-XXXXXXX"
                data-ad-slot="XXXXXXX"
                data-ad-format="auto"
                data-full-width-responsive="true" />
      */}
      <span>Ad Space - {type} ({type === "leaderboard" || type === "footer" ? "728x90" : "300x250"})</span>
    </div>
  );
}
