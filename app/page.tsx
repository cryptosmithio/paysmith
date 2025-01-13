import NavBar from '@/components/Navbar';

export default function Home() {
  return (
    <div>
      <NavBar />
      <main>Read our docs</main>
      <footer>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn
        </a>
      </footer>
    </div>
  );
}
