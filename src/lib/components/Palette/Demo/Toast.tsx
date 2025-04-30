import { XMarkIcon } from "@heroicons/react/24/solid";
import { Colors } from "@colorUtils/constants";

export default function Toast({ colorName }: { colorName: Colors; solid?: boolean }) {
	return (
		<div className={`border border-${colorName} flex flex-col rounded-md`}>
			<div className={`flex justify-between items-center border-b border-${colorName} px-2`}>
				<p
					className={`uppercase font-semibold tracking-widest leading-6 text-xs text-${colorName}`}
				>
					{colorName}
				</p>
				<XMarkIcon className='h-4' />
			</div>
			<p className='p-2 break-words leading-normal'>
				Lorem ipsum dolor sit amet consectetur adipiscing elit.
			</p>
			<p className='px-2 italic opacity-60'>
				<small>ex. Adipiscing elit quisque faucibus.</small>
			</p>
		</div>
	);
}
