// A template re-mounts on every navigation, which replays the entrance
// animation and gives tab-to-tab transitions without any client JS.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
