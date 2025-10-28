import {
	Button,
	createTheme,
	Drawer,
	Group,
	Input,
	MantineProvider,
	Modal,
	NumberInput,
	Stack,
	Tabs,
	Textarea,
	TextInput,
} from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import inputClasses from './input.module.css'

const theme = createTheme({
	components: {
		Drawer: Drawer.extend({
			defaultProps: {
				radius: 'xs',
				offset: '0.5rem',
				position: 'right',
				closeOnClickOutside: false,
				withCloseButton: false,
				overlayProps: {
					opacity: 0.1,
				},
			},
		}),
		Modal: Modal.extend({
			defaultProps: {
				zIndex: 300,
				overlayProps: {
					opacity: 0.1,
				},
			},
		}),
		TabsList: Tabs.List.extend({
			defaultProps: {
				pos: 'sticky',
				top: 0,
				bg: 'var(--mantine-color-body)',
				style: {
					zIndex: 10,
				},
			},
		}),
		TabsPanel: Tabs.Panel.extend({
			defaultProps: { keepMounted: true, p: 'xs', pt: 'xs' },
		}),
		Group: Group.extend({
			defaultProps: {
				mih: 30,
				gap: 'xs',
			},
		}),
		Stack: Stack.extend({
			defaultProps: {
				gap: 'xs',
			},
		}),
		Button: Button.extend({
			defaultProps: {
				size: 'xs',
				radius: 0,
				variant: 'subtle',
				px: '0.25rem',
			},
		}),
		Input: Input.extend({
			classNames: inputClasses,
			defaultProps: {
				variant: 'filled',
				size: 'xs',
				radius: 0,
			},
		}),
		Textarea: Textarea.extend({
			defaultProps: {
				variant: 'filled',
				size: 'xs',
				rows: 3,
				radius: 0,
				rightSectionProps: {
					style: {
						alignItems: 'flex-start',
					},
				},
			},
		}),
		TextInput: TextInput.extend({
			defaultProps: {
				variant: 'filled',
				size: 'xs',
				radius: 0,
			},
		}),
		NumberInput: NumberInput.extend({
			defaultProps: {
				variant: 'filled',
				size: 'xs',
				radius: 0,
			},
		}),
	},
})

export function AppProvider({ children }: { children: React.ReactNode }) {
	return (
		<MantineProvider theme={theme}>
			<Notifications />
			<ModalsProvider>{children}</ModalsProvider>
		</MantineProvider>
	)
}
