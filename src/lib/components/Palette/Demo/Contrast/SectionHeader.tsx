import Switch from "@/components/Switch";
import NavCard from "../NavCard";
import Slider from "@/components/Slider";
import useContrast from "../hooks/useContrast";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import IconTooltip from "@/components/IconTooltip";

export default function ContrastSectionHeader() {
	const {
		threshold,
		defaultThreshold,
		showMonotone,
		showAllPairs,
		toggleAllPairs,
		toggleMonotone,
		setThreshold,
		resetThreshold,
	} = useContrast();

	return (
		<nav className='flex px-4 gap-4'>
			<NavCard
				title='Adjust contrast threshold'
				className={"min-w-[24rem]"}
				headerContent={
					<>
						<small>
							<i>{`(${threshold})`}</i>
						</small>

						{threshold !== 4.5 && (
							<IconTooltip
								Icon={ArrowPathIcon}
								size='2xl'
								iconProps={{
									onClick: resetThreshold,
									className: "p-2 text-white hover:opacity-80 cursor-pointer",
								}}
							>
								<small>Reset to {defaultThreshold.toString()}</small>
							</IconTooltip>
						)}
					</>
				}
			>
				<Slider
					min={1}
					max={21}
					step={0.1}
					defaultValue={defaultThreshold}
					name='contrast-threshold'
					onChange={setThreshold}
				/>
			</NavCard>
			<NavCard title='Use Monotone Text'>
				<Switch
					name='use-monotone-text'
					isActive={showMonotone}
					onValueChange={toggleMonotone}
				/>
			</NavCard>
			<NavCard title='Show all pairs'>
				<Switch
					name='show-all-pairs'
					isActive={showAllPairs}
					onValueChange={toggleAllPairs}
				/>
			</NavCard>
		</nav>
	);
}
