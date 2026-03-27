import { Link } from "react-router";

export default function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-white">
            <h1 className="mb-2 text-6xl font-black tracking-tighter">404</h1>
            <p className="mb-10 text-zinc-400">
                Page not found. Perhaps you've taken a wrong turn in the cosmos.
            </p>
            <Link
                to="/"
                className="rounded-full bg-white px-8 py-4 font-bold text-black transition-transform hover:scale-105"
            >
                Return Home
            </Link>
        </div>
    );
}
