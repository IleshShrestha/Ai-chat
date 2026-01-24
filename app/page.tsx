import { redirect } from "next/navigation";


export default function Home() {
redirect('/chat')

  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
}
