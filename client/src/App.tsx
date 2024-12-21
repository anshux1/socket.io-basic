import { UserCard } from "@/components/UserCard";

function App() {
  return (
    <div className="h-screen w-screen max-w-screen-2xl mx-auto items-center justify-center flex">
      <div className="h-[600px] w-full gap-3 grid grid-cols-4">
        <UserCard />
        <UserCard />
        <UserCard />
        <UserCard />
      </div>
    </div>
  )
}

export default App
