import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider>
			{toasts.map(function ({ id, title, description, action, ...props }) {
				return (
					<Toast 
						key={id} 
						{...props} 
						className="bg-[#0066FF] text-white border-none p-3 min-h-0 text-xs rounded-2xl shadow-lg shadow-blue-500/20"
					>
						<div className="grid gap-0.5">
							{title && <ToastTitle className="text-sm font-bold">{title}</ToastTitle>}
							{description && (
								<ToastDescription className="text-xs opacity-90">{description}</ToastDescription>
							)}
						</div>
						{action}
						<ToastClose className="text-white hover:text-blue-200" />
					</Toast>
				);
			})}
			<ToastViewport className="p-4 sm:p-6" />
		</ToastProvider>
	);
}