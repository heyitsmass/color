import ColorPaletteDemo from "@/components/Palette/Demo";
import "./App.css";
import Header from "@/components/Header";
import Palette from "@/components/Palette";

function App() {
	return (
		<div className='flex flex-col h-full w-full gap-4'>
			<Header />
			<Palette>
				<ColorPaletteDemo></ColorPaletteDemo>
			</Palette>
		</div>
	);
}

export default App;
