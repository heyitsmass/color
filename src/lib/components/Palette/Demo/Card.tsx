// Basic card component for displaying color samples

type CardProps = React.ComponentPropsWithRef<"div">;

export default function Card({ ref, ...props }: CardProps) {
	return (
		<div className={`shadow-sm rounded-md border ${props.className}`} ref={ref} {...props}>
			{props.children}
		</div>
	);
}
