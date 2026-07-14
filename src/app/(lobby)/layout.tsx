import { LobbyNavbar } from '@/components/lobby/LobbyNavbar';

export default function LobbyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LobbyNavbar />
      {children}
    </>
  );
}
