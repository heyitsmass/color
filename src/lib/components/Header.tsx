import ThemeButton from "./ThemeButton";

export default function Header() {
	return (
		<header className='flex p-4 bg-zinc-200 dark:bg-zinc-800 rounded-2xl'>
			<ThemeButton />
		</header>
	);
}
